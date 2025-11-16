import { z } from "zod";

export const userSchema = z.object({
  id: z.string(),
  name: z.string(),
  email: z.string().email()
});

export const authResponseSchema = z.object({
  token: z.string(),
  user: userSchema
});

export const todoSchema = z.object({
  _id: z.string(),
  title: z.string(),
  description: z.string().optional(),
  completed: z.boolean(),
  createdAt: z.string(),
  updatedAt: z.string()
});

export const todoListSchema = z.array(todoSchema);
