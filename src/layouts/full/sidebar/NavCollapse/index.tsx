// import React, { useState } from "react";
// import { ChildItem } from "../Sidebaritems";
// import { useLocation } from "react-router";
// import { CustomCollapse } from "../CustomCollapse";
// import Dropitems from "../DropItems";

// interface NavCollapseProps {
//   item: ChildItem;
//   activeCollapse?: string | null;
//   setActiveCollapse?: (id: string | null) => void;
// }

// const NavCollapse: React.FC<NavCollapseProps> = ({ item, activeCollapse, setActiveCollapse }) => {
//   const location = useLocation();
//   const pathname = location.pathname;
//   const activeDD = item.children.find((t: { url: string }) => t.url === pathname);
//   const isOpen = activeCollapse === item.id; // Controlled open state

//   const handleToggle = () => {
//     setActiveCollapse?.(isOpen ? null : item.id); // Close others, open current
//   };

//   const isActive = Boolean(activeDD) || isOpen;

//   return (
//     <CustomCollapse
//       label={item.name}
//       open={isOpen}
//       onClick={handleToggle}
//       icon={item.icon}
//       isPro={item.isPro}
//       className={`sidebar-link relative mb-1 py-0 ps-6 pe-4 transition-all duration-300 
//         ${
//           isActive
//             ? "bg-[#0084DA]/20 text-[#0084DA] hover:bg-[#0084DA]/20"
//             : "group/link before:content-[''] before:absolute before:start-0 before:top-0 before:h-full before:w-0 hover:before:w-full before:bg-[#0084DA]/10 before:transition-all before:duration-400 before:rounded-e-full hover:bg-transparent hover:text-[#0084DA] text-dark/90"
//         }`}
//     >
//       {item.children && (
//         <div className={`sidebar-dropdown transition-all ${isOpen ? "max-h-[500px]" : "max-h-0 overflow-hidden"}`}>
//           {item.children.map((child: any) => (
//             <React.Fragment key={child.id}>
//               {child.children ? (
//                 <NavCollapse
//                   item={child}
//                   activeCollapse={activeCollapse}
//                   setActiveCollapse={setActiveCollapse}
//                 />
//               ) : (
//                 <Dropitems item={child} />
//               )}
//             </React.Fragment>
//           ))}
//         </div>
//       )}
//     </CustomCollapse>
//   );
// };

// export default NavCollapse;

















// import React from "react";
// import { ChildItem } from "../Sidebaritems";
// import { useLocation } from "react-router";
// import { CustomCollapse } from "../CustomCollapse";
// import Dropitems from "../DropItems";

// interface NavCollapseProps {
//   item: ChildItem;
//   activeCollapse?: string | null;
//   setActiveCollapse?: (id: string | null) => void;
// }

// const NavCollapse: React.FC<NavCollapseProps> = ({ 
//   item, 
//   activeCollapse, 
//   setActiveCollapse 
// }) => {
//   const location = useLocation();
//   const pathname = location.pathname;
//   const activeDD = item.children?.find((t: { url: string }) => t.url === pathname);
//   const isOpen = activeCollapse === item.id;

//   const handleToggle = () => {
//     setActiveCollapse?.(isOpen ? null : item.id);
//   };

//   const isActive = Boolean(activeDD) || isOpen;

//   return (
//     <CustomCollapse
//       label={item.name}
//       open={isOpen}
//       onClick={handleToggle}
//       icon={item.icon}
//       isPro={item.isPro}
//       className={`sidebar-link relative mb-1 py-3 px-4 transition-all duration-300 rounded-lg
//         ${
//           isActive
//             ? "bg-pink-50 text-[#0084DA] font-semibold border-l-4 border-[#0084DA]"
//             : "group/link text-gray-700 hover:text-[#0084DA] hover:bg-pink-50 font-normal"
//         }`}
//       style={{
//         fontSize: "14px",
//       }}
//     >
//       {item.children && (
//         <div 
//           className={`sidebar-dropdown transition-all duration-300 ${
//             isOpen ? "max-h-[500px] opacity-100" : "max-h-0 opacity-0 overflow-hidden"
//           }`}
//           style={{
//             marginLeft: "0.5rem",
//           }}
//         >
//           {item.children.map((child: any) => (
//             <React.Fragment key={child.id}>
//               {child.children ? (
//                 <NavCollapse
//                   item={child}
//                   activeCollapse={activeCollapse}
//                   setActiveCollapse={setActiveCollapse}
//                 />
//               ) : (
//                 <Dropitems item={child} />
//               )}
//             </React.Fragment>
//           ))}
//         </div>
//       )}
//     </CustomCollapse>
//   );
// };

// export default NavCollapse;




















import React from "react";
import { ChildItem } from "../Sidebaritems";
import { useLocation } from "react-router";
import { Icon } from "@iconify/react";
import Dropitems from "../DropItems";

interface NavCollapseProps {
  item: ChildItem;
  activeCollapse?: string | null;
  setActiveCollapse?: (id: string | null) => void;
}

const NavCollapse: React.FC<NavCollapseProps> = ({ 
  item, 
  activeCollapse, 
  setActiveCollapse 
}) => {
  const location = useLocation();
  const pathname = location.pathname;
  const activeDD = item.children?.find((t: { url: string }) => t.url === pathname);
  const isOpen = activeCollapse === item.id;

  const handleToggle = () => {
    setActiveCollapse?.(isOpen ? null : item.id);
  };

  const isActive = Boolean(activeDD) || isOpen;

  return (
    <div className="mb-2">
      {/* Main Menu Item */}
      <div
        className={`w-full py-3 px-4 transition-all duration-300 rounded-lg flex items-center justify-between cursor-pointer group
          ${
            isActive
              ? "bg-pink-50 text-[#0084DA] font-semibold"
              : "text-gray-700 hover:text-[#0084DA] hover:bg-pink-50 font-normal"
          }`}
        onClick={handleToggle}
      >
        {/* Left side - Icon and Text (Priority to text) */}
        <div className="flex items-center flex-1 min-w-0 mr-3">
          {item.icon && (
            <Icon 
              icon={item.icon} 
              className="flex-shrink-0 mr-3" 
              height={20} 
              width={20} 
            />
          )}
          <span className="text-sm font-medium truncate flex-1">
            {item.name}
          </span>
        </div>

        {/* Right side - Pro badge and Arrow */}
        <div className="flex items-center flex-shrink-0 space-x-2">
          {item.isPro && (
            <span className="py-1 px-2 rounded-full bg-orange-100 text-orange-600 text-xs font-medium whitespace-nowrap">
              Pro
            </span>
          )}
          {/* Fixed position arrow - never overlaps text */}
          <div className="flex-shrink-0 w-4 h-4 flex items-center justify-center">
            <svg
              className={`transform transition-transform duration-200 ${
                isOpen ? "rotate-180" : "rotate-0"
              }`}
              width="16"
              height="16"
              viewBox="0 0 16 16"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M4 6L8 10L12 6"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
        </div>
      </div>

      {/* Dropdown Content */}
      {item.children && (
        <div 
          className={`transition-all duration-300 ${
            isOpen ? "max-h-[500px] opacity-100 mt-2" : "max-h-0 opacity-0 overflow-hidden"
          }`}
        >
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
    </div>
  );
};

export default NavCollapse;


