

import { FC, useState } from "react";
import { Outlet } from "react-router";
import { Drawer } from "flowbite-react";
import SidebarLayout from "./sidebar/Sidebar";
import Header from "./header/Header";

const FullLayout: FC = () => {
  const [isSidebarMinimized, setIsSidebarMinimized] = useState(false);
  const [isMobileDrawerOpen, setIsMobileDrawerOpen] = useState(false);

  const toggleSidebar = () => setIsSidebarMinimized((prev) => !prev);
  const toggleMobileDrawer = () => setIsMobileDrawerOpen((prev) => !prev);

  return (
    <div className="flex w-full min-h-screen bg-[#f3f7fb]">

      {/* DESKTOP SIDEBAR – SAME RESPONSIVE RULE */}
      <div
        className={`
          hidden lg:block
          transition-all duration-300
          ${isSidebarMinimized ? "w-0" : "w-[260px]"}
          overflow-hidden shrink-0
          fixed top-0 left-0 h-screen z-40
        `}
      >
        <SidebarLayout isMinimized={isSidebarMinimized} />
      </div>

      {/* MOBILE DRAWER – NO CHANGE */}
      <Drawer
        open={isMobileDrawerOpen}
        onClose={() => setIsMobileDrawerOpen(false)}
        position="left"
        className="lg:hidden"
      >
        <SidebarLayout isMinimized={false} />
      </Drawer>

      {/* RIGHT SIDE – SAME FLEX FLOW */}
      <div
        className={`
          flex-1 min-w-0 relative flex flex-col
          transition-all duration-300
          ${isSidebarMinimized ? "lg:ml-0" : "lg:ml-[280px]"}
        `}
      >
        {/* HEADER – SAME POSITION */}
        <div className="sticky top-0 z-50 bg-[#f3f7fb]">
          <Header
            isSidebarMinimized={isSidebarMinimized}
            onToggleSidebar={toggleSidebar}
            isMobileDrawerOpen={isMobileDrawerOpen}
            onToggleMobileDrawer={toggleMobileDrawer}
          />
        </div>

        {/* MAIN CONTENT – SEPARATE SCROLL */}
        <main className="flex-1 overflow-y-auto overflow-x-hidden">
          <div className="container px-3 py-6">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default FullLayout;

















// import { FC, useState } from "react";
// import { Outlet } from "react-router";
// import { Drawer } from "flowbite-react";
// import SidebarLayout from "./sidebar/Sidebar";
// import Header from "./header/Header";

// const SIDEBAR_WIDTH = 260; // px

// const FullLayout: FC = () => {
//   const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false); // desktop
//   const [isMobileDrawerOpen, setIsMobileDrawerOpen] = useState(false); // mobile

//   const toggleDesktopSidebar = () => {
//     setIsSidebarCollapsed((prev) => !prev);
//   };

//   const toggleMobileDrawer = () => {
//     setIsMobileDrawerOpen((prev) => !prev);
//   };

//   return (
//     <div className="flex min-h-screen bg-[#f3f7fb]">
//       {/* DESKTOP SIDEBAR (lg and up) */}
//       <aside
//         className={`
//           hidden lg:flex flex-col bg-white shadow-lg
//           transition-[width] duration-300 ease-in-out
//         `}
//         style={{ width: isSidebarCollapsed ? 72 : SIDEBAR_WIDTH }}
//       >
//         <SidebarLayout isMinimized={isSidebarCollapsed} />
//       </aside>

//       {/* MOBILE DRAWER SIDEBAR */}
//       <Drawer
//         open={isMobileDrawerOpen}
//         onClose={() => setIsMobileDrawerOpen(false)}
//         position="left"
//         className="lg:hidden"
//       >
//         <SidebarLayout isMinimized={false} />
//       </Drawer>

//       {/* MAIN COLUMN (HEADER + CONTENT) */}
//       <div className="flex flex-1 flex-col min-w-0">
//         {/* FIXED HEADER */}
//         <div className="fixed top-0 left-0 right-0 z-30">
//           <Header
//             isSidebarMinimized={isSidebarCollapsed}
//             onToggleSidebar={toggleDesktopSidebar}
//             isMobileDrawerOpen={isMobileDrawerOpen}
//             onToggleMobileDrawer={toggleMobileDrawer}
//           />
//         </div>

//         {/* spacer for header height (same as header h-20 = 80px) */}
//         <div className="h-20" />

//         {/* CONTENT AREA */}
//         <main className="flex-1 overflow-x-hidden">
//           <div className="px-4 pb-6 pt-2 lg:pl-6">
//             <Outlet />
//           </div>
//         </main>
//       </div>
//     </div>
//   );
// };

// export default FullLayout;








// import { FC, useState } from 'react';
// import { Outlet } from 'react-router';

// import Sidebar from './sidebar/Sidebar';
// import Header from './header/Header';

// const FullLayout: FC = () => {
//    const [activeCollapse, setActiveCollapse] = useState<string | null>(null);
//   return (
//     <>
//       <div className="flex w-full min-w-0">
//         <div className="page-wrapper flex w-full min-w-0">
//           {/* Sidebar */}
//           <Sidebar activeCollapse={activeCollapse} setActiveCollapse={setActiveCollapse}/>

//           {/* Right content area */}
//           {/* keep the original pt-6 so header starts lower on page */}
//           <div className="container flex flex-col w-full min-w-0 min-h-screen pt-6">
//             {/* Top Header  - DO NOT wrap in a sticky div here */}
//             <Header />

//             <div className="h-full min-w-0">
//               {/* Body Content  */}
//               <div className="w-full h-full min-w-0 overflow-x-hidden">
//                 <div className="container px-0 py-6 min-w-0">
//                   <Outlet />
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </>
//   );
// };

// export default FullLayout;

















// import { FC } from 'react';
// import { Outlet } from 'react-router';

// import Sidebar from './sidebar/Sidebar';
// import Header from './header/Header';

// const FullLayout: FC = () => {
//   return (
//     <>
//       <div className="flex w-full min-w-0"> 
//         <div className="page-wrapper flex w-full min-w-0"> 
//           {/* Header/sidebar */}
//           <Sidebar />
//           <div className="container flex flex-col w-full min-w-0 min-h-screen pt-6"> 
//             {/* Top Header  */}
//             <Header />

//             <div className={`h-full min-w-0`}> 
//               {/* Body Content  */}
//               <div className={`w-full h-full min-w-0 overflow-x-hidden`}> 
//                 <div className="container px-0 py-6 min-w-0"> 
//                   <Outlet />
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </>
//   );
// };

// export default FullLayout;





// import { FC, useState } from 'react';
// import { Outlet } from 'react-router';

// import Sidebar from './sidebar/Sidebar';
// import Header from './header/Header';

// const FullLayout: FC = () => {
//   const [activeCollapse, setActiveCollapse] = useState<string | null>(null);
//   const [sidebarVisible, setSidebarVisible] = useState<boolean>(true);

//   const toggleSidebar = () => {
//     setSidebarVisible(!sidebarVisible);
//   };

//   return (
//     <div className="flex w-full min-w-0">
//       <div className="page-wrapper flex w-full min-w-0">
//         {/* Sidebar - conditionally rendered with transition */}
//         <div className={`transition-all duration-300 ease-in-out ${sidebarVisible ? 'w-auto' : 'w-0 overflow-hidden'}`}>
//           {sidebarVisible && (
//             <Sidebar activeCollapse={activeCollapse} setActiveCollapse={setActiveCollapse} />
//           )}
//         </div>

//         {/* Right content area - full width when sidebar is hidden */}
//         <div className={`flex flex-col w-full min-w-0 min-h-screen pt-6 transition-all duration-300 ease-in-out ${
//           sidebarVisible ? 'container mx-auto' : 'w-full'
//         }`}>
//           {/* Top Header */}
//           <Header sidebarVisible={sidebarVisible} toggleSidebar={toggleSidebar} />

//           <div className="h-full min-w-0">
//             {/* Body Content */}
//             <div className="w-full h-full min-w-0 overflow-x-hidden">
//               <div className={`py-6 min-w-0 w-full ${sidebarVisible ? 'container mx-auto px-0' : 'px-4'}`}>
//                 <Outlet />
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default FullLayout;











// import { FC, useState } from 'react'; 
// import { Outlet } from 'react-router'; 
// import Sidebar from './sidebar/Sidebar';
// import Header from './header/Header';

// const FullLayout: FC = () => { 
//   const [activeCollapse, setActiveCollapse] = useState<string | null>(null); 
//   const [sidebarVisible, setSidebarVisible] = useState<boolean>(true);

//   const toggleSidebar = () => setSidebarVisible((s) => !s);

//   return (
//     <div className="flex min-h-screen w-full">
//       {/* Sidebar */}
//       <div 
//         className={`transition-[width] duration-300 ease-in-out overflow-hidden flex-shrink-0 ${
//           sidebarVisible ? 'w-64' : 'w-0'
//         }`}
//       >
//         {sidebarVisible && (
//           <Sidebar 
//             activeCollapse={activeCollapse} 
//             setActiveCollapse={setActiveCollapse} 
//           />
//         )}
//       </div>

//       {/* Right area */}
//       <div className="flex flex-1 min-w-0 flex-col">
//         {/* Header should always span the full width of the right area */}
//         <Header sidebarVisible={sidebarVisible} toggleSidebar={toggleSidebar} />

//         {/* Content */}
//         <div className="flex-1 min-w-0">
//           <div
//             className={`min-w-0 w-full ${
//               sidebarVisible
//                 ? 'max-w-screen-2xl mx-auto px-6 py-6'
//                 : 'w-full px-4 py-6'
//             }`}
//           >
//             <Outlet />
//           </div>
//         </div>
//       </div>
//     </div>
//   ); 
// };

// export default FullLayout;