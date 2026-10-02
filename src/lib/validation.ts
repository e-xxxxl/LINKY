import { z } from "zod";

export const scanRequestSchema = z.object({
  url: z.string().min(1).max(2048),
});

export const reviewSubmitSchema = z.object({
  name: z.string().trim().min(2).max(60),
  avatarUrl: z.string().trim().url().max(500).optional().or(z.literal("")),
  rating: z.number().int().min(1).max(5),
  reviewText: z.string().trim().min(10).max(600),
  reason: z.string().trim().max(120).optional().or(z.literal("")),
});

export const reviewModerationSchema = z.object({
  status: z.enum(["approved", "rejected", "pending"]),
});

export const adminLoginSchema = z.object({
  password: z.string().min(1).max(200),
});
