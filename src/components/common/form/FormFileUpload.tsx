import { useFormContext } from "react-hook-form";
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui";
import { FileUpload } from "../FileUpload";

interface FormFileUploadProps {
  name: string;
  label?: string;
  description?: string;
  control?: any;
  className?: string;
  maxFiles?: number;
  accept?: Record<string, string[]>;
}

export function FormFileUpload({
  name,
  label,
  description,
  control,
  className,
  maxFiles,
  accept,
}: FormFileUploadProps) {
  const { control: contextControl } = useFormContext();
  const finalControl = control || contextControl;

  return (
    <FormField
      control={finalControl}
      name={name}
      render={({ field }) => (
        <FormItem className={className}>
          {label && <FormLabel>{label}</FormLabel>}
          <FormControl>
            <FileUpload
              value={field.value || []}
              onChange={field.onChange}
              maxFiles={maxFiles}
              accept={accept}
            />
          </FormControl>
          {description && <FormDescription>{description}</FormDescription>}
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
