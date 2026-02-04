import { api } from "@/lib/api";
import { type ProductFormData } from "@/validations/product";

export interface Product {
  id: number;
  title: string;
  body: string;
  userId: number;
  // Augmented fields for UI
  price?: number;
  stock?: number;
  status?: "active" | "draft" | "archived";
  category?: string;
  // Helper for UI consistent naming
  name?: string;
}

// Helper to augment data since API doesn't return business fields
const augmentProduct = (post: Product): Product & { name: string } => {
  return {
    ...post,
    name: post.title,
    price: ((post.id * 100000) % 5000000) + 500000,
    stock: (post.id * 10) % 100,
    status:
      post.id % 3 === 0 ? "archived" : post.id % 2 === 0 ? "draft" : "active",
    category: post.id % 4 === 0 ? "Electronics" : "Accessories",
  };
};

export const productService = {
  getAll: async () => {
    const response = await api.get<Product[]>("/posts");
    // Limit to 10 items for cleaner demo and map to our UI structure
    return response.data.slice(0, 10).map(augmentProduct);
  },

  create: async (newProduct: ProductFormData) => {
    const response = await api.post("/posts", {
      title: newProduct.name,
      body: newProduct.category,
      userId: 1,
    });
    return augmentProduct({
      ...response.data,
      id: Math.floor(Math.random() * 1000) + 100,
    });
  },

  update: async (data: ProductFormData & { id: number }) => {
    const response = await api.put(`/posts/${data.id}`, {
      id: data.id,
      title: data.name,
      body: data.category,
      userId: 1,
    });
    return augmentProduct(response.data);
  },

  delete: async (id: number) => {
    await api.delete(`/posts/${id}`);
    return id;
  },
};
