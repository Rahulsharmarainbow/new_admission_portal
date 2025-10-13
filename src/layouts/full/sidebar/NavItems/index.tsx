import React from "react";
import { ChildItem } from "../Sidebaritems";
import { SidebarItem } from "flowbite-react";
import { Icon } from "@iconify/react";
import { Link, useLocation } from "react-router";

interface NavItemsProps {
  item: ChildItem;
}

const NavItems: React.FC<NavItemsProps> = ({ item }) => {
  const location = useLocation();
  const pathname = location.pathname;
  const isActive = item.url === pathname;

  return (
    <Link to={item.url} target={item.isPro ? "blank" : "_self"}>
      <SidebarItem
        className={`relative mb-1 sidebar-link py-0 ps-6 pe-4 transition-all duration-300
          ${
            isActive
              ? "bg-[#0084DA] text-white hover:bg-[#0084DA]"
              : "text-dark/90 bg-transparent group/link before:content-[''] before:absolute before:start-0 before:top-0 before:h-full before:w-0 hover:before:w-full before:bg-[#0084DA]/10 before:transition-all before:duration-400 before:rounded-e-full hover:bg-transparent hover:text-[#0084DA]"
          }`}
      >
        <div className="flex items-center justify-between">
          <span className="flex gap-3 items-center">
            {item.icon ? (
              <Icon icon={item.icon} className={`${item.color}`} height={22} />
            ) : (
              <span
                className={`ms-2 me-3 ${
                  isActive
                    ? "rounded-full mx-1.5 bg-white h-[6px] w-[6px]"
                    : "h-[6px] w-[6px] bg-black/40 rounded-full group-hover/link:bg-[#0084DA]"
                }`}
              ></span>
            )}
            <span className="max-w-32 text-ellipsis overflow-x-hidden">{item.name}</span>
          </span>
          {item.isPro && (
            <span className="py-1 px-2 text-[10px] bg-[#0084DA]/20 text-[#0084DA] rounded-full">
              Pro
            </span>
          )}
        </div>
      </SidebarItem>
    </Link>
  );
};

export default NavItems;
