// import React from "react";
// import { ChildItem } from "../Sidebaritems";
// import { SidebarItem } from "flowbite-react";
// import { Icon } from "@iconify/react";
// import { Link, useLocation } from "react-router";

// interface NavItemsProps {
//   item: ChildItem;
// }

// const NavItems: React.FC<NavItemsProps> = ({ item }) => {
//   const location = useLocation();
//   const pathname = location.pathname;
//   const isActive = item.url === pathname;

//   // return (
//   //   <Link to={item.url} target={item.isPro ? "blank" : "_self"}>
//   //     <SidebarItem
//   //       className={`relative mb-1 sidebar-link py-0 ps-6 pe-4 transition-all duration-300
//   //         ${
//   //           isActive
//   //             ? "bg-[#0084DA] text-white hover:bg-[#0084DA]"
//   //             : "text-dark/90 bg-transparent group/link before:content-[''] before:absolute before:start-0 before:top-0 before:h-full before:w-0 hover:before:w-full before:bg-[#0084DA]/10 before:transition-all before:duration-400 before:rounded-e-full hover:bg-transparent hover:text-[#0084DA]"
//   //         }`}
//   //     >
//   //       <div className="flex items-center justify-between">
//   //         <span className="flex gap-3 items-center">
//   //           {item.icon ? (
//   //             <Icon icon={item.icon} className={`${item.color}`} height={22} />
//   //           ) : (
//   //             <span
//   //               className={`ms-2 me-3 ${
//   //                 isActive
//   //                   ? "rounded-full mx-1.5 bg-white h-[6px] w-[6px]"
//   //                   : "h-[6px] w-[6px] bg-black/40 rounded-full group-hover/link:bg-[#0084DA]"
//   //               }`}
//   //             ></span>
//   //           )}
//   //           <span className="max-w-32 text-ellipsis overflow-x-hidden">{item.name}</span>
//   //         </span>
//   //         {item.isPro && (
//   //           <span className="py-1 px-2 text-[10px] bg-[#0084DA]/20 text-[#0084DA] rounded-full">
//   //             Pro
//   //           </span>
//   //         )}
//   //       </div>
//   //     </SidebarItem>
//   //   </Link>
//   // );
// return (
//   <Link to={item.url} target={item.isPro ? "_blank" : "_self"}>
//     <SidebarItem
//       className={`relative mb-1 sidebar-link py-2 ps-5 pe-4 transition-all duration-300 rounded-lg
//         ${
//           isActive
//             ? "text-[#0084DA] bg-pink-50 font-semibold"
//             : "text-gray-700  hover:text-[#0084DA] hover:bg-pink-50 font-normal"
//         }`}
//     >
//       <div className="flex items-center justify-between">
//         <span className="flex gap-3 items-center">
//           {item.icon ? (
//             <Icon
//               icon={item.icon}
//               className={`${
//                 isActive ? "text-[#0084DA]" : "text-gray-500 group-hover/link:text-[#0084DA]"
//               }`}
//               height={20}
//             />
//           ) : (
//             <span
//               className={`ms-2 me-3 transition-all duration-300 rounded-full ${
//                 isActive
//                   ? "w-2 h-2 bg-gradient-to-r from-[#0084DA] to-[#00C2FF]"
//                   : "w-2 h-2 bg-gray-300 group-hover/link:from-[#0084DA] group-hover/link:to-[#00C2FF]"
//               }`}
//             ></span>
//           )}
//           <span
//             className={`truncate ${
//               isActive ? "text-[#0084DA]" : "text-inherit"
//             }`}
//             style={{ fontSize: "14px", fontWeight: isActive ? "500" : "400" }}
//           >
//             {item.name}
//           </span>
//         </span>

//         {item.isPro && (
//           <span
//             className="py-1 px-2 text-[10px] rounded-full border whitespace-nowrap flex-shrink-0 ml-2 font-medium"
//             style={{
//               backgroundColor: "#FFF2ED",
//               color: "#FF6B35",
//               borderColor: "#FFD1C2",
//             }}
//           >
//             Pro
//           </span>
//         )}
//       </div>
//     </SidebarItem>
//   </Link>
// );

// };

// export default NavItems;







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
    <Link to={item.url} target={item.isPro ? "_blank" : "_self"}>
      <SidebarItem
        className={`relative py-3 px-4  transition-all duration-200 rounded-lg
          ${
            isActive
              ? "bg-pink-50 text-[#0084DA] font-semibold"
              : "text-gray-700 hover:text-[#0084DA] hover:bg-pink-50 font-normal"
          }`}
        style={{
          fontSize: "14px",
        }}
      >
        <div className="flex items-center justify-between w-full">
          {/* Icon and Text */}
          <span className="flex gap-3 items-center min-w-0">
            {item.icon ? (
              <Icon
                icon={item.icon}
                className={`transition-colors duration-200 ${
                  isActive
                    ? "text-[#0084DA]"
                    : "text-gray-700 group-hover/link:text-[#0084DA]"
                }`}
                height={20}
                width={20}
              />
            ) : (
              <div
                className={`ms-1 me-2 transition-all duration-300 rounded-full ${
                  isActive
                    ? "w-2 h-2 bg-gradient-to-r from-[#0084DA] to-[#00C2FF] shadow-sm"
                    : "w-2 h-2 bg-gradient-to-r from-gray-300 to-gray-400 group-hover/link:from-[#0084DA] group-hover/link:to-[#00C2FF]"
                }`}
              />
            )}
            <span
              className={`min-w-0 flex-1 truncate ${
                isActive ? "text-[#0084DA]" : "text-gray-700"
              }`}
              style={{
                fontSize: "14px",
                fontWeight: isActive ? "600" : "500",
              }}
            >
              {item.name}
            </span>
          </span>

          {/* Pro Badge */}
          {item.isPro && (
            <span
              className="py-1 px-2 rounded-full border whitespace-nowrap flex-shrink-0 ml-2 text-xs font-medium"
              style={{
                backgroundColor: "#FFF2ED",
                color: "#FF6B35",
                borderColor: "#FFD1C2",
              }}
            >
              Pro
            </span>
          )}
        </div>
      </SidebarItem>
    </Link>
  );
};

export default NavItems;
