import { ComponentProps } from "react";
import { useFieldContext } from "../../hooks/useAppForm";
import DateInput from "../general/DateInput";

export const DateField = (props: Omit<ComponentProps<typeof DateInput>, "value" | "onChange" | "onBlur">) => {
  const { state, handleChange, handleBlur } = useFieldContext<Date | Date[]>();

  return (
    <DateInput
      {...props}
      value={state.value}
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      onChange={(e) => handleChange(e.target.value as any)}
      onBlur={handleBlur}
      error={!state.meta.isValid && state.meta.isTouched ? state.meta.errors.map((error) => error.message).join(", ") : undefined}
    />
  );
};
