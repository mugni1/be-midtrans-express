import z from "zod"

const itemDetailSchema = z.object({
  id: z.cuid("id is required and please input valid cuid"),
  name: z.string().min(3, "minimum name must have 3 characters"),
  category: z.string().min(3, "minimum category must have 3 characters"),
  price: z.number().positive("price must be greater than 0"),
  quantity: z.number().int("quantity must be integer").positive("quantity must be greater than 0"),
});

export const createOrderValidation = z.object({
  destination: z.string().min(5, "minimum destination must have 5 characters"),
  item_details: z.array(itemDetailSchema).min(1, "item_details cannot be empty"),
});