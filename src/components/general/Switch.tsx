import { faAsterisk } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import clsx from "clsx";
import { clsxm } from "../../utils/clsxm";

interface PropTypes {
  size?: "md" | "lg";
  title?: string;
  name?: string;
  value: string;
  onChange?: (e: { target: { name?: string; value: string } }) => void;
  options: {
    value: string;
    name: string;
    disabled?: boolean;
  }[];
  required?: boolean;
  className?: string;
  tabIndex?: number;
}

const Switch = ({ size = "md", title, name, value, onChange, options, required, className, tabIndex }: PropTypes) => {
  return (
    <div
      className={clsx(
        {
          "flex items-center justify-between rounded-lg border border-gray-200 bg-gray-50 p-1 pl-2 dark:border-gray-700 dark:bg-gray-700": title,
        },
        className
      )}
    >
      {title && (
        <label className="text-sm font-medium text-gray-900 dark:text-gray-300">
          {title}
          {required && <FontAwesomeIcon icon={faAsterisk} size="2xs" className="ml-1 text-red-600" />}
        </label>
      )}

      <div
        className={clsxm("flex w-fit items-center gap-x-1 rounded-full border border-gray-200 bg-gray-50 text-gray-900 dark:border-gray-700 dark:bg-gray-700 dark:text-white", {
          "border-gray-300 bg-gray-200 dark:bg-gray-600": title,
          "p-1": size === "md",
          "p-1.5": size === "lg",
        })}
      >
        {options.map((option) => (
          <div className="flex justify-center" key={option.value}>
            <button
              type="button"
              className={clsx("w-full whitespace-nowrap rounded-full", "focus:outline-none focus:ring-2 focus:ring-primary-300 dark:focus:ring-primary-800", {
                "bg-primary-700 text-white dark:bg-primary-600": value === option.value,
                "p-0.5 px-2": size === "md",
                "p-1 px-3": size === "lg",
              })}
              disabled={option.disabled}
              onClick={() => onChange?.({ target: { name: name, value: option.value } })}
              tabIndex={tabIndex}
            >
              {option.name}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Switch;
