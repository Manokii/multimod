import { z } from "zod/v4";
import { colorSchema } from "./commons";

export type ChatOptions = z.infer<typeof chatOptionsSchema>;
export const chatOptionsSchema = z.object({
  platform: z
    .stringbool({})
    .or(z.number().pipe(z.transform((val) => Boolean(val))))
    .optional()
    .default(true)
    .transform((val) => (val ? "visible" : "hidden")),
  userColor: colorSchema.optional(),
  messageColor: colorSchema.optional(),
  timestamp: z
    .stringbool()
    .or(z.number().transform((val) => Boolean(val)))
    .optional()
    .default(false)
    .transform((val) => (val ? "visible" : "hidden")),
});
