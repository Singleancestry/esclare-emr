import { z } from "zod";

const optionalUrl = z.union([z.literal(""), z.string().url()]).transform((value) => value || null);

export const reviewSchema = z.object({
  id: z.union([z.literal(""), z.string().uuid()]).optional(),
  reviewerDisplayName: z.string().trim().min(1).max(120),
  reviewText: z.string().trim().min(10).max(4000),
  rating: z.coerce.number().int().min(1).max(5),
  reviewDate: z.coerce.date(),
  source: z.enum(["google", "facebook", "manual", "other"]),
  originalReviewUrl: optionalUrl,
  sourceProfileUrl: optionalUrl,
  verified: z.coerce.boolean().default(false),
  featured: z.coerce.boolean().default(false),
  published: z.coerce.boolean().default(false),
  displayOrder: z.coerce.number().int().min(0).max(10000),
  lastCheckedAt: z.union([z.literal(""), z.coerce.date()]).optional(),
  adminNotes: z.string().trim().max(2000).optional(),
  clinicResponse: z.string().trim().max(2000).optional(),
});

export const reviewArchiveSchema = z.object({
  id: z.string().uuid(),
  reason: z.string().trim().min(5).max(500),
});
