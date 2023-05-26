import clsx from "clsx";
import { useId } from "react";

interface PropTypes extends React.ComponentProps<"input"> {
  title: string;
  description?: string;
}

const CheckBox = ({ title, description, ...props }: PropTypes) => {
  const id = useId();

  return (
    <div className="flex items-center pl-2 p-1 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-700">
      <div className="flex items-center">
        <input
          {...props}
          id={id}
          type="checkbox"
          className={clsx(
            "w-4 h-4 accent-primary-600 bg-gray-100 border-gray-300 rounded dark:ring-offset-gray-800 dark:bg-gray-700 dark:border-gray-600",
            "focus:ring-2 focus:ring-primary-300 focus:outline-none dark:focus:ring-primary-600",
            props.className
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
