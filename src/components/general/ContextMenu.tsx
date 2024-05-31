import clsx from "clsx";
import React, { useLayoutEffect, useRef, useState } from "react";
import useOnClickOutside from "../../hooks/useOnClickOutside";

type MenuItem = {
  name: string;
  icon: React.ReactNode;
  disabled?: boolean;
  onClick: () => void;
};
type PropTypes = {
  menu: MenuItem[] | MenuItem[][];
  children: React.ReactNode;
};

const ContextMenu = ({ menu, children }: PropTypes) => {
  const [position, setPosition] = useState<{ x: number; y: number } | undefined>(undefined);

  const ref = useRef<HTMLDivElement>(null);

  // close on click outside
  useOnClickOutside(ref, () => setPosition(undefined));

  // set the correct position
  useLayoutEffect(() => {
    if (ref.current && position) {
      const { width, height } = ref.current.getBoundingClientRect();
      if (position.y + height > window.innerHeight) {
        ref.current.style.top = `${position.y - height}px`;
      }
      if (position.x + width > window.innerWidth && position.x - width > 0) {
        ref.current.style.left = `${position.x - width}px`;
      }
    }
  }, [ref, position]);

  return (
    <>
      <div
        onContextMenu={(e) => {
          e.preventDefault();
          setPosition({ x: e.pageX, y: e.pageY });
        }}
      >
        {children}
      </div>
      {position && (
        <div
          ref={ref}
          role="menu"
          className="absolute z-20 w-40 divide-y divide-gray-200 rounded-lg border border-gray-200 bg-background shadow dark:divide-gray-600 dark:border-gray-600"
          style={{ top: `${position.y}px`, left: `${position.x}px` }}
          onClick={() => setPosition(undefined)}
        >
          {(menu.length > 0 && Array.isArray(menu[0]) && (
            <>
              {(menu as MenuItem[][]).map((group, i) => (
                <ul className="py-1 text-sm text-gray-700 dark:text-gray-200" key={i}>
                  {group.map((item) => (
                    <li
                      role="menuitem"
                      className={clsx("flex px-2 py-1", item.disabled ? "text-text-disabled" : "hover:bg-background-hover")}
                      onClick={!item.disabled ? item.onClick : undefined}
                      key={item.name}
                    >
                      <span className="me-2 flex w-4 items-center justify-center">{item.icon}</span>
                      {item.name}
                    </li>
                  ))}
                </ul>
              ))}
            </>
          )) || (
            <ul className="py-1 text-sm text-gray-700 dark:text-gray-200">
              {(menu as MenuItem[]).map((item) => (
                <li
                  role="menuitem"
                  className={clsx("flex px-2 py-1", item.disabled ? "text-text-disabled" : "hover:bg-background-hover")}
                  onClick={!item.disabled ? item.onClick : undefined}
                  key={item.name}
                >
                  <span className="me-2 flex w-4 items-center justify-center">{item.icon}</span>
                  {item.name}
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </>
  );
};

export default ContextMenu;
