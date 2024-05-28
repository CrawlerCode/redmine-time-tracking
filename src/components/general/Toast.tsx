import clsx from "clsx";

type PropTypes = {
  type: "success" | "error";
  message: string;
  allowClose?: boolean;
  autoClose?: number;
  onClose?: () => void;
};

const Toast = ({ type, message, allowClose = true, autoClose, onClose }: PropTypes) => {
  if (autoClose) setTimeout(() => onClose?.(), autoClose);

  return (
    <div className="fixed bottom-0 left-0 z-50 w-full p-2">
      <div className="flex w-full items-center rounded-lg bg-background-inner p-1 shadow" role="alert">
        <div
          className={clsx("inline-flex size-8 shrink-0 items-center justify-center", {
            "rounded-lg bg-green-100 text-green-700 dark:bg-green-800 dark:text-green-200": type === "success",
            "rounded-lg bg-red-100 text-red-700 dark:bg-red-800 dark:text-red-200": type === "error",
          })}
        >
          {type === "success" && (
            <svg aria-hidden="true" className="size-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"></path>
            </svg>
          )}
          {type === "error" && (
            <svg aria-hidden="true" className="size-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
              <path
                fillRule="evenodd"
                d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                clipRule="evenodd"
              ></path>
            </svg>
          )}
        </div>
        <div className="ml-3 text-sm font-normal">{message}</div>
        {allowClose && (
          <button
            type="button"
            className="ml-auto inline-flex size-8 rounded-lg p-1.5 hover:text-primary focus:outline-none focus:ring-2 focus:ring-primary-focus"
            aria-label="Close"
            onClick={onClose}
          >
            <svg aria-hidden="true" className="size-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
              <path
                fillRule="evenodd"
                d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                clipRule="evenodd"
              ></path>
            </svg>
          </button>
        )}
      </div>
    </div>
  );
};

export default Toast;
