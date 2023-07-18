import clsx from "clsx";
import { clsxm } from "../../utils/clsxm";

interface PropTypes {
  size?: "md" | "lg";
  name?: string;
  value: string;
  onChange?: (e: { target: { name?: string; value: string } }) => void;
  options: {
    value: string;
    name: string;
    disabled?: boolean;
  }[];
  className?: string;
  tabIndex?: number;
}

const Switch = ({ size = "md", name, value, onChange, options, className, tabIndex }: PropTypes) => {
  return (
    <div
      className={clsxm(
        "rounded-full flex items-center gap-x-1 w-fit bg-gray-50 text-gray-900 dark:bg-gray-700 dark:text-white",
        {
          "p-1": size === "md",
          "p-1.5": size === "lg",
        },
        className
      )}
    >
      {options.map((option) => (
        <div className="flex justify-center" key={option.value}>
          <button
            type="button"
            className={clsx("w-full rounded-full", "focus:ring-2 focus:ring-primary-300 focus:outline-none dark:focus:ring-primary-800", {
              "text-white bg-primary-700 dark:bg-primary-600": value === option.value,
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
  );
};

export default Switch;
