import clsx from "clsx";
import React from "react";
import { Link, useLocation } from "react-router-dom";

type NavItem = {
  href: string;
  name: string;
  icon: React.ReactNode;
};

type PropTypes = {
  navigation: NavItem[];
};

const Navbar = ({ navigation }: PropTypes) => {
  const location = useLocation();

  return (
    <nav className="sticky top-0 z-10 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 p-1">
      <ul className="flex flex-wrap gap-x-2 -mb-px text-sm font-medium text-center text-gray-500 dark:text-gray-400">
        {navigation.map((item) => (
          <li key={item.href}>
            <Link
              to={item.href}
              className={clsx(
                "inline-flex items-center gap-x-1 p-2 rounded-t-lg",
                location.pathname === item.href ? "text-primary-600 border-b-2 border-primary-600 dark:text-primary-500 dark:border-primary-500" : "border-b-2 border-transparent hover:text-gray-600 hover:border-gray-30 dark:hover:text-gray-300",
                "focus:ring-2 focus:ring-primary-300 focus:outline-none dark:focus:ring-primary-600 select-none"
              )}
              tabIndex={-1}
            >
              {item.icon}
              {item.name}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
};

export default Navbar;
