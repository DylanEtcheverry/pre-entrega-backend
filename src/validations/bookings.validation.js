import { z } from 'zod';

const objectId = z.string().regex(/^[a-f\d]{24}$/i, 'must be a valid ObjectId');

export const createBookingSchema = z
  .object({
    clientName: z.string().trim().min(1, 'is required'),
    clientEmail: z.string().email(),
    date: z.string().trim().min(1, 'is required'),
    time: z.string().trim().min(1, 'is required'),
    status: z.string().trim().min(1, 'is required'),
    services: z
      .array(
        z.object({
          service: objectId,
          quantity: z.number().int().positive(),
        }).strict()
      )
      .optional()
      .default([]),
  })
  .strict();

export const bookingIdParamsSchema = z.object({ bid: objectId });

export const addServiceParamsSchema = z.object({ bid: objectId, sid: objectId });