import { Request, Response } from 'express';
import { supabase } from '../config/supabase';
import { prisma } from '../config/prisma';

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

export const signup = async (req: Request, res: Response) => {
  try {
    const { email, password, username, university, referralCode } = req.body;

    if (!email || !password || !username || !university) {
      return res.status(400).json({ error: "Missing required fields: email, password, username, university." });
    }

    // 1. Create auth user via Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: { username, university },
    });

    if (authError) {
      return res.status(400).json({ error: authError.message });
    }

    const userId = authData.user.id;
    const abbrev = getAbbreviation(university);
    const userReferralCode = generateReferralCode(abbrev);

    // 2. Create profile via Prisma
    await prisma.profile.upsert({
      where: { id: userId },
      update: {
        username,
        university,
        referral_code: userReferralCode,
      },
      create: {
        id: userId,
        username,
        university,
        referral_code: userReferralCode,
        total_referrals: 0,
      },
    });

    // 3. Handle referral code
    if (referralCode) {
      const cleanCode = referralCode.trim().toUpperCase();
      const referrer = await prisma.profile.findUnique({
        where: { referral_code: cleanCode },
        select: { id: true },
      });

      if (referrer) {
        // Link referral to new user
        await prisma.profile.update({
          where: { id: userId },
          data: { referred_by: referrer.id },
        });

        // Increment referrer's count
        await prisma.profile.update({
          where: { id: referrer.id },
          data: {
            total_referrals: {
              increment: 1,
            },
          },
        });
      }
    }

    return res.status(201).json({
      message: "Account created successfully.",
      userId,
      referralCode: userReferralCode,
    });
  } catch (err: any) {
    return res.status(500).json({ error: err.message || "Internal server error." });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required." });
    }

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      return res.status(401).json({ error: error.message });
    }

    return res.status(200).json({
      message: "Login successful.",
      user: data.user,
      session: data.session,
    });
  } catch (err: any) {
    return res.status(500).json({ error: err.message || "Internal server error." });
  }
};

export const logout = async (req: Request, res: Response) => {
  try {
    const { error } = await supabase.auth.signOut();

    if (error) {
      return res.status(400).json({ error: error.message });
    }

    return res.status(200).json({ message: "Logged out successfully." });
  } catch (err: any) {
    return res.status(500).json({ error: err.message || "Internal server error." });
  }
};
