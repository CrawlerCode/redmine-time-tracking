import { Loader2Icon } from "lucide-react";
import { ComponentProps, ReactNode, useId } from "react";
import { useIntl } from "react-intl";
import { useFieldContext } from "../../hooks/useAppForm";
import {
  Combobox,
  ComboboxChip,
  ComboboxChips,
  ComboboxChipsInput,
  ComboboxClear,
  ComboboxCollection,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxGroup,
  ComboboxInput,
  ComboboxItem,
  ComboboxLabel,
  ComboboxList,
  ComboboxValue,
  useComboboxAnchor,
} from "../ui/combobox";
import { Field, FieldError, FieldLabel } from "../ui/field";

type Item<Value> = { value: Value; label: string; icon?: ReactNode; disabled?: boolean };
type Group<Value> = { label: string; items: Item<Value>[] };

type ComboboxFieldProps<Value extends string | number = string | number, Mode extends "single" | "multiple" = "single"> = Omit<
  ComponentProps<typeof Combobox<Item<Value>, Mode extends "multiple" ? true : false>>,
  "multiple" | "value" | "defaultValue" | "onValueChange" | "items"
> & {
  mode?: Mode;
  title?: string;
  placeholder?: string;
  items: Item<Value>[] | Group<Value>[];
  noOptionsMessage?: string;
  isLoading?: boolean;
  className?: string;
};

export const ComboboxField = <Value extends string | number, Mode extends "single" | "multiple" = "single">({
  mode = "single" as Mode,
  items,
  title,
  placeholder,
  required,
  disabled,
  noOptionsMessage,
  isLoading,
  className,
  ...props
}: ComboboxFieldProps<Value, Mode>) => {
  const { name, state, handleChange, handleBlur } = useFieldContext<null | Value | Value[]>();
  const isInvalid = !state.meta.isValid && state.meta.isTouched;
  const id = useId();

  const { formatMessage } = useIntl();

  const anchor = useComboboxAnchor();

  return (
    <Field data-invalid={isInvalid} className={className}>
      <FieldLabel required={required} htmlFor={id}>
        {title}
      </FieldLabel>
      <Combobox
        autoHighlight
        {...props}
        id={id}
        name={name}
        disabled={disabled}
        items={items}
        multiple={mode === "multiple"}
        value={mode === "single" ? findSelectedItem(state.value, items) : findSelectedItems(state.value, items)}
        onValueChange={(value) => handleChange(Array.isArray(value) ? (value.map((v) => v.value) as Value[]) : value ? (value.value as Value) : null)}
      >
        {mode === "single" && (
          <ComboboxInput disabled={disabled} aria-invalid={isInvalid} placeholder={placeholder} showClear={!required} onBlur={handleBlur}>
            {isLoading && <Loader2Icon className="size-4 animate-spin" />}
          </ComboboxInput>
        )}
        {mode === "multiple" && (
          <ComboboxChips ref={anchor}>
            <ComboboxValue>
              {(selected: Item<Value>[]) => (
                <>
                  {selected.map((item) => (
                    <ComboboxChip key={item.value} className="justify-start truncate">
                      {item.label}
                    </ComboboxChip>
                  ))}
                  <ComboboxChipsInput disabled={disabled} placeholder={selected.length === 0 ? placeholder : undefined} onBlur={handleBlur} />
                </>
              )}
            </ComboboxValue>
            {isLoading && <Loader2Icon className="size-4 animate-spin" />}
            {!required && <ComboboxClear />}
          </ComboboxChips>
        )}
        <ComboboxContent anchor={mode === "multiple" ? anchor : undefined}>
          <ComboboxEmpty>{noOptionsMessage ?? formatMessage({ id: "general.no-options" })}</ComboboxEmpty>
          <ComboboxList>
            {(item: Item<Value> | Group<Value>) =>
              typeof item === "object" && "items" in item ? (
                <ComboboxGroup key={item.label} items={item.items}>
                  <ComboboxLabel>{item.label}</ComboboxLabel>
                  <ComboboxCollection>
                    {(childItem: Item<Value>) => (
                      <ComboboxItem key={childItem.value} value={childItem} disabled={childItem.disabled}>
                        {childItem.icon}
                        {childItem.label}
                      </ComboboxItem>
                    )}
                  </ComboboxCollection>
                </ComboboxGroup>
              ) : (
                <ComboboxItem key={item.value} value={item}>
                  {item.icon}
                  {item.label}
                </ComboboxItem>
              )
            }
          </ComboboxList>
        </ComboboxContent>
      </Combobox>
      {isInvalid && <FieldError errors={state.meta.errors} />}
    </Field>
  );
};

const findSelectedItem = <Value extends string | number>(value: null | Value | Value[], items: ComboboxFieldProps<Value>["items"]): null | Item<Value> => {
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

const findSelectedItems = <Value extends string | number>(value: null | Value | Value[], items: ComboboxFieldProps<Value>["items"]): Item<Value>[] => {
  if (!Array.isArray(value)) {
    return [];
  }

  const selected = [];
  for (const item of items) {
    if (typeof item === "object" && "items" in item) {
      selected.push(...findSelectedItems(value, item.items));
    } else if (value.includes(item.value)) {
      selected.push(item);
    }
  }
  return selected;
};
