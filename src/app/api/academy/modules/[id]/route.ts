import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

/**
 * GET /api/academy/modules/[id]
 * Returns a single module with all its lessons.
 */
export async function GET(
  _req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    const { data: module, error: moduleError } = await supabase
      .from("lms_modules")
      .select("*")
      .eq("id", id)
      .single();

    if (moduleError || !module) {
      return NextResponse.json({ error: "Module not found." }, { status: 404 });
    }

    const { data: lessons, error: lessonsError } = await supabase
      .from("lms_lessons")
      .select("*")
      .eq("module_id", id)
      .order("order_index", { ascending: true });

    if (lessonsError) {
      return NextResponse.json({ error: lessonsError.message }, { status: 400 });
    }

    return NextResponse.json(
      { module, lessons: lessons ?? [] },
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
 * PATCH /api/academy/modules/[id]
 * Admin: updates a module's fields.
 * Body: { title?, description?, thumbnail_url?, order_index? }
 */
export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const body = await req.json();

    const allowed = ["title", "description", "thumbnail_url", "order_index"];
    const updates: Record<string, any> = {};
    for (const key of allowed) {
      if (body[key] !== undefined) updates[key] = body[key];
    }

    if (Object.keys(updates).length === 0) {
      return NextResponse.json(
        { error: "No valid fields provided." },
        { status: 400 }
      );
    }

    const { data, error } = await supabase
      .from("lms_modules")
      .update(updates)
      .eq("id", id)
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json({ message: "Module updated.", module: data }, { status: 200 });
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || "Internal server error." },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/academy/modules/[id]
 * Admin: deletes a module and all its associated lessons.
 */
export async function DELETE(
  _req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    // Delete all lessons in this module first (cascade safety)
    await supabase.from("lms_lessons").delete().eq("module_id", id);

    const { error } = await supabase
      .from("lms_modules")
      .delete()
      .eq("id", id);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json(
      { message: `Module ${id} and all its lessons deleted.` },
      { status: 200 }
    );
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || "Internal server error." },
      { status: 500 }
    );
  }
}
