import { faAsterisk } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import clsx from "clsx";
import Select, { GroupBase, Props, components } from "react-select";

type PropTypes = {
  title?: string;
  error?: string;
};

function ReactSelect<Option = unknown, IsMulti extends boolean = false, Group extends GroupBase<Option> = GroupBase<Option>>({
  title,
  error,
  className,
  ...props
}: Props<Option, IsMulti, Group> & PropTypes) {
  return (
    <div className={className}>
      {title && (
        <label className="mb-1 block text-sm font-medium">
          {title}
          {props.required && <FontAwesomeIcon icon={faAsterisk} size="2xs" className="ml-1 text-red-600" />}
        </label>
      )}
      <Select<Option, IsMulti, Group>
        {...props}
        components={{
          DropdownIndicator: () => null,
          IndicatorSeparator: () => null,
          Option: (optionProps) => (
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            <components.Option {...optionProps}>
              {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
              {(optionProps.data as any).icon && <span className="mr-2 inline-block w-5">{(optionProps.data as any).icon}</span>}
              {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
              {(optionProps.data as any).label}
            </components.Option>
          ),
          SingleValue: (singleValueProps) => (
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            <components.SingleValue {...singleValueProps}>
              {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
              {(singleValueProps.data as any).icon && <span className="mr-2">{(singleValueProps.data as any).icon}</span>}
              {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
              {(singleValueProps.data as any).label}
            </components.SingleValue>
          ),
        }}
        unstyled
        classNames={{
          control: (state) =>
            clsx("block w-full rounded-lg border border-field-border bg-field p-2 text-sm", {
              "outline-none ring-2 ring-primary-focus": state.isFocused,
              "border-red-500 text-red-900 dark:border-red-500 dark:text-red-500": error !== undefined,
            }),
          placeholder: () =>
            clsx("text-field-placeholder", {
              "text-red-700 dark:text-red-500": error !== undefined,
            }),
          menu: () => "mt-1 py-2 rounded-lg border-field-border bg-field border",
          option: (state) =>
            clsx("truncate p-1.5", {
              "bg-field-inner": state.isFocused,
            }),
          groupHeading: () => "px-2 py-1 text-xs font-bold uppercase font-mono",
          valueContainer: () => "gap-1",
          multiValue: () => "rounded-md bg-field-inner px-2 py-1 text-xs font-medium text-gray-600 dark:text-gray-300 ring-1 ring-inset ring-gray-600/10 dark:ring-gray-300/10 max-w-[240px]",
          indicatorsContainer: () => "cursor-pointer",
        }}
        styles={{ menuPortal: (base) => ({ ...base, zIndex: 20 }) }}
      />
      {error && <p className="text-sm text-red-600 dark:text-red-500">{error}</p>}
    </div>
  );
}

export default ReactSelect;
