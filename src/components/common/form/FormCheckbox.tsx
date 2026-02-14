import { useFormContext } from "react-hook-form";
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Checkbox,
} from "@/components/ui";

interface FormCheckboxProps {
  name: string;
  label?: string;
  description?: string;
  control?: any;
  className?: string;
}

export function FormCheckbox({
  name,
  label,
  description,
  control,
  className,
}: FormCheckboxProps) {
  const { control: contextControl } = useFormContext();
  const finalControl = control || contextControl;

  return (
    <FormField
      control={finalControl}
      name={name}
      render={({ field }) => (
        <FormItem className={`flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4 ${className}`}>
          <FormControl>
            <Checkbox
              checked={field.value}
              onCheckedChange={field.onChange}
            />
          </FormControl>
          <div className="space-y-1 leading-none">
            {label && <FormLabel>{label}</FormLabel>}
            {description && <FormDescription>{description}</FormDescription>}
          </div>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
