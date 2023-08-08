import clsx from "clsx";

type PropTypes = {
  variant: "primary" | "success" | "danger";
};

const Indicator = ({ variant }: PropTypes) => {
  return (
    <span className="relative flex h-3 w-3">
      <span
        className={clsx("absolute inline-flex h-full w-full animate-ping rounded-full", {
          "bg-primary-500/75 dark:bg-primary-700/75": variant === "primary",
          "bg-green-500/75 dark:bg-green-700/75": variant === "success",
          "bg-red-500/75 dark:bg-red-700/75": variant === "danger",
        })}
      ></span>
      <span
        className={clsx("relative inline-flex h-3 w-3 rounded-full", {
          "bg-primary-600 dark:bg-primary-800": variant === "primary",
          "bg-green-600 dark:bg-green-800": variant === "success",
          "bg-red-600 dark:bg-red-800": variant === "danger",
        })}
      ></span>
    </span>
  );
};

export default Indicator;
