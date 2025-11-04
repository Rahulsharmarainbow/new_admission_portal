



// import React from "react";
// import { Toaster, ToastBar } from "react-hot-toast";
// import { AiOutlineCheckCircle, AiOutlineCloseCircle } from "react-icons/ai";

// const CustomToaster = () => {
//   return (
//     <Toaster
//       position="bottom-center"
//       toastOptions={{
//         duration: 4000,
//         style: {
//           background: "#363636",
//           color: "#fff",
//           padding: "12px 16px",
//           borderRadius: "8px",
//           minWidth: "300px",
//         },
//         success: {
//           duration: 3000,
//           icon: <AiOutlineCheckCircle size={20} color="#4ADE80" />,
//           style: {
//             background: "#059669",
//             color: "#fff",
//           },
//         },
//         error: {
//           duration: 3000,
//           icon: <AiOutlineCloseCircle size={20} color="#F87171" />,
//           style: {
//             background: "#DC2626",
//             color: "#fff",
//           },
//         },
//       }}
//     >
//       {(t) => (
//         <ToastBar toast={t}>
//           {({ icon, message }) => (
//             <div className="flex gap-3 w-full">
//               {/* Icon */}
//               <div className="flex-shrink-0">
//                 {icon}
//               </div>
              
//               {/* Content */}
//               <div className="flex flex-col flex-1">
//                 <div className="text-sm font-semibold mb-1">
//                   {t.type === "success" ? "Success" : "Error"}
//                 </div>
//                 <div className="text-sm">
//                   {message}
//                 </div>
//               </div>
//             </div>
//           )}
//         </ToastBar>
//       )}
//     </Toaster>
//   );
// };

// export default CustomToaster;









// import React from "react";
// import { Toaster, ToastBar } from "react-hot-toast";
// import { AiOutlineCheckCircle, AiOutlineCloseCircle } from "react-icons/ai";

// const CustomToaster = () => {
//   return (
//     <Toaster
//       position="bottom-center"
//       toastOptions={{
//         duration: 4000,
//         style: {
//           background: "#363636",
//           color: "#fff",
//           padding: "12px 16px",
//           borderRadius: "8px",
//           minWidth: "300px",
//         },
//         success: {
//           duration: 3000,
//           icon: <AiOutlineCheckCircle size={20} color="#4ADE80" />,
//           style: {
//             background: "#059669",
//             color: "#fff",
//           },
//         },
//         error: {
//           duration: 3000,
//           icon: <AiOutlineCloseCircle size={20} color="#F87171" />,
//           style: {
//             background: "#DC2626",
//             color: "#fff",
//           },
//         },
//       }}
//     >
//       {(t) => (
//         <ToastBar toast={t}>
//           {({ icon, message }) => (
//             <div className="flex gap-3 w-full items-start justify-between">
//               {/* Icon */}
//               <div className="flex-shrink-0">
//                 {icon}
//               </div>
              
//               {/* Content - YAHAN CHANGE KIYA HAI */}
//               <div className="flex flex-col flex-1 min-w-0 justify-start items-start">
//                 <div className="text-sm font-semibold mb-1 w-full text-left">
//                   {t.type === "success" ? "Success" : "Error"}
//                 </div>
//                 <div className="text-sm w-full text-justify break-words">
//                   {message}
//                 </div>
//               </div>
//             </div>
//           )}
//         </ToastBar>
//       )}
//     </Toaster>
//   );
// };

// export default CustomToaster;










import { Toaster, ToastBar } from "react-hot-toast";
import { AiOutlineCheckCircle, AiOutlineCloseCircle } from "react-icons/ai";

const CustomToaster = () => {
  return (
    <Toaster
      position="bottom-center"
      toastOptions={{
        duration: 2000,
        style: {
          background: "#363636",
          color: "#fff",
          padding: "12px 16px",
          borderRadius: "8px",
          minWidth: "300px",
        },
        success: {
          duration: 2000,
          icon: <AiOutlineCheckCircle size={20} color="#FFFFFF" />,
          style: {
            background: "#059669",
            color: "#fff",
          },
        },
        error: {
          duration: 2000,
          icon: <AiOutlineCloseCircle size={20} color="#FFFFFF" />,
          style: {
            background: "#DC2626",
            color: "#fff",
          },
        },
      }}
    >
      {(t) => (
        <ToastBar toast={t}>
          {({ icon }) => (
            <div className="flex gap-3 w-full items-start">
              <div className="flex-shrink-0 mt-1">
                {icon}
              </div>

              <div className="flex flex-col flex-1 min-w-0">
                <div className="text-sm font-semibold mb-1">
                  {t.type === "success" ? "Success" : "Error"}
                </div>
                <div className="text-sm break-words">
                  {t.message}
                </div>
              </div>
            </div>
          )}
        </ToastBar>
      )}
    </Toaster>
  );
};

export default CustomToaster;
