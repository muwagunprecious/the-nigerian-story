import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

/**
 * GET /api/referrals?user_id=<uuid>
 * Returns the list of users referred by a given user
 * and their current total referral count.
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

    // 1. Fetch all users referred by this user
    const { data: referees, error: refError } = await supabase
      .from("profiles")
      .select("username, created_at, university")
      .eq("referred_by", userId)
      .order("created_at", { ascending: false });

    if (refError) {
      return NextResponse.json({ error: refError.message }, { status: 400 });
    }

    // 2. Fetch the referrer's current count
    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("total_referrals, referral_code")
      .eq("id", userId)
      .single();

    if (profileError) {
      return NextResponse.json({ error: profileError.message }, { status: 404 });
    }

    // 3. Self-heal if count is out of sync
    const actualCount = referees?.length ?? 0;
    if (profile.total_referrals !== actualCount) {
      await supabase
        .from("profiles")
        .update({ total_referrals: actualCount })
        .eq("id", userId);
    }

    return NextResponse.json(
      {
        referredUsers: referees ?? [],
        totalReferrals: actualCount,
        referralCode: profile.referral_code,
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
