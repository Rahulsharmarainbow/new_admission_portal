import React, { useState } from "react";
import { Card, Label, Select, TextInput, Textarea, Checkbox, Alert } from "flowbite-react";
import { HiInformationCircle, HiEye, HiEyeOff } from "react-icons/hi";
import { FormData } from "src/types/formTypes";
import PasswordInput from "./PasswordInput";

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

//  const PasswordInput = ({ 
//   id, 
//   value, 
//   onChange, 
//   showPassword, 
//   setShowPassword, 
//   placeholder 
// }: {
//   id: string;
//   value: string;
//   onChange: (value: string) => void;
//   showPassword: boolean;
//   setShowPassword: (value: boolean) => void;
//   placeholder?: string;
// }) => {
//   const inputRef = React.useRef<HTMLInputElement>(null);

//   const handleToggle = () => {
//     setShowPassword(!showPassword);
//     // Focus maintain करने के लिए
//     setTimeout(() => {
//       if (inputRef.current) {
//         inputRef.current.focus();
//         // Cursor को end में move करें
//         const length = inputRef.current.value.length;
//         inputRef.current.setSelectionRange(length, length);
//       }
//     }, 0);
//   };

//   return (
//     <div className="relative">
//       <input
//         ref={inputRef}
//         id={id}
//         type={showPassword ? "text" : "password"}
//         value={value}
//         onChange={(e) => onChange(e.target.value)}
//         placeholder={placeholder}
//         className="block w-full border border-gray-300 rounded-lg bg-white p-2.5 text-sm text-gray-900 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 pr-10"
//       />
//       <button
//         type="button"
//         className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
//         onClick={handleToggle}
//       >
//         {showPassword ? <HiEyeOff className="w-5 h-5" /> : <HiEye className="w-5 h-5" />}
//       </button>
//     </div>
//   );
// };

  return (
    <div className="space-y-6">
      <Alert color="info" icon={HiInformationCircle} className="break-words">
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
          <Label htmlFor="enableEmail" className="font-semibold text-gray-900 dark:text-white cursor-pointer">
            Enable Email Service
          </Label>
        </div>

        {formData.isDropdownEnabled && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="emailService" className="mb-2 block">Select Email Service</Label>
                <Select
                  id="emailService"
                  value={formData.selectedServicesOption}
                  onChange={(e) => handleInputChange('selectedServicesOption', e.target.value)}
                  className="w-full"
                >
                  <option value="">Please Select</option>
                  <option value="MailGun SMTP">MailGun SMTP</option>
                  <option value="Google SMTP">Google SMTP</option>
                  <option value="Zoho Api">Zoho Api</option>
                  <option value="Other">Other</option>
                </Select>
              </div>
              
              <div>
                <Label htmlFor="emailTemplate" className="mb-2 block">
                  Email Template <span className="text-red-600">*</span>
                </Label>
                <Textarea
                  id="emailTemplate"
                  value={formData.emailTemplate}
                  onChange={(e) => handleInputChange('emailTemplate', e.target.value)}
                  rows={4}
                  placeholder="Enter email template"
                  required
                  className="w-full resize-vertical"
                />
              </div>
            </div>

            {/* MailGun SMTP Configuration */}
            {formData.selectedServicesOption === "MailGun SMTP" && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
                <div>
                  <Label htmlFor="fromEmail" className="mb-2 block">From Email</Label>
                  <TextInput
                    id="fromEmail"
                    value={formData.fromEmail}
                    onChange={(e) => handleInputChange('fromEmail', e.target.value)}
                    className="w-full"
                  />
                </div>
                <div>
                  <Label htmlFor="smtpHost" className="mb-2 block">SMTP Host</Label>
                  <TextInput
                    id="smtpHost"
                    value={formData.smtpHost}
                    onChange={(e) => handleInputChange('smtpHost', e.target.value)}
                    className="w-full"
                  />
                </div>
                <div>
                  <Label htmlFor="smtpPort" className="mb-2 block">SMTP Port</Label>
                  <TextInput
                    id="smtpPort"
                    value={formData.smtpPort}
                    onChange={(e) => handleInputChange('smtpPort', e.target.value)}
                    className="w-full"
                  />
                </div>
                <div>
                  <Label htmlFor="smtpUsername" className="mb-2 block">SMTP Username</Label>
                  <TextInput
                    id="smtpUsername"
                    value={formData.smtpUsername}
                    onChange={(e) => handleInputChange('smtpUsername', e.target.value)}
                    className="w-full"
                  />
                </div>
                <div>
                  <Label htmlFor="smtpPassword" className="mb-2 block">SMTP Password</Label>
                  <PasswordInput
                    id="smtpPassword"
                    value={formData.smtpPassword}
                    onChange={(value) => handleInputChange('smtpPassword', value)}
                    showPassword={showSmtpPassword}
                    setShowPassword={setShowSmtpPassword}
                  />
                </div>
              </div>
            )}

            {/* Zoho API Configuration */}
            {formData.selectedServicesOption === "Zoho Api" && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="zohoApiKey" className="mb-2 block">Zoho API Key</Label>
                  <PasswordInput
                    id="zohoApiKey"
                    value={formData.zohoApiKey}
                    onChange={(value) => handleInputChange('zohoApiKey', value)}
                    showPassword={showApiKey}
                    setShowPassword={setShowApiKey}
                  />
                </div>
                <div>
                  <Label htmlFor="zohoFromEmail" className="mb-2 block">From Address</Label>
                  <TextInput
                    id="zohoFromEmail"
                    value={formData.zohoFromEmail}
                    onChange={(e) => handleInputChange('zohoFromEmail', e.target.value)}
                    className="w-full"
                  />
                </div>
                <div>
                  <Label htmlFor="bounceAddress" className="mb-2 block">Bounce Address</Label>
                  <TextInput
                    id="bounceAddress"
                    value={formData.bounceAddress}
                    onChange={(e) => handleInputChange('bounceAddress', e.target.value)}
                    className="w-full"
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
          <Label htmlFor="enableWhatsApp" className="font-semibold text-gray-900 dark:text-white cursor-pointer">
            Enable WhatsApp Service
          </Label>
        </div>

        {formData.isTemplatesVisible && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="whatsappTemplate" className="mb-2 block">
                WhatsApp Template <span className="text-red-600">*</span>
              </Label>
              <TextInput
                id="whatsappTemplate"
                value={formData.whatsappTemplate}
                onChange={(e) => handleInputChange('whatsappTemplate', e.target.value)}
                required
                className="w-full"
              />
            </div>
            <div>
              <Label htmlFor="userId" className="mb-2 block">User ID</Label>
              <TextInput
                id="userId"
                value={formData.UserId}
                onChange={(e) => handleInputChange('UserId', e.target.value)}
                className="w-full"
              />
            </div>
            <div>
              <Label htmlFor="wPassword" className="mb-2 block">Password</Label>
              <PasswordInput
                id="wPassword"
                value={formData.wPassword}
                onChange={(value) => handleInputChange('wPassword', value)}
                showPassword={showPassword}
                setShowPassword={setShowPassword}
              />
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
          <Label htmlFor="enableSMS" className="font-semibold text-gray-900 dark:text-white cursor-pointer">
            Enable SMS Service
          </Label>
        </div>

        {formData.isSmsApiEnabled && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="smsTemplate" className="mb-2 block">
                SMS Template <span className="text-red-600">*</span>
              </Label>
              <TextInput
                id="smsTemplate"
                value={formData.smsTemplate}
                onChange={(e) => handleInputChange('smsTemplate', e.target.value)}
                required
                className="w-full"
              />
            </div>
            <div>
              <Label htmlFor="smsApiKey" className="mb-2 block">API Key</Label>
              <TextInput
                id="smsApiKey"
                value={formData.smsApikey}
                onChange={(e) => handleInputChange('smsApikey', e.target.value)}
                className="w-full"
              />
            </div>
            <div>
              <Label htmlFor="smsSecretKey" className="mb-2 block">Secret Key</Label>
              <PasswordInput
                id="smsSecretKey"
                value={formData.smsSecretkey}
                onChange={(value) => handleInputChange('smsSecretkey', value)}
                showPassword={showSecretKey}
                setShowPassword={setShowSecretKey}
              />
            </div>
          </div>
        )}
      </Card>

      {/* Razorpay Integration */}
      <Card>
        <h5 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 break-words">Razorpay Integration</h5>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="razorpayApiKey" className="mb-2 block">
              API Key <span className="text-red-600">*</span>
            </Label>
            <PasswordInput
              id="razorpayApiKey"
              value={formData.razorpayApikey}
              onChange={(value) => handleInputChange('razorpayApikey', value)}
              showPassword={showRazorpayApiKey}
              setShowPassword={setShowRazorpayApiKey}
            />
          </div>
          <div>
            <Label htmlFor="razorpaySecretKey" className="mb-2 block">
              Secret Key <span className="text-red-600">*</span>
            </Label>
            <PasswordInput
              id="razorpaySecretKey"
              value={formData.razorpaySecretkey}
              onChange={(value) => handleInputChange('razorpaySecretkey', value)}
              showPassword={showRazorpaySecretKey}
              setShowPassword={setShowRazorpaySecretKey}
            />
          </div>
        </div>
      </Card>
    </div>
  );
};

export default ThirdPartyApiSetup;