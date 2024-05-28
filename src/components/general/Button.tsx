import React from "react";
import { clsxm } from "../../utils/clsxm";

interface PropTypes<T extends React.ElementType> {
  as?: T;
  variant?: "primary" | "outline";
  size?: "xs" | "sm" | "md";
  className?: string;
}

const Button = <T extends React.ElementType = "button">({
  as,
  variant = "primary",
  size = "md",
  children,
  className,
  ...props
}: PropTypes<T> & Omit<React.ComponentPropsWithoutRef<T>, keyof PropTypes<T>>) => {
  const Component = as || "button";
  return (
    <Component
      className={clsxm(
        "rounded-lg font-medium",
        {
          "px-1 py-0.5 text-xs focus:ring-1": size === "xs",
          "px-3 py-2 text-xs focus:ring-2": size === "sm",
          "px-5 py-2.5 text-sm focus:ring-4": size === "md",
          "bg-primary text-white hover:bg-primary-hover": variant === "primary",
          "text-primary ring-1 ring-primary": variant === "outline",
          "bg-primary-disabled hover:bg-primary-disabled": props.disabled && variant === "primary",
        },
        "focus:outline-none focus:ring-primary-focus",
        className
      )}
      {...props}
    >
      {children}
    </Component>
  );
};

export default Button;
