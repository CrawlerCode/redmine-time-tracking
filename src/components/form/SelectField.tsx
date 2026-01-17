import { ComponentProps, ReactNode, useId } from "react";
import { useFieldContext } from "../../hooks/useAppForm";
import { Field, FieldError, FieldLabel } from "../ui/field";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "../ui/select";

type Item<Value> = { value: Value; label: string; icon?: ReactNode };
type Group<Value> = { label: string; items: Item<Value>[] };

type SelectFieldProps<Value extends string | number = string | number> = Omit<ComponentProps<typeof Select<Item<Value>>>, "multiple" | "value" | "defaultValue" | "onValueChange" | "items"> & {
  items: Item<Value>[] | Group<Value>[];
  title?: string;
  placeholder?: string;
  className?: string;
};

export const SelectField = <Value extends string | number>({ items, title, placeholder, required, disabled, className, ...props }: SelectFieldProps<Value>) => {
  const { name, state, handleChange, handleBlur } = useFieldContext<null | Value>();
  const isInvalid = !state.meta.isValid && state.meta.isTouched;
  const id = useId();

  return (
    <Field data-invalid={isInvalid} className={className}>
      <FieldLabel required={required} htmlFor={id}>
        {title}
      </FieldLabel>
      <Select {...props} name={name} required={required} disabled={disabled} value={findSelectedItem(state.value, items)} onValueChange={(item) => handleChange(item?.value || null)}>
        <SelectTrigger id={id} className="w-full truncate" aria-invalid={isInvalid} onBlur={handleBlur}>
          <SelectValue>
            {(selected: Item<Value>) =>
              selected ? (
                <>
                  {selected.icon}
                  {selected.label}
                </>
              ) : (
                placeholder
              )
            }
          </SelectValue>
        </SelectTrigger>
        <SelectContent>
          {items?.map((item) =>
            typeof item === "object" && "items" in item ? (
              <SelectGroup key={item.label}>
                <SelectLabel>{item.label}</SelectLabel>
                {item.items.map((childItem) => (
                  <SelectItem key={childItem.value} value={childItem}>
                    {childItem.icon}
                    {childItem.label}
                  </SelectItem>
                ))}
              </SelectGroup>
            ) : (
              <SelectItem key={item.value} value={item}>
                {item.icon}
                {item.label}
              </SelectItem>
            )
          )}
        </SelectContent>
      </Select>
      {isInvalid && <FieldError errors={state.meta.errors} />}
    </Field>
  );
};

const findSelectedItem = <Value extends string | number>(value: null | Value, items: SelectFieldProps<Value>["items"]): null | Item<Value> => {
  for (const item of items) {
    if (typeof item === "object" && "items" in item) {
      const found = findSelectedItem(value, item.items);
      if (found) {
        return found;
      }
    } else if (item.value === value) {
      return item;
    }
  }
  return null;
};
