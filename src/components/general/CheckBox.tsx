import clsx from "clsx";
import { useId } from "react";

interface PropTypes extends Omit<React.ComponentProps<"input">, "id" | "type"> {
  title: string;
  description?: string;
}

const CheckBox = ({ title, description, className, ...props }: PropTypes) => {
  const id = useId();

  return (
    <div className={clsx("border-field-border bg-field flex items-center rounded-lg border p-1 pl-2", className)}>
      <div className="flex items-center">
        <input
          {...props}
          id={id}
          type="checkbox"
          className={clsx(
            "accent-primary size-4 rounded-sm border-gray-300 bg-gray-100 dark:border-gray-600 dark:bg-gray-700 dark:ring-offset-gray-800",
            "focus:ring-primary-focus focus:ring-2 focus:outline-hidden"
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
