// ye vo code he jo aapne comment krne ko bla tha 




// import { FC, useState } from 'react';
// import { Outlet } from 'react-router';

// import Sidebar from './sidebar/Sidebar';
// import Header from './header/Header';

// const FullLayout: FC = () => {
//   const [activeCollapse, setActiveCollapse] = useState<string | null>(null);
//   const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

//   return (
//     <div className="flex w-full min-w-0 min-h-screen bg-gray-50">
//       {/* Sidebar */}
//       <div className={`transition-all duration-300 ease-in-out ${sidebarCollapsed ? 'w-0 -ml-64' : 'w-64'} hidden xl:block`}>
//         <Sidebar 
//           activeCollapse={activeCollapse} 
//           setActiveCollapse={setActiveCollapse}
//         />
//       </div>

//       {/* Main Content Area */}
//       <div className={`flex flex-col w-full min-w-0 transition-all duration-300 ease-in-out ${sidebarCollapsed ? 'xl:ml-0' : 'xl:ml-64'}`}>
//         {/* Header */}
//         <Header 
//           sidebarCollapsed={sidebarCollapsed}
//           setSidebarCollapsed={setSidebarCollapsed}
//         />

//         {/* Body Content */}
//         <main className="flex-1 w-full min-w-0 px-6 py-6">
//           <div className="w-full h-full min-w-0">
//             <Outlet />
//           </div>
//         </main>
//       </div>
//     </div>
//   );
// };

// export default FullLayout;









import { FC, useState } from 'react';
import { Outlet } from 'react-router';

import Sidebar from './sidebar/Sidebar';
import Header from './header/Header';

const FullLayout: FC = () => {
   const [activeCollapse, setActiveCollapse] = useState<string | null>(null);
  return (
    <>
      <div className="flex w-full min-w-0">
        <div className="page-wrapper flex w-full min-w-0">
          {/* Sidebar */}
          <Sidebar activeCollapse={activeCollapse} setActiveCollapse={setActiveCollapse}/>

          {/* Right content area */}
          {/* keep the original pt-6 so header starts lower on page */}
          <div className="container flex flex-col w-full min-w-0 min-h-screen pt-6">
            {/* Top Header  - DO NOT wrap in a sticky div here */}
            <Header />

            <div className="h-full min-w-0">
              {/* Body Content  */}
              <div className="w-full h-full min-w-0 overflow-x-hidden">
                <div className="container px-0 py-6 min-w-0">
                  <Outlet />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default FullLayout;

















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