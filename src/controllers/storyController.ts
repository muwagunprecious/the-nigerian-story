import { Request, Response } from 'express';
import { prisma } from '../config/prisma';

export const getAllStories = async (req: Request, res: Response) => {
  try {
    const userId = req.query.user_id as string;
    const category = req.query.category as string;
    const limit = parseInt((req.query.limit as string) ?? "50");
    const offset = parseInt((req.query.offset as string) ?? "0");

    const [stories, count] = await Promise.all([
      prisma.story.findMany({
        where: {
          user_id: userId || undefined,
          category: category || undefined,
        },
        orderBy: {
          created_at: 'desc',
        },
        take: limit,
        skip: offset,
      }),
      prisma.story.count({
        where: {
          user_id: userId || undefined,
          category: category || undefined,
        },
      }),
    ]);

    return res.status(200).json({ stories, total: count });
  } catch (err: any) {
    return res.status(500).json({ error: err.message || "Internal server error." });
  }
};

export const getStoryById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const story = await prisma.story.findUnique({
      where: { id },
    });

    if (!story) {
      return res.status(404).json({ error: "Story not found." });
    }

    return res.status(200).json({ story });
  } catch (err: any) {
    return res.status(500).json({ error: err.message || "Internal server error." });
  }
};

export const createStory = async (req: Request, res: Response) => {
  try {
    const { user_id, name, email, title, content, location, era, category } = req.body;

    if (!user_id || !title || !content || !location || !era || !category) {
      return res.status(400).json({
        error: "Missing required fields: user_id, title, content, location, era, category.",
      });
    }

    const story = await prisma.story.create({
      data: {
        user_id,
        name,
        email,
        title,
        content,
        location,
        era,
        category,
      },
    });

    return res.status(201).json({ message: "Story submitted successfully.", story });
  } catch (err: any) {
    return res.status(500).json({ error: err.message || "Internal server error." });
  }
};

export const deleteStory = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    await prisma.story.delete({
      where: { id },
    });

    return res.status(200).json({ message: `Story ${id} deleted successfully.` });
  } catch (err: any) {
    return res.status(500).json({ error: err.message || "Internal server error." });
  }
};
