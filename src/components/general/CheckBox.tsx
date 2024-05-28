import clsx from "clsx";
import { useId } from "react";

interface PropTypes extends Omit<React.ComponentProps<"input">, "id" | "type"> {
  title: string;
  description?: string;
}

const CheckBox = ({ title, description, className, ...props }: PropTypes) => {
  const id = useId();

  return (
    <div className={clsx("flex items-center rounded-lg border border-field-border bg-field p-1 pl-2", className)}>
      <div className="flex items-center">
        <input
          {...props}
          id={id}
          type="checkbox"
          className={clsx(
            "size-4 rounded border-gray-300 bg-gray-100 accent-primary dark:border-gray-600 dark:bg-gray-700 dark:ring-offset-gray-800",
            "focus:outline-none focus:ring-2 focus:ring-primary-focus"
          )}
        />
      </div>
      <div className="ml-2 text-sm">
        <label htmlFor={id} className="font-medium">
          {title}
        </label>
        {description && <p className="text-xs font-normal text-gray-500 dark:text-gray-300">{description}</p>}
      </div>
    </div>
  );
};

export default CheckBox;
