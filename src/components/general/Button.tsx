import clsx from "clsx";
import React from "react";

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
      className={clsx(
        "rounded-lg font-medium",
        {
          "px-1 py-0.5 text-xs focus:ring-1": size === "xs",
          "px-3 py-2 text-xs focus:ring-2": size === "sm",
          "px-5 py-2.5 text-sm focus:ring-4": size === "md",
          "bg-primary-700 text-white hover:bg-primary-800 dark:bg-primary-600 dark:hover:bg-primary-700": variant === "primary",
          "text-primary-700 ring-2 hover:bg-primary-700/20 dark:hover:bg-primary-700/30": variant === "outline",
        },
        "focus:outline-none focus:ring-primary-300 dark:focus:ring-primary-800",
        className
      )}
      {...props}
      {...(Component === "button" && {
        type: "button",
      })}
    >
      {children}
    </Component>
  );
};

export default Button;
