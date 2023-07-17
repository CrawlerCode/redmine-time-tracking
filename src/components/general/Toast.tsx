import clsx from "clsx";

type PropTypes = {
  type: "success" | "error";
  message: string;
  allowClose?: boolean;
  onClose?: () => void;
};

const Toast = ({ type, message, allowClose = true, onClose }: PropTypes) => {
  return (
    <div className="fixed bottom-0 left-0 p-2 w-full z-50">
      <div className="flex items-center w-full p-1 text-gray-700 bg-gray-200 rounded-lg shadow dark:text-gray-300 dark:bg-gray-600" role="alert">
        <div
          className={clsx("inline-flex items-center justify-center flex-shrink-0 w-8 h-8", {
            "text-green-500 bg-green-100 rounded-lg dark:bg-green-800 dark:text-green-200": type === "success",
            "text-red-500 bg-red-100 rounded-lg dark:bg-red-800 dark:text-red-200": type === "error",
          })}
        >
          {type === "success" && (
            <svg aria-hidden="true" className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"></path>
            </svg>
          )}
          {type === "error" && (
            <svg aria-hidden="true" className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
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
            className="ml-auto text-gray-400 hover:text-gray-900 rounded-lg p-1.5 inline-flex h-8 w-8 dark:text-gray-500 dark:hover:text-white focus:ring-2 focus:ring-primary-300 focus:outline-none dark:focus:ring-primary-800"
            aria-label="Close"
            onClick={onClose}
          >
            <svg aria-hidden="true" className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
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
