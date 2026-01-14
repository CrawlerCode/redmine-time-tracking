import { Group, Loader2Icon } from "lucide-react";
import { ReactNode, useId } from "react";
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

type Option<Value> = { value: Value; label: string; icon?: ReactNode; disabled?: boolean };
type Group<Value> = { label: string; items: Option<Value>[] };

type ComboboxFieldProps<Value extends string | number = string | number, Mode extends "single" | "multiple" = "single"> = {
  mode?: Mode;
  title?: string;
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  options: Option<Value>[] | Group<Value>[];
  onOpen?: () => void;
  noOptionsMessage?: string;
  isLoading?: boolean;
  className?: string;
};

export const ComboboxField = <Value extends string | number, Mode extends "single" | "multiple" = "single">({
  title,
  placeholder,
  required,
  disabled,
  mode = "single" as Mode,
  options,
  onOpen,
  noOptionsMessage,
  isLoading,
  className,
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
        id={id}
        name={name}
        required={required}
        disabled={disabled}
        items={options}
        multiple={mode === "multiple"}
        value={mode === "single" ? findSelectedOption(state.value, options) : findSelectedOptions(state.value, options)}
        onValueChange={(value) => handleChange(Array.isArray(value) ? (value.map((v) => v.value) as Value[]) : value ? (value.value as Value) : null)}
        onOpenChange={(open) => {
          if (open) onOpen?.();
        }}
      >
        {mode === "single" && (
          <ComboboxInput disabled={disabled} aria-invalid={isInvalid} placeholder={placeholder} showClear={!required} onBlur={handleBlur}>
            {isLoading && <Loader2Icon className="size-4 animate-spin" />}
          </ComboboxInput>
        )}
        {mode === "multiple" && (
          <ComboboxChips ref={anchor}>
            <ComboboxValue>
              {(selected: Option<Value>[]) => (
                <>
                  {selected.map((option) => (
                    <ComboboxChip key={option.value} className="justify-start truncate">
                      {option.label}
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
            {(option: Option<Value> | Group<Value>) =>
              typeof option === "object" && "items" in option ? (
                <ComboboxGroup key={option.label} items={option.items}>
                  <ComboboxLabel>{option.label}</ComboboxLabel>
                  <ComboboxCollection>
                    {(subOption: Option<Value>) => (
                      <ComboboxItem key={subOption.value} value={subOption} disabled={subOption.disabled}>
                        {subOption.icon}
                        {subOption.label}
                      </ComboboxItem>
                    )}
                  </ComboboxCollection>
                </ComboboxGroup>
              ) : (
                <ComboboxItem key={option.value} value={option}>
                  {option.icon}
                  {option.label}
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

const findSelectedOption = <Value extends string | number>(value: null | Value | Value[], options: ComboboxFieldProps<Value>["options"]): null | Option<Value> => {
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

const findSelectedOptions = <Value extends string | number>(value: null | Value | Value[], options: ComboboxFieldProps<Value>["options"]): Option<Value>[] => {
  if (!Array.isArray(value)) {
    return [];
  }

  const selected = [];
  for (const option of options) {
    if (typeof option === "object" && "items" in option) {
      selected.push(...findSelectedOptions(value, option.items));
    } else if (value.includes(option.value)) {
      selected.push(option);
    }
  }
  return selected;
};
