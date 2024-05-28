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
          "flex items-center justify-between rounded-lg border border-field-border bg-field p-1 pl-2": title,
        },
        className
      )}
    >
      {title && (
        <label className="text-sm font-medium">
          {title}
          {required && <FontAwesomeIcon icon={faAsterisk} size="2xs" className="ml-1 text-red-600" />}
        </label>
      )}

      <div
        className={clsxm("flex w-fit items-center gap-x-1 rounded-full border border-field-border bg-field", {
          "bg-field-inner": title,
          "p-1": size === "md",
          "p-1.5": size === "lg",
        })}
      >
        {options.map((option) => (
          <div className="flex justify-center" key={option.value}>
            <button
              type="button"
              className={clsx("w-full whitespace-nowrap rounded-full", "focus:outline-none focus:ring-2 focus:ring-primary-focus", {
                "bg-primary text-white": value === option.value,
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
