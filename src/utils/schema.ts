import { z } from "zod";

export const dbStringSchema = z.string().max(190);
export const cuidSchema = z.string().regex(/^c[a-z0-9]{24}$/);
export const base64ImageSchema = z
  .string()
  .regex(/^data:image\/[a-z]+;base64,/);

export const userSchema = {
  name: dbStringSchema
    .min(3, "Username must be at least 4 character long")
    .regex(
      /^[a-z\-\d]+$/,
      "Username can only contain lowercase letters, digits and dashes."
    ),
};

const slugSchema = dbStringSchema
  .min(3, "Slug must be at least 3 character long")
  .regex(
    /^[a-z\-\d]+$/,
    "Slug can only contain lowercase letters, digits and dashes."
  );
export const subjectSchema = {
  slug: slugSchema,
  description: z
    .string()
    .max(2000, "Description must be at most 2000 characters long"),
};

export const depictionCreateSchema = z.object({
  subjectSlug: subjectSchema.slug,
  regularization: dbStringSchema
    .min(4, "Class must be at least 4 characters long")
    .regex(/^[a-zA-Z_ ]+$/, "Class can only contain letters and space."),
  name: dbStringSchema.min(4, "Name must be at least 4 character long"),
  styleSlug: slugSchema,
});

export const promptSchema = z
  .string()
  .min(4, "Prompt must be at least 4 character long")
  .max(768, "Prompt can be max 768 characters long");

export const photoCategorySchema = z.enum([
  "generated-image",
  "training-progress",
]);
