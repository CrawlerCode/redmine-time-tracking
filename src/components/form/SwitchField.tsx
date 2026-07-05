import { ComponentProps, useId } from "react";
import { useFieldContext } from "../../hooks/useAppForm";
import { Field, FieldContent, FieldDescription, FieldError, FieldInfo, FieldLabel } from "../ui/field";
import { Switch } from "../ui/switch";

type SwitchFieldProps = Omit<ComponentProps<typeof Switch>, "id" | "checked" | "onCheckedChange" | "onBlur" | "className"> & {
  position?: "start" | "end";
  description?: string;
  info?: string;
  className?: string;
};

export const SwitchField = ({ title, description, info, position = "start", className, ...props }: SwitchFieldProps) => {
  const { name, state, handleChange, handleBlur } = useFieldContext<boolean>();
  const isInvalid = !state.meta.isValid && state.meta.isTouched;
  const id = useId();

  return (
    <Field data-invalid={isInvalid} orientation="horizontal" className={className}>
      {position === "start" && (
        <Switch {...props} id={id} name={name} checked={state.value} onCheckedChange={(checked) => handleChange(checked)} onBlur={handleBlur} nativeButton render={<button />} />
      )}
      <FieldContent>
        <span className="flex items-center gap-2">
          <FieldLabel required={props.required} htmlFor={id}>
            {title}
            {info && <FieldInfo>{info}</FieldInfo>}
          </FieldLabel>
          {isInvalid && <FieldError variant="tooltip" errors={state.meta.errors} />}
        </span>
        {description && <FieldDescription>{description}</FieldDescription>}
      </FieldContent>
      {position === "end" && <Switch {...props} id={id} name={name} checked={state.value} onCheckedChange={(checked) => handleChange(checked)} onBlur={handleBlur} />}
    </Field>
  );
};
