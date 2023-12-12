import { faAsterisk } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import clsx from "clsx";
import Select, { GroupBase, Props } from "react-select";

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
        <label className="mb-1 block text-sm font-medium text-gray-900 dark:text-white">
          {title}
          {props.required && <FontAwesomeIcon icon={faAsterisk} size="2xs" className="ml-1 text-red-600" />}
        </label>
      )}
      <Select
        {...props}
        components={{
          DropdownIndicator: () => null,
          IndicatorSeparator: () => null,
        }}
        unstyled
        classNames={{
          control: (state) =>
            clsx("block w-full rounded-lg border border-gray-300 bg-gray-50 p-2 text-sm text-gray-900 dark:border-gray-600 dark:bg-gray-700 dark:text-white", {
              "outline-none ring-2 ring-primary-300 dark:ring-primary-800": state.isFocused,
              "border-red-500 text-red-900 dark:border-red-500 dark:text-red-500": error !== undefined,
            }),
          placeholder: () =>
            clsx("text-gray-400", {
              "text-red-700 dark:text-red-500": error !== undefined,
            }),
          menu: () => "mt-1 py-2 rounded-lg bg-gray-100 text-gray-900 dark:bg-gray-600 dark:text-white border border-gray-300 dark:border-gray-600",
          option: (state) =>
            clsx("truncate p-1.5", {
              "bg-gray-200 dark:bg-gray-700": state.isFocused,
            }),
          groupHeading: () => "px-2 py-1 text-xs font-bold uppercase font-mono dark:text-gray-300",
          valueContainer: () => "gap-1",
          multiValue: () =>
            "rounded-md bg-gray-50 dark:bg-gray-400/10 px-2 py-1 text-xs font-medium text-gray-600 dark:text-gray-300 ring-1 ring-inset ring-gray-600/10 dark:ring-gray-300/10 max-w-[240px]",
          indicatorsContainer: () => "cursor-pointer",
        }}
      />
      {error && <p className="text-sm text-red-600 dark:text-red-500">{error}</p>}
    </div>
  );
}

export default ReactSelect;
