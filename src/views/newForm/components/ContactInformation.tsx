// import React from "react";
// import { Card, Label, TextInput } from "flowbite-react";
// import { FormWizardData } from "./FormWizard";

// interface ContactInformationProps {
//   formData: FormWizardData;
//   updateFormData: (updates: Partial<FormWizardData>) => void;
// }

// const ContactInformation: React.FC<ContactInformationProps> = ({ 
//   formData, 
//   updateFormData 
// }) => {
//   return (
//     <div className="space-y-6">
//       {/* Technical Contact */}
//       <Card>
//         <h5 className="text-lg font-semibold text-gray-900 dark:text-white">Technical Contact</h5>
//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
//           <div>
//             <Label htmlFor="technicalName">Name</Label>
//             <TextInput
//               id="technicalName"
//               value={formData.technicalName}
//               onChange={(e) => updateFormData({ technicalName: e.target.value })}
//               placeholder="Enter Name"
//             />
//           </div>
//           <div>
//             <Label htmlFor="technicalEmail">Email</Label>
//             <TextInput
//               id="technicalEmail"
//               type="email"
//               value={formData.technicalEmail}
//               onChange={(e) => updateFormData({ technicalEmail: e.target.value })}
//               placeholder="Enter Email"
//             />
//           </div>
//           <div>
//             <Label htmlFor="technicalPhone">Phone</Label>
//             <TextInput
//               id="technicalPhone"
//               value={formData.technicalPhone}
//               onChange={(e) => updateFormData({ technicalPhone: e.target.value })}
//               placeholder="Enter Phone"
//             />
//           </div>
//           <div>
//             <Label htmlFor="technicalLocation">Location</Label>
//             <TextInput
//               id="technicalLocation"
//               value={formData.technicalLocation}
//               onChange={(e) => updateFormData({ technicalLocation: e.target.value })}
//               placeholder="Enter Location"
//             />
//           </div>
//         </div>
//       </Card>

//       {/* Billing Contact */}
//       <Card>
//         <h5 className="text-lg font-semibold text-gray-900 dark:text-white">Billing Contact</h5>
//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
//           <div>
//             <Label htmlFor="billingName">Name</Label>
//             <TextInput
//               id="billingName"
//               value={formData.billingName}
//               onChange={(e) => updateFormData({ billingName: e.target.value })}
//               placeholder="Enter Name"
//             />
//           </div>
//           <div>
//             <Label htmlFor="billingEmail">Email</Label>
//             <TextInput
//               id="billingEmail"
//               type="email"
//               value={formData.billingEmail}
//               onChange={(e) => updateFormData({ billingEmail: e.target.value })}
//               placeholder="Enter Email"
//             />
//           </div>
//           <div>
//             <Label htmlFor="billingPhone">Phone</Label>
//             <TextInput
//               id="billingPhone"
//               value={formData.billingPhone}
//               onChange={(e) => updateFormData({ billingPhone: e.target.value })}
//               placeholder="Enter Phone"
//             />
//           </div>
//           <div>
//             <Label htmlFor="billingLocation">Location</Label>
//             <TextInput
//               id="billingLocation"
//               value={formData.billingLocation}
//               onChange={(e) => updateFormData({ billingLocation: e.target.value })}
//               placeholder="Enter Location"
//             />
//           </div>
//         </div>
//       </Card>

//       {/* Additional Contact */}
//       <Card>
//         <h5 className="text-lg font-semibold text-gray-900 dark:text-white">Additional Contact</h5>
//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
//           <div>
//             <Label htmlFor="additionalName">Name</Label>
//             <TextInput
//               id="additionalName"
//               value={formData.additionalName}
//               onChange={(e) => updateFormData({ additionalName: e.target.value })}
//               placeholder="Enter Name"
//             />
//           </div>
//           <div>
//             <Label htmlFor="additionalEmail">Email</Label>
//             <TextInput
//               id="additionalEmail"
//               type="email"
//               value={formData.additionalEmail}
//               onChange={(e) => updateFormData({ additionalEmail: e.target.value })}
//               placeholder="Enter Email"
//             />
//           </div>
//           <div>
//             <Label htmlFor="additionalPhone">Phone</Label>
//             <TextInput
//               id="additionalPhone"
//               value={formData.additionalPhone}
//               onChange={(e) => updateFormData({ additionalPhone: e.target.value })}
//               placeholder="Enter Phone"
//             />
//           </div>
//           <div>
//             <Label htmlFor="additionalLocation">Location</Label>
//             <TextInput
//               id="additionalLocation"
//               value={formData.additionalLocation}
//               onChange={(e) => updateFormData({ additionalLocation: e.target.value })}
//               placeholder="Enter Location"
//             />
//           </div>
//         </div>
//       </Card>
//     </div>
//   );
// };

// export default ContactInformation;
















"use client";
import React from "react";
import { Card, Label, TextInput } from "flowbite-react";
import { FormData } from "./FormWizard";

interface ContactInformationProps {
  formData: FormData;
  updateFormData: (updates: Partial<FormData>) => void;
}

const ContactInformation: React.FC<ContactInformationProps> = ({ formData, updateFormData }) => {
  
  const validateEmail = (email: string) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  const validatePhone = (phone: string) => {
    return /^\d{10}$/.test(phone);
  };

  const handleContactChange = (field: string, value: string) => {
    updateFormData({ [field]: value });
  };

  return (
    <div className="space-y-6">
      {/* Technical Contact */}
      <Card>
        <h5 className="text-lg font-semibold text-gray-900 dark:text-white">Technical Contact</h5>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <Label htmlFor="technicalName">Name</Label>
            <TextInput
              id="technicalName"
              value={formData.technicalName}
              onChange={(e) => handleContactChange('technicalName', e.target.value)}
              placeholder="Enter Name"
            />
          </div>
          <div>
            <Label htmlFor="technicalEmail">Email</Label>
            <TextInput
              id="technicalEmail"
              type="email"
              value={formData.technicalEmail}
              onChange={(e) => handleContactChange('technicalEmail', e.target.value)}
              placeholder="Enter Email"
              color={formData.technicalEmail && !validateEmail(formData.technicalEmail) ? "failure" : "gray"}
            />
          </div>
          <div>
            <Label htmlFor="technicalPhone">Phone</Label>
            <TextInput
              id="technicalPhone"
              value={formData.technicalPhone}
              onChange={(e) => handleContactChange('technicalPhone', e.target.value)}
              placeholder="Enter Phone"
              color={formData.technicalPhone && !validatePhone(formData.technicalPhone) ? "failure" : "gray"}
            />
          </div>
          <div>
            <Label htmlFor="technicalLocation">Location</Label>
            <TextInput
              id="technicalLocation"
              value={formData.technicalLocation}
              onChange={(e) => handleContactChange('technicalLocation', e.target.value)}
              placeholder="Enter Location"
            />
          </div>
        </div>
      </Card>

      {/* Billing Contact */}
      <Card>
        <h5 className="text-lg font-semibold text-gray-900 dark:text-white">Billing Contact</h5>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <Label htmlFor="billingName">Name</Label>
            <TextInput
              id="billingName"
              value={formData.billingName}
              onChange={(e) => handleContactChange('billingName', e.target.value)}
              placeholder="Enter Name"
            />
          </div>
          <div>
            <Label htmlFor="billingEmail">Email</Label>
            <TextInput
              id="billingEmail"
              type="email"
              value={formData.billingEmail}
              onChange={(e) => handleContactChange('billingEmail', e.target.value)}
              placeholder="Enter Email"
              color={formData.billingEmail && !validateEmail(formData.billingEmail) ? "failure" : "gray"}
            />
          </div>
          <div>
            <Label htmlFor="billingPhone">Phone</Label>
            <TextInput
              id="billingPhone"
              value={formData.billingPhone}
              onChange={(e) => handleContactChange('billingPhone', e.target.value)}
              placeholder="Enter Phone"
              color={formData.billingPhone && !validatePhone(formData.billingPhone) ? "failure" : "gray"}
            />
          </div>
          <div>
            <Label htmlFor="billingLocation">Location</Label>
            <TextInput
              id="billingLocation"
              value={formData.billingLocation}
              onChange={(e) => handleContactChange('billingLocation', e.target.value)}
              placeholder="Enter Location"
            />
          </div>
        </div>
      </Card>

      {/* Additional Contact */}
      <Card>
        <h5 className="text-lg font-semibold text-gray-900 dark:text-white">Additional Contact</h5>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <Label htmlFor="additionalName">Name</Label>
            <TextInput
              id="additionalName"
              value={formData.additionalName}
              onChange={(e) => handleContactChange('additionalName', e.target.value)}
              placeholder="Enter Name"
            />
          </div>
          <div>
            <Label htmlFor="additionalEmail">Email</Label>
            <TextInput
              id="additionalEmail"
              type="email"
              value={formData.additionalEmail}
              onChange={(e) => handleContactChange('additionalEmail', e.target.value)}
              placeholder="Enter Email"
              color={formData.additionalEmail && !validateEmail(formData.additionalEmail) ? "failure" : "gray"}
            />
          </div>
          <div>
            <Label htmlFor="additionalPhone">Phone</Label>
            <TextInput
              id="additionalPhone"
              value={formData.additionalPhone}
              onChange={(e) => handleContactChange('additionalPhone', e.target.value)}
              placeholder="Enter Phone"
              color={formData.additionalPhone && !validatePhone(formData.additionalPhone) ? "failure" : "gray"}
            />
          </div>
          <div>
            <Label htmlFor="additionalLocation">Location</Label>
            <TextInput
              id="additionalLocation"
              value={formData.additionalLocation}
              onChange={(e) => handleContactChange('additionalLocation', e.target.value)}
              placeholder="Enter Location"
            />
          </div>
        </div>
      </Card>
    </div>
  );
};

export default ContactInformation;