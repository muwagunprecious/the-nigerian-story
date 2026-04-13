import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

/**
 * GET /api/ambassador?user_id=<uuid>
 * Returns the ambassador application status for a given user,
 * their story count, and their profile info (university, username).
 */
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("user_id");

    if (!userId) {
      return NextResponse.json(
        { error: "user_id query param is required." },
        { status: 400 }
      );
    }

    // Run all queries in parallel
    const [
      { count: storyCount },
      { data: profile },
      { data: application },
    ] = await Promise.all([
      supabase
        .from("stories")
        .select("*", { count: "exact", head: true })
        .eq("user_id", userId),
      supabase
        .from("profiles")
        .select("university, username")
        .eq("id", userId)
        .single(),
      supabase
        .from("ambassador_applications")
        .select("id, status, created_at")
        .eq("user_id", userId)
        .single(),
    ]);

    return NextResponse.json(
      {
        storyCount: storyCount ?? 0,
        university: profile?.university ?? "",
        username: profile?.username ?? "",
        application: application ?? null,
      },
      { status: 200 }
    );
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || "Internal server error." },
      { status: 500 }
    );
  }
}

/**
 * POST /api/ambassador
 * Submits a new ambassador application for a user.
 * Body: { user_id, university, full_name }
 * Requires: user must have at least 1 story submitted.
 */
export async function POST(req: NextRequest) {
  try {
    const { user_id, university, full_name } = await req.json();

    if (!user_id || !university || !full_name) {
      return NextResponse.json(
        { error: "user_id, university, and full_name are required." },
        { status: 400 }
      );
    }

    // Prerequisite: user must have submitted at least one story
    const { count: storyCount } = await supabase
      .from("stories")
      .select("*", { count: "exact", head: true })
      .eq("user_id", user_id);

    if ((storyCount ?? 0) === 0) {
      return NextResponse.json(
        {
          error:
            "You must submit at least one story before applying as an ambassador.",
        },
        { status: 403 }
      );
    }

    // Check if user already has a pending/approved application
    const { data: existing } = await supabase
      .from("ambassador_applications")
      .select("id, status")
      .eq("user_id", user_id)
      .single();

    if (existing) {
      return NextResponse.json(
        {
          error: `You already have an application with status: ${existing.status}.`,
          application: existing,
        },
        { status: 409 }
      );
    }

    // Insert application
    const { data, error } = await supabase
      .from("ambassador_applications")
      .insert([{ user_id, university, full_name, status: "pending" }])
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json(
      { message: "Application submitted successfully.", application: data },
      { status: 201 }
    );
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || "Internal server error." },
      { status: 500 }
    );
  }
}
