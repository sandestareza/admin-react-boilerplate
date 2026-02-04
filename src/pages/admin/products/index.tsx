import { useState } from "react";
import {
  Plus,
  MoreHorizontal,
  Edit,
  Trash2,
  Search,
  Package,
  Loader2,
} from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Button,
  Input,
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  Label,
  Dialog,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui";
import { cn, formatCurrency } from "@/lib/utils";
import { productSchema, type ProductFormData } from "@/validations/product";
import { productService, type Product } from "@/services/productService";

export function ProductsPage() {
  const queryClient = useQueryClient();
  const [search, setSearch] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<
    (Product & { name: string }) | null
  >(null);
  const [activeMenu, setActiveMenu] = useState<number | null>(null);

  // Queries
  const { data: products = [], isLoading } = useQuery({
    queryKey: ["products"],
    queryFn: productService.getAll,
  });

  // Mutations
  const createMutation = useMutation({
    mutationFn: productService.create,
    onSuccess: (data) => {
      // Since JSONPlaceholder doesn't actually save, we manually update cache to show result
      queryClient.setQueryData(
        ["products"],
        (old: (Product & { name: string })[]) => [data, ...old],
      );
      setIsDialogOpen(false);
      reset();
    },
  });

  const updateMutation = useMutation({
    mutationFn: productService.update,
    onSuccess: (data) => {
      queryClient.setQueryData(
        ["products"],
        (old: (Product & { name: string })[]) =>
          old.map((p) => (p.id === data.id ? { ...p, ...data } : p)),
      );
      setIsDialogOpen(false);
      setEditingProduct(null);
      reset();
    },
  });

  const deleteMutation = useMutation({
    mutationFn: productService.delete,
    onSuccess: (id) => {
      queryClient.setQueryData(
        ["products"],
        (old: (Product & { name: string })[]) => old.filter((p) => p.id !== id),
      );
      setActiveMenu(null);
    },
  });

  // Form
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<ProductFormData>({
    // Explicitly cast resolver to avoid type conflicts between Zod 3.24+ and RHF
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resolver: zodResolver(productSchema) as any,
    defaultValues: {
      status: "active",
    },
  });

  // Handlers
  const handleEdit = (product: Product & { name: string }) => {
    setEditingProduct(product);
    setValue("name", product.name!);
    setValue("price", product.price || 0);
    setValue("category", product.category || "General");
    setValue("stock", product.stock || 0);
    setValue("status", product.status || "active");
    setIsDialogOpen(true);
    setActiveMenu(null);
  };

  const handleDelete = (id: number) => {
    if (confirm("Are you sure you want to delete this product?")) {
      deleteMutation.mutate(id);
    }
  };

  const handleCloseDialog = (open: boolean) => {
    if (!open) {
      setEditingProduct(null);
      reset();
    }
    setIsDialogOpen(open);
  };

  const filteredProducts = products.filter(
    (p) =>
      p.name!.toLowerCase().includes(search.toLowerCase()) ||
      (p.category && p.category.toLowerCase().includes(search.toLowerCase())),
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Products</h1>
          <p className="text-muted-foreground mt-1">
            Manage your product inventory (Service Pattern).
          </p>
        </div>
        <Button onClick={() => setIsDialogOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Add Product
        </Button>
      </div>

      <Card>
        <CardContent className="p-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search products..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Product List</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
              <Loader2 className="h-8 w-8 animate-spin mb-4 text-primary" />
              <p>Fetching data from JSONPlaceholder...</p>
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <Package className="h-12 w-12 mx-auto mb-3 opacity-20" />
              <p>No products found.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">
                      ID
                    </th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">
                      Name
                    </th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">
                      Category
                    </th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">
                      Price
                    </th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">
                      Stock
                    </th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">
                      Status
                    </th>
                    <th className="text-right py-3 px-4 text-sm font-medium text-muted-foreground">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filteredProducts.map((product) => (
                    <tr
                      key={product.id}
                      className="border-b border-border/50 last:border-0 hover:bg-muted/50 transition-colors"
                    >
                      <td className="py-3 px-4 text-sm text-muted-foreground">
                        #{product.id}
                      </td>
                      <td
                        className="py-3 px-4 font-medium max-w-[200px] truncate"
                        title={product.name}
                      >
                        {product.name}
                      </td>
                      <td className="py-3 px-4 text-sm text-muted-foreground">
                        {product.category}
                      </td>
                      <td className="py-3 px-4 text-sm font-mono">
                        {formatCurrency(product.price || 0)}
                      </td>
                      <td className="py-3 px-4 text-sm">{product.stock}</td>
                      <td className="py-3 px-4">
                        <span
                          className={cn(
                            "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize",
                            product.status === "active" &&
                              "bg-green-500/10 text-green-500",
                            product.status === "draft" &&
                              "bg-yellow-500/10 text-yellow-500",
                            product.status === "archived" &&
                              "bg-red-500/10 text-red-500",
                          )}
                        >
                          {product.status}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <div className="relative inline-block">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() =>
                              setActiveMenu(
                                activeMenu === product.id ? null : product.id,
                              )
                            }
                          >
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                          {activeMenu === product.id && (
                            <>
                              <div
                                className="fixed inset-0 z-40"
                                onClick={() => setActiveMenu(null)}
                              />
                              <div className="absolute right-0 top-full mt-1 w-32 rounded-lg border border-border bg-popover p-1 shadow-lg z-50 animate-in fade-in zoom-in-95 duration-100">
                                <button
                                  className="flex items-center gap-2 w-full px-3 py-2 text-sm hover:bg-accent rounded-md transition-colors"
                                  onClick={() => handleEdit(product as any)} // Cast needed because of type intersection mismatch in state vs argument
                                >
                                  <Edit className="h-4 w-4" />
                                  Edit
                                </button>
                                <button
                                  className="flex items-center gap-2 w-full px-3 py-2 text-sm text-destructive hover:bg-accent rounded-md transition-colors"
                                  onClick={() => handleDelete(product.id)}
                                >
                                  <Trash2 className="h-4 w-4" />
                                  Delete
                                </button>
                              </div>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      <Dialog open={isDialogOpen} onOpenChange={handleCloseDialog}>
        <DialogHeader>
          <DialogTitle>
            {editingProduct ? "Edit Product" : "Add Product"}
          </DialogTitle>
        </DialogHeader>

        <form
          onSubmit={handleSubmit((data) => {
            if (editingProduct) {
              updateMutation.mutate({ ...data, id: editingProduct.id });
            } else {
              createMutation.mutate(data);
            }
          })}
          className="space-y-4"
        >
          <div className="space-y-2">
            <Label htmlFor="name" required>
              Name
            </Label>
            <Input
              id="name"
              {...register("name")}
              error={errors.name?.message}
            />
            <p className="text-xs text-muted-foreground">
              Mapped to JSONPlaceholder "title"
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="price" required>
                Price
              </Label>
              <Input
                type="number"
                id="price"
                {...register("price")}
                error={errors.price?.message}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="stock" required>
                Stock
              </Label>
              <Input
                type="number"
                id="stock"
                {...register("stock")}
                error={errors.stock?.message}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="category" required>
              Category
            </Label>
            <Input
              id="category"
              {...register("category")}
              error={errors.category?.message}
            />
            <p className="text-xs text-muted-foreground">
              Mapped to JSONPlaceholder "body"
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="status" required>
              Status
            </Label>
            <select
              id="status"
              className="flex h-10 w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              {...register("status")}
            >
              <option
                value="active"
                className="bg-popover text-popover-foreground"
              >
                Active
              </option>
              <option
                value="draft"
                className="bg-popover text-popover-foreground"
              >
                Draft
              </option>
              <option
                value="archived"
                className="bg-popover text-popover-foreground"
              >
                Archived
              </option>
            </select>
            {errors.status && (
              <p className="text-destructive text-sm mt-1">
                {errors.status.message}
              </p>
            )}
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => handleCloseDialog(false)}
            >
              Cancel
            </Button>
            <Button type="submit" isLoading={isSubmitting}>
              {editingProduct ? "Update Product" : "Create Product"}
            </Button>
          </DialogFooter>
        </form>
      </Dialog>
    </div>
  );
}
