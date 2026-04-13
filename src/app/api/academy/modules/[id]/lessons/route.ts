import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

/**
 * GET /api/academy/modules/[id]/lessons
 * Returns all lessons for a given module, ordered by order_index.
 */
export async function GET(
  _req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    const { data, error } = await supabase
      .from("lms_lessons")
      .select("*")
      .eq("module_id", id)
      .order("order_index", { ascending: true });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json({ lessons: data ?? [] }, { status: 200 });
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || "Internal server error." },
      { status: 500 }
    );
  }
}

/**
 * POST /api/academy/modules/[id]/lessons
 * Admin: adds a new lesson to a module.
 * Body: { title, description, video_url, duration }
 */
export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id: moduleId } = params;
    const { title, description, video_url, duration } = await req.json();

    if (!title || !video_url) {
      return NextResponse.json(
        { error: "title and video_url are required." },
        { status: 400 }
      );
    }

    // Determine the next order_index for this module
    const { count } = await supabase
      .from("lms_lessons")
      .select("*", { count: "exact", head: true })
      .eq("module_id", moduleId);

    const { data, error } = await supabase
      .from("lms_lessons")
      .insert([
        {
          module_id: moduleId,
          title,
          description: description ?? "",
          video_url,
          duration: duration ?? "",
          order_index: count ?? 0,
        },
      ])
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json(
      { message: "Lesson added.", lesson: data },
      { status: 201 }
    );
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || "Internal server error." },
      { status: 500 }
    );
  }
}
