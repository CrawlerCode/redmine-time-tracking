import { Link, useLocation } from "@tanstack/react-router";
import React from "react";
import { NavigationMenu, NavigationMenuItem, NavigationMenuLink, NavigationMenuList } from "../ui/navigation-menu";

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
    <NavigationMenu className="border-primary max-w-screen border-b p-1.5">
      <NavigationMenuList className="justify-start">
        {navigation.map((item) => (
          <NavigationMenuItem key={item.href}>
            <NavigationMenuLink render={<Link to={item.href} />} data-active={location.pathname === item.href}>
              {item.icon}
              <span className="truncate max-[21rem]:max-w-[3rem]">{item.name}</span>
            </NavigationMenuLink>
          </NavigationMenuItem>
        ))}
      </NavigationMenuList>
    </NavigationMenu>
  );
};

export default Navbar;
