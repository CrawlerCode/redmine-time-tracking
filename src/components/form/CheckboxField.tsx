import { ComponentProps, useId } from "react";
import { useFieldContext } from "../../hooks/useAppForm";
import { Checkbox } from "../ui/checkbox";
import { Field, FieldContent, FieldDescription, FieldError, FieldLabel } from "../ui/field";

type CheckboxFieldProps = Omit<ComponentProps<typeof Checkbox>, "checked" | "onCheckedChange" | "onBlur"> & {
  description?: string;
};

export const CheckboxField = ({ title, description, className, ...props }: CheckboxFieldProps) => {
  const { state, handleChange, handleBlur } = useFieldContext<boolean>();
  const isInvalid = !state.meta.isValid && state.meta.isTouched;
  const id = useId();

  return (
    <Field data-invalid={isInvalid} orientation="horizontal" className={className}>
      <Checkbox {...props} id={id} checked={state.value} onCheckedChange={(checked) => handleChange(!!checked)} onBlur={handleBlur} />
      <FieldContent>
        <span className="flex items-center gap-2">
          <FieldLabel required={props.required} htmlFor={id}>
            {title}
          </FieldLabel>
          {isInvalid && <FieldError variant="tooltip" errors={state.meta.errors} />}
        </span>
        {description && <FieldDescription>{description}</FieldDescription>}
      </FieldContent>
    </Field>
  );
};
