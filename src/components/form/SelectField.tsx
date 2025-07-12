import { ReactNode, useId } from "react";
import { useFieldContext } from "../../hooks/useAppForm";
import { FormControl, FormItem, FormLabel, FormMessage } from "../ui/form";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "../ui/select";

type Option<Value> = { value: Value; label: string; icon?: ReactNode };
type Group<Value> = { label: string; options: Option<Value>[] };

type SelectFieldProps<Value> = {
  title?: string;
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  options: Option<Value>[] | Group<Value>[];
  className?: string;
};

export const SelectField = <Value extends string | number>({ title, placeholder, required, disabled, options, className }: SelectFieldProps<Value>) => {
  const { state, handleChange, handleBlur } = useFieldContext<Value>();
  const id = useId();

  return (
    <FormItem className={className}>
      <FormLabel fieldState={state} htmlFor={id} required={required}>
        {title}
      </FormLabel>
      <FormControl>
        <Select required={required} disabled={disabled} defaultValue={JSON.stringify(state.value)} onValueChange={(value) => handleChange(JSON.parse(value) as Value)}>
          <SelectTrigger id={id} className="w-full truncate" onBlur={handleBlur}>
            <SelectValue placeholder={placeholder} />
          </SelectTrigger>
          <SelectContent>
            {options?.map((option) =>
              typeof option === "object" && "options" in option ? (
                <SelectGroup key={option.label}>
                  <SelectLabel>{option.label}</SelectLabel>
                  {option.options.map((subOption) => (
                    <SelectOption key={subOption.value} option={subOption} />
                  ))}
                </SelectGroup>
              ) : (
                <SelectOption key={option.value} option={option} />
              )
            )}
          </SelectContent>
        </Select>
      </FormControl>
      <FormMessage fieldState={state} />
    </FormItem>
  );
};

const SelectOption = <Value extends string | number>({ option }: { option: Option<Value> }) => (
  <SelectItem value={JSON.stringify(option.value)} className="flex items-center gap-1">
    {option.icon}
    {option.label}
  </SelectItem>
);
