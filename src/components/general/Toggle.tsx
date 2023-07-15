import clsx from "clsx";
import { useId } from "react";

interface PropTypes extends Omit<React.ComponentProps<"input">, "id" | "size" | "type"> {
  size?: "sm" | "md" | "lg";
  onLabel?: string;
  offLabel?: string;
}

const Toggle = ({ size = "md", title, onLabel, offLabel, className, ...props }: PropTypes) => {
  const id = useId();

  return (
    <label htmlFor={id} className={clsx("inline-flex items-center cursor-pointer", className)}>
      <input {...props} id={id} type="checkbox" className="sr-only peer" />
      <div
        className={clsx(
          "relative bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-primary-300 dark:peer-focus:ring-primary-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:bg-white after:border-gray-300 after:border after:rounded-full after:transition-all dark:border-gray-600 peer-checked:bg-primary-600",
          {
            "w-7 h-4 after:h-3 after:w-3 after:top-[2px] after:left-[2px]": size === "sm",
            "w-9 h-5 after:h-4 after:w-4 after:top-[2px] after:left-[2px]": size === "md",
            "w-11 h-6 after:h-5 after:w-5 after:top-[2px] after:left-[2px]": size === "lg",
          }
        )}
      >
        {offLabel && (
          <span
            className={clsx("absolute font-normal uppercase text-white", {
              "text-[0.4rem] leading-3 uppercase right-0.5 top-0.5": size === "sm",
              "text-[0.5rem] leading-3 uppercase right-0.5 top-1": size === "md",
              "text-[0.6rem] leading-3 uppercase right-1 top-1.5": size === "lg",
            })}
          >
            {offLabel}
          </span>
        )}
        {onLabel && (
          <span
            className={clsx("absolute font-normal uppercase text-white", {
              "text-[0.4rem] leading-3 uppercase left-0.5 top-0.5": size === "sm",
              "text-[0.5rem] leading-3 uppercase left-0.5 top-1": size === "md",
              "text-[0.6rem] leading-3 uppercase left-1 top-1.5": size === "lg",
            })}
          >
            {onLabel}
          </span>
        )}
      </div>
      {title && (
        <span
          className={clsx("ml-2 font-medium text-gray-900 dark:text-gray-300", {
            "text-xs": size === "sm",
            "text-sm": size === "md",
            "text-base": size === "lg",
          })}
        >
          {title}
        </span>
      )}
    </label>
  );
};

export default Toggle;
