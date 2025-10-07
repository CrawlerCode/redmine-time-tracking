import { ComponentProps, useId } from "react";
import { useFieldContext } from "../../hooks/useAppForm";
import { Field, FieldError, FieldLabel } from "../ui/field";
import { Input } from "../ui/input";

type TextFieldProps = Omit<ComponentProps<typeof Input>, "id" | "value" | "onChange" | "onBlur"> & {
  classNames?: {
    input?: string;
  };
};

export const TextField = ({ title, required, className, classNames, ...props }: TextFieldProps) => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { state, handleChange, handleBlur } = useFieldContext<any>();
  const isInvalid = !state.meta.isValid && state.meta.isTouched;
  const id = useId();

  return (
    <Field data-invalid={isInvalid} className={className}>
      <FieldLabel required={required} htmlFor={id}>
        {title}
      </FieldLabel>
      <Input
        {...props}
        id={id}
        value={state.value}
        onChange={(e) => handleChange(props.type === "number" ? e.target.valueAsNumber : e.target.value)}
        onBlur={handleBlur}
        className={classNames?.input}
      />
      {isInvalid && <FieldError errors={state.meta.errors} />}
    </Field>
  );
};
