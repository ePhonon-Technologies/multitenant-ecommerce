import { z } from "zod";

// loginSchema - Schema to validate the login input (email and password)
export const loginSchema = z.object({
  email: z.string().email(), // Validates email format
  password: z.string(), // Accepts any non-empty string for password
});

// registerSchema - Schema to validate the registration input (email, password, username)
export const registerSchema = z.object({
  email: z.string().email(), // Validates email format
  password: z.string(), // Accepts any non-empty string for password
  username: z
    .string()
    .min(3, "Username must be at least 3 characters") // Enforce minimum length of 3
    .max(63, "Username must be less than 63 characters") // Enforce maximum length of 63
    .regex(
      /^[a-z0-9][a-z0-9-]*[a-z0-9]$/, // Must start/end with letter or number; hyphens allowed in between
      "Username can only contain lowercase letters, numbers and hyphens. It must start and end with a letter or number"
    )
    .refine(
      (val) => !val.includes("--"), // Disallow consecutive hyphens
      "Username cannot contain consecutive hyphens"
    )
    .transform((val) => val.toLowerCase()), // Normalize to lowercase
});
