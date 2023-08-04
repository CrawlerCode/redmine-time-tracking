import clsx from "clsx";
import React from "react";

interface PropTypes extends React.ComponentProps<"button"> {
  variant?: "primary" | "outline";
  size?: "sm" | "md";
}

const Button = ({ variant = "primary", type = "button", size = "md", children, className, ...props }: PropTypes) => {
  return (
    <button
      type={type}
      className={clsx(
        "font-medium rounded-lg",
        {
          "text-xs px-3 py-2": size === "sm",
          "text-sm px-5 py-2.5": size === "md",
          "text-white bg-primary-700 hover:bg-primary-800 dark:bg-primary-600 dark:hover:bg-primary-700": variant === "primary",
          "text-primary-700 hover:bg-primary-700/20 dark:hover:bg-primary-700/30 ring-2": variant === "outline",
        },
        "focus:ring-4 focus:ring-primary-300 focus:outline-none dark:focus:ring-primary-800",
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;
