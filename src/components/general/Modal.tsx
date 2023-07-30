import useHotKey from "../../hooks/useHotkey";

type PropTypes = {
  title: string;
  children: React.ReactNode;
  onClose: () => void;
};

const Modal = ({ title, children, onClose }: PropTypes) => {
  /**
   * On "Escape" => close
   */
  useHotKey(onClose, { key: "Escape" });

  return (
    <div tabIndex={-1} className="fixed inset-0 flex items-center justify-center z-40 w-full p-4 overflow-y-auto h-full bg-gray-800/50 dark:bg-gray-600/50 animate-in fade-in">
      <div className="relative w-full max-w-md max-h-full">
        <div className="relative rounded-lg drop-shadow-lg bg-white dark:bg-gray-800 animate-in fade-in zoom-in">
          <button
            type="button"
            className="absolute top-3 right-2.5 text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center dark:hover:bg-gray-800 dark:hover:text-white"
            onClick={onClose}
          >
            <svg aria-hidden="true" className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
              <path
                fillRule="evenodd"
                d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                clipRule="evenodd"
              ></path>
            </svg>
            <span className="sr-only">Close modal</span>
          </button>
          <div className="p-3">
            <h3 className="mb-4 text-xl font-medium text-gray-900 dark:text-white">{title}</h3>
            {children}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Modal;
