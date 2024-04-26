import { z } from "zod";
export const signUpValidation = z.object({
  name: z.string().min(2, { message: "Name Must Be At Least 2 Chars" }),
  username: z.string().min(2, { message: "username Must Be At Least 2 Chars" }),
  email: z.string().email(),
  password: z
    .string()
    .min(8, { message: "Password Must Be At Least 8 Chars" })
    .max(15, {
      message: "Password Max Chars Must Be Less Than 15",
    }),
});
export const signInValidation = z.object({
  email: z.string().email(),
  password: z
    .string()
    .min(8, { message: "Password Must Be At Least 8 Chars" })
    .max(15, {
      message: "Password Max Chars Must Be Less Than 15",
    }),
});
export const postValidation = z.object({
  caption: z.string().min(5).max(2200),
  file: z.custom<File[]>(),
  location: z.string().min(2).max(100),
  tags: z.string(),
});
export const ProfileValidation = z.object({
  file: z.custom<File[]>(),
  name: z.string().min(2, { message: "Name must be at least 2 characters." }),
  username: z
    .string()
    .min(2, { message: "Name must be at least 2 characters." }),
  email: z.string().email(),
  bio: z.string(),
});
export const PostValidation = z.object({
  caption: z
    .string()
    .min(5, { message: "Minimum 5 characters." })
    .max(2200, { message: "Maximum 2,200 caracters" }),
  file: z.custom<File[]>(),
  location: z
    .string()
    .min(1, { message: "This field is required" })
    .max(1000, { message: "Maximum 1000 characters." }),
  tags: z.string(),
});
