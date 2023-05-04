import clsx from "clsx";
import { useId } from "react";

interface PropTypes extends React.ComponentProps<"input"> {
  title: string;
  description?: string;
}

const CheckBox = ({ title, description, ...props }: PropTypes) => {
  const id = useId();

  return (
    <div className="flex items-center pl-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-700">
      <div className={clsx("flex items-center", description ? "h-12" : "h-8")}>
        <input
          {...props}
          id={id}
          type="checkbox"
          className={clsx("w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600", props.className)}
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
