import { FC } from 'react';
import { Outlet } from 'react-router';

import Sidebar from './sidebar/Sidebar';
import Header from './header/Header';

const FullLayout: FC = () => {
  return (
    <>
      <div className="flex w-full min-w-0"> {/* 👈 min-w-0 add karein */}
        <div className="page-wrapper flex w-full min-w-0"> {/* 👈 yahan bhi */}
          {/* Header/sidebar */}
          <Sidebar />
          <div className="container flex flex-col w-full min-w-0 pt-6"> {/* 👈 yahan bhi */}
            {/* Top Header  */}
            <Header />

            <div className={`h-full min-w-0`}> {/* 👈 yahan bhi */}
              {/* Body Content  */}
              <div className={`w-full min-w-0 overflow-x-hidden`}> {/* 👈 overflow-x-hidden add karein */}
                <div className="container px-0 py-6 min-w-0"> {/* 👈 yahan bhi */}
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
      
        
//         <div className="flex w-full ">
//           <div className="page-wrapper flex w-full">
//             {/* Header/sidebar */}
//             <Sidebar />
//             <div className="container flex flex-col w-full pt-6">
//               {/* Top Header  */}
//               <Header />

//               <div className={`h-full`}>
//                 {/* Body Content  */}
//                 <div className={`w-full`}>
//                   <div className="container px-0 py-6">
//                     <Outlet />
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
        
      
//     </>
//   );
// };

// export default FullLayout;
