import { clsxm } from "@/utils/clsxm";
import { ComponentProps } from "react";
import { useFieldContext } from "../../hooks/useAppForm";
import { FormControl, FormItem, FormLabel, FormMessage } from "../ui/form";
import { ToggleGroup, ToggleGroupItem } from "../ui/toggle-group";

type ToggleGroupFieldProps = Omit<ComponentProps<typeof ToggleGroup>, "type" | "value" | "defaultValue" | "onValueChange"> & {
  type?: ComponentProps<typeof ToggleGroup>["type"];
  title?: string;
  required?: boolean;
  options: { value: string; name: string }[];
};

export const ToggleGroupField = ({ title, className, required, options, type = "single", variant = "outline", ...props }: ToggleGroupFieldProps) => {
  const { state, handleChange } = useFieldContext<string>();

  return (
    <FormItem className={clsxm("flex justify-between gap-2", className)}>
      <span className="flex items-center gap-2 truncate">
        <FormLabel fieldState={state} required={required}>
          {title}
        </FormLabel>
        <FormMessage variant="tooltip" fieldState={state} />
      </span>
      <FormControl>
        {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
        <ToggleGroup size="sm" type={type} variant={variant} {...props} value={state.value as any} onValueChange={(value: any) => handleChange(value)}>
          {options.map((option) => (
            <ToggleGroupItem key={option.value} value={option.value} className="flex items-center justify-center" aria-label={option.name}>
              {option.name}
            </ToggleGroupItem>
          ))}
        </ToggleGroup>
      </FormControl>
    </FormItem>
  );
};
