import { faAsterisk } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import clsx from "clsx";
import { forwardRef, useId } from "react";

interface PropTypes extends Omit<React.ComponentProps<"input">, "id" | "size"> {
  size?: "sm" | "md";
  icon?: React.ReactNode;
  error?: string;
  extraText?: string;
  inputClassName?: string;
}

const InputField = forwardRef<HTMLInputElement, PropTypes>(({ size = "md", title, icon, error, extraText, className, inputClassName, ...props }: PropTypes, ref) => {
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
        <input
          ref={ref}
          {...props}
          id={id}
          required={false}
          className={clsx(
            "block w-full rounded-lg text-sm",
            "placeholder:text-field-placeholder border border-field-border bg-field",
            "focus:outline-none focus:ring-2 focus:ring-primary-focus",
            "dark:autofill:shadow-fill-field-DEFAULT dark:autofill:text-fill-white",
            {
              "border-red-500 text-red-900 placeholder:text-red-700 dark:border-red-500 dark:text-red-500 dark:placeholder:text-red-500": error !== undefined,
              "pl-8": !!icon,
              "p-1.5": size === "sm",
              "p-2.5": size === "md",
              "appearance-none": extraText,
            },
            inputClassName
          )}
        />
        {extraText && (
          <span
            className={clsx("absolute whitespace-nowrap rounded bg-field-inner font-medium text-gray-800 dark:text-gray-400", {
              "right-1.5 top-1.5 px-2.5 py-0.5": size === "sm",
              "right-2.5 top-2 px-3.5 py-1": size === "md",
            })}
          >
            {extraText}
          </span>
        )}
      </div>
      {error && <p className="text-sm text-red-600 dark:text-red-500">{error}</p>}
    </div>
  );
});

InputField.displayName = "InputField";

export default InputField;
