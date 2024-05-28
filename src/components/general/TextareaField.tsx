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
      <textarea
        {...props}
        id={id}
        required={false}
        className={clsx("block w-full rounded-lg text-sm", "placeholder:text-field-placeholder border border-field-border bg-field", "focus:outline-none focus:ring-2 focus:ring-primary-focus", {
          "border-red-500 text-red-900 placeholder:text-red-700 dark:border-red-500 dark:text-red-500 dark:placeholder:text-red-500": error !== undefined,
          "p-1.5": size === "sm",
          "p-2.5": size === "md",
        })}
        rows={rows}
      >
        {value}
      </textarea>
      {error && <p className="text-sm text-red-600 dark:text-red-500">{error}</p>}
    </div>
  );
};

export default TextareaField;
