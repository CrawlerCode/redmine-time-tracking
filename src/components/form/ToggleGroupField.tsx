import { clsxm } from "@/utils/clsxm";
import { ComponentProps } from "react";
import { useFieldContext } from "../../hooks/useAppForm";
import { Field, FieldError, FieldLabel } from "../ui/field";
import { ToggleGroup, ToggleGroupItem } from "../ui/toggle-group";

type ToggleGroupFieldProps = Omit<ComponentProps<typeof ToggleGroup>, "type" | "value" | "defaultValue" | "onValueChange"> & {
  type?: ComponentProps<typeof ToggleGroup>["type"];
  title?: string;
  required?: boolean;
  options: { value: string; name: string }[];
};

export const ToggleGroupField = ({ title, className, required, options, type = "single", variant = "outline", ...props }: ToggleGroupFieldProps) => {
  const { state, handleChange } = useFieldContext<string | string[]>();
  const isInvalid = !state.meta.isValid && state.meta.isTouched;

  return (
    <Field data-invalid={isInvalid} orientation="horizontal" className={clsxm("justify-between", className)}>
      <span className="flex items-center gap-2 truncate">
        <FieldLabel required={required}>{title}</FieldLabel>
        {isInvalid && <FieldError variant="tooltip" errors={state.meta.errors} />}
      </span>
      {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
      <ToggleGroup size="sm" type={type} variant={variant} {...props} value={state.value as any} onValueChange={(value: any) => handleChange(value)}>
        {options.map((option) => (
          <ToggleGroupItem key={option.value} value={option.value} className="flex items-center justify-center" aria-label={option.name}>
            {option.name}
          </ToggleGroupItem>
        ))}
      </ToggleGroup>
    </Field>
  );
};
