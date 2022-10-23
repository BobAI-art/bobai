import { z } from "zod";

const dbString = z.string().max(190);

export const userSchema = {
  name: dbString
    .min(4, "Username must be at least 4 character long")
    .regex(
      /^[a-z\-\d]+$/,
      "Username can only contain lowercase letters, digits and dashes."
    ),
};

export const modelSchema = {
  slug: dbString
    .min(4, "Slug must be at least 4 character long")
    .regex(
      /^[a-z\-\d]+$/,
      "Slug can only contain lowercase letters, digits and dashes."
    ),
  description: z
    .string()
    .max(2000, "Description must be at most 2000 characters long"),
};
