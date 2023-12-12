import { faAsterisk } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import clsx from "clsx";
import { useId } from "react";

interface PropTypes extends Omit<React.ComponentProps<"select">, "id" | "size"> {
  size?: "sm" | "md";
  error?: string;
  placeholder?: string
}

const SelectField = ({ size = "md", title, error, children, placeholder, className, ...props }: PropTypes) => {
  const id = useId();

  return (
    <div className={className}>
      {title && (
        <label
          htmlFor={id}
          className={clsx("mb-1 block font-medium text-gray-900 dark:text-white", {
            "text-xs": size === "sm",
            "text-sm": size === "md",
          })}
        >
          {title}
          {props.required && <FontAwesomeIcon icon={faAsterisk} size="2xs" className="ml-1 text-red-600" />}
        </label>
      )}
      <select
        {...props}
        id={id}
        className={clsx(
          "block w-full rounded-lg text-sm",
          "border border-gray-300 bg-gray-50 text-gray-900 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder:text-gray-400",
          "focus:border-primary-300 focus:ring-primary-300 dark:focus:border-primary-800 dark:focus:ring-primary-800",
          {
            "p-1.5": size === "sm",
            "p-2.5": size === "md",
          }
        )}
      >
        {placeholder && (
          <option disabled selected>
            {placeholder}
          </option>
        )}
        {children}
      </select>
      {error && <p className="text-sm text-red-600 dark:text-red-500">{error}</p>}
    </div>
  );
};

export default SelectField;
