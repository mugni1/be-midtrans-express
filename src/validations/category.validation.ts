import z from "zod";

export const createCategoryValidation = z.object({
  name: z.string("name is required").min(2, "name must be at least 2 characters").max(50, "name must be at most 50 characters"),
  code: z.string("code is required").min(2, "code must be at least 2 characters").max(50, "code must be at most 50 characters"),
  game_id: z.cuid("game_id is required and please input valid game_id")
});
export type CreateCategoryPayload = z.infer<typeof createCategoryValidation>;

export const updateCategoryValidation = z.object({
  name: z.string("name is required").min(2, "name must be at least 2 characters").max(50, "name must be at most 50 characters").optional(),
  code: z.string("code is required").min(2, "code must be at least 2 characters").max(50, "code must be at most 50 characters").optional(),
  game_id: z.cuid("game_id is required and please input valid game_id").optional()
});
export type UpdateCategoryPayload = z.infer<typeof updateCategoryValidation>;