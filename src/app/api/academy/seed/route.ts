import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const DEMO_MODULE = {
  title: "African 2D Animation Fundamentals",
  description:
    "Learn how to use traditional Nigerian motifs and storytelling in modern 2D animation.",
  thumbnail_url:
    "https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=800&q=80",
  order_index: 0,
};

const DEMO_LESSONS = (moduleId: string) => [
  {
    module_id: moduleId,
    title: "Introduction to Cultural Motif Animation",
    description: "Understanding how to animate Nok art and Benin bronze styles.",
    video_url: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    duration: "10:00",
    order_index: 0,
  },
  {
    module_id: moduleId,
    title: "Storytelling with The Talking Drum",
    description: "Synchronizing sound and motion in traditional narratives.",
    video_url: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    duration: "15:30",
    order_index: 1,
  },
  {
    module_id: moduleId,
    title: "Character Design & Nigerian Folklore",
    description:
      "Bringing Sango, Eyo, and Nok terracotta legends to life through character design.",
    video_url: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    duration: "20:15",
    order_index: 2,
  },
];

/**
 * POST /api/academy/seed
 * Admin-only: seeds the LMS with demo module + lessons.
 * Idempotent — skips if a module with the same title already exists.
 */
export async function POST(_req: NextRequest) {
  try {
    // Check if demo data already exists
    const { data: existing } = await supabase
      .from("lms_modules")
      .select("id")
      .eq("title", DEMO_MODULE.title)
      .single();

    if (existing) {
      return NextResponse.json(
        { message: "Demo data already exists.", moduleId: existing.id },
        { status: 200 }
      );
    }

    // Insert module
    const { data: mod, error: modErr } = await supabase
      .from("lms_modules")
      .insert([DEMO_MODULE])
      .select()
      .single();

    if (modErr || !mod) {
      return NextResponse.json(
        { error: modErr?.message ?? "Failed to create module." },
        { status: 500 }
      );
    }

    // Insert lessons
    const { error: lessonErr } = await supabase
      .from("lms_lessons")
      .insert(DEMO_LESSONS(mod.id));

    if (lessonErr) {
      return NextResponse.json({ error: lessonErr.message }, { status: 500 });
    }

    return NextResponse.json(
      {
        message: "Demo content seeded successfully.",
        moduleId: mod.id,
        lessonsAdded: DEMO_LESSONS(mod.id).length,
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
