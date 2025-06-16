import z from "zod/v4";

export const colorSchema = z
  .string()
  .regex(
    /^#[0-9a-fA-F]{3,6}$/,
    "Invalid color format. Use hex format like #RRGGBB.",
  );
