import { z } from "zod";

export const registerSchema = z.object({
    name: z.string().min(3).max(50),
    email: z.string()
        .email({ message: "Invalid email address" }),
    password: z.string()
        .min(8, { message: "Password must be atleast 8 characters" })
        .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{8,}$/,
            "Password must contain uppercase, lowercase, number, and special character")
});

export const loginSchema = z.object({
    email: z.string().email("Invalid email"),
    password: z.string().min(6, "Password required")
});