import { ComponentProps, ReactNode } from "react";
import { GroupBase, MultiValue, SingleValue } from "react-select";
import { useFieldContext } from "../../hooks/useAppForm";
import ReactSelect from "../general/ReactSelect";

type Option<Value> = { value: Value; label: string; icon?: ReactNode };

export const SelectField = <Value extends number | string, IsMulti extends boolean = false, Group extends GroupBase<Option<Value>> = GroupBase<Option<Value>>>(
  props: Omit<ComponentProps<typeof ReactSelect<Option<Value>, IsMulti, Group>>, "value" | "onChange" | "onBlur">
) => {
  const { state, handleChange, handleBlur } = useFieldContext<IsMulti extends true ? Value[] : Value>();

  const flattedOptions = props.options?.reduce((result, option) => {
    if (typeof option === "object" && "options" in option) {
      return [...result, ...option.options];
    }
    return [...result, option];
  }, [] as Option<Value>[]);

  const selectedValue = Array.isArray(state.value)
    ? flattedOptions?.filter((option) => (state.value as Value[])?.includes(option.value))
    : flattedOptions?.find((option) => (state.value as Value) === option.value);

  return (
    <ReactSelect
      {...props}
      value={selectedValue}
      onChange={(selected) => {
        const value = Array.isArray(selected) ? (selected as MultiValue<Option<Value>>)?.map((v) => v.value) : ((selected as SingleValue<Option<Value>>)?.value ?? null);
        handleChange(value as IsMulti extends true ? Value[] : Value);
      }}
      onBlur={handleBlur}
      error={!state.meta.isValid && state.meta.isTouched ? state.meta.errors.map((error) => error.message).join(", ") : undefined}
    />
  );
};
