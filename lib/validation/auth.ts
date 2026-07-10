import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().trim().email(),
  password: z
    .string()
    .min(12, "Password must be at least 12 characters.")
    .regex(/[A-Z]/, "Password must contain an uppercase letter.")
    .regex(/[a-z]/, "Password must contain a lowercase letter.")
    .regex(/[0-9]/, "Password must contain a number."),
});

export type LoginInput = z.infer<typeof loginSchema>;
