import { useState } from "react";
import {
  Plus,
  MoreHorizontal,
  Edit,
  Trash2,
  Loader2,
} from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Button,
  Input,
  Dialog,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogContent, // Added this
  Label,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui";
import { formatCurrency, cn } from "@/lib/utils";
import { productSchema, type ProductFormData } from "@/validations/productValidation";
import { productService, type Product } from "@/services/productService";
import { DataTable } from "@/components/common/DataTable";
import { type ColumnDef } from "@tanstack/react-table";

export function ProductsPage() {
  const queryClient = useQueryClient();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<
    (Product & { name: string }) | null
  >(null);

  // Queries
  const { data: products = [], isLoading } = useQuery({
    queryKey: ["products"],
    queryFn: productService.getAll,
  });

  // Mutations
  const createMutation = useMutation({
    mutationFn: productService.create,
    onSuccess: (data) => {
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
    // Explicitly cast resolver to avoid type conflicts
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

  // Columns Definition
  const columns: ColumnDef<Product & { name: string }>[] = [
    {
      accessorKey: "id",
      header: "ID",
      cell: ({ row }) => <div className="text-muted-foreground">#{row.getValue("id")}</div>,
    },
    {
      accessorKey: "name",
      header: "Name",
      cell: ({ row }) => (
        <div className="font-medium max-w-[200px] truncate" title={row.getValue("name")}>
          {row.getValue("name")}
        </div>
      ),
    },
    {
      accessorKey: "category",
      header: "Category",
    },
    {
      accessorKey: "price",
      header: "Price",
      cell: ({ row }) => {
        const amount = parseFloat(row.getValue("price"));
        return <div className="font-mono">{formatCurrency(amount)}</div>;
      },
    },
    {
      accessorKey: "stock",
      header: "Stock",
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => {
        const status = row.getValue("status") as string;
        return (
          <span
            className={cn(
              "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize",
              status === "active" && "bg-green-500/10 text-green-500",
              status === "draft" && "bg-yellow-500/10 text-yellow-500",
              status === "archived" && "bg-red-500/10 text-red-500"
            )}
          >
            {status}
          </span>
        );
      },
    },
    {
      id: "actions",
      cell: ({ row }) => {
        const product = row.original;
        return (
          <div className="text-right">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8 p-0">
                  <span className="sr-only">Open menu</span>
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => handleEdit(product)}>
                  <Edit className="mr-2 h-4 w-4" />
                  Edit
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => handleDelete(product.id)}
                  className="text-destructive focus:text-destructive"
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        );
      },
    },
  ];

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh]">
        <Loader2 className="h-8 w-8 animate-spin text-primary mb-4" />
        <p className="text-muted-foreground">Loading products...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Products</h1>
          <p className="text-muted-foreground mt-1">
            Manage your product inventory (Data Table).
          </p>
        </div>
        <Button onClick={() => setIsDialogOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Add Product
        </Button>
      </div>

      <DataTable 
        columns={columns} 
        data={products as (Product & { name: string })[]} 
        searchPlaceholder="Filter products..."
        facets={[
          {
            key: "status",
            title: "Status",
            options: [
              { label: "Active", value: "active" },
              { label: "Draft", value: "draft" },
              { label: "Archived", value: "archived" },
            ],
          },
          {
            key: "category",
            title: "Category",
            options: [
              { label: "General", value: "General" },
              { label: "Electronics", value: "Electronics" },
              { label: "Clothing", value: "Clothing" },
            ],
          },
        ]}
      />

      <Dialog open={isDialogOpen} onOpenChange={handleCloseDialog}>
        <DialogContent className="sm:max-w-[425px]">
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
        </DialogContent>
      </Dialog>
    </div>
  );
}
