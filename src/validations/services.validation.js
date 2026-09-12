import { z } from 'zod';

const objectId = z.string().regex(/^[a-f\d]{24}$/i, 'must be a valid ObjectId');

const serviceFields = {
  name: z.string().trim().min(1, 'is required'),
  professionalName: z.string().trim().min(1, 'is required'),
  description: z.string().trim().min(1, 'is required'),
  duration: z.number().int().positive(),
  price: z.number().nonnegative(),
  category: z.string().trim().min(1, 'is required'),
  available: z.boolean(),
};

export const createServiceSchema = z.object(serviceFields).strict();

export const updateServiceSchema = z
  .object(serviceFields)
  .partial()
  .strict()
  .refine((data) => Object.keys(data).length > 0, 'at least one field is required');

export const serviceIdParamsSchema = z.object({ sid: objectId });

export const servicesQuerySchema = z.object({
  category: z.string().trim().min(1).optional(),
  available: z.preprocess(
    (value) => {
      if (value === 'true') return true;
      if (value === 'false') return false;
      return value;
    },
    z.boolean().optional()
  ),
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(10),
  sortBy: z.enum(['name', 'description', 'duration', 'price', 'category', 'available']).optional(),
  order: z.enum(['asc', 'desc']).default('asc'),
});