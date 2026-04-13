import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

/**
 * GET /api/profile/[id]
 * Returns the full profile record for a given user ID.
 * Also computes and self-heals total_referrals if out of sync.
 */
export async function GET(
  _req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    // 1. Fetch profile
    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", id)
      .single();

    if (profileError || !profile) {
      return NextResponse.json({ error: "Profile not found." }, { status: 404 });
    }

    // 2. Compute actual referral count
    const { data: referees } = await supabase
      .from("profiles")
      .select("username, created_at")
      .eq("referred_by", id);

    const actualCount = referees?.length ?? 0;

    // 3. Self-heal if out of sync
    if (profile.total_referrals !== actualCount) {
      await supabase
        .from("profiles")
        .update({ total_referrals: actualCount })
        .eq("id", id);
      profile.total_referrals = actualCount;
    }

    return NextResponse.json(
      { profile, referredUsers: referees ?? [] },
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
 * PATCH /api/profile/[id]
 * Updates a user's profile (university and/or referral code).
 * Body: { university?: string, referral_code?: string, username?: string }
 */
export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const body = await req.json();

    // Only allow specific fields to be updated
    const allowedFields = ["university", "referral_code", "username"];
    const updates: Record<string, string> = {};

    for (const field of allowedFields) {
      if (body[field] !== undefined) {
        updates[field] = body[field];
      }
    }

    if (Object.keys(updates).length === 0) {
      return NextResponse.json(
        { error: "No valid fields provided for update." },
        { status: 400 }
      );
    }

    const { data, error } = await supabase
      .from("profiles")
      .update(updates)
      .eq("id", id)
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json({ message: "Profile updated.", profile: data }, { status: 200 });
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || "Internal server error." },
      { status: 500 }
    );
  }
}
