import clsx from "clsx";
import { useId } from "react";

interface PropTypes extends Omit<React.ComponentProps<"input">, "id" | "type"> {
  title: string;
  description?: string;
}

const CheckBox = ({ title, description, className, ...props }: PropTypes) => {
  const id = useId();

  return (
    <div className={clsx("flex items-center rounded-lg border border-gray-200 bg-white p-1 pl-2 dark:border-gray-700 dark:bg-gray-700", className)}>
      <div className="flex items-center">
        <input
          {...props}
          id={id}
          type="checkbox"
          className={clsx(
            "h-4 w-4 rounded border-gray-300 bg-gray-100 accent-primary-600 dark:border-gray-600 dark:bg-gray-700 dark:ring-offset-gray-800",
            "focus:outline-none focus:ring-2 focus:ring-primary-300 dark:focus:ring-primary-800"
          )}
        />
      </div>
      <div className="ml-2 text-sm">
        <label htmlFor={id} className="font-medium text-gray-900 dark:text-gray-300">
          {title}
        </label>
        {description && <p className="text-xs font-normal text-gray-500 dark:text-gray-300">{description}</p>}
      </div>
    </div>
  );
};

export default CheckBox;
