import { Request, Response } from 'express';
import { prisma } from '../config/prisma';

export const getModules = async (req: Request, res: Response) => {
  try {
    const modules = await prisma.lmsModule.findMany({
      orderBy: { order_index: 'asc' },
    });

    return res.status(200).json({ modules });
  } catch (err: any) {
    return res.status(500).json({ error: err.message || "Internal server error." });
  }
};

export const createModule = async (req: Request, res: Response) => {
  try {
    const { title, description, thumbnail_url } = req.body;

    if (!title || !description) {
      return res.status(400).json({ error: "title and description are required." });
    }

    const count = await prisma.lmsModule.count();

    const module = await prisma.lmsModule.create({
      data: {
        title,
        description,
        thumbnail_url: thumbnail_url ?? "",
        order_index: count,
      },
    });

    return res.status(201).json({ message: "Module created.", module });
  } catch (err: any) {
    return res.status(500).json({ error: err.message || "Internal server error." });
  }
};

export const getLessonsByModule = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const lessons = await prisma.lmsLesson.findMany({
      where: { module_id: id },
      orderBy: { order_index: 'asc' },
    });

    return res.status(200).json({ lessons });
  } catch (err: any) {
    return res.status(500).json({ error: err.message || "Internal server error." });
  }
};

export const addLessonToModule = async (req: Request, res: Response) => {
  try {
    const { id: moduleId } = req.params;
    const { title, description, video_url, duration } = req.body;

    if (!title || !video_url) {
      return res.status(400).json({ error: "title and video_url are required." });
    }

    const count = await prisma.lmsLesson.count({
      where: { module_id: moduleId },
    });

    const lesson = await prisma.lmsLesson.create({
      data: {
        module_id: moduleId,
        title,
        description: description ?? "",
        video_url,
        duration: duration ?? "",
        order_index: count,
      },
    });

    return res.status(201).json({ message: "Lesson added.", lesson });
  } catch (err: any) {
    return res.status(500).json({ error: err.message || "Internal server error." });
  }
};

export const deleteModule = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    await prisma.lmsModule.delete({ where: { id } });
    return res.status(200).json({ message: "Module deleted." });
  } catch (err: any) {
    return res.status(500).json({ error: err.message || "Internal server error." });
  }
};

export const deleteLesson = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    await prisma.lmsLesson.delete({ where: { id } });
    return res.status(200).json({ message: "Lesson deleted." });
  } catch (err: any) {
    return res.status(500).json({ error: err.message || "Internal server error." });
  }
};

export const getModuleById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const module = await prisma.lmsModule.findUnique({ where: { id } });
    if (!module) return res.status(404).json({ error: "Module not found." });
    return res.status(200).json({ module });
  } catch (err: any) {
    return res.status(500).json({ error: err.message || "Internal server error." });
  }
};

export const getProgress = async (req: any, res: Response) => {
  try {
    const user_id = req.user.id;
    const progress = await prisma.lmsProgress.findMany({
      where: { user_id },
      select: { lesson_id: true },
    });
    return res.status(200).json({ progress: progress.map(p => p.lesson_id) });
  } catch (err: any) {
    return res.status(500).json({ error: err.message || "Internal server error." });
  }
};

export const toggleProgress = async (req: any, res: Response) => {
  try {
    const user_id = req.user.id;
    const { lesson_id } = req.body;
    
    const existing = await prisma.lmsProgress.findUnique({
      where: {
        user_id_lesson_id: {
          user_id,
          lesson_id,
        },
      },
    });

    if (existing) {
      await prisma.lmsProgress.delete({
        where: {
          user_id_lesson_id: {
            user_id,
            lesson_id,
          },
        },
      });
      return res.status(200).json({ message: "Progress removed.", completed: false });
    } else {
      await prisma.lmsProgress.create({
        data: {
          user_id,
          lesson_id,
        },
      });
      return res.status(200).json({ message: "Progress added.", completed: true });
    }
  } catch (err: any) {
    return res.status(500).json({ error: err.message || "Internal server error." });
  }
};
