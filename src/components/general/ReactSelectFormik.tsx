import { FormikHandlers } from "formik";
import { ComponentProps, ReactNode } from "react";
import { GroupBase, OnChangeValue, PropsValue } from "react-select";
import ReactSelect from "./ReactSelect";

type Option = { value: number; label: string; icon?: ReactNode };

function ReactSelectFormik<IsMulti extends boolean = false, Group extends GroupBase<Option> = GroupBase<Option>>({
  value: _value,
  onChange,
  onBlur,
  ...props
}: Omit<ComponentProps<typeof ReactSelect<Option, IsMulti, Group>>, "value" | "onChange"> & {
  value?: Option["value"] | Option["value"][];
  onChange?: FormikHandlers["handleChange"];
}) {
  let value: PropsValue<Option>;
  if (Array.isArray(_value)) {
    value =
      props.options?.reduce((result, o) => {
        if (typeof o === "object" && "options" in o) {
          const opts = o.options.filter((o) => _value.includes(o.value));
          return [...result, ...opts];
        } else if (_value.includes(o.value)) {
          return [...result, o];
        }
        return result;
      }, [] as Option[]) ?? [];
  } else {
    value =
      (props.options &&
        [...props.options].reduce(
          (_, o, i, arr) => {
            if (typeof o === "object" && "options" in o) {
              const opt = o.options.find((o) => o.value === _value);
              if (opt) {
                arr.splice(i + 1); // break out reduce
                return opt;
              }
            } else if (o.value === _value) {
              arr.splice(i + 1); // break out reduce
              return o;
            }
            return undefined;
          },
          undefined as undefined | Option
        )) ??
      null;
  }

  return (
    <ReactSelect
      {...props}
      value={value}
      onChange={(selected) => {
        if (Array.isArray(selected)) {
          onChange?.({
            target: {
              name: props.name,
              value: (selected as OnChangeValue<Option, true>).map((v) => v.value),
            },
          });
        } else {
          onChange?.({
            target: {
              name: props.name,
              value: (selected as OnChangeValue<Option, false>)?.value,
            },
          });
        }
      }}
      onBlur={(e) => {
        e.target.name = props.name!;
        onBlur?.(e);
      }}
    />
  );
}

export default ReactSelectFormik;
