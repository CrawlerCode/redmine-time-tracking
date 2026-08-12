import { cn } from "@/lib/utils";
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
      className={cn("rounded-lg border border-foreground/10 bg-card p-1 text-card-foreground", "outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50", className)}
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
