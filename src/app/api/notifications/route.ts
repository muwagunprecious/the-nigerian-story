import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

/**
 * GET /api/notifications?user_id=<uuid>
 * Returns feed-type notifications for a user (their own + broadcasts).
 * Query params:
 *   - user_id: the authenticated user's UUID
 *   - limit: (default 20)
 */
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("user_id");
    const limit = parseInt(searchParams.get("limit") ?? "20");

    if (!userId) {
      return NextResponse.json(
        { error: "user_id query param is required." },
        { status: 400 }
      );
    }

    // Fetch notifications that are either broadcasts (user_id IS NULL)
    // or specifically for this user
    const { data, error } = await supabase
      .from("notifications")
      .select("*")
      .or(`user_id.is.null,user_id.eq.${userId}`)
      .order("created_at", { ascending: false })
      .limit(limit);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json({ notifications: data ?? [] }, { status: 200 });
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || "Internal server error." },
      { status: 500 }
    );
  }
}

/**
 * POST /api/notifications
 * Admin: broadcast a notification to all users or a specific user.
 * Body: {
 *   title: string,
 *   message: string,
 *   type: "popup" | "feed",
 *   target_username?: string   // optional – leave blank for broadcast
 * }
 */
export async function POST(req: NextRequest) {
  try {
    const { title, message, type, target_username } = await req.json();

    if (!title || !message || !type) {
      return NextResponse.json(
        { error: "title, message, and type are required." },
        { status: 400 }
      );
    }

    if (!["popup", "feed"].includes(type)) {
      return NextResponse.json(
        { error: 'type must be "popup" or "feed".' },
        { status: 400 }
      );
    }

    let userId: string | null = null;

    // Resolve target username to user ID if provided
    if (target_username) {
      const { data: userData, error: userError } = await supabase
        .from("profiles")
        .select("id")
        .or(
          `username.eq.${target_username},id.eq.${target_username}`
        )
        .single();

      if (userError || !userData) {
        return NextResponse.json(
          { error: `User "${target_username}" not found.` },
          { status: 404 }
        );
      }

      userId = userData.id;
    }

    const { data, error } = await supabase
      .from("notifications")
      .insert([{ user_id: userId, title, message, type }])
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json(
      {
        message: userId
          ? `Notification sent to user ${userId}.`
          : "Broadcast sent to all users.",
        notification: data,
      },
      { status: 201 }
    );
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || "Internal server error." },
      { status: 500 }
    );
  }
}
