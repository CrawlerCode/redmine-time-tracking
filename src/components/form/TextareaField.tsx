import { ComponentProps, useId } from "react";
import { useFieldContext } from "../../hooks/useAppForm";
import { Field, FieldError, FieldLabel } from "../ui/field";
import { Textarea } from "../ui/textarea";

type TextareaFieldProps = Omit<ComponentProps<typeof Textarea>, "id" | "value" | "onChange" | "onBlur">;

export const TextareaField = ({ title, required, className, ...props }: TextareaFieldProps) => {
  const { name, state, handleChange, handleBlur } = useFieldContext<string>();
  const isInvalid = !state.meta.isValid && state.meta.isTouched;
  const id = useId();

  return (
    <Field data-invalid={isInvalid} className={className}>
      <FieldLabel required={required} htmlFor={id} className="truncate">
        {title}
      </FieldLabel>
      <Textarea {...props} id={id} name={name} value={state.value} onChange={(e) => handleChange(e.target.value)} onBlur={handleBlur} aria-invalid={isInvalid} />
      {isInvalid && <FieldError errors={state.meta.errors} />}
    </Field>
  );
};
