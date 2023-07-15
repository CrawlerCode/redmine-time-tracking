import { faAsterisk } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import clsx from "clsx";
import { useId } from "react";

interface PropTypes extends Omit<React.ComponentProps<"select">, "id" | "size"> {
  size?: "sm" | "md";
  error?: string;
}

const SelectField = ({ size = "md", title, error, children, placeholder, className, ...props }: PropTypes) => {
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
      <select
        {...props}
        id={id}
        className={clsx(
          "text-sm rounded-lg block w-full",
          "bg-gray-50 border border-gray-300 text-gray-900 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white ",
          "focus:ring-primary-300 focus:border-primary-300 dark:focus:ring-primary-800 dark:focus:border-primary-800",
          {
            "p-1.5": size === "sm",
            "p-2.5": size === "md",
          },
          className
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
