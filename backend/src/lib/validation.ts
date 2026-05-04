import { Request, Response, NextFunction } from 'express';
import { ZodSchema, ZodError, z } from 'zod';

export function validateBody<T>(schema: ZodSchema<T>) {
  return (req: Request, res: Response, next: NextFunction) => {
    const parsed = schema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ error: 'Invalid request body', details: parsed.error.flatten() });
    }
    req.body = parsed.data;
    next();
  };
}

export function validateQuery<T>(schema: ZodSchema<T>) {
  return (req: Request, res: Response, next: NextFunction) => {
    const parsed = schema.safeParse(req.query);
    if (!parsed.success) {
      return res.status(400).json({ error: 'Invalid query', details: parsed.error.flatten() });
    }
    req.query = parsed.data as any;
    next();
  };
}

export function zodError(err: unknown, res: Response): boolean {
  if (err instanceof ZodError) {
    res.status(400).json({ error: 'Invalid input', details: err.flatten() });
    return true;
  }
  return false;
}

// Shared scalar shapes
export const Email = z.string().email().max(255);
export const Password = z.string().min(8).max(128);
export const Username = z.string().min(3).max(50).regex(/^[a-zA-Z0-9_.-]+$/);
export const NonEmptyText = z.string().min(1).max(2000);
export const Phone = z.string().min(7).max(20).optional().nullable();

// Shared schemas
export const RegisterStudentSchema = z.object({
  username: Username,
  email: Email,
  password: Password,
  full_name: z.string().min(2).max(120).optional(),
  phone: Phone,
  class_grade: z.string().max(32).optional().nullable(),
});

export const LoginSchema = z.object({
  email: Email,
  password: z.string().min(1),
});

export const InviteUserSchema = z.object({
  username: Username,
  email: Email,
  password: Password,
  role: z.enum(['teacher', 'student']),
  full_name: z.string().min(2).max(120),
  phone: Phone,
  bio: z.string().max(2000).optional().nullable(),
  class_grade: z.string().max(32).optional().nullable(),
});

export const UpdateProfileSchema = z.object({
  full_name: z.string().min(2).max(120).optional(),
  phone: Phone,
  avatar_url: z.string().url().max(500).optional().nullable(),
  bio: z.string().max(2000).optional().nullable(),
  class_grade: z.string().max(32).optional().nullable(),
});

export const CreateCourseSchema = z.object({
  slug: z.string().min(2).max(120).regex(/^[a-z0-9-]+$/),
  title: z.string().min(2).max(255),
  category: z.string().min(2).max(64),
  description: z.string().max(4000).optional().nullable(),
  duration_months: z.number().int().positive().max(120).optional().nullable(),
  price_inr: z.number().int().nonnegative().optional().nullable(),
  hero_image_url: z.string().url().max(500).optional().nullable(),
  highlights: z.any().optional().nullable(),
  is_published: z.boolean().optional(),
});

export const CreateBatchSchema = z.object({
  course_id: z.number().int().positive(),
  name: z.string().min(2).max(255),
  start_date: z.string(),
  end_date: z.string().optional().nullable(),
  schedule_description: z.string().max(500).optional().nullable(),
  capacity: z.number().int().positive().optional().nullable(),
  status: z.enum(['upcoming', 'active', 'completed', 'archived']).optional(),
  teacher_ids: z.array(z.number().int().positive()).optional(),
  student_ids: z.array(z.number().int().positive()).optional(),
});

export const CreateMaterialSchema = z.object({
  title: z.string().min(1).max(255),
  description: z.string().max(2000).optional().nullable(),
  type: z.enum(['pdf', 'video_link', 'image', 'doc', 'text_note']),
  url: z.string().url().max(1000).optional().nullable(),
  text_body: z.string().max(50_000).optional().nullable(),
  size_bytes: z.number().int().nonnegative().optional().nullable(),
  is_pinned: z.boolean().optional(),
});

export const CreateLiveClassSchema = z.object({
  title: z.string().min(1).max(255),
  description: z.string().max(2000).optional().nullable(),
  scheduled_start: z.string(),
  scheduled_end: z.string(),
  teacher_id: z.number().int().positive().optional(),
});

export const CreateAnnouncementSchema = z.object({
  title: z.string().min(1).max(255),
  body: z.string().min(1),
  is_pinned: z.boolean().optional(),
});

export const SignedUploadSchema = z.object({
  filename: z.string().min(1).max(255),
  content_type: z.string().min(1).max(120),
  size_bytes: z.number().int().positive().max(500 * 1024 * 1024), // 500 MB hard cap
});
