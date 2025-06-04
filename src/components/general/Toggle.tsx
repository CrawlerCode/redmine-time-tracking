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
          "peer border-field-border bg-field peer-checked:bg-primary peer-focus:ring-primary-focus relative rounded-full border peer-focus:ring-2 peer-focus:outline-hidden after:absolute after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] peer-checked:after:translate-x-full peer-checked:after:border-white",
          {
            "h-4 w-7 after:top-px after:left-px after:size-3": size === "sm",
            "h-5 w-9 after:top-px after:left-px after:size-4": size === "md",
            "h-6 w-11 after:top-px after:left-px after:size-5": size === "lg",
          }
        )}
      >
        {offLabel && (
          <span
            className={clsx("absolute font-normal text-white uppercase", {
              "top-0.5 right-0.5 text-[0.4rem] leading-3 uppercase": size === "sm",
              "top-1 right-0.5 text-[0.5rem] leading-3 uppercase": size === "md",
              "top-1.5 right-1 text-[0.6rem] leading-3 uppercase": size === "lg",
            })}
          >
            {offLabel}
          </span>
        )}
        {onLabel && (
          <span
            className={clsx("absolute font-normal text-white uppercase", {
              "top-0.5 left-0.5 text-[0.4rem] leading-3 uppercase": size === "sm",
              "top-1 left-0.5 text-[0.5rem] leading-3 uppercase": size === "md",
              "top-1.5 left-1 text-[0.6rem] leading-3 uppercase": size === "lg",
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
