import { z } from "zod";
import { SEED_PATTERN } from "./avatar";

export const scanRequestSchema = z.object({
  url: z.string().min(1).max(2048),
});

export const reviewSubmitSchema = z
  .object({
    name: z.string().trim().max(40).optional().or(z.literal("")),
    anonymous: z.boolean().optional(),
    avatarSeed: z.string().regex(SEED_PATTERN),
    rating: z.number().int().min(1).max(5),
    reviewText: z.string().trim().min(1).max(600),
    reason: z.string().trim().max(120).optional().or(z.literal("")),
  })
  .refine((v) => v.anonymous || (v.name && v.name.length > 0), {
    message: "Add a name or stay anonymous.",
    path: ["name"],
  });

export const reviewModerationSchema = z.object({
  status: z.enum(["approved", "rejected", "pending"]),
});

export const adminLoginSchema = z.object({
  password: z.string().min(1).max(200),
});
