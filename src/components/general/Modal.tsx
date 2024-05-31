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
    <div tabIndex={-1} className="fixed inset-0 z-40 flex size-full min-w-[320px] items-center justify-center overflow-y-auto bg-gray-800/50 p-2 animate-in fade-in dark:bg-gray-600/50">
      <div className="relative max-h-full w-full max-w-md" role="dialog">
        <div className="relative rounded-lg bg-background drop-shadow-lg animate-in fade-in zoom-in">
          <div className="p-2.5">
            <div className="mb-2 flex items-start justify-between">
              <h3 className="text-lg font-medium">{title}</h3>
              <button type="button" className="rounded-lg bg-transparent p-1.5 text-sm hover:text-primary focus:outline-none focus:ring-2 focus:ring-primary-focus" onClick={onClose}>
                <svg aria-hidden="true" className="size-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                  <path
                    fillRule="evenodd"
                    d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  />
                </svg>
                <span className="sr-only">Close modal</span>
              </button>
            </div>
            {children}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Modal;
