import { faAsterisk } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import clsx from "clsx";
import { ChangeEventHandler, useId, useRef } from "react";
import Flatpickr, { DateTimePickerProps } from "react-flatpickr";

import { getIn } from "formik";
import { useIntl } from "react-intl";
import "../../assets/themes/dark.css";
import "../../assets/themes/light.css";

interface PropTypes extends Omit<DateTimePickerProps, "id" | "size" | "onChange"> {
  size?: "sm" | "md";
  icon?: React.ReactNode;
  error?: string;
  onChange?: ChangeEventHandler<HTMLInputElement>;
}

const DateField = ({ size = "md", title, icon, error, className, value, onChange, onBlur, ...props }: PropTypes) => {
  const { formatDate } = useIntl();
  const id = useId();

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const ref = useRef<any>(null);

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
          ref={ref}
          {...props}
          type="hidden"
          options={{
            ...props.options,
            altInput: true,
            formatDate: (date: Date) => formatDate(date),
          }}
          value={value}
          onChange={(dates, _, instance) => {
            onChange?.({
              target: {
                name: props.name,
                value: instance.config.mode === "single" ? (dates[0] ?? null) : dates,
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
          className={clsx("block w-full rounded-lg text-sm", "border border-field-border bg-field placeholder:text-field-placeholder", "focus:outline-none focus:ring-2 focus:ring-primary-focus", {
            "border-red-500 text-red-900 placeholder:text-red-700 dark:border-red-500 dark:text-red-500 dark:placeholder:text-red-500": error !== undefined,
            "pl-8": !!icon,
            "pr-8": !props.required && value,
            "p-1.5": size === "sm",
            "p-2.5": size === "md",
          })}
        />
        {!props.required && value && (
          <svg viewBox="0 0 20 20" aria-hidden="true" className="absolute right-2 top-1/2 size-5 -translate-y-1/2 cursor-pointer fill-current" onClick={() => ref.current?.flatpickr.clear()}>
            <path d="M14.348 14.849c-0.469 0.469-1.229 0.469-1.697 0l-2.651-3.030-2.651 3.029c-0.469 0.469-1.229 0.469-1.697 0-0.469-0.469-0.469-1.229 0-1.697l2.758-3.15-2.759-3.152c-0.469-0.469-0.469-1.228 0-1.697s1.228-0.469 1.697 0l2.652 3.031 2.651-3.031c0.469-0.469 1.228-0.469 1.697 0s0.469 1.229 0 1.697l-2.758 3.152 2.758 3.15c0.469 0.469 0.469 1.229 0 1.698z"></path>
          </svg>
        )}
      </div>
      {error && <p className="text-sm text-red-600 dark:text-red-500">{error}</p>}
    </div>
  );
};

// update the FastField component if options changed
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const shouldUpdate = (nextProps: any, currentProps: any) =>
  nextProps.options !== currentProps.options ||
  // formik's default shouldUpdate
  nextProps.name !== currentProps.name ||
  nextProps.formik.isSubmitting !== currentProps.formik.isSubmitting ||
  Object.keys(nextProps).length !== Object.keys(currentProps).length ||
  getIn(nextProps.formik.values, currentProps.name) !== getIn(currentProps.formik.values, currentProps.name) ||
  getIn(nextProps.formik.errors, currentProps.name) !== getIn(currentProps.formik.errors, currentProps.name) ||
  getIn(nextProps.formik.touched, currentProps.name) !== getIn(currentProps.formik.touched, currentProps.name);

export default DateField;
