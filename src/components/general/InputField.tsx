import { faAsterisk } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import clsx from "clsx";
import { useId } from "react";

interface PropTypes extends React.ComponentProps<"input"> {
  icon?: React.ReactNode;
  error?: string;
}

const InputField = ({ icon, error, className, ...props }: PropTypes) => {
  const id = useId();

  return (
    <>
      {props.title && (
        <label htmlFor={id} className="block text-sm font-medium text-gray-900 dark:text-white">
          {props.title}
          {props.required && <FontAwesomeIcon icon={faAsterisk} size="2xs" className="text-red-600 ml-1" />}
        </label>
      )}
      <div className="relative">
        {icon && <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">{icon}</div>}
        <input
          {...props}
          id={id}
          required={false}
          className={clsx(
            "text-sm rounded-lg block w-full p-2.5",
            "bg-gray-50 border border-gray-300 text-gray-900 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white",
            "focus:ring-2 focus:ring-primary-300 focus:outline-none dark:focus:ring-primary-600",
            {
              "border-red-500 text-red-900 placeholder-red-700 dark:text-red-500 dark:placeholder-red-500 dark:border-red-500": error !== undefined,
              "pl-8": !!icon,
            },
            className
          )}
        />
      </div>
      {error && <p className="text-sm text-red-600 dark:text-red-500">{error}</p>}
    </>
  );
};

export default InputField;
