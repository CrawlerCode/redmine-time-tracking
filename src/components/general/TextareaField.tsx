import { faAsterisk } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import clsx from "clsx";
import { useId } from "react";

interface PropTypes extends Omit<React.ComponentProps<"textarea">, "id" | "size"> {
  size?: "sm" | "md";
  error?: string;
}

const TextareaField = ({ size = "md", title, error, value, rows = 3, className, ...props }: PropTypes) => {
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
      <textarea
        {...props}
        id={id}
        required={false}
        className={clsx(
          "text-sm rounded-lg block w-full",
          "bg-gray-50 border border-gray-300 text-gray-900 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white",
          "focus:ring-2 focus:ring-primary-300 focus:outline-none dark:focus:ring-primary-800",
          {
            "border-red-500 text-red-900 placeholder-red-700 dark:text-red-500 dark:placeholder-red-500 dark:border-red-500": error !== undefined,
            "p-1.5": size === "sm",
            "p-2.5": size === "md",
          },
          className
        )}
        rows={rows}
      >
        {value}
      </textarea>
      {error && <p className="text-sm text-red-600 dark:text-red-500">{error}</p>}
    </div>
  );
};

export default TextareaField;
