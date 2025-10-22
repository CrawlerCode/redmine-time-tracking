import React from "react";
import { Link, useLocation } from "react-router-dom";
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
    <NavigationMenu className="border-primary max-w-screen border-b" viewport={false}>
      <NavigationMenuList>
        {navigation.map((item) => (
          <NavigationMenuItem key={item.href}>
            <NavigationMenuLink asChild data-active={location.pathname === item.href} className="inline-flex flex-row items-center">
              <Link to={item.href}>
                {item.icon}
                <span className="truncate max-[21rem]:max-w-[3rem]">{item.name}</span>
              </Link>
            </NavigationMenuLink>
          </NavigationMenuItem>
        ))}
      </NavigationMenuList>
    </NavigationMenu>
  );
};

export default Navbar;
