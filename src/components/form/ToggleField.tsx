import { ComponentProps, useId } from "react";
import { useFieldContext } from "../../hooks/useAppForm";
import { Field, FieldContent, FieldError, FieldLabel } from "../ui/field";
import { Switch } from "../ui/switch";

type ToggleFieldProps = Omit<ComponentProps<typeof Switch>, "id" | "checked" | "onCheckedChange" | "onBlur">;

export const ToggleField = ({ title, className, ...props }: ToggleFieldProps) => {
  const { state, handleChange, handleBlur } = useFieldContext<boolean>();
  const isInvalid = !state.meta.isValid && state.meta.isTouched;
  const id = useId();

  return (
    <Field data-invalid={isInvalid} orientation="horizontal" className={className}>
      <Switch {...props} id={id} checked={state.value} onCheckedChange={(checked) => handleChange(checked)} onBlur={handleBlur} />
      <FieldContent>
        <span className="flex items-center gap-2">
          <FieldLabel required={props.required} htmlFor={id}>
            {title}
          </FieldLabel>
          {isInvalid && <FieldError variant="tooltip" errors={state.meta.errors} />}
        </span>
      </FieldContent>
    </Field>
  );
};
