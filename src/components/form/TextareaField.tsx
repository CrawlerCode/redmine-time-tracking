import { ComponentProps, useId } from "react";
import { useFieldContext } from "../../hooks/useAppForm";
import { FormControl, FormItem, FormLabel, FormMessage } from "../ui/form";
import { Textarea } from "../ui/textarea";

type TextareaFieldProps = Omit<ComponentProps<typeof Textarea>, "id" | "value" | "onChange" | "onBlur">;

export const TextareaField = ({ title, required, className, ...props }: TextareaFieldProps) => {
  const { state, handleChange, handleBlur } = useFieldContext<string>();
  const id = useId();

  return (
    <FormItem className={className}>
      <FormLabel fieldState={state} htmlFor={id} required={required}>
        {title}
      </FormLabel>
      <FormControl>
        <Textarea {...props} id={id} value={state.value} onChange={(e) => handleChange(e.target.value)} onBlur={handleBlur} />
      </FormControl>
      <FormMessage fieldState={state} />
    </FormItem>
  );
};
