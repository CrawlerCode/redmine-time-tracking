import clsx from "clsx";

type PropTypes = {
  type: "success" | "error";
  message: string;
  allowClose?: boolean;
  onClose?: () => void;
};

const Toast = ({ type, message, allowClose = true, onClose }: PropTypes) => {
  return (
    <div className="fixed bottom-0 left-0 z-50 w-full p-2">
      <div className="flex w-full items-center rounded-lg bg-gray-200 p-1 text-gray-700 shadow dark:bg-gray-600 dark:text-gray-300" role="alert">
        <div
          className={clsx("inline-flex h-8 w-8 shrink-0 items-center justify-center", {
            "text-green-700 bg-green-100 rounded-lg dark:bg-green-800 dark:text-green-200": type === "success",
            "text-red-700 bg-red-100 rounded-lg dark:bg-red-800 dark:text-red-200": type === "error",
          })}
        >
          {type === "success" && (
            <svg aria-hidden="true" className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"></path>
            </svg>
          )}
          {type === "error" && (
            <svg aria-hidden="true" className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
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
            className="ml-auto inline-flex h-8 w-8 rounded-lg p-1.5 text-gray-400 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary-300 dark:text-gray-500 dark:hover:text-white dark:focus:ring-primary-800"
            aria-label="Close"
            onClick={onClose}
          >
            <svg aria-hidden="true" className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
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
