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
    <nav className="border-primary bg-background fixed top-0 w-full border-b-2 p-1.5">
      <ul className="-mb-px flex gap-x-1 text-center text-sm font-medium text-gray-500 dark:text-gray-400">
        {navigation.map((item) => (
          <li key={item.href}>
            <Link
              to={item.href}
              className={clsx(
                "inline-flex items-center gap-x-1 px-1 py-2",
                location.pathname === item.href ? "text-primary" : "hover:text-gray-600 dark:hover:text-gray-300",
                "select-none focus:outline-hidden"
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
