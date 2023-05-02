import { faAsterisk } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import clsx from "clsx";

interface PropTypes extends React.ComponentProps<"input"> {
  error?: string;
}

const InputField = (props: PropTypes) => {
  return (
    <>
      {props.title && (
        <label htmlFor={props.name} className="block text-sm font-medium text-gray-900 dark:text-white">
          {props.title}
          {props.required && <FontAwesomeIcon icon={faAsterisk} size="2xs" className="text-red-600 ml-1" />}
        </label>
      )}
      <input
        {...props}
        id={props.name}
        required={false}
        className={clsx(
          "text-sm rounded-lg block w-full p-2.5",
          "bg-gray-50 border border-gray-300 text-gray-900 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white",
          "focus:ring-2 focus:ring-primary-500 focus:border-primary-500 dark:focus:ring-primary-500 dark:focus:border-primary-500",
          {
            "border-red-500 text-red-900 placeholder-red-700 dark:text-red-500 dark:placeholder-red-500 dark:border-red-500": props.error !== undefined,
          }
        )}
      />
      {props.error && <p className="text-sm text-red-600 dark:text-red-500">{props.error}</p>}
    </>
  );
};

export default InputField;
