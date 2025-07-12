import { clsxm } from "@/utils/clsxm";
import { ComponentProps, useId } from "react";
import { useFieldContext } from "../../hooks/useAppForm";
import { Checkbox } from "../ui/checkbox";
import { FormControl, FormDescription, FormItem, FormLabel, FormMessage } from "../ui/form";

type CheckboxFieldProps = Omit<ComponentProps<typeof Checkbox>, "checked" | "onCheckedChange" | "onBlur"> & {
  description?: string;
};

export const CheckboxField = ({ title, description, className, ...props }: CheckboxFieldProps) => {
  const { state, handleChange, handleBlur } = useFieldContext<boolean>();
  const id = useId();

  return (
    <FormItem
      className={clsxm(
        "flex gap-2",
        {
          "items-start": !!description,
          "items-center": !description,
        },
        className
      )}
    >
      <FormControl>
        <Checkbox {...props} id={id} checked={state.value} onCheckedChange={(checked) => handleChange(!!checked)} onBlur={handleBlur} />
      </FormControl>
      {description ? (
        <div className="flex flex-col gap-2">
          <span className="flex items-center gap-2">
            <FormLabel fieldState={state} htmlFor={id} required={props.required}>
              {title}
            </FormLabel>
            <FormMessage variant="tooltip" fieldState={state} />
          </span>
          <FormDescription>{description}</FormDescription>
        </div>
      ) : (
        <>
          <FormLabel fieldState={state} htmlFor={id} required={props.required}>
            {title}
          </FormLabel>
          <FormMessage variant="tooltip" fieldState={state} />
        </>
      )}
    </FormItem>
  );
};
