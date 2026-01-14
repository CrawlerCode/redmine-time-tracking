import { clsxm } from "@/utils/clsxm";
import { ComponentProps } from "react";
import { useFieldContext } from "../../hooks/useAppForm";
import { Field, FieldError, FieldLabel } from "../ui/field";
import { ToggleGroup, ToggleGroupItem } from "../ui/toggle-group";

type ToggleGroupFieldProps = Omit<ComponentProps<typeof ToggleGroup>, "value" | "defaultValue" | "onValueChange"> & {
  mode?: "single" | "multiple";
  title?: string;
  required?: boolean;
  options: { value: string; name: string }[];
};

export const ToggleGroupField = ({ title, className, required, options, mode = "single", variant = "outline", ...props }: ToggleGroupFieldProps) => {
  const { state, handleChange } = useFieldContext<string | string[]>();
  const isInvalid = !state.meta.isValid && state.meta.isTouched;

  return (
    <Field data-invalid={isInvalid} orientation="horizontal" className={clsxm("justify-between", className)}>
      <span className="flex items-center gap-2 truncate">
        <FieldLabel required={required}>{title}</FieldLabel>
        {isInvalid && <FieldError variant="tooltip" errors={state.meta.errors} />}
      </span>
      <ToggleGroup
        size="sm"
        multiple={mode === "multiple"}
        variant={variant}
        {...props}
        value={Array.isArray(state.value) ? state.value : [state.value]}
        onValueChange={(value) => {
          if (mode === "single") {
            if (value.length === 0 && required) return;
            handleChange(value[0] ?? null);
          } else {
            handleChange(value);
          }
        }}
      >
        {options.map((option) => (
          <ToggleGroupItem key={option.value} value={option.value} aria-label={option.name}>
            {option.name}
          </ToggleGroupItem>
        ))}
      </ToggleGroup>
    </Field>
  );
};
