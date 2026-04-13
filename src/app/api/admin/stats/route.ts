import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

/**
 * GET /api/admin/stats
 * Returns aggregate platform statistics for the admin dashboard.
 * Response: { totalStories, totalUsers, totalReferrals, totalModules, totalLessons }
 */
export async function GET(_req: NextRequest) {
  try {
    const [
      { count: totalStories },
      { count: totalUsers, data: profileData },
      { count: totalModules },
      { count: totalLessons },
      { count: totalApplications },
    ] = await Promise.all([
      supabase.from("stories").select("*", { count: "exact", head: true }),
      supabase.from("profiles").select("total_referrals", { count: "exact" }),
      supabase.from("lms_modules").select("*", { count: "exact", head: true }),
      supabase.from("lms_lessons").select("*", { count: "exact", head: true }),
      supabase.from("ambassador_applications").select("*", { count: "exact", head: true }),
    ]);

    const totalReferrals =
      profileData?.reduce((acc, p) => acc + (p.total_referrals || 0), 0) ?? 0;

    return NextResponse.json(
      {
        totalStories: totalStories ?? 0,
        totalUsers: totalUsers ?? 0,
        totalReferrals,
        totalModules: totalModules ?? 0,
        totalLessons: totalLessons ?? 0,
        totalApplications: totalApplications ?? 0,
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
