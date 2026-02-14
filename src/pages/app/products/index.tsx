import { useState } from "react";
import {
  Plus,
  MoreHorizontal,
  Edit,
  Trash2,
} from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import {
  Button,
  Dialog,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogContent,
  Form,
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
import { TableSkeleton } from "@/components/common/TableSkeleton";
import { ConfirmDialog } from "@/components/common/ConfirmDialog";
import { FormInput } from "@/components/common/form/FormInput";
import { FormSelect } from "@/components/common/form/FormSelect";
import { FormFileUpload } from "@/components/common/form/FormFileUpload";
import { type ColumnDef } from "@tanstack/react-table";

export function ProductsPage() {
  const queryClient = useQueryClient();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<
    (Product & { name: string }) | null
  >(null);
  const [deleteId, setDeleteId] = useState<number | null>(null);

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
      form.reset();
      toast.success("Product created successfully");
    },
    onError: (error) => {
      toast.error(`Failed to create product: ${error}`);
    }
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
      form.reset();
      toast.success("Product updated successfully");
    },
    onError: (error) => {
      toast.error(`Failed to update product: ${error}`);
    }
  });

  const deleteMutation = useMutation({
    mutationFn: productService.delete,
    onSuccess: (id) => {
      queryClient.setQueryData(
        ["products"],
        (old: (Product & { name: string })[]) => old.filter((p) => p.id !== id),
      );
      setDeleteId(null);
      toast.success("Product deleted successfully");
    },
    onError: (error) => {
      toast.error(`Failed to delete product: ${error}`);
    }
  });

  // Form
  const form = useForm<ProductFormData>({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resolver: zodResolver(productSchema) as any,
    defaultValues: {
      name: "",
      price: 0,
      category: "",
      stock: 0,
      status: "active",
    },
  });

  // Handlers
  const handleEdit = (product: Product & { name: string }) => {
    setEditingProduct(product);
    form.setValue("name", product.name!);
    form.setValue("price", product.price || 0);
    form.setValue("category", product.category || "General");
    form.setValue("stock", product.stock || 0);
    form.setValue("status", product.status || "active");
    setIsDialogOpen(true);
  };

  const handleDeleteClick = (id: number) => {
    setDeleteId(id);
  };

  const handleConfirmDelete = () => {
    if (deleteId) {
      deleteMutation.mutate(deleteId);
    }
  };

  const handleCloseDialog = (open: boolean) => {
    if (!open) {
      setEditingProduct(null);
      form.reset();
    }
    setIsDialogOpen(open);
  };

  const onSubmit = (data: ProductFormData) => {
    if (editingProduct) {
      updateMutation.mutate({ ...data, id: editingProduct.id });
    } else {
      createMutation.mutate(data);
    }
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
      cell: ({ row }) => {
        const stock = parseFloat(row.getValue("stock"));
        return <div>{stock}</div>;
      },
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
                  onClick={() => handleDeleteClick(product.id)}
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
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold">Products</h1>
            <p className="text-muted-foreground mt-1">
              Manage your product inventory (Data Table).
            </p>
          </div>
        </div>
        <TableSkeleton rowCount={5} columnCount={7} />
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

          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="space-y-4"
            >
              <FormInput
                control={form.control}
                name="name"
                label="Name"
                description="Mapped to JSONPlaceholder 'title'"
              />

              <div className="grid grid-cols-2 gap-4">
                <FormInput
                  control={form.control}
                  name="price"
                  label="Price"
                  type="number"
                />
                <FormInput
                  control={form.control}
                  name="stock"
                  label="Stock"
                  type="number"
                />
              </div>

              <FormInput
                control={form.control}
                name="category"
                label="Category"
                description="Mapped to JSONPlaceholder 'body'"
              />

              <FormSelect
                control={form.control}
                name="status"
                label="Status"
                options={[
                  { label: "Active", value: "active" },
                  { label: "Draft", value: "draft" },
                  { label: "Archived", value: "archived" },
                ]}
              />

              <FormFileUpload
                control={form.control}
                name="image"
                label="Product Image"
                description="Upload product image (max 5MB)"
                maxFiles={1}
                accept={{
                  "image/*": [],
                  "application/pdf": [],
                }}
              />

              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => handleCloseDialog(false)}
                >
                  Cancel
                </Button>
                <Button type="submit" isLoading={form.formState.isSubmitting}>
                  {editingProduct ? "Update Product" : "Create Product"}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      <ConfirmDialog
        open={!!deleteId}
        onOpenChange={(open) => !open && setDeleteId(null)}
        title="Delete Product"
        description="Are you sure you want to delete this product? This action cannot be undone."
        confirmText="Delete"
        variant="destructive"
        onConfirm={handleConfirmDelete}
        loading={deleteMutation.isPending}
      />
    </div>
  );
}
