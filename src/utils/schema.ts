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
