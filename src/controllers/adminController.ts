import { Request, Response } from 'express';
import { prisma } from '../config/prisma';

export const getStats = async (_req: Request, res: Response) => {
  try {
    const [
      totalStories,
      totalUsers,
      profileData,
      totalModules,
      totalLessons,
      totalApplications,
    ] = await Promise.all([
      prisma.story.count(),
      prisma.profile.count(),
      prisma.profile.findMany({ select: { total_referrals: true } }),
      prisma.lmsModule.count(),
      prisma.lmsLesson.count(),
      prisma.ambassadorApplication.count(),
    ]);

    const totalReferrals = profileData.reduce((acc, p) => acc + (p.total_referrals || 0), 0);

    return res.status(200).json({
      totalStories,
      totalUsers,
      totalReferrals,
      totalModules,
      totalLessons,
      totalApplications,
    });
  } catch (err: any) {
    return res.status(500).json({ error: err.message || "Internal server error." });
  }
};

export const getApplications = async (req: Request, res: Response) => {
  try {
    const status = req.query.status as string;

    const applications = await prisma.ambassadorApplication.findMany({
      where: {
        status: status || undefined,
      },
      include: {
        user: {
          select: {
            username: true,
            total_referrals: true,
          }
        }
      },
      orderBy: {
        created_at: 'desc',
      },
    });

    return res.status(200).json({ applications });
  } catch (err: any) {
    return res.status(500).json({ error: err.message || "Internal server error." });
  }
};

export const updateApplicationStatus = async (req: Request, res: Response) => {
  try {
    const { application_id, status } = req.body;

    if (!application_id || !status) {
      return res.status(400).json({ error: "application_id and status are required." });
    }

    if (!["approved", "rejected", "pending"].includes(status)) {
      return res.status(400).json({ error: 'status must be "approved", "rejected", or "pending".' });
    }

    const application = await prisma.ambassadorApplication.update({
      where: { id: application_id },
      data: { status },
    });

    return res.status(200).json({ message: `Application ${status}.`, application });
  } catch (err: any) {
    return res.status(500).json({ error: err.message || "Internal server error." });
  }
};
