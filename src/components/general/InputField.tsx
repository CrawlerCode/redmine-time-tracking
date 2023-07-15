import { faAsterisk } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import clsx from "clsx";
import { forwardRef, useId } from "react";

interface PropTypes extends Omit<React.ComponentProps<"input">, "id" | "size"> {
  size?: "sm" | "md";
  icon?: React.ReactNode;
  error?: string;
  extraText?: string;
}

const InputField = forwardRef<HTMLInputElement, PropTypes>(({ size = "md", title, icon, error, extraText, className, ...props }: PropTypes, ref) => {
  const id = useId();

  return (
    <div>
      {title && (
        <label
          htmlFor={id}
          className={clsx("block font-medium text-gray-900 dark:text-white mb-1", {
            "text-xs": size === "sm",
            "text-sm": size === "md",
          })}
        >
          {title}
          {props.required && <FontAwesomeIcon icon={faAsterisk} size="2xs" className="text-red-600 ml-1" />}
        </label>
      )}
      <div className="relative">
        {icon && <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">{icon}</div>}
        <input
          ref={ref}
          {...props}
          id={id}
          required={false}
          className={clsx(
            "text-sm rounded-lg block w-full",
            "bg-gray-50 border border-gray-300 text-gray-900 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white",
            "focus:ring-2 focus:ring-primary-300 focus:outline-none dark:focus:ring-primary-800",
            {
              "border-red-500 text-red-900 placeholder-red-700 dark:text-red-500 dark:placeholder-red-500 dark:border-red-500": error !== undefined,
              "pl-8": !!icon,
              "p-1.5": size === "sm",
              "p-2.5": size === "md",
              "appearance-none": extraText,
            },
            className
          )}
        />
        {extraText && (
          <span
            className={clsx("bg-gray-100 text-gray-800 font-medium rounded dark:bg-gray-600 dark:text-gray-400 absolute", {
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

export default InputField;
