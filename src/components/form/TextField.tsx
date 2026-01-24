import { ComponentProps, useId } from "react";
import { useFieldContext } from "../../hooks/useAppForm";
import { Field, FieldError, FieldLabel } from "../ui/field";
import { Input } from "../ui/input";

type TextFieldProps = Omit<ComponentProps<typeof Input>, "id" | "value" | "onChange" | "onBlur" | "className"> & {
  className?: string;
  classNames?: {
    input?: string;
  };
  fieldErrorVariant?: ComponentProps<typeof FieldError>["variant"];
};

export const TextField = ({ title, required, className, classNames, fieldErrorVariant, children, ...props }: TextFieldProps) => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { name, state, handleChange, handleBlur } = useFieldContext<any>();
  const isInvalid = !state.meta.isValid && state.meta.isTouched;
  const id = useId();

  return (
    <Field data-invalid={isInvalid} className={className}>
      {title && (
        <FieldLabel required={required} htmlFor={id} errors={isInvalid && fieldErrorVariant === "tooltip" ? state.meta.errors : undefined}>
          {title}
        </FieldLabel>
      )}
      <Input
        {...props}
        id={id}
        name={name}
        value={state.value}
        onChange={(e) => handleChange(props.type === "number" ? e.target.valueAsNumber : e.target.value)}
        onBlur={handleBlur}
        aria-invalid={isInvalid}
        className={classNames?.input}
      />
      {isInvalid && fieldErrorVariant !== "tooltip" && <FieldError errors={state.meta.errors} />}
      {children}
    </Field>
  );
};
