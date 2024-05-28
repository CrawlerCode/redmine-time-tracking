import { faAsterisk } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import clsx from "clsx";
import { ChangeEventHandler, useId } from "react";
import Flatpickr, { DateTimePickerProps } from "react-flatpickr";

import "../../assets/themes/dark.css";
import "../../assets/themes/light.css";

interface PropTypes extends Omit<DateTimePickerProps, "id" | "size" | "onChange"> {
  size?: "sm" | "md";
  icon?: React.ReactNode;
  error?: string;
  onChange?: ChangeEventHandler<HTMLInputElement>;
}

const DateField = ({ size = "md", title, icon, error, className, value, onChange, onBlur, ...props }: PropTypes) => {
  const id = useId();

  return (
    <div className={className}>
      {title && (
        <label
          htmlFor={id}
          className={clsx("mb-1 block font-medium", {
            "text-xs": size === "sm",
            "text-sm": size === "md",
          })}
        >
          {title}
          {props.required && <FontAwesomeIcon icon={faAsterisk} size="2xs" className="ml-1 text-red-600" />}
        </label>
      )}
      <div className="relative">
        {icon && <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">{icon}</div>}
        <Flatpickr
          id={id}
          {...props}
          value={value}
          onChange={(dates, _, instance) => {
            onChange?.({
              target: {
                name: props.name,
                value: instance.config.mode === "single" ? dates[0] : dates,
              },
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
            } as any);
          }}
          onClose={() => {
            onBlur?.({
              target: {
                name: props.name,
              },
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
            } as any);
          }}
          className={clsx("block w-full rounded-lg text-sm", "placeholder:text-field-placeholder border border-field-border bg-field", "focus:outline-none focus:ring-2 focus:ring-primary-focus", {
            "border-red-500 text-red-900 placeholder:text-red-700 dark:border-red-500 dark:text-red-500 dark:placeholder:text-red-500": error !== undefined,
            "pl-8": !!icon,
            "p-1.5": size === "sm",
            "p-2.5": size === "md",
          })}
        />
      </div>
      {error && <p className="text-sm text-red-600 dark:text-red-500">{error}</p>}
    </div>
  );
};

export default DateField;
