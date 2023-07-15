import clsx from "clsx";

interface PropTypes {
  size?: "md" | "lg";
  name?: string;
  value: string;
  onChange?: (e: { target: { name?: string; value: string } }) => void;
  options: {
    value: string;
    name: string;
  }[];
  className?: string;
}

const Switch = ({ size = "md", name, value, onChange, options, className }: PropTypes) => {
  return (
    <div
      className={clsx(
        "rounded-full flex items-center gap-x-1 w-fit bg-gray-50 text-gray-900 dark:bg-gray-700 dark:text-white",
        {
          "p-1": size === "md",
          "p-1.5": size === "lg",
        },
        className
      )}
    >
      {options.map((option) => (
        <div className="flex justify-center">
          <button
            type="button"
            className={clsx("w-full rounded-full", "focus:ring-2 focus:ring-primary-300 focus:outline-none dark:focus:ring-primary-800", {
              "bg-primary-600": value === option.value,
              "p-0.5 px-2": size === "md",
              "p-1 px-3": size === "lg",
            })}
            onClick={() => onChange?.({ target: { name: name, value: option.value } })}
          >
            {option.name}
          </button>
        </div>
      ))}
    </div>
  );
};

export default Switch;
