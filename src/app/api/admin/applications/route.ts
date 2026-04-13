import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

/**
 * GET /api/admin/applications
 * Returns all ambassador applications with profile info.
 * Query params:
 *   - status: "pending" | "approved" | "rejected" (optional)
 */
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const status = searchParams.get("status");

    let query = supabase
      .from("ambassador_applications")
      .select(
        `
        id,
        user_id,
        university,
        full_name,
        status,
        created_at,
        profiles (username, total_referrals)
        `
      )
      .order("created_at", { ascending: false });

    if (status) query = query.eq("status", status);

    const { data, error } = await query;

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json({ applications: data ?? [] }, { status: 200 });
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || "Internal server error." },
      { status: 500 }
    );
  }
}

/**
 * PATCH /api/admin/applications
 * Admin: update the status of an application.
 * Body: { application_id: string, status: "approved" | "rejected" }
 */
export async function PATCH(req: NextRequest) {
  try {
    const { application_id, status } = await req.json();

    if (!application_id || !status) {
      return NextResponse.json(
        { error: "application_id and status are required." },
        { status: 400 }
      );
    }

    if (!["approved", "rejected", "pending"].includes(status)) {
      return NextResponse.json(
        { error: 'status must be "approved", "rejected", or "pending".' },
        { status: 400 }
      );
    }

    const { data, error } = await supabase
      .from("ambassador_applications")
      .update({ status })
      .eq("id", application_id)
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json(
      { message: `Application ${status}.`, application: data },
      { status: 200 }
    );
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || "Internal server error." },
      { status: 500 }
    );
  }
}
