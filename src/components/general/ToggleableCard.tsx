import { clsxm } from "@/utils/clsxm";
import { ComponentProps, JSXElementConstructor } from "react";

interface PropTypes extends ComponentProps<"div"> {
  as?: "div" | JSXElementConstructor<ComponentProps<"div">>;
  onToggle?: () => void;
}

export const ToggleableCard = ({ as = "div", className, onToggle, ...props }: PropTypes) => {
  const Comp = as;
  return (
    <Comp
      {...props}
      className={clsxm("bg-card rounded-lg p-1", "border-border border", "focus-visible:border-ring focus-visible:ring-ring/50 outline-none focus-visible:ring-[3px]", className)}
      {...(!!onToggle && {
        tabIndex: 1,
        onKeyDown: (e) => {
          if ((e.key === "Enter" || e.code === "Space") && e.currentTarget === document.activeElement) {
            onToggle();
            e.preventDefault();
            e.stopPropagation();
          }
        },
      })}
    />
  );
};
