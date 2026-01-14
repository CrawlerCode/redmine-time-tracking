import { ReactNode, useId } from "react";
import { useFieldContext } from "../../hooks/useAppForm";
import { Field, FieldError, FieldLabel } from "../ui/field";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "../ui/select";

type Option<Value> = { value: Value; label: string; icon?: ReactNode };
type Group<Value> = { label: string; items: Option<Value>[] };

type SelectFieldProps<Value> = {
  title?: string;
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  options: Option<Value>[] | Group<Value>[];
  className?: string;
};

export const SelectField = <Value extends string | number>({ title, placeholder, required, disabled, options, className }: SelectFieldProps<Value>) => {
  const { name, state, handleChange, handleBlur } = useFieldContext<null | Value>();
  const isInvalid = !state.meta.isValid && state.meta.isTouched;
  const id = useId();

  return (
    <Field data-invalid={isInvalid} className={className}>
      <FieldLabel required={required} htmlFor={id}>
        {title}
      </FieldLabel>
      <Select name={name} required={required} disabled={disabled} value={findSelectedOption(state.value, options)} onValueChange={(option) => handleChange(option?.value || null)}>
        <SelectTrigger id={id} className="w-full truncate" aria-invalid={isInvalid} onBlur={handleBlur}>
          <SelectValue>
            {(selectedOption: Option<Value>) =>
              selectedOption ? (
                <>
                  {selectedOption.icon}
                  {selectedOption.label}
                </>
              ) : (
                placeholder
              )
            }
          </SelectValue>
        </SelectTrigger>
        <SelectContent>
          {options?.map((option) =>
            typeof option === "object" && "items" in option ? (
              <SelectGroup key={option.label}>
                <SelectLabel>{option.label}</SelectLabel>
                {option.items.map((subOption) => (
                  <SelectItem key={subOption.value} value={subOption}>
                    {subOption.icon}
                    {subOption.label}
                  </SelectItem>
                ))}
              </SelectGroup>
            ) : (
              <SelectItem key={option.value} value={option}>
                {option.icon}
                {option.label}
              </SelectItem>
            )
          )}
        </SelectContent>
      </Select>
      {isInvalid && <FieldError errors={state.meta.errors} />}
    </Field>
  );
};

const findSelectedOption = <Value extends string | number>(value: null | Value, options: SelectFieldProps<Value>["options"]): null | Option<Value> => {
  for (const option of options) {
    if (typeof option === "object" && "items" in option) {
      const found = findSelectedOption(value, option.items);
      if (found) {
        return found;
      }
    } else if (option.value === value) {
      return option;
    }
  }
  return null;
};
