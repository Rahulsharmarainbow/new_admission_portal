

import { FC } from 'react';
import { Outlet } from 'react-router';

import Sidebar from './sidebar/Sidebar';
import Header from './header/Header';

const FullLayout: FC = () => {
  return (
    <>
      <div className="flex w-full min-w-0">
        <div className="page-wrapper flex w-full min-w-0">
          {/* Sidebar */}
          <Sidebar />

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













