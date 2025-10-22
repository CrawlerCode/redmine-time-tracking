import { ReactNode, useId } from "react";
import { useFieldContext } from "../../hooks/useAppForm";
import { Field, FieldError, FieldLabel } from "../ui/field";
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
  const isInvalid = !state.meta.isValid && state.meta.isTouched;
  const id = useId();

  return (
    <Field data-invalid={isInvalid} className={className}>
      <FieldLabel required={required} htmlFor={id}>
        {title}
      </FieldLabel>
      <Select required={required} disabled={disabled} value={JSON.stringify(state.value)} onValueChange={(value) => handleChange(JSON.parse(value) as Value)}>
        <SelectTrigger id={id} className="w-full truncate" onBlur={handleBlur} aria-invalid={isInvalid}>
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
      {isInvalid && <FieldError errors={state.meta.errors} />}
    </Field>
  );
};

const SelectOption = <Value extends string | number>({ option }: { option: Option<Value> }) => (
  <SelectItem value={JSON.stringify(option.value)} className="flex items-center gap-1">
    {option.icon}
    {option.label}
  </SelectItem>
);
