import { ComponentProps } from "react";
import { useFieldContext } from "../../hooks/useAppForm";
import Toggle from "../general/Toggle";

export const ToggleField = (props: Omit<ComponentProps<typeof Toggle>, "checked" | "onChange" | "onBlur">) => {
  const { state, handleChange, handleBlur } = useFieldContext<boolean>();

  return <Toggle {...props} checked={state.value} onChange={(e) => handleChange(e.target.checked)} onBlur={handleBlur} />;
};
