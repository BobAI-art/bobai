import { z } from "zod";
import { parentModelNames } from "./consts";

const dbString = z.string().max(190);
export const cuidSchema = z.string().regex(/^c[a-z0-9]{24}$/);
export const base64ImageSchema = z
  .string()
  .regex(/^data:image\/[a-z]+;base64,/);

export const userSchema = {
  name: dbString
    .min(4, "Username must be at least 4 character long")
    .regex(
      /^[a-z\-\d]+$/,
      "Username can only contain lowercase letters, digits and dashes."
    ),
};

export const subjectSchema = {
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

export const modelCreateSchema = z.object({
  subjectSlug: subjectSchema.slug,
  regularization: dbString
    .min(4, "Class must be at least 4 characters long")
    .regex(/^[a-zA-Z_ ]+$/, "Class can only contain letters and space."),
  name: dbString.min(4, "Name must be at least 4 character long"),
  parentModelCode: dbString,
});

export const promptSchema = {
  prompt: z
    .string()
    .max(768, "Prompt can be max 768 characters long")
    .regex(/\<MODEL\>/, "Prompt must contain <MODEL>"),
  modelIds: z.array(cuidSchema),
};
