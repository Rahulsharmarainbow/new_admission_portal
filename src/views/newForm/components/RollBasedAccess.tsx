// import React from "react";
// import { Card, Checkbox } from "flowbite-react";
// import { HiCloudUpload } from "react-icons/hi";
// import { FormWizardData } from "./FormWizard";

// interface RollBasedAccessProps {
//   formData: FormWizardData;
//   updateFormData: (updates: Partial<FormWizardData>) => void;
// }

// const RollBasedAccess: React.FC<RollBasedAccessProps> = ({ 
//   formData, 
//   updateFormData 
// }) => {
//   // Don't render anything if School is selected
//   if (formData.selectType === "1") {
//     return null;
//   }

//   return (
//     <div className="space-y-6">
//       <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//         <Card>
//           <div className="flex items-center justify-between">
//             <div className="flex items-center space-x-3">
//               <div className="p-2 bg-gray-100 rounded-lg dark:bg-gray-700">
//                 <HiCloudUpload className="w-6 h-6 text-gray-500 dark:text-gray-400" />
//               </div>
//               <div>
//                 <h6 className="font-semibold text-gray-900 dark:text-white">Give Access For Hall Ticket Generate</h6>
//               </div>
//             </div>
//             <Checkbox
//               checked={formData.switchState}
//               onChange={(e) => updateFormData({ switchState: e.target.checked })}
//             />
//           </div>
//         </Card>

//         <Card>
//           <div className="flex items-center justify-between">
//             <div className="flex items-center space-x-3">
//               <div className="p-2 bg-gray-100 rounded-lg dark:bg-gray-700">
//                 <HiCloudUpload className="w-6 h-6 text-gray-500 dark:text-gray-400" />
//               </div>
//               <div>
//                 <h6 className="font-semibold text-gray-900 dark:text-white">Give Access For Nominal Roll Access</h6>
//               </div>
//             </div>
//             <Checkbox
//               checked={formData.nominalState}
//               onChange={(e) => updateFormData({ nominalState: e.target.checked })}
//             />
//           </div>
//         </Card>
//       </div>
//     </div>
//   );
// };

// export default RollBasedAccess;











"use client";
import React from "react";
import { Card, Checkbox } from "flowbite-react";
import { HiCloudUpload } from "react-icons/hi";
import { FormData } from "./FormWizard";

interface RollBasedAccessProps {
  formData: FormData;
  updateFormData: (updates: Partial<FormData>) => void;
}

const RollBasedAccess: React.FC<RollBasedAccessProps> = ({ formData, updateFormData }) => {
  
  // Only show for College and University (not School)
  if (formData.selectType === "1") {
    return null;
  }

  const handleCheckboxChange = (field: string, value: boolean) => {
    updateFormData({ [field]: value });
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Hall Ticket Generate Access */}
        <Card>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-gray-100 rounded-lg dark:bg-gray-700">
                <HiCloudUpload className="w-6 h-6 text-gray-500 dark:text-gray-400" />
              </div>
              <div>
                <h6 className="font-semibold text-gray-900 dark:text-white">Give Access For Hall Ticket Generate</h6>
              </div>
            </div>
            <Checkbox
              checked={formData.switchState}
              onChange={(e) => handleCheckboxChange('switchState', e.target.checked)}
            />
          </div>
        </Card>

        {/* Nominal Roll Access */}
        <Card>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-gray-100 rounded-lg dark:bg-gray-700">
                <HiCloudUpload className="w-6 h-6 text-gray-500 dark:text-gray-400" />
              </div>
              <div>
                <h6 className="font-semibold text-gray-900 dark:text-white">Give Access For Nominal Roll Access</h6>
              </div>
            </div>
            <Checkbox
              checked={formData.nominalState}
              onChange={(e) => handleCheckboxChange('nominalState', e.target.checked)}
            />
          </div>
        </Card>
      </div>
    </div>
  );
};

export default RollBasedAccess;