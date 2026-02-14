import { z } from "zod";

export const productSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  price: z.coerce.number().min(0, "Price must be positive"),
  category: z.string().min(1, "Category is required"),
  stock: z.coerce.number().int().min(0, "Stock must be positive"),
  status: z.enum(["active", "draft", "archived"]),
  image: z.any().optional(), // File[] or string (url)
});

export type ProductFormData = z.infer<typeof productSchema>