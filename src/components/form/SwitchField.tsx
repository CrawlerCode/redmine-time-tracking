import { ComponentProps } from "react";
import { useFieldContext } from "../../hooks/useAppForm";
import Switch from "../general/Switch";

export const SwitchField = (props: Omit<ComponentProps<typeof Switch>, "value" | "onChange" | "onBlur">) => {
  const { state, handleChange } = useFieldContext<string>();

  return <Switch {...props} value={state.value} onChange={(e) => handleChange(e.target.value)} />;
};
