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
    <nav className="sticky top-0 z-10 border-b border-gray-200 bg-white p-1 dark:border-gray-700 dark:bg-gray-800">
      <ul className="-mb-px flex flex-wrap gap-x-2 text-center text-sm font-medium text-gray-500 dark:text-gray-400">
        {navigation.map((item) => (
          <li key={item.href}>
            <Link
              to={item.href}
              className={clsx(
                "inline-flex items-center gap-x-1 rounded-t-lg p-2",
                location.pathname === item.href
                  ? "border-b-2 border-primary-600 text-primary-600 dark:border-primary-500 dark:text-primary-500"
                  : "border-b-2 border-transparent hover:text-gray-600 dark:hover:text-gray-300",
                "select-none focus:outline-none focus:ring-2 focus:ring-primary-300 dark:focus:ring-primary-600"
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
