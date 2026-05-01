import { Request, Response } from 'express';
import { prisma } from '../config/prisma';

// Profile
export const getProfile = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const profile = await prisma.profile.findUnique({
      where: { id },
      include: {
        _count: {
          select: { stories: true }
        }
      }
    });

    if (!profile) {
      return res.status(404).json({ error: "Profile not found." });
    }

    const referees = await prisma.profile.findMany({
      where: { referred_by: id },
      select: {
        username: true,
        created_at: true,
      },
    });

    const actualCount = referees.length;

    if (profile.total_referrals !== actualCount) {
      await prisma.profile.update({
        where: { id },
        data: { total_referrals: actualCount },
      });
      profile.total_referrals = actualCount;
    }

    return res.status(200).json({ profile, referredUsers: referees });
  } catch (err: any) {
    return res.status(500).json({ error: err.message || "Internal server error." });
  }
};

export const updateProfile = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const body = req.body;

    const allowedFields = ["university", "referral_code", "username"];
    const updates: any = {};

    for (const field of allowedFields) {
      if (body[field] !== undefined) {
        updates[field] = body[field];
      }
    }

    if (Object.keys(updates).length === 0) {
      return res.status(400).json({ error: "No valid fields provided for update." });
    }

    const profile = await prisma.profile.update({
      where: { id },
      data: updates,
    });

    return res.status(200).json({ message: "Profile updated.", profile });
  } catch (err: any) {
    return res.status(500).json({ error: err.message || "Internal server error." });
  }
};

// Referrals
export const getReferrals = async (req: Request, res: Response) => {
  try {
    const userId = req.query.user_id as string;

    if (!userId) {
      return res.status(400).json({ error: "user_id query param is required." });
    }

    const referees = await prisma.profile.findMany({
      where: { referred_by: userId },
      select: {
        username: true,
        created_at: true,
        university: true,
      },
      orderBy: {
        created_at: 'desc',
      },
    });

    const profile = await prisma.profile.findUnique({
      where: { id: userId },
      select: {
        total_referrals: true,
        referral_code: true,
      },
    });

    if (!profile) {
      return res.status(404).json({ error: "Profile not found." });
    }

    const actualCount = referees.length;
    if (profile.total_referrals !== actualCount) {
      await prisma.profile.update({
        where: { id: userId },
        data: { total_referrals: actualCount },
      });
    }

    return res.status(200).json({
      referredUsers: referees,
      totalReferrals: actualCount,
      referralCode: profile.referral_code,
    });
  } catch (err: any) {
    return res.status(500).json({ error: err.message || "Internal server error." });
  }
};

// Ambassador
export const getAmbassadorStatus = async (req: Request, res: Response) => {
  try {
    const userId = req.query.user_id as string;

    if (!userId) {
      return res.status(400).json({ error: "user_id query param is required." });
    }

    const [storyCount, profile, application] = await Promise.all([
      prisma.story.count({
        where: { user_id: userId },
      }),
      prisma.profile.findUnique({
        where: { id: userId },
        select: { university: true, username: true },
      }),
      prisma.ambassadorApplication.findFirst({
        where: { user_id: userId },
        select: { id: true, status: true, created_at: true },
      }),
    ]);

    return res.status(200).json({
      storyCount: storyCount || 0,
      university: profile?.university || "",
      username: profile?.username || "",
      application: application || null,
    });
  } catch (err: any) {
    return res.status(500).json({ error: err.message || "Internal server error." });
  }
};

export const submitAmbassadorApplication = async (req: Request, res: Response) => {
  try {
    const { user_id, university, full_name } = req.body;

    if (!user_id || !university || !full_name) {
      return res.status(400).json({ error: "user_id, university, and full_name are required." });
    }

    const storyCount = await prisma.story.count({
      where: { user_id },
    });

    if (storyCount === 0) {
      return res.status(403).json({
        error: "You must submit at least one story before applying as an ambassador.",
      });
    }

    const existing = await prisma.ambassadorApplication.findFirst({
      where: { user_id },
      select: { id: true, status: true },
    });

    if (existing) {
      return res.status(409).json({
        error: `You already have an application with status: ${existing.status}.`,
        application: existing,
      });
    }

    const application = await prisma.ambassadorApplication.create({
      data: {
        user_id,
        university,
        full_name,
        status: "pending",
      },
    });

    return res.status(201).json({ message: "Application submitted successfully.", application });
  } catch (err: any) {
    return res.status(500).json({ error: err.message || "Internal server error." });
  }
};

// Leaderboard
export const getLeaderboard = async (req: Request, res: Response) => {
  try {
    const university = req.query.university as string;
    const limit = parseInt((req.query.limit as string) ?? "100");

    const profiles = await prisma.profile.findMany({
      where: {
        university: (university && university !== "All") ? university : undefined,
      },
      select: {
        id: true,
        username: true,
        university: true,
        total_referrals: true,
      },
      orderBy: {
        total_referrals: 'desc',
      },
      take: limit,
    });

    const ranked = profiles.map((entry, index) => ({
      ...entry,
      rank: index + 1,
    }));

    return res.status(200).json({ leaderboard: ranked, total: ranked.length });
  } catch (err: any) {
    return res.status(500).json({ error: err.message || "Internal server error." });
  }
};

// Notifications
export const getNotifications = async (req: Request, res: Response) => {
  try {
    const userId = req.query.user_id as string;
    const limit = parseInt((req.query.limit as string) ?? "20");

    if (!userId) {
      return res.status(400).json({ error: "user_id query param is required." });
    }

    const notifications = await prisma.notification.findMany({
      where: {
        OR: [
          { user_id: null },
          { user_id: userId },
        ],
      },
      orderBy: {
        created_at: 'desc',
      },
      take: limit,
    });

    return res.status(200).json({ notifications });
  } catch (err: any) {
    return res.status(500).json({ error: err.message || "Internal server error." });
  }
};

export const createNotification = async (req: Request, res: Response) => {
  try {
    const { title, message, type, target_username } = req.body;

    if (!title || !message || !type) {
      return res.status(400).json({ error: "title, message, and type are required." });
    }

    let userId: string | null = null;

    if (target_username) {
      const user = await prisma.profile.findFirst({
        where: {
          OR: [
            { username: target_username },
            { id: target_username },
          ],
        },
        select: { id: true },
      });

      if (!user) {
        return res.status(404).json({ error: `User "${target_username}" not found.` });
      }

      userId = user.id;
    }

    const notification = await prisma.notification.create({
      data: {
        user_id: userId,
        title,
        message,
        type,
      },
    });

    return res.status(201).json({
      message: userId ? `Notification sent to user ${userId}.` : "Broadcast sent to all users.",
      notification,
    });
  } catch (err: any) {
    return res.status(500).json({ error: err.message || "Internal server error." });
  }
};
