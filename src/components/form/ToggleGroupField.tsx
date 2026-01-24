import { ComponentProps, ReactNode } from "react";
import { useFieldContext } from "../../hooks/useAppForm";
import { Field, FieldError, FieldLabel } from "../ui/field";
import { ToggleGroup, ToggleGroupItem } from "../ui/toggle-group";

type ToggleGroupFieldProps = Omit<ComponentProps<typeof ToggleGroup>, "multiple" | "value" | "defaultValue" | "onValueChange" | "className"> & {
  mode?: "single" | "multiple";
  title?: string;
  required?: boolean;
  items: { label: string; value: string; icon?: ReactNode }[];
  orientation?: ComponentProps<typeof Field>["orientation"];
  className?: string;
};

export const ToggleGroupField = ({ title, orientation, className, required, items, mode = "single", variant = "outline", ...props }: ToggleGroupFieldProps) => {
  const { state, handleChange } = useFieldContext<string | string[]>();
  const isInvalid = !state.meta.isValid && state.meta.isTouched;

  return (
    <Field data-invalid={isInvalid} orientation={orientation} className={className}>
      {title && (
        <span className="flex items-center gap-2 truncate">
          <FieldLabel required={required}>{title}</FieldLabel>
          {isInvalid && <FieldError variant="tooltip" errors={state.meta.errors} />}
        </span>
      )}
      <ToggleGroup
        size="sm"
        {...props}
        multiple={mode === "multiple"}
        variant={variant}
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
        {items.map((item) => (
          <ToggleGroupItem key={item.value} value={item.value} aria-label={item.label}>
            {item.icon}
            {item.label}
          </ToggleGroupItem>
        ))}
      </ToggleGroup>
    </Field>
  );
};
