import clsx from "clsx";

type PropTypes = {
  variant: "loading" | "success" | "danger";
};

const Indicator = ({ variant }: PropTypes) => {
  return (
    <span className="relative flex h-3 w-3">
      <span
        className={clsx("absolute inline-flex h-full w-full animate-ping rounded-full", {
          "bg-blue-500/75 dark:bg-blue-700/75": variant === "loading",
          "bg-green-500/75 dark:bg-green-700/75": variant === "success",
          "bg-red-500/75 dark:bg-red-700/75": variant === "danger",
        })}
      ></span>
      <span
        className={clsx("relative inline-flex h-3 w-3 rounded-full", {
          "bg-blue-600 dark:bg-blue-800": variant === "loading",
          "bg-green-600 dark:bg-green-800": variant === "success",
          "bg-red-600 dark:bg-red-800": variant === "danger",
        })}
      ></span>
    </span>
  );
};

export default Indicator;
