import clsx from "clsx";
import React from "react";

type PropTypes = {
  children: React.ReactNode;
  space?: "md" | "xl";
  className?: string;
};

const KBD = ({ children, space = "md", className }: PropTypes) => {
  return (
    <kbd
      className={clsx(
        space === "xl" ? "px-2" : "px-1",
        "mx-1 rounded-lg border border-gray-200 bg-gray-100 py-0.5 text-xs text-gray-800 dark:border-gray-500 dark:bg-gray-600 dark:text-gray-100",
        className
      )}
    >
      {children}
    </kbd>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export default KBD;
