import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

/**
 * GET /api/leaderboard
 * Returns top users ranked by total_referrals.
 * Query params:
 *   - university: filter by university name (optional, "All" = no filter)
 *   - limit: number of results (default 100)
 */
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const university = searchParams.get("university");
    const limit = parseInt(searchParams.get("limit") ?? "100");

    let query = supabase
      .from("profiles")
      .select("id, username, university, total_referrals")
      .order("total_referrals", { ascending: false })
      .limit(limit);

    if (university && university !== "All") {
      query = query.eq("university", university);
    }

    const { data, error } = await query;

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    // Attach rank to each entry
    const ranked = (data ?? []).map((entry, index) => ({
      ...entry,
      rank: index + 1,
    }));

    return NextResponse.json({ leaderboard: ranked, total: ranked.length }, { status: 200 });
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || "Internal server error." },
      { status: 500 }
    );
  }
}
