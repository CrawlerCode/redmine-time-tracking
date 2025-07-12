import { ComponentProps, useId } from "react";
import { useFieldContext } from "../../hooks/useAppForm";
import { FormControl, FormItem, FormLabel, FormMessage } from "../ui/form";
import { Input } from "../ui/input";

type TextFieldProps = Omit<ComponentProps<typeof Input>, "id" | "value" | "onChange" | "onBlur"> & {
  classNames?: {
    input?: string;
  };
};

export const TextField = ({ title, required, className, classNames, ...props }: TextFieldProps) => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { state, handleChange, handleBlur } = useFieldContext<any>();
  const id = useId();

  return (
    <FormItem className={className}>
      <FormLabel fieldState={state} htmlFor={id} required={required}>
        {title}
      </FormLabel>
      <FormControl>
        <Input
          {...props}
          id={id}
          value={state.value}
          onChange={(e) => handleChange(props.type === "number" ? e.target.valueAsNumber : e.target.value)}
          onBlur={handleBlur}
          className={classNames?.input}
        />
      </FormControl>
      <FormMessage fieldState={state} />
    </FormItem>
  );
};
