import { ConversationsSchema } from "@/generated/zod";
import { extendZodWithOpenApi } from "@asteasolutions/zod-to-openapi";
import { z } from "zod";

extendZodWithOpenApi(z);

export const createConversationsSchema = ConversationsSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
}).partial();

export const updateConversationsSchema = ConversationsSchema.omit({
  id: true,
  createdAt: true,
}).partial();

export type ConversationsDto = z.infer<typeof ConversationsSchema>;
export type CreateConversationsDto = z.infer<typeof createConversationsSchema>;
export type UpdateConversationsDto = z.infer<typeof updateConversationsSchema>;
