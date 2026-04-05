import { z } from "zod";

export const requestLinkSchema = z.object({
  personalId: z.string().uuid("Invalid PersonalId"),
});
