import { ComponentProps } from "react";
import { useFieldContext } from "../../hooks/useAppForm";
import CheckBox from "../general/CheckBox";

export const CheckboxField = (props: Omit<ComponentProps<typeof CheckBox>, "checked" | "onChange" | "onBlur">) => {
  const { state, handleChange, handleBlur } = useFieldContext<boolean>();

  return <CheckBox {...props} checked={state.value} onChange={(e) => handleChange(e.target.checked)} onBlur={handleBlur} />;
};
