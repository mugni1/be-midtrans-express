import z from "zod";

export const createUpdateItemValidation = z.object({
  name: z.string("name is required").min(2, "name must be at least 2 characters").max(50, "name must be at most 50 characters"),
  merchant_name: z.string("merchant_name is required").min(2, "merchant_name must be at least 2 characters").max(50, "merchant_name must be at most 50 characters"),
  price: z.coerce.number("price must be a number").min(0, "price must be at least 0"),
  category_id: z.cuid("category_id must be a valid CUID")
})

export type CreateUpdateItemPayload = z.infer<typeof createUpdateItemValidation>;
