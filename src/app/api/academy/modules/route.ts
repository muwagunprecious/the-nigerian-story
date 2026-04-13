import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

/**
 * GET /api/academy/modules
 * Returns all LMS modules ordered by order_index.
 */
export async function GET(_req: NextRequest) {
  try {
    const { data, error } = await supabase
      .from("lms_modules")
      .select("*")
      .order("order_index", { ascending: true });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json({ modules: data ?? [] }, { status: 200 });
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || "Internal server error." },
      { status: 500 }
    );
  }
}

/**
 * POST /api/academy/modules
 * Admin: creates a new LMS module.
 * Body: { title: string, description: string, thumbnail_url?: string }
 */
export async function POST(req: NextRequest) {
  try {
    const { title, description, thumbnail_url } = await req.json();

    if (!title || !description) {
      return NextResponse.json(
        { error: "title and description are required." },
        { status: 400 }
      );
    }

    // Determine next order_index
    const { count } = await supabase
      .from("lms_modules")
      .select("*", { count: "exact", head: true });

    const { data, error } = await supabase
      .from("lms_modules")
      .insert([
        {
          title,
          description,
          thumbnail_url: thumbnail_url ?? "",
          order_index: count ?? 0,
        },
      ])
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json(
      { message: "Module created.", module: data },
      { status: 201 }
    );
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || "Internal server error." },
      { status: 500 }
    );
  }
}
