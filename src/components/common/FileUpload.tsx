import { useCallback } from "react";
import { useDropzone, type FileRejection, type DropzoneOptions } from "react-dropzone";
import { UploadCloud, X, FileText } from "lucide-react";
import { cn, formatBytes } from "@/lib/utils";
import { Button } from "@/components/ui/button";

interface FileUploadProps {
  value?: File[];
  onChange?: (files: File[]) => void;
  onRemove?: (file: File) => void;
  maxFiles?: number;
  maxSize?: number; // in bytes
  accept?: DropzoneOptions["accept"];
  className?: string;
  disabled?: boolean;
}

export function FileUpload({
  value = [],
  onChange,
  onRemove,
  maxFiles = 1,
  maxSize = 5 * 1024 * 1024, // 5MB default
  accept = {
    "image/*": [],
    "application/pdf": [],
  },
  className,
  disabled = false,
}: FileUploadProps) {
  const onDrop = useCallback(
    (acceptedFiles: File[], rejectedFiles: FileRejection[]) => {
      // Handle accepted files
      if (acceptedFiles.length > 0 && onChange) {
        const newFiles = [...value, ...acceptedFiles].slice(0, maxFiles);
        onChange(newFiles);
      }

      // Handle errors (optional: trigger toast here if needed)
      if (rejectedFiles.length > 0) {
        rejectedFiles.forEach(({ file, errors }) => {
          console.error(`File ${file.name} rejected:`, errors);
        });
      }
    },
    [value, maxFiles, onChange]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    maxFiles,
    maxSize,
    accept,
    disabled: disabled || value.length >= maxFiles,
  });

  const handleRemove = (e: React.MouseEvent, fileToRemove: File) => {
    e.stopPropagation();
    if (onRemove) {
      onRemove(fileToRemove);
    } else if (onChange) {
      const newFiles = value.filter((file) => file !== fileToRemove);
      onChange(newFiles);
    }
  };

  return (
    <div className={cn("space-y-4", className)}>
      <div
        {...getRootProps()}
        className={cn(
          "border-2 border-dashed rounded-lg p-6 transition-colors cursor-pointer flex flex-col items-center justify-center text-center gap-2",
          isDragActive
            ? "border-primary bg-primary/5"
            : "border-muted-foreground/25 hover:border-primary/50 hover:bg-muted/25",
          (disabled || value.length >= maxFiles) &&
            "opacity-60 cursor-not-allowed pointer-events-none"
        )}
      >
        <input {...getInputProps()} />
        <div className="p-4 rounded-full bg-muted">
          <UploadCloud className="w-8 h-8 text-muted-foreground" />
        </div>
        <div className="space-y-1">
          <p className="text-sm font-medium">
            {isDragActive ? "Drop the files here" : "Drag & drop files here"}
          </p>
          <p className="text-xs text-muted-foreground">
            or click to select files (Max {formatBytes(maxSize)})
          </p>
        </div>
      </div>

      {value.length > 0 && (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {value.map((file, index) => (
            <div
              key={`${file.name}-${index}`}
              className="relative group flex items-start gap-4 p-3 rounded-lg border bg-card text-card-foreground shadow-sm"
            >
              <div className="relative w-16 h-16 shrink-0 rounded-md overflow-hidden bg-muted flex items-center justify-center">
                {file.type.startsWith("image/") ? (
                  <img
                    src={URL.createObjectURL(file)}
                    alt={file.name}
                    className="aspect-square h-full w-full object-cover"
                    onLoad={(e) => URL.revokeObjectURL(e.currentTarget.src)}
                  />
                ) : (
                  <FileText className="w-8 h-8 text-muted-foreground" />
                )}
              </div>
              <div className="flex-1 min-w-0 space-y-1">
                <p className="truncate text-sm font-medium" title={file.name}>
                  {file.name}
                </p>
                <p className="text-xs text-muted-foreground">
                  {formatBytes(file.size)}
                </p>
              </div>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="h-6 w-6 absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                onClick={(e) => handleRemove(e, file)}
              >
                <X className="w-4 h-4" />
                <span className="sr-only">Remove file</span>
              </Button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// Helper to format bytes (add to utils if not exists, but easy to inline or local import)
// Assuming utils has it, or we add it to utils.ts. 
// I will check utils.ts separately, for now I will assume I need to add it or implement local.
// Wait, I see formatBytes used in imports. I should check if utils has it.
// If not, I'll update utils.ts first.
