// import React, { useState } from "react";
// import { Sidebar, SidebarItemGroup, SidebarItems } from "flowbite-react";
// import NavItems from "./NavItems";
// import SimpleBar from "simplebar-react";
// import FullLogo from "../shared/logo/FullLogo";
// import NavCollapse from "./NavCollapse";
// import SidebarContent from "./Sidebaritems";
// import { useAuth } from "src/hook/useAuth";
// import { BaseSidebarContent } from "./BaseSidebarContent";

// const SidebarLayout = () => {
//   const { user } = useAuth();
//   const SidebarContents = BaseSidebarContent();
//   const [activeCollapse, setActiveCollapse] = useState<string | null>(null); // Track which dropdown open

//   return (
//     <div className="xl:block hidden">
//       <Sidebar
//         className="fixed menu-sidebar bg-white dark:bg-darkgray rtl:pe-4 rtl:ps-0 top-[2px]"
//         aria-label="Sidebar with multi-level dropdown example"
//       >
//         <div className="px-5 py-4 flex items-center sidebarlogo">
//           <FullLogo />
//         </div>

//         <SimpleBar className="h-[calc(100vh_-_94px)]">
//           <SidebarItems className="mt-2">
//             <SidebarItemGroup className="sidebar-nav hide-menu">
//               {SidebarContents?.map((item, index) => (
//                 <div className="caption" key={item.heading}>
//                   {item.children?.map((child, index) => (
//                     <React.Fragment key={child.id || index}>
//                       {child.children ? (
//                         <div className="collpase-items">
//                           <NavCollapse
//                             item={child}
//                             activeCollapse={activeCollapse}
//                             setActiveCollapse={setActiveCollapse}
//                           />
//                         </div>
//                       ) : (
//                         <NavItems item={child} />
//                       )}
//                     </React.Fragment>
//                   ))}
//                 </div>
//               ))}
//             </SidebarItemGroup>
//           </SidebarItems>
//         </SimpleBar>
//       </Sidebar>
//     </div>
//   );
// };

// export default SidebarLayout;





import React, { useState } from "react";
import { Sidebar, SidebarItemGroup, SidebarItems } from "flowbite-react";
import SimpleBar from "simplebar-react";
import FullLogo from "../shared/logo/FullLogo";
import NavItems from "./NavItems";
import NavCollapse from "./NavCollapse";
import { BaseSidebarContent } from "./BaseSidebarContent";

interface SidebarLayoutProps {
  isMinimized: boolean;
}

const SidebarLayout: React.FC<SidebarLayoutProps> = ({ isMinimized }) => {
  const SidebarContents = BaseSidebarContent();
  const [activeCollapse, setActiveCollapse] = useState<string | null>(null);

  return (
    <Sidebar
      aria-label="Main navigation"
  className="!w-full !max-w-none border-0"
    >
      {/* Logo */}
      <div className="flex items-center justify-center px-4 py-5 border-b border-gray-100 h-[80px]">
        {isMinimized ? (
          <FullLogo className="h-8 w-8" />
        ) : (
          <FullLogo />
        )}
      </div>

      {/* Sidebar Scroll Area */}
      <SimpleBar className="h-[calc(100vh-80px)] px-3 py-3">
        <SidebarItems>
          <SidebarItemGroup className="space-y-1">
            {SidebarContents?.map((section) => (
              <div key={section.heading}>
                {section.children?.map((child) => (
                  <React.Fragment key={child.id}>
                    {child.children ? (
                      !isMinimized && (
                        <NavCollapse
                          item={child}
                          activeCollapse={activeCollapse}
                          setActiveCollapse={setActiveCollapse}
                        />
                      )
                    ) : (
                      <NavItems item={child} isMinimized={isMinimized} />
                    )}
                  </React.Fragment>
                ))}
              </div>
            ))}
          </SidebarItemGroup>
        </SidebarItems>
      </SimpleBar>
    </Sidebar>
  );
};

export default SidebarLayout;

















// proper working code live wala


// import React, { useState } from "react";
// import { Sidebar, SidebarItemGroup, SidebarItems } from "flowbite-react";
// import NavItems from "./NavItems";
// import SimpleBar from "simplebar-react";
// import FullLogo from "../shared/logo/FullLogo";
// import NavCollapse from "./NavCollapse";
// // import SidebarContent from "./Sidebaritems";
// import { useAuth } from "src/hook/useAuth";
// import { BaseSidebarContent } from "./BaseSidebarContent";

// const SidebarLayout = () => {
//   const { user } = useAuth();
//   const SidebarContents = BaseSidebarContent();
//   console.log("SidebarContents",SidebarContents);
//   const [activeCollapse, setActiveCollapse] = useState<string | null>(null);

//   return (
//     <div className="xl:block hidden">
//       <Sidebar
//         className="fixed menu-sidebar bg-white dark:bg-darkgray rtl:pe-4 rtl:ps-0 top-[20px] left-[20px] bottom-[20px] rounded-2xl shadow-lg border border-gray-200"
//         aria-label="Sidebar with multi-level dropdown example"
//         style={{
//           width: "280px", // Fixed width for card consistency
//           height: "calc(100vh - 40px)", // Adjust height for margins
//         }}
//       >
//         {/* Logo Section with padding */}
//         <div className="px-6 py-5 flex items-center sidebarlogo border-b border-gray-100">
//           <FullLogo />
//         </div>

//         {/* Scrollable Content Area */}
//         <SimpleBar className="h-[calc(100vh_-_140px)] px-4 py-2">
//           <SidebarItems className="mt-2">
//             <SidebarItemGroup className="sidebar-nav hide-menu space-y-1">
//               {SidebarContents?.map((item, index) => (
//                 <div className="caption" key={item.heading}>
//                   {item.children?.map((child, index) => (
//                     <React.Fragment key={child.id || index}>
//                       {child.children ? (
//                         <div className="collpase-items">
//                           <NavCollapse
//                             item={child}
//                             activeCollapse={activeCollapse}
//                             setActiveCollapse={setActiveCollapse}
//                           />
//                         </div>
//                       ) : (
//                         <NavItems item={child} />
//                       )}
//                     </React.Fragment>
//                   ))}
//                 </div>
//               ))}
//             </SidebarItemGroup>
//           </SidebarItems>
//         </SimpleBar>
//       </Sidebar>
//     </div>
//   );
// };

// export default SidebarLayout;








// import React, { useState } from "react";
// import { Sidebar, SidebarItemGroup, SidebarItems } from "flowbite-react";
// import NavItems from "./NavItems";
// import SimpleBar from "simplebar-react";
// import FullLogo from "../shared/logo/FullLogo";
// import NavCollapse from "./NavCollapse";
// import { useAuth } from "src/hook/useAuth";
// import { BaseSidebarContent } from "./BaseSidebarContent";

// interface Props {
//   activeCollapse?: string | null;
//   setActiveCollapse?: (id: string | null) => void;
// }

// const SidebarLayout = ({activeCollapse,setActiveCollapse}:Props) => {
//   const { user } = useAuth();
//   const SidebarContents = BaseSidebarContent();
 

//   return (
//     <div className="xl:block hidden sidebar-layout">
//       <Sidebar
//         className="fixed menu-sidebar bg-white dark:bg-darkgray rtl:pe-4 rtl:ps-0 top-[2px]"
//         aria-label="Sidebar with multi-level dropdown example"
//       >
//         <div className="px-5 py-4 flex items-center sidebarlogo">
//           <FullLogo />
//         </div>

//         <SimpleBar className="h-[calc(100vh_-_94px)]">
//           <SidebarItems className="mt-2">
//             <SidebarItemGroup className="sidebar-nav hide-menu">
//               {SidebarContents?.map((item, index) => (
//                 <div className="caption" key={item.heading}>
//                   {item.children?.map((child, index) => (
//                     <React.Fragment key={child.id || index}>
//                       {child.children ? (
//                         <div className="collpase-items">
//                           <NavCollapse
//                             item={child}
//                             activeCollapse={activeCollapse}
//                             setActiveCollapse={setActiveCollapse}
//                           />
//                         </div>
//                       ) : (
//                         <NavItems item={child} />
//                       )}
//                     </React.Fragment>
//                   ))}
//                 </div>
//               ))}
//             </SidebarItemGroup>
//           </SidebarItems>
//         </SimpleBar>
//       </Sidebar>
//     </div>
//   );
// };

// export default SidebarLayout;



// ye code he jo aapne comment krne ko bla tha

// import React from "react";
// import { Sidebar, SidebarItemGroup, SidebarItems } from "flowbite-react";
// import NavItems from "./NavItems";
// import SimpleBar from "simplebar-react";
// import FullLogo from "../shared/logo/FullLogo";
// import NavCollapse from "./NavCollapse";
// import { useAuth } from "src/hook/useAuth";
// import { BaseSidebarContent } from "./BaseSidebarContent";

// interface Props {
//   activeCollapse?: string | null;
//   setActiveCollapse?: (id: string | null) => void;
// }

// const SidebarLayout = ({activeCollapse, setActiveCollapse}: Props) => {
//   const { user } = useAuth();
//   const SidebarContents = BaseSidebarContent();

//   return (
//     <Sidebar
//       className="h-screen bg-white dark:bg-darkgray border-r border-gray-200"
//       aria-label="Sidebar with multi-level dropdown example"
//     >
//       <div className="px-5 py-4 flex items-center sidebarlogo">
//         <FullLogo />
//       </div>

//       <SimpleBar className="h-[calc(100vh_-_94px)]">
//         <SidebarItems className="mt-2">
//           <SidebarItemGroup className="sidebar-nav">
//             {SidebarContents?.map((item, index) => (
//               <div className="caption" key={item.heading}>
//                 {item.children?.map((child, index) => (
//                   <React.Fragment key={child.id || index}>
//                     {child.children ? (
//                       <div className="collpase-items">
//                         <NavCollapse
//                           item={child}
//                           activeCollapse={activeCollapse}
//                           setActiveCollapse={setActiveCollapse}
//                         />
//                       </div>
//                     ) : (
//                       <NavItems item={child} />
//                     )}
//                   </React.Fragment>
//                 ))}
//               </div>
//             ))}
//           </SidebarItemGroup>
//         </SidebarItems>
//       </SimpleBar>
//     </Sidebar>
//   );
// };

// export default SidebarLayout;