// import React from "react";
// import { Alert, Card, Checkbox, Label, Select, TextInput, Textarea } from "flowbite-react";
// import { HiInformationCircle, HiEye, HiEyeOff } from "react-icons/hi";
// import { FormWizardData } from "./FormWizard";

// interface ThirdPartyApiSetupProps {
//   formData: FormWizardData;
//   updateFormData: (updates: Partial<FormWizardData>) => void;
// }

// const ThirdPartyApiSetup: React.FC<ThirdPartyApiSetupProps> = ({ 
//   formData, 
//   updateFormData 
// }) => {
//   const [showApiKey, setShowApiKey] = React.useState(false);
//   const [showPassword, setShowPassword] = React.useState(false);
//   const [showSecretKey, setShowSecretKey] = React.useState(false);
//   const [showRazorpaySecretKey, setShowRazorpaySecretKey] = React.useState(false);
//   const [showSmtpPassword, setShowSmtpPassword] = React.useState(false);
//   const [showRazorpayApiKey, setShowRazorpayApiKey] = React.useState(false);

//   return (
//     <div className="space-y-6">
//       <Alert color="info" icon={HiInformationCircle}>
//         Note: For inputs such as WhatsApp, Email, SMS, and Razorpay API configurations, 
//         you may skip entering values. If left blank, the system will automatically apply 
//         the default administration settings for these services.
//       </Alert>

//       {/* Email Service */}
//       <Card>
//         <div className="flex items-center mb-4">
//           <Checkbox
//             id="enableEmail"
//             checked={formData.isDropdownEnabled}
//             onChange={(e) => updateFormData({ isDropdownEnabled: e.target.checked })}
//             className="mr-2"
//           />
//           <Label htmlFor="enableEmail" className="font-semibold text-gray-900 dark:text-white">
//             Enabled Email Service
//           </Label>
//         </div>

//         {formData.isDropdownEnabled && (
//           <div className="space-y-4">
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//               <div>
//                 <Label htmlFor="emailService">Select Email Service</Label>
//                 <Select
//                   id="emailService"
//                   value={formData.selectedServicesOption}
//                   onChange={(e) => updateFormData({ selectedServicesOption: e.target.value })}
//                 >
//                   <option value="">Please Select</option>
//                   <option value="MailGun SMTP">MailGun SMTP</option>
//                   <option value="Google SMTP">Google SMTP</option>
//                   <option value="Zoho Api">Zoho Api</option>
//                   <option value="Other">Other</option>
//                 </Select>
//               </div>
              
//               <div>
//                 <Label htmlFor="emailTemplate">
//                   Email Template <span className="text-red-600">*</span>
//                 </Label>
//                 <Textarea
//                   id="emailTemplate"
//                   value={formData.emailTemplate}
//                   onChange={(e) => updateFormData({ emailTemplate: e.target.value })}
//                   rows={4}
//                   placeholder="Enter email template"
//                   required
//                 />
//               </div>
//             </div>

//             {/* MailGun SMTP Configuration */}
//             {formData.selectedServicesOption === "MailGun SMTP" && (
//               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
//                 <div>
//                   <Label htmlFor="fromEmail">From Email</Label>
//                   <TextInput
//                     id="fromEmail"
//                     value={formData.fromEmail}
//                     onChange={(e) => updateFormData({ fromEmail: e.target.value })}
//                   />
//                 </div>
//                 <div>
//                   <Label htmlFor="smtpHost">SMTP Host</Label>
//                   <TextInput
//                     id="smtpHost"
//                     value={formData.smtpHost}
//                     onChange={(e) => updateFormData({ smtpHost: e.target.value })}
//                   />
//                 </div>
//                 <div>
//                   <Label htmlFor="smtpPort">SMTP Port</Label>
//                   <TextInput
//                     id="smtpPort"
//                     value={formData.smtpPort}
//                     onChange={(e) => updateFormData({ smtpPort: e.target.value })}
//                   />
//                 </div>
//                 <div>
//                   <Label htmlFor="smtpUsername">SMTP Username</Label>
//                   <TextInput
//                     id="smtpUsername"
//                     value={formData.smtpUsername}
//                     onChange={(e) => updateFormData({ smtpUsername: e.target.value })}
//                   />
//                 </div>
//                 <div>
//                   <Label htmlFor="smtpPassword">SMTP Password</Label>
//                   <div className="relative">
//                     <TextInput
//                       id="smtpPassword"
//                       type={showSmtpPassword ? "text" : "password"}
//                       value={formData.smtpPassword}
//                       onChange={(e) => updateFormData({ smtpPassword: e.target.value })}
//                     />
//                     <button
//                       type="button"
//                       className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 hover:text-gray-700"
//                       onClick={() => setShowSmtpPassword(!showSmtpPassword)}
//                     >
//                       {showSmtpPassword ? <HiEyeOff className="w-5 h-5" /> : <HiEye className="w-5 h-5" />}
//                     </button>
//                   </div>
//                 </div>
//               </div>
//             )}

//             {/* Zoho API Configuration */}
//             {formData.selectedServicesOption === "Zoho Api" && (
//               <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//                 <div>
//                   <Label htmlFor="zohoApiKey">Zoho API Key</Label>
//                   <div className="relative">
//                     <TextInput
//                       id="zohoApiKey"
//                       type={showApiKey ? "text" : "password"}
//                       value={formData.zohoApiKey}
//                       onChange={(e) => updateFormData({ zohoApiKey: e.target.value })}
//                     />
//                     <button
//                       type="button"
//                       className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 hover:text-gray-700"
//                       onClick={() => setShowApiKey(!showApiKey)}
//                     >
//                       {showApiKey ? <HiEyeOff className="w-5 h-5" /> : <HiEye className="w-5 h-5" />}
//                     </button>
//                   </div>
//                 </div>
//                 <div>
//                   <Label htmlFor="zohoFromEmail">From Address</Label>
//                   <TextInput
//                     id="zohoFromEmail"
//                     value={formData.zohoFromEmail}
//                     onChange={(e) => updateFormData({ zohoFromEmail: e.target.value })}
//                   />
//                 </div>
//                 <div>
//                   <Label htmlFor="bounceAddress">Bounce Address</Label>
//                   <TextInput
//                     id="bounceAddress"
//                     value={formData.bounceAddress}
//                     onChange={(e) => updateFormData({ bounceAddress: e.target.value })}
//                   />
//                 </div>
//               </div>
//             )}
//           </div>
//         )}
//       </Card>

//       {/* WhatsApp Service */}
//       <Card>
//         <div className="flex items-center mb-4">
//           <Checkbox
//             id="enableWhatsApp"
//             checked={formData.isTemplatesVisible}
//             onChange={(e) => updateFormData({ isTemplatesVisible: e.target.checked })}
//             className="mr-2"
//           />
//           <Label htmlFor="enableWhatsApp" className="font-semibold text-gray-900 dark:text-white">
//             Enable WhatsApp Service
//           </Label>
//         </div>

//         {formData.isTemplatesVisible && (
//           <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//             <div>
//               <Label htmlFor="whatsappTemplate">
//                 WhatsApp Template <span className="text-red-600">*</span>
//               </Label>
//               <TextInput
//                 id="whatsappTemplate"
//                 value={formData.whatsappTemplate}
//                 onChange={(e) => updateFormData({ whatsappTemplate: e.target.value })}
//                 required
//               />
//             </div>
//             <div>
//               <Label htmlFor="userId">User ID</Label>
//               <TextInput
//                 id="userId"
//                 value={formData.UserId}
//                 onChange={(e) => updateFormData({ UserId: e.target.value })}
//               />
//             </div>
//             <div>
//               <Label htmlFor="wPassword">Password</Label>
//               <div className="relative">
//                 <TextInput
//                   id="wPassword"
//                   type={showPassword ? "text" : "password"}
//                   value={formData.wPassword}
//                   onChange={(e) => updateFormData({ wPassword: e.target.value })}
//                 />
//                 <button
//                   type="button"
//                   className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 hover:text-gray-700"
//                   onClick={() => setShowPassword(!showPassword)}
//                 >
//                   {showPassword ? <HiEyeOff className="w-5 h-5" /> : <HiEye className="w-5 h-5" />}
//                 </button>
//               </div>
//             </div>
//           </div>
//         )}
//       </Card>

//       {/* SMS Service */}
//       <Card>
//         <div className="flex items-center mb-4">
//           <Checkbox
//             id="enableSMS"
//             checked={formData.isSmsApiEnabled}
//             onChange={(e) => updateFormData({ isSmsApiEnabled: e.target.checked })}
//             className="mr-2"
//           />
//           <Label htmlFor="enableSMS" className="font-semibold text-gray-900 dark:text-white">
//             Enable SMS Service
//           </Label>
//         </div>

//         {formData.isSmsApiEnabled && (
//           <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//             <div>
//               <Label htmlFor="smsTemplate">
//                 SMS Template <span className="text-red-600">*</span>
//               </Label>
//               <TextInput
//                 id="smsTemplate"
//                 value={formData.smsTemplate}
//                 onChange={(e) => updateFormData({ smsTemplate: e.target.value })}
//                 required
//               />
//             </div>
//             <div>
//               <Label htmlFor="smsApiKey">API Key</Label>
//               <TextInput
//                 id="smsApiKey"
//                 value={formData.smsApikey}
//                 onChange={(e) => updateFormData({ smsApikey: e.target.value })}
//               />
//             </div>
//             <div>
//               <Label htmlFor="smsSecretKey">Secret Key</Label>
//               <div className="relative">
//                 <TextInput
//                   id="smsSecretKey"
//                   type={showSecretKey ? "text" : "password"}
//                   value={formData.smsSecretkey}
//                   onChange={(e) => updateFormData({ smsSecretkey: e.target.value })}
//                 />
//                 <button
//                   type="button"
//                   className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 hover:text-gray-700"
//                   onClick={() => setShowSecretKey(!showSecretKey)}
//                 >
//                   {showSecretKey ? <HiEyeOff className="w-5 h-5" /> : <HiEye className="w-5 h-5" />}
//                 </button>
//               </div>
//             </div>
//           </div>
//         )}
//       </Card>

//       {/* Razorpay Integration */}
//       <Card>
//         <h5 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Razorpay Integration</h5>
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//           <div>
//             <Label htmlFor="razorpayApiKey">
//               API Key <span className="text-red-600">*</span>
//             </Label>
//             <div className="relative">
//               <TextInput
//                 id="razorpayApiKey"
//                 type={showRazorpayApiKey ? "text" : "password"}
//                 value={formData.razorpayApikey}
//                 onChange={(e) => updateFormData({ razorpayApikey: e.target.value })}
//                 required
//               />
//               <button
//                 type="button"
//                 className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 hover:text-gray-700"
//                 onClick={() => setShowRazorpayApiKey(!showRazorpayApiKey)}
//               >
//                 {showRazorpayApiKey ? <HiEyeOff className="w-5 h-5" /> : <HiEye className="w-5 h-5" />}
//               </button>
//             </div>
//           </div>
//           <div>
//             <Label htmlFor="razorpaySecretKey">
//               Secret Key <span className="text-red-600">*</span>
//             </Label>
//             <div className="relative">
//               <TextInput
//                 id="razorpaySecretKey"
//                 type={showRazorpaySecretKey ? "text" : "password"}
//                 value={formData.razorpaySecretkey}
//                 onChange={(e) => updateFormData({ razorpaySecretkey: e.target.value })}
//                 required
//               />
//               <button
//                 type="button"
//                 className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 hover:text-gray-700"
//                 onClick={() => setShowRazorpaySecretKey(!showRazorpaySecretKey)}
//               >
//                 {showRazorpaySecretKey ? <HiEyeOff className="w-5 h-5" /> : <HiEye className="w-5 h-5" />}
//               </button>
//             </div>
//           </div>
//         </div>
//       </Card>
//     </div>
//   );
// };

// export default ThirdPartyApiSetup;










"use client";
import React, { useState } from "react";
import { Card, Label, Select, TextInput, Textarea, Checkbox, Alert } from "flowbite-react";
import { HiInformationCircle, HiEye, HiEyeOff } from "react-icons/hi";
import { FormData } from "./FormWizard";

interface ThirdPartyApiSetupProps {
  formData: FormData;
  updateFormData: (updates: Partial<FormData>) => void;
}

const ThirdPartyApiSetup: React.FC<ThirdPartyApiSetupProps> = ({ formData, updateFormData }) => {
  const [showApiKey, setShowApiKey] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showSecretKey, setShowSecretKey] = useState(false);
  const [showRazorpaySecretKey, setShowRazorpaySecretKey] = useState(false);
  const [showSmtpPassword, setShowSmtpPassword] = useState(false);
  const [showRazorpayApiKey, setShowRazorpayApiKey] = useState(false);

  const handleCheckboxChange = (field: string, value: boolean) => {
    updateFormData({ [field]: value });
  };

  const handleInputChange = (field: string, value: string) => {
    updateFormData({ [field]: value });
  };

  return (
    <div className="space-y-6">
      <Alert color="info" icon={HiInformationCircle}>
        Note: For inputs such as WhatsApp, Email, SMS, and Razorpay API configurations, 
        you may skip entering values. If left blank, the system will automatically apply 
        the default administration settings for these services.
      </Alert>

      {/* Email Service */}
      <Card>
        <div className="flex items-center mb-4">
          <Checkbox
            id="enableEmail"
            checked={formData.isDropdownEnabled}
            onChange={(e) => handleCheckboxChange('isDropdownEnabled', e.target.checked)}
            className="mr-2"
          />
          <Label htmlFor="enableEmail" className="font-semibold text-gray-900 dark:text-white">
            Enabled Email Service
          </Label>
        </div>

        {formData.isDropdownEnabled && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="emailService">Select Email Service</Label>
                <Select
                  id="emailService"
                  value={formData.selectedServicesOption}
                  onChange={(e) => handleInputChange('selectedServicesOption', e.target.value)}
                >
                  <option value="">Please Select</option>
                  <option value="MailGun SMTP">MailGun SMTP</option>
                  <option value="Google SMTP">Google SMTP</option>
                  <option value="Zoho Api">Zoho Api</option>
                  <option value="Other">Other</option>
                </Select>
              </div>
              
              <div>
                <Label htmlFor="emailTemplate">
                  Email Template <span className="text-red-600">*</span>
                </Label>
                <Textarea
                  id="emailTemplate"
                  value={formData.emailTemplate}
                  onChange={(e) => handleInputChange('emailTemplate', e.target.value)}
                  rows={4}
                  placeholder="Enter email template"
                  required
                />
              </div>
            </div>

            {/* MailGun SMTP Configuration */}
            {formData.selectedServicesOption === "MailGun SMTP" && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                <div>
                  <Label htmlFor="fromEmail">From Email</Label>
                  <TextInput
                    id="fromEmail"
                    value={formData.fromEmail}
                    onChange={(e) => handleInputChange('fromEmail', e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="smtpHost">SMTP Host</Label>
                  <TextInput
                    id="smtpHost"
                    value={formData.smtpHost}
                    onChange={(e) => handleInputChange('smtpHost', e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="smtpPort">SMTP Port</Label>
                  <TextInput
                    id="smtpPort"
                    value={formData.smtpPort}
                    onChange={(e) => handleInputChange('smtpPort', e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="smtpUsername">SMTP Username</Label>
                  <TextInput
                    id="smtpUsername"
                    value={formData.smtpUsername}
                    onChange={(e) => handleInputChange('smtpUsername', e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="smtpPassword">SMTP Password</Label>
                  <div className="relative">
                    <TextInput
                      id="smtpPassword"
                      type={showSmtpPassword ? "text" : "password"}
                      value={formData.smtpPassword}
                      onChange={(e) => handleInputChange('smtpPassword', e.target.value)}
                    />
                    <button
                      type="button"
                      className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 hover:text-gray-700"
                      onClick={() => setShowSmtpPassword(!showSmtpPassword)}
                    >
                      {showSmtpPassword ? <HiEyeOff className="w-5 h-5" /> : <HiEye className="w-5 h-5" />}
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Zoho API Configuration */}
            {formData.selectedServicesOption === "Zoho Api" && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="zohoApiKey">Zoho API Key</Label>
                  <div className="relative">
                    <TextInput
                      id="zohoApiKey"
                      type={showApiKey ? "text" : "password"}
                      value={formData.zohoApiKey}
                      onChange={(e) => handleInputChange('zohoApiKey', e.target.value)}
                    />
                    <button
                      type="button"
                      className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 hover:text-gray-700"
                      onClick={() => setShowApiKey(!showApiKey)}
                    >
                      {showApiKey ? <HiEyeOff className="w-5 h-5" /> : <HiEye className="w-5 h-5" />}
                    </button>
                  </div>
                </div>
                <div>
                  <Label htmlFor="zohoFromEmail">From Address</Label>
                  <TextInput
                    id="zohoFromEmail"
                    value={formData.zohoFromEmail}
                    onChange={(e) => handleInputChange('zohoFromEmail', e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="bounceAddress">Bounce Address</Label>
                  <TextInput
                    id="bounceAddress"
                    value={formData.bounceAddress}
                    onChange={(e) => handleInputChange('bounceAddress', e.target.value)}
                  />
                </div>
              </div>
            )}
          </div>
        )}
      </Card>

      {/* WhatsApp Service */}
      <Card>
        <div className="flex items-center mb-4">
          <Checkbox
            id="enableWhatsApp"
            checked={formData.isTemplatesVisible}
            onChange={(e) => handleCheckboxChange('isTemplatesVisible', e.target.checked)}
            className="mr-2"
          />
          <Label htmlFor="enableWhatsApp" className="font-semibold text-gray-900 dark:text-white">
            Enable WhatsApp Service
          </Label>
        </div>

        {formData.isTemplatesVisible && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="whatsappTemplate">
                WhatsApp Template <span className="text-red-600">*</span>
              </Label>
              <TextInput
                id="whatsappTemplate"
                value={formData.whatsappTemplate}
                onChange={(e) => handleInputChange('whatsappTemplate', e.target.value)}
                required
              />
            </div>
            <div>
              <Label htmlFor="userId">User ID</Label>
              <TextInput
                id="userId"
                value={formData.UserId}
                onChange={(e) => handleInputChange('UserId', e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="wPassword">Password</Label>
              <div className="relative">
                <TextInput
                  id="wPassword"
                  type={showPassword ? "text" : "password"}
                  value={formData.wPassword}
                  onChange={(e) => handleInputChange('wPassword', e.target.value)}
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 hover:text-gray-700"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <HiEyeOff className="w-5 h-5" /> : <HiEye className="w-5 h-5" />}
                </button>
              </div>
            </div>
          </div>
        )}
      </Card>

      {/* SMS Service */}
      <Card>
        <div className="flex items-center mb-4">
          <Checkbox
            id="enableSMS"
            checked={formData.isSmsApiEnabled}
            onChange={(e) => handleCheckboxChange('isSmsApiEnabled', e.target.checked)}
            className="mr-2"
          />
          <Label htmlFor="enableSMS" className="font-semibold text-gray-900 dark:text-white">
            Enable SMS Service
          </Label>
        </div>

        {formData.isSmsApiEnabled && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="smsTemplate">
                SMS Template <span className="text-red-600">*</span>
              </Label>
              <TextInput
                id="smsTemplate"
                value={formData.smsTemplate}
                onChange={(e) => handleInputChange('smsTemplate', e.target.value)}
                required
              />
            </div>
            <div>
              <Label htmlFor="smsApiKey">API Key</Label>
              <TextInput
                id="smsApiKey"
                value={formData.smsApikey}
                onChange={(e) => handleInputChange('smsApikey', e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="smsSecretKey">Secret Key</Label>
              <div className="relative">
                <TextInput
                  id="smsSecretKey"
                  type={showSecretKey ? "text" : "password"}
                  value={formData.smsSecretkey}
                  onChange={(e) => handleInputChange('smsSecretkey', e.target.value)}
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 hover:text-gray-700"
                  onClick={() => setShowSecretKey(!showSecretKey)}
                >
                  {showSecretKey ? <HiEyeOff className="w-5 h-5" /> : <HiEye className="w-5 h-5" />}
                </button>
              </div>
            </div>
          </div>
        )}
      </Card>

      {/* Razorpay Integration */}
      <Card>
        <h5 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Razorpay Integration</h5>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="razorpayApiKey">
              API Key <span className="text-red-600">*</span>
            </Label>
            <div className="relative">
              <TextInput
                id="razorpayApiKey"
                type={showRazorpayApiKey ? "text" : "password"}
                value={formData.razorpayApikey}
                onChange={(e) => handleInputChange('razorpayApikey', e.target.value)}
                required
              />
              <button
                type="button"
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 hover:text-gray-700"
                onClick={() => setShowRazorpayApiKey(!showRazorpayApiKey)}
              >
                {showRazorpayApiKey ? <HiEyeOff className="w-5 h-5" /> : <HiEye className="w-5 h-5" />}
              </button>
            </div>
          </div>
          <div>
            <Label htmlFor="razorpaySecretKey">
              Secret Key <span className="text-red-600">*</span>
            </Label>
            <div className="relative">
              <TextInput
                id="razorpaySecretKey"
                type={showRazorpaySecretKey ? "text" : "password"}
                value={formData.razorpaySecretkey}
                onChange={(e) => handleInputChange('razorpaySecretkey', e.target.value)}
                required
              />
              <button
                type="button"
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 hover:text-gray-700"
                onClick={() => setShowRazorpaySecretKey(!showRazorpaySecretKey)}
              >
                {showRazorpaySecretKey ? <HiEyeOff className="w-5 h-5" /> : <HiEye className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default ThirdPartyApiSetup;