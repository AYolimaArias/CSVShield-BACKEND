import { z } from "zod";

export const userSchema = z.object({
  name: z.string({
    required_error: "Name is required",
    invalid_type_error: "Name have to be a string",
  }),
  email: z
    .string({
      required_error: "Email is required",
      invalid_type_error: "Email must be a string",
    })
    .email({ message: "Email must be valid" }),
  password: z
    .string({
      required_error: "Password is required",
      invalid_type_error: "Password must be a string",
    })
    .min(6, "Password must have at least 6 characters "),
  role: z
    .enum(["admin", "user"], {
      errorMap: () => ({ message: "The role must be 'admin' or 'user' " }),
    })
    .default("user"),
});

export type UserParams = z.infer<typeof userSchema>;

export type User = UserParams & { id: number };
