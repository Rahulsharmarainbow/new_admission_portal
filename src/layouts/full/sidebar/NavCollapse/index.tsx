import React, { useState } from "react";
import { ChildItem } from "../Sidebaritems";
import { useLocation } from "react-router";
import { CustomCollapse } from "../CustomCollapse";
import Dropitems from "../DropItems";

interface NavCollapseProps {
  item: ChildItem;
  activeCollapse?: string | null;
  setActiveCollapse?: (id: string | null) => void;
}

const NavCollapse: React.FC<NavCollapseProps> = ({ item, activeCollapse, setActiveCollapse }) => {
  const location = useLocation();
  const pathname = location.pathname;

  const activeDD = item.children.find((t: { url: string }) => t.url === pathname);
  const isOpen = activeCollapse === item.id; // Controlled open state

  const handleToggle = () => {
    setActiveCollapse?.(isOpen ? null : item.id); // Close others, open current
  };

  const isActive = Boolean(activeDD) || isOpen;

  return (
    <CustomCollapse
      label={item.name}
      open={isOpen}
      onClick={handleToggle}
      icon={item.icon}
      isPro={item.isPro}
      className={`sidebar-link relative mb-1 py-0 ps-6 pe-4 transition-all duration-300 
        ${
          isActive
            ? "bg-[#0084DA]/20 text-[#0084DA] hover:bg-[#0084DA]/20"
            : "group/link before:content-[''] before:absolute before:start-0 before:top-0 before:h-full before:w-0 hover:before:w-full before:bg-[#0084DA]/10 before:transition-all before:duration-400 before:rounded-e-full hover:bg-transparent hover:text-[#0084DA] text-dark/90"
        }`}
    >
      {item.children && (
        <div className={`sidebar-dropdown transition-all ${isOpen ? "max-h-[500px]" : "max-h-0 overflow-hidden"}`}>
          {item.children.map((child: any) => (
            <React.Fragment key={child.id}>
              {child.children ? (
                <NavCollapse
                  item={child}
                  activeCollapse={activeCollapse}
                  setActiveCollapse={setActiveCollapse}
                />
              ) : (
                <Dropitems item={child} />
              )}
            </React.Fragment>
          ))}
        </div>
      )}
    </CustomCollapse>
  );
};

export default NavCollapse;
