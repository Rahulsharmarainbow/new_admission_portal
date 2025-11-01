// import React from 'react';
// import { ChildItem } from '../Sidebaritems';
// import { SidebarItem } from 'flowbite-react';
// import { Icon } from '@iconify/react';
// import { Link, useLocation } from 'react-router';

// interface NavItemsProps {
//   item: ChildItem;
// }
// const Dropitems: React.FC<NavItemsProps> = ({ item }) => {
//   const location = useLocation();
//   const pathname = location.pathname;

//   return (
//     <>
//     <Link to={item.url} target={item.isPro ? 'blank' : '_self'}>
//       <SidebarItem
        
//         className={`realtive max-h-10 relative  py-2 ps-6 pe-4 ${
//           item.url == pathname
//             ? `text-primary  ${
//                 item.icon ? ` bg-primary/10   hover:bg-primary/10 ` : 'bg-transparent '
//               }   active `
//             : ` text-dark/95 bg-transparent  group/link  `
//         } `}
//       >
//         <div className="flex items-center justify-between">
//           <span className="flex gap-3 align-center items-center">
//             {item.icon ? (
//               <Icon icon={item.icon} className={`${item.color}`} height={22} />
//             ) : (
//               <span
//                 className={`ms-2 me-2 ${
//                   item.url == pathname
//                     ? 'rounded-full mx-1.5 group-hover/link:bg-dark bg-dark dark:bg-white  h-[6px] w-[6px]'
//                     : 'h-[6px] w-[6px] bg-black/40  rounded-full  group-hover/link:bg-dark '
//                 } `}
//               ></span>
//             )}
//             <span className={`max-w-40 text-ellipsis overflow-x-hidden`}>{item.name}</span>
//           </span>
//           {item.isPro ? (
//             <span className="py-1 px-2 text-[10px] bg-secondary/20 text-secondary rounded-full">
//               Pro
//             </span>
//           ) : null}
//         </div>
//       </SidebarItem>
//       </Link>
//     </>
//   );
// };

// export default Dropitems;



















import React from 'react';
import { ChildItem } from '../Sidebaritems';
import { SidebarItem } from 'flowbite-react';
import { Icon } from '@iconify/react';
import { Link, useLocation } from 'react-router';

interface NavItemsProps {
  item: ChildItem;
}

const Dropitems: React.FC<NavItemsProps> = ({ item }) => {
  const location = useLocation();
  const pathname = location.pathname;

  const isActive = item.url === pathname;

  return (
    <Link to={item.url} target={item.isPro ? '_blank' : '_self'}>
      <SidebarItem
        className={`relative py-3 px-4 my-1 transition-all duration-200 rounded-lg
          ${
            isActive
              ? "text-[#0084DA] bg-pink-50 font-medium"
              : "text-gray-600 bg-transparent hover:text-[#0084DA] hover:bg-pink-50 font-normal group/link"
          }`}
        style={{
          fontSize: "14px",
        }}
      >
        <div className="flex items-center justify-between w-full">
          <span className="flex gap-3 items-center min-w-0">
           {/* {item.icon ? (
  <Icon 
    icon={item.icon} 
    className={`${isActive ? "text-[#0084DA]" : "text-gray-500 group-hover/link:text-[#0084DA]"}`} 
    height={10} 
    width={10}
  />
) : (
  // Modern Circle Outline
  <div className={`ms-1 me-2 transition-all duration-200 border-2 rounded-full ${
    isActive
      ? 'w-2 h-2 border-[#0084DA] bg-[#0084DA]'
      : 'w-2 h-2 border-gray-300 bg-transparent group-hover/link:w-2.5 group-hover/link:h-2.5 group-hover/link:border-[#0084DA]'
  }`} />
)} */}

{/* {item.icon ? (
  <Icon 
    icon={item.icon} 
    className={`${isActive ? "text-[#0084DA]" : "text-gray-500 group-hover/link:text-[#0084DA]"}`} 
    height={20} 
    width={20}
  />
) : (
  // Small Chevron Right
  <svg 
    className={`ms-1 me-2 transition-all duration-200 ${
      isActive ? "text-[#0084DA] scale-110" : "text-gray-400 group-hover/link:text-[#0084DA]"
    }`} 
    width="12" 
    height="12" 
    viewBox="0 0 16 16" 
    fill="none"
  >
    <path 
      d="M6 12L10 8L6 4" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round"
    />
  </svg>
)} */}


{item.icon ? (
  <Icon 
    icon={item.icon} 
    className={`${isActive ? "text-[#0084DA]" : "text-gray-500 group-hover/link:text-[#0084DA]"}`} 
    height={20} 
    width={20}
  />
) : (
  // Gradient Dot
  <div className={`ms-1 me-2 transition-all duration-300 rounded-full ${
    isActive
      ? 'w-2 h-2 bg-gradient-to-r from-[#0084DA] to-[#00C2FF] shadow-sm'
      : 'w-2 h-2 bg-gradient-to-r from-gray-300 to-gray-400 group-hover/link:w-2 group-hover/link:h-2 group-hover/link:from-[#0084DA] group-hover/link:to-[#00C2FF]'
  }`} />
)}
            <span 
              className={`min-w-0 flex-1 truncate ${
                isActive ? 'text-[#0084DA]' : 'text-inherit'
              }`}
              style={{
                fontSize: "14px",
                fontWeight: isActive ? "500" : "400"
              }}
            >
              {item.name}
            </span>
          </span>
          
          {item.isPro && (
            <span 
              className="py-1 px-2 rounded-full border whitespace-nowrap flex-shrink-0 ml-2 text-xs font-medium"
              style={{
                backgroundColor: "#FFF2ED",
                color: "#FF6B35",
                borderColor: "#FFD1C2"
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

export default Dropitems;














// import React from 'react';
// import { ChildItem } from '../Sidebaritems';
// import { SidebarItem } from 'flowbite-react';
// import { Icon } from '@iconify/react';
// import { Link, useLocation } from 'react-router';

// interface NavItemsProps {
//   item: ChildItem;
// }

// const Dropitems: React.FC<NavItemsProps> = ({ item }) => {
//   const location = useLocation();
//   const pathname = location.pathname;

//   const isActive = item.url === pathname;

//   return (
//     <div className="mb-1">
//       <Link to={item.url} target={item.isPro ? '_blank' : '_self'}>
//         <SidebarItem
//           className={`w-full py-3 px-4 transition-all duration-200 rounded-lg border border-gray-100 shadow-sm
//             ${
//               isActive
//                 ? "text-[#0084DA] bg-pink-50 border-pink-200 font-medium shadow-md"
//                 : "text-gray-600 bg-white hover:text-[#0084DA] hover:bg-pink-50 hover:border-pink-100 hover:shadow-md font-normal group/link"
//             }`}
//           style={{
//             fontSize: "14px",
//           }}
//         >
//           <div className="flex items-center justify-between w-full">
//             <span className="flex gap-3 items-center min-w-0">
//               {item.icon ? (
//                 <Icon 
//                   icon={item.icon} 
//                   className={`${isActive ? "text-[#0084DA]" : "text-gray-500 group-hover/link:text-[#0084DA]"}`} 
//                   height={20} 
//                   width={20}
//                 />
//               ) : (
//                 <span
//                   className={`ms-1 me-2 transition-all duration-200 ${
//                     isActive
//                       ? 'bg-[#0084DA] h-2 w-2 rounded-full'
//                       : 'h-2 w-2 bg-gray-400 rounded-full group-hover/link:bg-[#0084DA]'
//                   }`}
//                 ></span>
//               )}
//               <span 
//                 className={`min-w-0 flex-1 truncate ${
//                   isActive ? 'text-[#0084DA]' : 'text-inherit'
//                 }`}
//                 style={{
//                   fontSize: "14px",
//                   fontWeight: isActive ? "500" : "400"
//                 }}
//               >
//                 {item.name}
//               </span>
//             </span>
            
//             {item.isPro && (
//               <span 
//                 className="py-1 px-2 rounded-full whitespace-nowrap flex-shrink-0 ml-2 text-xs font-medium shadow-sm"
//                 style={{
//                   backgroundColor: "#FFF2ED",
//                   color: "#FF6B35",
//                   border: "1px solid #FFD1C2"
//                 }}
//               >
//                 Pro
//               </span>
//             )}
//           </div>
//         </SidebarItem>
//       </Link>
//     </div>
//   );
// };

// export default Dropitems;