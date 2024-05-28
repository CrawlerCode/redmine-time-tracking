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
    <label htmlFor={id} className={clsx("inline-flex w-fit cursor-pointer items-center", className)}>
      <input {...props} id={id} type="checkbox" className="peer sr-only" />
      <div
        className={clsx(
          "peer relative rounded-full border border-field-border bg-field after:absolute after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] peer-checked:bg-primary peer-checked:after:translate-x-full peer-checked:after:border-white peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-primary-focus",
          {
            "h-4 w-7 after:left-[1px] after:top-[1px] after:size-3": size === "sm",
            "h-5 w-9 after:left-[1px] after:top-[1px] after:size-4": size === "md",
            "h-6 w-11 after:left-[1px] after:top-[1px] after:size-5": size === "lg",
          }
        )}
      >
        {offLabel && (
          <span
            className={clsx("absolute font-normal uppercase text-white", {
              "right-0.5 top-0.5 text-[0.4rem] uppercase leading-3": size === "sm",
              "right-0.5 top-1 text-[0.5rem] uppercase leading-3": size === "md",
              "right-1 top-1.5 text-[0.6rem] uppercase leading-3": size === "lg",
            })}
          >
            {offLabel}
          </span>
        )}
        {onLabel && (
          <span
            className={clsx("absolute font-normal uppercase text-white", {
              "left-0.5 top-0.5 text-[0.4rem] uppercase leading-3": size === "sm",
              "left-0.5 top-1 text-[0.5rem] uppercase leading-3": size === "md",
              "left-1 top-1.5 text-[0.6rem] uppercase leading-3": size === "lg",
            })}
          >
            {onLabel}
          </span>
        )}
      </div>
      {title && (
        <span
          className={clsx("ml-2 font-medium", {
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
