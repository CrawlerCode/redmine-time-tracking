import { ComponentProps } from "react";
import { useFieldContext } from "../../hooks/useAppForm";
import TextInput from "../general/TextInput";

export const TextField = (props: Omit<ComponentProps<typeof TextInput>, "value" | "onChange" | "onBlur">) => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { state, handleChange, handleBlur } = useFieldContext<any>();

  return (
    <TextInput
      {...props}
      value={state.value}
      onChange={(e) => handleChange(props.type === "number" ? e.target.valueAsNumber : e.target.value)}
      onBlur={handleBlur}
      error={!state.meta.isValid && state.meta.isTouched ? state.meta.errors.map((error) => error.message).join(", ") : undefined}
    />
  );
};
