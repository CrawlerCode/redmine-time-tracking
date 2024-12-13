import { faAsterisk } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import clsx from "clsx";
import { useId } from "react";
import { Tooltip } from "react-tooltip";

interface PropTypes extends Omit<React.ComponentProps<"input">, "id" | "size"> {
  size?: "sm" | "md";
  icon?: React.ReactNode;
  error?: string;
  extraText?: string;
  inputClassName?: string;
}

const InputField = ({ size = "md", title, icon, error, extraText, className, inputClassName, ...props }: PropTypes) => {
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
          {...props}
          id={id}
          required={false} // Remove html required attribute
          className={clsx(
            "block w-full rounded-lg text-sm",
            "border border-field-border bg-field placeholder:text-field-placeholder",
            "focus:outline-none focus:ring-2 focus:ring-primary-focus",
            "dark:autofill:shadow-fill-field-DEFAULT dark:autofill:text-fill-white",
            {
              "border-red-500 text-red-900 placeholder:text-red-700 dark:border-red-500 dark:text-red-500 dark:placeholder:text-red-500": error !== undefined,
              "bg-field-disabled": props.disabled,
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
              "right-1.5 top-1/2 -translate-y-1/2 px-2.5 py-0.5": size === "sm",
              "right-2.5 top-1/2 -translate-y-1/2 px-3.5 py-1": size === "md",
            })}
          >
            {extraText}
          </span>
        )}
      </div>
      {error && (
        <>
          <p className="truncate text-sm text-red-600 dark:text-red-500">
            <span data-tooltip-id={`tooltip-error-${id}`}>{error}</span>
          </p>
          <Tooltip id={`tooltip-error-${id}`} delayShow={200} content={error} className="text-red-600 dark:text-red-500" />
        </>
      )}
    </div>
  );
};

export default InputField;
