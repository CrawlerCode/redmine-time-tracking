import clsx from "clsx";
import { useLayoutEffect, useRef } from "react";
import useOnClickOutside from "../../hooks/useOnClickOutside";

type MenuItem = {
  name: string;
  icon: React.ReactNode;
  disabled?: boolean;
  onClick: () => void;
};
type PropTypes = {
  x: number;
  y: number;
  menu: MenuItem[] | MenuItem[][];
  onClose: () => void;
};

const ContextMenu = ({ x, y, menu, onClose }: PropTypes) => {
  const ref = useRef<HTMLDivElement>(null);

  // close on click outside
  useOnClickOutside(ref, onClose);

  // set the correct position
  useLayoutEffect(() => {
    if (ref.current) {
      const { width, height } = ref.current.getBoundingClientRect();
      if (y + height > window.innerHeight) {
        ref.current.style.top = `${y - height}px`;
      }
      if (x + width > window.innerWidth && x - width > 0) {
        ref.current.style.left = `${x - width}px`;
      }
    }
  }, []);

  return (
    <div ref={ref} className="absolute z-20 bg-white border dark:border-0 border-gray-200 divide-y divide-gray-200 dark:divide-gray-600 rounded-lg shadow w-40 dark:bg-gray-700" style={{ top: `${y}px`, left: `${x}px` }} onClick={onClose}>
      {(menu.length > 0 && Array.isArray(menu[0]) && (
        <>
          {(menu as MenuItem[][]).map((group) => (
            <ul className="py-1 text-sm text-gray-700 dark:text-gray-200" aria-labelledby="dropdownDefaultButton">
              {group.map((item) => (
                <li className={clsx("flex px-2 py-1", item.disabled ? "text-gray-300 dark:text-gray-500" : "hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white")} onClick={!item.disabled ? item.onClick : undefined}>
                  <span className="flex justify-center items-center w-4 me-2">{item.icon}</span>
                  {item.name}
                </li>
              ))}
            </ul>
          ))}
        </>
      )) || (
        <ul className="py-1 text-sm text-gray-700 dark:text-gray-200" aria-labelledby="dropdownDefaultButton">
          {(menu as MenuItem[]).map((item) => (
            <li className={clsx("flex px-2 py-1", item.disabled ? "text-gray-300 dark:text-gray-500" : "hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white")} onClick={!item.disabled ? item.onClick : undefined}>
              <span className="flex justify-center items-center w-4 me-2">{item.icon}</span>
              {item.name}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default ContextMenu;
