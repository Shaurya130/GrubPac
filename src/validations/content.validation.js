import { z } from 'zod';

export const uploadContentSchema = z.object({
  title: z.string().min(1),

  subject: z.string().min(1),

  description: z.string().optional(),

  duration: z.coerce.number().min(1),

  startTime: z.string(),

  endTime: z.string(),
});