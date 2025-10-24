// import React from "react";
// import { Alert, Button, Label, TextInput } from "flowbite-react";
// import { HiInformationCircle, HiCheckCircle } from "react-icons/hi";
// import { FormData } from "src/types/formTypes";

// interface DnsConfigurationProps {
//   formData: FormData;
//   updateFormData: (updates: Partial<FormData>) => void;
// }

// const DnsConfiguration: React.FC<DnsConfigurationProps> = ({ formData, updateFormData }) => {
  
//   const domainNameRegex = /^(?:[a-zA-Z0-9-]+\.)+[a-zA-Z]{2,}$/;

//   const handleConfigure = () => {
//     if (!formData.domainNameError && formData.website_url) {
//       updateFormData({ 
//         configure: "1",
//         updateConfigure: 1
//       });
//     }
//   };

//   const handleDomainChange = (value: string) => {
//     updateFormData({ domainName: value });
    
//     if (!domainNameRegex.test(value)) {
//       updateFormData({ 
//         domainNameError: true,
//         domainNameErrorMsg: "Please enter a valid domain name (e.g., example.com)."
//       });
//     } else {
//       updateFormData({ 
//         domainNameError: false,
//         domainNameErrorMsg: ""
//       });
//     }
//   };

//   return (
//     <div className="space-y-6">
//       <Alert color="info" icon={HiInformationCircle} className="break-words">
//         Important: Ensure that the domain you are configuring points to our server's IP address. 
//         Please add an A record in the client domain settings with the IP address provided by us. 
//         Only after this setup, site will work properly.
//       </Alert>

//       {formData.configure === "0" ? (
//         <div className="flex flex-col items-center justify-center space-y-4 py-8">
//           <div className="w-full max-w-md">
//             <Label htmlFor="domainName" className="mb-2 block text-center">Enter Domain Name</Label>
//             <div className="relative">
//               <TextInput
//                 id="domainName"
//                 value={formData.website_url}
//                 onChange={(e) => handleDomainChange(e.target.value)}
//                 color={formData.domainNameError ? "failure" : "gray"}
//                 placeholder="example.com"
//                 className="w-full text-center"
//               />
//               {formData.domainNameError && (
//                 <p className="mt-2 text-sm text-red-600 text-center break-words">
//                   {formData.domainNameErrorMsg}
//                 </p>
//               )}
//             </div>
//           </div>
//           <Button 
//             onClick={handleConfigure} 
//             className="mt-4"
//             disabled={!formData.domainName || formData.domainNameError}
//           >
//             Configure Domain
//           </Button>
//         </div>
//       ) : (
//         <div className="flex flex-col items-center justify-center space-y-4 py-8">
//           <HiCheckCircle className="w-16 h-16 text-green-500" />
//           {formData.updateConfigure ? (
//             <div className="text-center">
//               <p className="text-green-600 font-semibold text-lg mb-2 break-words">
//                 Domain Configured Successfully!
//               </p>
//               <p className="text-gray-600 dark:text-gray-400 break-words">
//                 Domain <span className="font-mono text-blue-600">{formData.domainName}</span> has been configured.
//               </p>
//               <p className="text-gray-500 dark:text-gray-400 text-sm mt-2 break-words">
//                 Click on "Update" to apply the changes.
//               </p>
//             </div>
//           ) : (
//             <div className="text-center">
//               <p className="font-semibold text-gray-900 dark:text-white text-lg mb-2 break-words">
//                 Domain Already Configured
//               </p>
//               <p className="text-gray-600 dark:text-gray-400 break-words">
//                 Domain <span className="font-mono text-blue-600">{formData.domainName}</span> is already configured for this account.
//               </p>
//             </div>
//           )}
//         </div>
//       )}
//     </div>
//   );
// };

// export default DnsConfiguration;

import React from "react";
import { Alert, Button, Label, TextInput } from "flowbite-react";
import { HiInformationCircle, HiCheckCircle } from "react-icons/hi";
import { FormData } from "src/types/formTypes";

interface DnsConfigurationProps {
  formData: FormData;
  updateFormData: (updates: Partial<FormData>) => void;
  isEditMode?: boolean; // Add this prop to distinguish between add and edit
}

const DnsConfiguration: React.FC<DnsConfigurationProps> = ({ 
  formData, 
  updateFormData, 
  isEditMode = false 
}) => {
  
  const domainNameRegex = /^(?:[a-zA-Z0-9-]+\.)+[a-zA-Z]{2,}$/;

  const handleConfigure = () => {
    if (!formData.domainNameError && formData.domainName) {
      updateFormData({ 
        configure: "1",
        updateConfigure: 1
      });
    }
  };

  const handleDomainChange = (value: string) => {
    updateFormData({ domainName: value });
    
    if (!domainNameRegex.test(value)) {
      updateFormData({ 
        domainNameError: true,
        domainNameErrorMsg: "Please enter a valid domain name (e.g., example.com)."
      });
    } else {
      updateFormData({ 
        domainNameError: false,
        domainNameErrorMsg: ""
      });
    }
  };

  // For add mode, use empty domainName, for edit mode use existing domainName or website_url
  const getDomainValue = () => {
    if (isEditMode) {
      return formData.domainName || formData.website_url || "";
    }
    return formData.domainName || "";
  };

  return (
    <div className="space-y-6">
      <Alert color="info" icon={HiInformationCircle} className="break-words">
        Important: Ensure that the domain you are configuring points to our server's IP address. 
        Please add an A record in the client domain settings with the IP address provided by us. 
        Only after this setup, site will work properly.
      </Alert>

      {formData.configure === "0" ? (
        <div className="flex flex-col items-center justify-center space-y-4 py-8">
          <div className="w-full max-w-md">
            <Label htmlFor="domainName" className="mb-2 block text-center">
              Enter Domain Name {!isEditMode && <span className="text-red-600">*</span>}
            </Label>
            <div className="relative">
              <TextInput
                id="domainName"
                value={getDomainValue()}
                onChange={(e) => handleDomainChange(e.target.value)}
                color={formData.domainNameError ? "failure" : "gray"}
                placeholder="example.com"
                className="w-full text-center"
                disabled={isEditMode && formData.configure === "1"} // Disable if already configured in edit mode
              />
              {formData.domainNameError && (
                <p className="mt-2 text-sm text-red-600 text-center break-words">
                  {formData.domainNameErrorMsg}
                </p>
              )}
              {isEditMode && formData.configure === "1" && (
                <p className="mt-2 text-sm text-blue-600 text-center break-words">
                  Domain is already configured. To change, please contact support.
                </p>
              )}
            </div>
          </div>
          
          {!(isEditMode && formData.configure === "1") && (
            <Button 
              onClick={handleConfigure} 
              className="mt-4"
              disabled={!formData.domainName || formData.domainNameError}
            >
              {isEditMode ? "Reconfigure Domain" : "Configure Domain"}
            </Button>
          )}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center space-y-4 py-8">
          <HiCheckCircle className="w-16 h-16 text-green-500" />
          {formData.updateConfigure ? (
            <div className="text-center">
              <p className="text-green-600 font-semibold text-lg mb-2 break-words">
                Domain Configured Successfully!
              </p>
              <p className="text-gray-600 dark:text-gray-400 break-words">
                Domain <span className="font-mono text-blue-600">{formData.domainName}</span> has been configured.
              </p>
              <p className="text-gray-500 dark:text-gray-400 text-sm mt-2 break-words">
                Click on "{isEditMode ? 'Update' : 'Create Live Account'}" to apply the changes.
              </p>
            </div>
          ) : (
            <div className="text-center">
              <p className="font-semibold text-gray-900 dark:text-white text-lg mb-2 break-words">
                Domain Already Configured
              </p>
              <p className="text-gray-600 dark:text-gray-400 break-words">
                Domain <span className="font-mono text-blue-600">{formData.domainName}</span> is already configured for this account.
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default DnsConfiguration;