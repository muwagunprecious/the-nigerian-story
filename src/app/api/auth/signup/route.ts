import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY! // service role for server-side ops
);

const CHARS = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";

function generateReferralCode(univAbbrev: string): string {
  let code = "";
  for (let i = 0; i < 6; i++) {
    code += CHARS.charAt(Math.floor(Math.random() * CHARS.length));
  }
  return `${univAbbrev.toUpperCase()}-${code}`;
}

function getAbbreviation(universityName: string): string {
  const words = universityName.split(" ").filter((w) => w.length > 2);
  return words
    .slice(0, 3)
    .map((w) => w[0])
    .join("")
    .toUpperCase();
}

export async function POST(req: NextRequest) {
  try {
    const { email, password, username, university, referralCode } =
      await req.json();

    if (!email || !password || !username || !university) {
      return NextResponse.json(
        { error: "Missing required fields: email, password, username, university." },
        { status: 400 }
      );
    }

    // 1. Create auth user
    const { data: authData, error: authError } = await supabase.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: { username, university },
    });

    if (authError) {
      return NextResponse.json({ error: authError.message }, { status: 400 });
    }

    const userId = authData.user.id;
    const abbrev = getAbbreviation(university);
    const userReferralCode = generateReferralCode(abbrev);

    // 2. Upsert profile
    const { error: profileError } = await supabase.from("profiles").upsert({
      id: userId,
      username,
      university,
      referral_code: userReferralCode,
      total_referrals: 0,
    });

    if (profileError) {
      return NextResponse.json({ error: profileError.message }, { status: 500 });
    }

    // 3. Handle referral code
    if (referralCode) {
      const cleanCode = referralCode.trim().toUpperCase();
      const { data: referrer } = await supabase
        .from("profiles")
        .select("id")
        .eq("referral_code", cleanCode)
        .single();

      if (referrer) {
        // Link referral to new user
        await supabase
          .from("profiles")
          .update({ referred_by: referrer.id })
          .eq("id", userId);

        // Increment referrer's count
        await supabase.rpc("increment_referral_count", {
          referrer_id: referrer.id,
        });
      }
    }

    return NextResponse.json(
      {
        message: "Account created successfully.",
        userId,
        referralCode: userReferralCode,
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
