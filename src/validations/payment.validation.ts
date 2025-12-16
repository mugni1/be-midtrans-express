import z from "zod"

const itemDetailSchema = z.object({
    id: z.string().min(3, "item id is required"),
    name: z.string().min(3, "item name is required"),
    category: z.string().min(3, "category is required"),
    price: z.number().positive("price must be greater than 0"),
    quantity: z.number().int("quantity must be integer").positive("quantity must be greater than 0"),
    total_price: z.number().positive("total_price must be greater than 0"),
});

export const postPaymentValidate = z.object({
    order_id: z.string().min(5, "minimum order_id must have 5 characters"),
    item_details: z.array(itemDetailSchema).min(1, "item_details cannot be empty"),
});