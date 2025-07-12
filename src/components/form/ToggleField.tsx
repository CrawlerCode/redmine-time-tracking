import { clsxm } from "@/utils/clsxm";
import { ComponentProps, useId } from "react";
import { useFieldContext } from "../../hooks/useAppForm";
import { FormControl, FormItem, FormLabel, FormMessage } from "../ui/form";
import { Switch } from "../ui/switch";

type ToggleFieldProps = Omit<ComponentProps<typeof Switch>, "id" | "checked" | "onCheckedChange" | "onBlur">;

export const ToggleField = ({ title, className, ...props }: ToggleFieldProps) => {
  const { state, handleChange, handleBlur } = useFieldContext<boolean>();
  const id = useId();

  return (
    <FormItem className={clsxm("flex items-center gap-2", className)}>
      <FormControl>
        <Switch {...props} id={id} checked={state.value} onCheckedChange={(checked) => handleChange(checked)} onBlur={handleBlur} />
      </FormControl>
      <FormLabel fieldState={state} htmlFor={id} required={props.required}>
        {title}
      </FormLabel>
      <FormMessage variant="tooltip" fieldState={state} />
    </FormItem>
  );
};
