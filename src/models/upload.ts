import { z } from "zod";

export const userCSVSchema = z.object({
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
  age: z.number({
    required_error: "Age is required",
    invalid_type_error: "Age must be a number",
  }),

  role: z
    .enum(["admin", "user"], {
      errorMap: () => ({ message: "The role must be 'admin' or 'user' " }),
    })
    .default("user"),
});

export type UserParams = z.infer<typeof userCSVSchema>;

export type User = UserParams & { id: number };
