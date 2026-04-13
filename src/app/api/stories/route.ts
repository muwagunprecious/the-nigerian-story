import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

/**
 * GET /api/stories
 * Returns all stories, ordered by newest first.
 * Query params:
 *   - user_id: filter by a specific user
 *   - category: filter by category
 *   - limit: number of results (default 50)
 *   - offset: pagination offset (default 0)
 */
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("user_id");
    const category = searchParams.get("category");
    const limit = parseInt(searchParams.get("limit") ?? "50");
    const offset = parseInt(searchParams.get("offset") ?? "0");

    let query = supabase
      .from("stories")
      .select("*", { count: "exact" })
      .order("created_at", { ascending: false })
      .range(offset, offset + limit - 1);

    if (userId) query = query.eq("user_id", userId);
    if (category) query = query.eq("category", category);

    const { data, error, count } = await query;

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json({ stories: data, total: count }, { status: 200 });
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || "Internal server error." },
      { status: 500 }
    );
  }
}

/**
 * POST /api/stories
 * Submits a new story.
 * Body: { user_id, name, email, title, content, location, era, category }
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { user_id, name, email, title, content, location, era, category } = body;

    if (!user_id || !title || !content || !location || !era || !category) {
      return NextResponse.json(
        {
          error:
            "Missing required fields: user_id, title, content, location, era, category.",
        },
        { status: 400 }
      );
    }

    const { data, error } = await supabase
      .from("stories")
      .insert([{ user_id, name, email, title, content, location, era, category }])
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json(
      { message: "Story submitted successfully.", story: data },
      { status: 201 }
    );
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || "Internal server error." },
      { status: 500 }
    );
  }
}
