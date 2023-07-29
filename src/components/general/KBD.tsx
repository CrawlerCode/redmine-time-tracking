import clsx from "clsx";

type PropTypes = {
  text: string;
  space?: "md" | "xl";
  className?: string;
};

const KBD = ({ text, space = "md", className }: PropTypes) => {
  return <kbd className={clsx(space === "xl" ? "px-2" : "px-1", "mx-1 py-0.5 text-xs text-gray-800 bg-gray-100 border border-gray-200 rounded-lg dark:bg-gray-600 dark:text-gray-100 dark:border-gray-500", className)}>{text}</kbd>;
};

// eslint-disable-next-line react-refresh/only-export-components
export default KBD;
