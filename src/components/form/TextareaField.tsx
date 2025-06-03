import { ComponentProps } from "react";
import { useFieldContext } from "../../hooks/useAppForm";
import Textarea from "../general/TextareaInput";

export const TextareaField = (props: Omit<ComponentProps<typeof Textarea>, "value" | "onChange" | "onBlur">) => {
  const { state, handleChange, handleBlur } = useFieldContext<string>();

  return (
    <Textarea
      {...props}
      value={state.value}
      onChange={(e) => handleChange(e.target.value)}
      onBlur={handleBlur}
      error={!state.meta.isValid && state.meta.isTouched ? state.meta.errors.map((error) => error.message).join(", ") : undefined}
    />
  );
};
