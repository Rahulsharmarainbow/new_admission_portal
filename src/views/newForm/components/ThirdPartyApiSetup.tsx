// import React, { useState, useEffect, useRef, useMemo, useCallback } from "react";
// import { Card, Label, Select, TextInput, Textarea, Checkbox, Alert } from "flowbite-react";
// import { HiInformationCircle, HiEye, HiEyeOff } from "react-icons/hi";
// import { FormData } from "src/types/formTypes";
// import JoditEditor from "jodit-react";

// interface ThirdPartyApiSetupProps {
//   formData: FormData;
//   updateFormData: (updates: Partial<FormData>) => void;
//   errors?: Record<string, string>;
// }

// const ThirdPartyApiSetup: React.FC<ThirdPartyApiSetupProps> = ({ 
//   formData, 
//   updateFormData,
//   errors = {} 
// }) => {
//   const [showApiKey, setShowApiKey] = useState(false);
//   const [showPassword, setShowPassword] = useState(false);
//   const [showSecretKey, setShowSecretKey] = useState(false);
//   const [showRazorpaySecretKey, setShowRazorpaySecretKey] = useState(false);
//   const [showSmtpPassword, setShowSmtpPassword] = useState(false);
//   const [showRazorpayApiKey, setShowRazorpayApiKey] = useState(false);
//   const [showPgSecretKey, setShowPgSecretKey] = useState(false);
//   const [showPgMerchantId, setShowPgMerchantId] = useState(false);

//   // Jodit Editor ref for email template
//   const emailEditorRef = useRef(null);

//   console.log('Rendering ThirdPartyApiSetup Component', formData);

//   // Jodit Editor configuration
//   const editorConfig = useMemo(
//     () => ({
//       readonly: false,
//       height: 300,
//       toolbarSticky: false,
//       toolbarAdaptive: false,
//       buttons: [
//         "source",
//         "|",
//         "bold",
//         "italic",
//         "underline",
//         "strikethrough",
//         "|",
//         "ul",
//         "ol",
//         "|",
//         "font",
//         "fontsize",
//         "brush",
//         "paragraph",
//         "|",
//         "image",
//         "video",
//         "table",
//         "link",
//         "|",
//         "left",
//         "center",
//         "right",
//         "justify",
//         "|",
//         "undo",
//         "redo",
//         "|",
//         "hr",
//         "eraser",
//         "copyformat",
//         "fullsize",
//       ],
//       showXPathInStatusbar: false,
//       showCharsCounter: false,
//       showWordsCounter: false,
//       uploader: { insertImageAsBase64URI: true },
//       placeholder: "Start typing your email template here...",
//       theme: "default",
//     }),
//     []
//   );

//   const handleEmailTemplateChange = useCallback((newContent: string) => {
//     console.log('Email template changed:', newContent);
//     updateFormData({ emailTemplate: newContent });
//   }, [updateFormData]);

//   // Debug effect
//   useEffect(() => {
//     console.log('ThirdPartyApiSetup - Current UserId:', formData.UserId);
//     console.log('Current Payment Type:', formData.paymentType);
//   }, [formData.UserId, formData.paymentType]);

//   const handleCheckboxChange = (field: keyof FormData, value: boolean) => {
//     console.log(`Checkbox ${field}:`, value);
//     updateFormData({ [field]: value });
//   };

//   const handleInputChange = (field: keyof FormData, value: string) => {
//     console.log(`Input ${field}:`, value);
//     updateFormData({ [field]: value });
//   };

//   const handleSelectChange = (field: keyof FormData, value: string) => {
//     console.log(`Select ${field}:`, value);
    
//     // Handle payment type change specially
//     if (field === 'paymentType') {
//       // Update payment type and payment status based on selection
//       const paymentStatus = value === 'razorpay' ? '1' : value === 'ug_payment' ? '2' : '';
      
//       updateFormData({ 
//         [field]: value,
//         paymentStatus: paymentStatus
//       });
//     } else {
//       updateFormData({ [field]: value });
//     }
//   };

//   // Specific handler for UserId
//   const handleUserIdChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const value = e.target.value;
//     console.log('UserId changing to:', value);
//     updateFormData({ UserId: value });
//   };

//   // Password Input Component
//   interface PasswordInputProps {
//     id: string;
//     value: string;
//     onChange: (value: string) => void;
//     showPassword: boolean;
//     setShowPassword: (value: boolean) => void;
//     placeholder?: string;
//     error?: string;
//   }

//   const PasswordInput: React.FC<PasswordInputProps> = ({ 
//     id, 
//     value, 
//     onChange, 
//     showPassword, 
//     setShowPassword, 
//     placeholder,
//     error
//   }) => {
//     const inputRef = React.useRef<HTMLInputElement>(null);

//     const handleToggle = () => {
//       setShowPassword(!showPassword);
//       setTimeout(() => {
//         if (inputRef.current) {
//           inputRef.current.focus();
//           const length = inputRef.current.value.length;
//           inputRef.current.setSelectionRange(length, length);
//         }
//       }, 0);
//     };

//     const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//       onChange(e.target.value);
//     };

//     return (
//       <div className="relative">
//         <input
//           ref={inputRef}
//           id={id}
//           type={showPassword ? "text" : "password"}
//           value={value}
//           onChange={handleChange}
//           placeholder={placeholder}
//           className={`block w-full border rounded-lg bg-white p-2.5 text-sm text-gray-900 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 pr-10 ${
//             error ? 'border-red-500' : 'border-gray-300'
//           }`}
//         />
//         <button
//           type="button"
//           className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
//           onClick={handleToggle}
//         >
//           {showPassword ? <HiEyeOff className="w-5 h-5" /> : <HiEye className="w-5 h-5" />}
//         </button>
//         {error && (
//           <p className="mt-1 text-sm text-red-600">{error}</p>
//         )}
//       </div>
//     );
//   };

//   // Custom Password Input Component for PG fields
//   interface CustomPasswordInputProps {
//     id: string;
//     label: string;
//     value: string;
//     onChange: (value: string) => void;
//     showPassword: boolean;
//     setShowPassword: (value: boolean) => void;
//     error?: string;
//   }

//   const CustomPasswordInput: React.FC<CustomPasswordInputProps> = ({
//     id,
//     label,
//     value,
//     onChange,
//     showPassword,
//     setShowPassword,
//     error
//   }) => {
//     const inputRef = useRef<HTMLInputElement>(null);

//     const handleToggle = () => {
//       setShowPassword(!showPassword);
//       setTimeout(() => {
//         if (inputRef.current) {
//           inputRef.current.focus();
//           const length = inputRef.current.value.length;
//           inputRef.current.setSelectionRange(length, length);
//         }
//       }, 0);
//     };

//     return (
//       <div>
//         <Label htmlFor={id} className="mb-2 block">{label}</Label>
//         <div className="relative">
//           <input
//             ref={inputRef}
//             id={id}
//             type={showPassword ? "text" : "password"}
//             value={value}
//             onChange={(e) => onChange(e.target.value)}
//             className={`block w-full border rounded-lg bg-white p-2.5 text-sm text-gray-900 focus:ring-blue-500 focus:border-blue-500 pr-10 ${
//               error ? 'border-red-500' : 'border-gray-300'
//             }`}
//           />
//           <button
//             type="button"
//             className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-500 hover:text-gray-700"
//             onClick={handleToggle}
//           >
//             {showPassword ? <HiEyeOff className="w-5 h-5" /> : <HiEye className="w-5 h-5" />}
//           </button>
//         </div>
//         {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
//       </div>
//     );
//   };
// console.log('Form Data:', formData);
//   return (
//     <div className="space-y-6">
//       <Alert color="info" icon={HiInformationCircle} className="break-words">
//         Note: For inputs such as WhatsApp, Email, SMS, and Payment configurations, 
//         you may skip entering values. If left blank, the system will automatically apply 
//         the default administration settings for these services.
//       </Alert>

//       {/* Payment Type Dropdown */}
//       <Card>
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//           <div>
//             <Label htmlFor="paymentType" className="mb-2 block">
//               Payment Type <span className="text-red-600">*</span>
//             </Label>
//             <Select
//               id="paymentType"
//               value={formData.paymentType || ''}
//               onChange={(e) => handleSelectChange('paymentType', e.target.value)}
//               color={errors.paymentType ? "failure" : "gray"}
//               helperText={errors.paymentType}
//               className="w-full"
//             >
//               <option value="">Select Payment Type</option>
//               <option value="1">Razorpay</option>
//               <option value="2">UG Payment</option>
//             </Select>
//           </div>
          
//           {/* Display payment status */}
//           {/* <div>
//             <Label htmlFor="paymentStatusDisplay" className="mb-2 block">
//               Payment Status
//             </Label>
//             <TextInput
//               id="paymentStatusDisplay"
//               value={formData.paymentStatus || ''}
//               readOnly
//               className="w-full bg-gray-50"
//             />
//             <div className="mt-1 text-xs text-gray-500">
//               {formData.paymentStatus === '1' ? 'Razorpay Selected' : 
//                formData.paymentStatus === '2' ? 'UG Payment Selected' : 
//                'Select payment type'}
//             </div>
//           </div> */}
//         </div>
//       </Card>

//       {/* Razorpay Integration - Show only when Razorpay is selected */}
//       {formData.paymentType === '1' && (
//         <Card className="p-4">
//           <h5 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 break-words">
//             Razorpay Integration
//           </h5>
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//             <div>
//               <Label htmlFor="razorpayApiKey" className="mb-2 block">
//                 API Key
//               </Label>
//               <div className="relative">
//                 <input
//                   id="razorpayApiKey"
//                   type={showRazorpayApiKey ? "text" : "password"}
//                   value={formData.razorpayApikey || ''}
//                   onChange={(e) => handleInputChange('razorpayApikey', e.target.value)}
//                   className={`block w-full border rounded-lg bg-white p-2.5 text-sm text-gray-900 pr-10 ${
//                     errors.razorpayApikey ? 'border-red-500' : 'border-gray-300'
//                   }`}
//                 />
//                 <button
//                   type="button"
//                   className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
//                   onClick={() => setShowRazorpayApiKey(!showRazorpayApiKey)}
//                 >
//                   {showRazorpayApiKey ? <HiEyeOff className="w-5 h-5" /> : <HiEye className="w-5 h-5" />}
//                 </button>
//               </div>
//               {errors.razorpayApikey && (
//                 <p className="mt-1 text-sm text-red-600">{errors.razorpayApikey}</p>
//               )}
//             </div>
            
//             <div>
//               <Label htmlFor="razorpaySecretKey" className="mb-2 block">
//                 Secret Key
//               </Label>
//               <div className="relative">
//                 <input
//                   id="razorpaySecretKey"
//                   type={showRazorpaySecretKey ? "text" : "password"}
//                   value={formData.razorpaySecretkey || ''}
//                   onChange={(e) => handleInputChange('razorpaySecretkey', e.target.value)}
//                   className={`block w-full border rounded-lg bg-white p-2.5 text-sm text-gray-900 pr-10 ${
//                     errors.razorpaySecretkey ? 'border-red-500' : 'border-gray-300'
//                   }`}
//                 />
//                 <button
//                   type="button"
//                   className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
//                   onClick={() => setShowRazorpaySecretKey(!showRazorpaySecretKey)}
//                 >
//                   {showRazorpaySecretKey ? <HiEyeOff className="w-5 h-5" /> : <HiEye className="w-5 h-5" />}
//                 </button>
//               </div>
//               {errors.razorpaySecretkey && (
//                 <p className="mt-1 text-sm text-red-600">{errors.razorpaySecretkey}</p>
//               )}
//             </div>
//           </div>
//         </Card>
//       )}

//       {/* UG Payment Integration - Show only when UG Payment is selected */}
//       {formData.paymentType === '2' && (
//         <Card className="p-4">
//           <h5 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 break-words">
//             UG Payment Integration
//           </h5>
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//             <div>
//               <Label htmlFor="pgMerchantId" className="mb-2 block">
//                 Merchant ID
//               </Label>
//               <div className="relative">
//                 <input
//                   id="pgMerchantId"
//                   type={showPgMerchantId ? "text" : "password"}
//                   value={formData.pgMerchantId || ''}
//                   onChange={(e) => handleInputChange('pgMerchantId', e.target.value)}
//                   className={`block w-full border rounded-lg bg-white p-2.5 text-sm text-gray-900 pr-10 ${
//                     errors.pgMerchantId ? 'border-red-500' : 'border-gray-300'
//                   }`}
//                 />
//                 <button
//                   type="button"
//                   className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
//                   onClick={() => setShowPgMerchantId(!showPgMerchantId)}
//                 >
//                   {showPgMerchantId ? <HiEyeOff className="w-5 h-5" /> : <HiEye className="w-5 h-5" />}
//                 </button>
//               </div>
//               {errors.pgMerchantId && (
//                 <p className="mt-1 text-sm text-red-600">{errors.pgMerchantId}</p>
//               )}
//             </div>
            
//             <div>
//               <Label htmlFor="pgSecretKey" className="mb-2 block">
//                 Secret Key
//               </Label>
//               <div className="relative">
//                 <input
//                   id="pgSecretKey"
//                   type={showPgSecretKey ? "text" : "password"}
//                   value={formData.pgSecretKey || ''}
//                   onChange={(e) => handleInputChange('pgSecretKey', e.target.value)}
//                   className={`block w-full border rounded-lg bg-white p-2.5 text-sm text-gray-900 pr-10 ${
//                     errors.pgSecretKey ? 'border-red-500' : 'border-gray-300'
//                   }`}
//                 />
//                 <button
//                   type="button"
//                   className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
//                   onClick={() => setShowPgSecretKey(!showPgSecretKey)}
//                 >
//                   {showPgSecretKey ? <HiEyeOff className="w-5 h-5" /> : <HiEye className="w-5 h-5" />}
//                 </button>
//               </div>
//               {errors.pgSecretKey && (
//                 <p className="mt-1 text-sm text-red-600">{errors.pgSecretKey}</p>
//               )}
//             </div>
//           </div>
//         </Card>
//       )}

//       {/* Email Service */}
//       <Card>
//         <div className="flex items-center mb-4">
//           <Checkbox
//             id="enableEmail"
//             checked={formData.isDropdownEnabled}
//             onChange={(e) => handleCheckboxChange('isDropdownEnabled', e.target.checked)}
//             className="mr-2"
//           />
//           <Label htmlFor="enableEmail" className="font-semibold text-gray-900 dark:text-white cursor-pointer">
//             Enable Email Service
//           </Label>
//         </div>

//         {formData.isDropdownEnabled && (
//           <div className="space-y-4">
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//               <div>
//                 <Label htmlFor="emailService" className="mb-2 block">Select Email Service</Label>
//                 <Select
//                   id="emailService"
//                   value={formData.selectedServicesOption}
//                   onChange={(e) => handleSelectChange('selectedServicesOption', e.target.value)}
//                   color={errors.selectedServicesOption ? "failure" : "gray"}
//                   helperText={errors.selectedServicesOption}
//                   className="w-full"
//                 >
//                   <option value="">Please Select</option>
//                   <option value="MailGun SMTP">MailGun SMTP</option>
//                   <option value="Google SMTP">Google SMTP</option>
//                   <option value="Zoho Api">Zoho Api</option>
//                   <option value="Other">Other</option>
//                 </Select>
//               </div>
              
//               <div>
//                 <Label htmlFor="emailTemplate" className="mb-2 block">
//                   Email Template <span className="text-red-600">*</span>
//                 </Label>
//                 <div className="border border-gray-300 rounded-lg overflow-hidden">
//                   <JoditEditor
//                     ref={emailEditorRef}
//                     value={formData.emailTemplate || ''}
//                     config={editorConfig}
//                     onBlur={handleEmailTemplateChange}
//                   />
//                 </div>
//                 {errors.emailTemplate && (
//                   <p className="mt-1 text-sm text-red-600">{errors.emailTemplate}</p>
//                 )}
//               </div>
//             </div>

//             {/* MailGun SMTP Configuration */}
//             {formData.selectedServicesOption === "MailGun SMTP" && (
//               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
//                 <div>
//                   <Label htmlFor="fromEmail" className="mb-2 block">From Email</Label>
//                   <TextInput
//                     id="fromEmail"
//                     value={formData.fromEmail || ''}
//                     onChange={(e) => handleInputChange('fromEmail', e.target.value)}
//                     color={errors.fromEmail ? "failure" : "gray"}
//                     helperText={errors.fromEmail}
//                     className="w-full"
//                   />
//                 </div>
//                 <div>
//                   <Label htmlFor="smtpHost" className="mb-2 block">SMTP Host</Label>
//                   <TextInput
//                     id="smtpHost"
//                     value={formData.smtpHost || ''}
//                     onChange={(e) => handleInputChange('smtpHost', e.target.value)}
//                     color={errors.smtpHost ? "failure" : "gray"}
//                     helperText={errors.smtpHost}
//                     className="w-full"
//                   />
//                 </div>
//                 <div>
//                   <Label htmlFor="smtpPort" className="mb-2 block">SMTP Port</Label>
//                   <TextInput
//                     id="smtpPort"
//                     value={formData.smtpPort || ''}
//                     onChange={(e) => handleInputChange('smtpPort', e.target.value)}
//                     color={errors.smtpPort ? "failure" : "gray"}
//                     helperText={errors.smtpPort}
//                     className="w-full"
//                   />
//                 </div>
//                 <div>
//                   <Label htmlFor="smtpUsername" className="mb-2 block">SMTP Username</Label>
//                   <TextInput
//                     id="smtpUsername"
//                     value={formData.smtpUsername || ''}
//                     onChange={(e) => handleInputChange('smtpUsername', e.target.value)}
//                     className="w-full"
//                   />
//                 </div>
//                 <div>
//                   <Label htmlFor="smtpPassword" className="mb-2 block">SMTP Password</Label>
//                   <PasswordInput
//                     id="smtpPassword"
//                     value={formData.smtpPassword || ''}
//                     onChange={(value) => handleInputChange('smtpPassword', value)}
//                     showPassword={showSmtpPassword}
//                     setShowPassword={setShowSmtpPassword}
//                   />
//                 </div>
//               </div>
//             )}

//             {/* Zoho API Configuration */}
//             {formData.selectedServicesOption === "Zoho Api" && (
//               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
//                 <div>
//                   <Label htmlFor="zohoApiKey" className="mb-2 block">Zoho API Key</Label>
//                   <PasswordInput
//                     id="zohoApiKey"
//                     value={formData.zohoApiKey || ''}
//                     onChange={(value) => handleInputChange('zohoApiKey', value)}
//                     showPassword={showApiKey}
//                     setShowPassword={setShowApiKey}
//                     error={errors.zohoApiKey}
//                   />
//                 </div>
//                 <div>
//                   <Label htmlFor="zohoFromEmail" className="mb-2 block">From Address</Label>
//                   <TextInput
//                     id="zohoFromEmail"
//                     value={formData.zohoFromEmail || ''}
//                     onChange={(e) => handleInputChange('zohoFromEmail', e.target.value)}
//                     color={errors.zohoFromEmail ? "failure" : "gray"}
//                     helperText={errors.zohoFromEmail}
//                     className="w-full"
//                   />
//                 </div>
//                 <div>
//                   <Label htmlFor="bounceAddress" className="mb-2 block">Bounce Address</Label>
//                   <TextInput
//                     id="bounceAddress"
//                     value={formData.bounceAddress || ''}
//                     onChange={(e) => handleInputChange('bounceAddress', e.target.value)}
//                     className="w-full"
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
//             onChange={(e) => handleCheckboxChange('isTemplatesVisible', e.target.checked)}
//             className="mr-2"
//           />
//           <Label htmlFor="enableWhatsApp" className="font-semibold text-gray-900 dark:text-white cursor-pointer">
//             Enable WhatsApp Service
//           </Label>
//         </div>

//         {formData.isTemplatesVisible && (
//           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
//             <div>
//               <Label htmlFor="whatsappTemplate" className="mb-2 block">
//                 WhatsApp Template <span className="text-red-600">*</span>
//               </Label>
//               <TextInput
//                 id="whatsappTemplate"
//                 value={formData.whatsappTemplate || ''}
//                 onChange={(e) => handleInputChange('whatsappTemplate', e.target.value)}
//                 color={errors.whatsappTemplate ? "failure" : "gray"}
//                 helperText={errors.whatsappTemplate}
//                 required
//                 className="w-full"
//               />
//             </div>
            
//             {/* UserId Input */}
//             <div>
//               <Label htmlFor="userId" className="mb-2 block">User ID</Label>
//               <TextInput
//                 id="userId"
//                 value={formData.UserId || ''}
//                 onChange={handleUserIdChange}
//                 className="w-full"
//                 placeholder="Enter User ID"
//               />
//               <div className="mt-1 text-xs text-gray-500">
//                 Current Value: {formData.UserId || 'Empty'}
//               </div>
//             </div>
            
//             <div>
//               <Label htmlFor="wPassword" className="mb-2 block">Password</Label>
//               <PasswordInput
//                 id="wPassword"
//                 value={formData.wPassword || ''}
//                 onChange={(value) => handleInputChange('wPassword', value)}
//                 showPassword={showPassword}
//                 setShowPassword={setShowPassword}
//               />
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
//             onChange={(e) => handleCheckboxChange('isSmsApiEnabled', e.target.checked)}
//             className="mr-2"
//           />
//           <Label htmlFor="enableSMS" className="font-semibold text-gray-900 dark:text-white cursor-pointer">
//             Enable SMS Service
//           </Label>
//         </div>

//         {formData.isSmsApiEnabled && (
//           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
//             <div>
//               <Label htmlFor="smsTemplate" className="mb-2 block">
//                 SMS Template <span className="text-red-600">*</span>
//               </Label>
//               <TextInput
//                 id="smsTemplate"
//                 value={formData.smsTemplate || ''}
//                 onChange={(e) => handleInputChange('smsTemplate', e.target.value)}
//                 color={errors.smsTemplate ? "failure" : "gray"}
//                 helperText={errors.smsTemplate}
//                 required
//                 className="w-full"
//               />
//             </div>
//             <div>
//               <Label htmlFor="smsApiKey" className="mb-2 block">API Key</Label>
//               <TextInput
//                 id="smsApiKey"
//                 value={formData.smsApikey || ''}
//                 onChange={(e) => handleInputChange('smsApikey', e.target.value)}
//                 className="w-full"
//               />
//             </div>
//             <div>
//               <Label htmlFor="smsSecretKey" className="mb-2 block">Secret Key</Label>
//               <PasswordInput
//                 id="smsSecretKey"
//                 value={formData.smsSecretkey || ''}
//                 onChange={(value) => handleInputChange('smsSecretkey', value)}
//                 showPassword={showSecretKey}
//                 setShowPassword={setShowSecretKey}
//               />
//             </div>
//           </div>
//         )}
//       </Card>
//     </div>
//   );
// };

// export default ThirdPartyApiSetup;








// // import React, { useState, useEffect, useRef, useMemo, useCallback } from "react";
// // import { Card, Label, Select, TextInput, Textarea, Checkbox, Alert } from "flowbite-react";
// // import { HiInformationCircle, HiEye, HiEyeOff } from "react-icons/hi";
// // import { FormData } from "src/types/formTypes";
// // import JoditEditor from "jodit-react";

// // interface ThirdPartyApiSetupProps {
// //   formData: FormData;
// //   updateFormData: (updates: Partial<FormData>) => void;
// //   errors?: Record<string, string>;
// // }

// // const ThirdPartyApiSetup: React.FC<ThirdPartyApiSetupProps> = ({ 
// //   formData, 
// //   updateFormData,
// //   errors = {} 
// // }) => {
// //   const [showApiKey, setShowApiKey] = useState(false);
// //   const [showPassword, setShowPassword] = useState(false);
// //   const [showSecretKey, setShowSecretKey] = useState(false);
// //   const [showRazorpaySecretKey, setShowRazorpaySecretKey] = useState(false);
// //   const [showSmtpPassword, setShowSmtpPassword] = useState(false);
// //   const [showRazorpayApiKey, setShowRazorpayApiKey] = useState(false);

// //   // Jodit Editor ref for email template
// //   const emailEditorRef = useRef(null);

// //   console.log('Rendering ThirdPartyApiSetup Component', formData);

// //   // Jodit Editor configuration
// //   const editorConfig = useMemo(
// //     () => ({
// //       readonly: false,
// //       height: 300,
// //       toolbarSticky: false,
// //       toolbarAdaptive: false,
// //       buttons: [
// //         "source",
// //         "|",
// //         "bold",
// //         "italic",
// //         "underline",
// //         "strikethrough",
// //         "|",
// //         "ul",
// //         "ol",
// //         "|",
// //         "font",
// //         "fontsize",
// //         "brush",
// //         "paragraph",
// //         "|",
// //         "image",
// //         "video",
// //         "table",
// //         "link",
// //         "|",
// //         "left",
// //         "center",
// //         "right",
// //         "justify",
// //         "|",
// //         "undo",
// //         "redo",
// //         "|",
// //         "hr",
// //         "eraser",
// //         "copyformat",
// //         "fullsize",
// //       ],
// //       showXPathInStatusbar: false,
// //       showCharsCounter: false,
// //       showWordsCounter: false,
// //       uploader: { insertImageAsBase64URI: true },
// //       placeholder: "Start typing your email template here...",
// //       theme: "default",
// //     }),
// //     []
// //   );

// //   const handleEmailTemplateChange = useCallback((newContent: string) => {
// //     console.log('Email template changed:', newContent);
// //     updateFormData({ emailTemplate: newContent });
// //   }, [updateFormData]);

// //   // Debug effect
// //   useEffect(() => {
// //     console.log('ThirdPartyApiSetup - Current UserId:', formData.UserId);
// //   }, [formData.UserId]);

// //   const handleCheckboxChange = (field: keyof FormData, value: boolean) => {
// //     console.log(`Checkbox ${field}:`, value);
// //     updateFormData({ [field]: value });
// //   };

// //   const handleInputChange = (field: keyof FormData, value: string) => {
// //     console.log(`Input ${field}:`, value);
// //     updateFormData({ [field]: value });
// //   };

// //   const handleSelectChange = (field: keyof FormData, value: string) => {
// //     console.log(`Select ${field}:`, value);
// //     updateFormData({ [field]: value });
// //   };

// //   // Specific handler for UserId
// //   const handleUserIdChange = (e: React.ChangeEvent<HTMLInputElement>) => {
// //     const value = e.target.value;
// //     console.log('UserId changing to:', value);
// //     updateFormData({ UserId: value });
// //   };

// //   // Password Input Component - FIXED SYNTAX
// //   interface PasswordInputProps {
// //     id: string;
// //     value: string;
// //     onChange: (value: string) => void;
// //     showPassword: boolean;
// //     setShowPassword: (value: boolean) => void;
// //     placeholder?: string;
// //     error?: string;
// //   }

// //   const PasswordInput: React.FC<PasswordInputProps> = ({ 
// //     id, 
// //     value, 
// //     onChange, 
// //     showPassword, 
// //     setShowPassword, 
// //     placeholder,
// //     error
// //   }) => {
// //     const inputRef = React.useRef<HTMLInputElement>(null);

// //     const handleToggle = () => {
// //       setShowPassword(!showPassword);
// //       setTimeout(() => {
// //         if (inputRef.current) {
// //           inputRef.current.focus();
// //           const length = inputRef.current.value.length;
// //           inputRef.current.setSelectionRange(length, length);
// //         }
// //       }, 0);
// //     };

// //     const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
// //       onChange(e.target.value);
// //     };

// //     return (
// //       <div className="relative">
// //         <input
// //           ref={inputRef}
// //           id={id}
// //           type={showPassword ? "text" : "password"}
// //           value={value}
// //           onChange={handleChange}
// //           placeholder={placeholder}
// //           className={`block w-full border rounded-lg bg-white p-2.5 text-sm text-gray-900 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 pr-10 ${
// //             error ? 'border-red-500' : 'border-gray-300'
// //           }`}
// //         />
// //         <button
// //           type="button"
// //           className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
// //           onClick={handleToggle}
// //         >
// //           {showPassword ? <HiEyeOff className="w-5 h-5" /> : <HiEye className="w-5 h-5" />}
// //         </button>
// //         {error && (
// //           <p className="mt-1 text-sm text-red-600">{error}</p>
// //         )}
// //       </div>
// //     );
// //   };

// //   // Razorpay Password Visibility Icons - FIXED JSX
// //   const EyeIcon = ({ show }: { show: boolean }) => {
// //     if (show) {
// //       return (
// //         <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
// //           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
// //         </svg>
// //       );
// //     }
// //     return (
// //       <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
// //         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
// //         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
// //       </svg>
// //     );
// //   };

// //   return (
// //     <div className="space-y-6">
// //       <Alert color="info" icon={HiInformationCircle} className="break-words">
// //         Note: For inputs such as WhatsApp, Email, SMS, and Razorpay API configurations, 
// //         you may skip entering values. If left blank, the system will automatically apply 
// //         the default administration settings for these services.
// //       </Alert>

// //       {/* Email Service */}
// //       <Card>
// //         <div className="flex items-center mb-4">
// //           <Checkbox
// //             id="enableEmail"
// //             checked={formData.isDropdownEnabled}
// //             onChange={(e) => handleCheckboxChange('isDropdownEnabled', e.target.checked)}
// //             className="mr-2"
// //           />
// //           <Label htmlFor="enableEmail" className="font-semibold text-gray-900 dark:text-white cursor-pointer">
// //             Enable Email Service
// //           </Label>
// //         </div>

// //         {formData.isDropdownEnabled && (
// //           <div className="space-y-4">
// //             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
// //               <div>
// //                 <Label htmlFor="emailService" className="mb-2 block">Select Email Service</Label>
// //                 <Select
// //                   id="emailService"
// //                   value={formData.selectedServicesOption}
// //                   onChange={(e) => handleSelectChange('selectedServicesOption', e.target.value)}
// //                   color={errors.selectedServicesOption ? "failure" : "gray"}
// //                   helperText={errors.selectedServicesOption}
// //                   className="w-full"
// //                 >
// //                   <option value="">Please Select</option>
// //                   <option value="MailGun SMTP">MailGun SMTP</option>
// //                   <option value="Google SMTP">Google SMTP</option>
// //                   <option value="Zoho Api">Zoho Api</option>
// //                   <option value="Other">Other</option>
// //                 </Select>
// //               </div>
              
// //               <div>
// //                 <Label htmlFor="emailTemplate" className="mb-2 block">
// //                   Email Template <span className="text-red-600">*</span>
// //                 </Label>
// //                 <div className="border border-gray-300 rounded-lg overflow-hidden">
// //                   <JoditEditor
// //                     ref={emailEditorRef}
// //                     value={formData.emailTemplate}
// //                     config={editorConfig}
// //                     onBlur={handleEmailTemplateChange}
// //                   />
// //                 </div>
// //                 {errors.emailTemplate && (
// //                   <p className="mt-1 text-sm text-red-600">{errors.emailTemplate}</p>
// //                 )}
// //               </div>
// //             </div>

// //             {/* MailGun SMTP Configuration */}
// //             {formData.selectedServicesOption === "MailGun SMTP" && (
// //               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
// //                 <div>
// //                   <Label htmlFor="fromEmail" className="mb-2 block">From Email</Label>
// //                   <TextInput
// //                     id="fromEmail"
// //                     value={formData.fromEmail}
// //                     onChange={(e) => handleInputChange('fromEmail', e.target.value)}
// //                     color={errors.fromEmail ? "failure" : "gray"}
// //                     helperText={errors.fromEmail}
// //                     className="w-full"
// //                   />
// //                 </div>
// //                 <div>
// //                   <Label htmlFor="smtpHost" className="mb-2 block">SMTP Host</Label>
// //                   <TextInput
// //                     id="smtpHost"
// //                     value={formData.smtpHost}
// //                     onChange={(e) => handleInputChange('smtpHost', e.target.value)}
// //                     color={errors.smtpHost ? "failure" : "gray"}
// //                     helperText={errors.smtpHost}
// //                     className="w-full"
// //                   />
// //                 </div>
// //                 <div>
// //                   <Label htmlFor="smtpPort" className="mb-2 block">SMTP Port</Label>
// //                   <TextInput
// //                     id="smtpPort"
// //                     value={formData.smtpPort}
// //                     onChange={(e) => handleInputChange('smtpPort', e.target.value)}
// //                     color={errors.smtpPort ? "failure" : "gray"}
// //                     helperText={errors.smtpPort}
// //                     className="w-full"
// //                   />
// //                 </div>
// //                 <div>
// //                   <Label htmlFor="smtpUsername" className="mb-2 block">SMTP Username</Label>
// //                   <TextInput
// //                     id="smtpUsername"
// //                     value={formData.smtpUsername}
// //                     onChange={(e) => handleInputChange('smtpUsername', e.target.value)}
// //                     className="w-full"
// //                   />
// //                 </div>
// //                 <div>
// //                   <Label htmlFor="smtpPassword" className="mb-2 block">SMTP Password</Label>
// //                   <PasswordInput
// //                     id="smtpPassword"
// //                     value={formData.smtpPassword}
// //                     onChange={(value) => handleInputChange('smtpPassword', value)}
// //                     showPassword={showSmtpPassword}
// //                     setShowPassword={setShowSmtpPassword}
// //                   />
// //                 </div>
// //               </div>
// //             )}

// //             {/* Zoho API Configuration */}
// //             {formData.selectedServicesOption === "Zoho Api" && (
// //               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
// //                 <div>
// //                   <Label htmlFor="zohoApiKey" className="mb-2 block">Zoho API Key</Label>
// //                   <PasswordInput
// //                     id="zohoApiKey"
// //                     value={formData.zohoApiKey}
// //                     onChange={(value) => handleInputChange('zohoApiKey', value)}
// //                     showPassword={showApiKey}
// //                     setShowPassword={setShowApiKey}
// //                     error={errors.zohoApiKey}
// //                   />
// //                 </div>
// //                 <div>
// //                   <Label htmlFor="zohoFromEmail" className="mb-2 block">From Address</Label>
// //                   <TextInput
// //                     id="zohoFromEmail"
// //                     value={formData.zohoFromEmail}
// //                     onChange={(e) => handleInputChange('zohoFromEmail', e.target.value)}
// //                     color={errors.zohoFromEmail ? "failure" : "gray"}
// //                     helperText={errors.zohoFromEmail}
// //                     className="w-full"
// //                   />
// //                 </div>
// //                 <div>
// //                   <Label htmlFor="bounceAddress" className="mb-2 block">Bounce Address</Label>
// //                   <TextInput
// //                     id="bounceAddress"
// //                     value={formData.bounceAddress}
// //                     onChange={(e) => handleInputChange('bounceAddress', e.target.value)}
// //                     className="w-full"
// //                   />
// //                 </div>
// //               </div>
// //             )}
// //           </div>
// //         )}
// //       </Card>

// //       {/* WhatsApp Service */}
// //       <Card>
// //         <div className="flex items-center mb-4">
// //           <Checkbox
// //             id="enableWhatsApp"
// //             checked={formData.isTemplatesVisible}
// //             onChange={(e) => handleCheckboxChange('isTemplatesVisible', e.target.checked)}
// //             className="mr-2"
// //           />
// //           <Label htmlFor="enableWhatsApp" className="font-semibold text-gray-900 dark:text-white cursor-pointer">
// //             Enable WhatsApp Service
// //           </Label>
// //         </div>

// //         {formData.isTemplatesVisible && (
// //           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
// //             <div>
// //               <Label htmlFor="whatsappTemplate" className="mb-2 block">
// //                 WhatsApp Template <span className="text-red-600">*</span>
// //               </Label>
// //               <TextInput
// //                 id="whatsappTemplate"
// //                 value={formData.whatsappTemplate}
// //                 onChange={(e) => handleInputChange('whatsappTemplate', e.target.value)}
// //                 color={errors.whatsappTemplate ? "failure" : "gray"}
// //                 helperText={errors.whatsappTemplate}
// //                 required
// //                 className="w-full"
// //               />
// //             </div>
            
// //             {/* UserId Input - FIXED */}
// //             <div>
// //               <Label htmlFor="userId" className="mb-2 block">User ID</Label>
// //               <TextInput
// //                 id="userId"
// //                 value={formData.UserId}
// //                 onChange={handleUserIdChange}
// //                 className="w-full"
// //                 placeholder="Enter User ID"
// //               />
// //               <div className="mt-1 text-xs text-gray-500">
// //                 Current Value: {formData.UserId || 'Empty'}
// //               </div>
// //             </div>
            
// //             <div>
// //               <Label htmlFor="wPassword" className="mb-2 block">Password</Label>
// //               <PasswordInput
// //                 id="wPassword"
// //                 value={formData.wPassword}
// //                 onChange={(value) => handleInputChange('wPassword', value)}
// //                 showPassword={showPassword}
// //                 setShowPassword={setShowPassword}
// //               />
// //             </div>
// //           </div>
// //         )}
// //       </Card>

// //       {/* SMS Service */}
// //       <Card>
// //         <div className="flex items-center mb-4">
// //           <Checkbox
// //             id="enableSMS"
// //             checked={formData.isSmsApiEnabled}
// //             onChange={(e) => handleCheckboxChange('isSmsApiEnabled', e.target.checked)}
// //             className="mr-2"
// //           />
// //           <Label htmlFor="enableSMS" className="font-semibold text-gray-900 dark:text-white cursor-pointer">
// //             Enable SMS Service
// //           </Label>
// //         </div>

// //         {formData.isSmsApiEnabled && (
// //           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
// //             <div>
// //               <Label htmlFor="smsTemplate" className="mb-2 block">
// //                 SMS Template <span className="text-red-600">*</span>
// //               </Label>
// //               <TextInput
// //                 id="smsTemplate"
// //                 value={formData.smsTemplate}
// //                 onChange={(e) => handleInputChange('smsTemplate', e.target.value)}
// //                 color={errors.smsTemplate ? "failure" : "gray"}
// //                 helperText={errors.smsTemplate}
// //                 required
// //                 className="w-full"
// //               />
// //             </div>
// //             <div>
// //               <Label htmlFor="smsApiKey" className="mb-2 block">API Key</Label>
// //               <TextInput
// //                 id="smsApiKey"
// //                 value={formData.smsApikey}
// //                 onChange={(e) => handleInputChange('smsApikey', e.target.value)}
// //                 className="w-full"
// //               />
// //             </div>
// //             <div>
// //               <Label htmlFor="smsSecretKey" className="mb-2 block">Secret Key</Label>
// //               <PasswordInput
// //                 id="smsSecretKey"
// //                 value={formData.smsSecretkey}
// //                 onChange={(value) => handleInputChange('smsSecretkey', value)}
// //                 showPassword={showSecretKey}
// //                 setShowPassword={setShowSecretKey}
// //               />
// //             </div>
// //           </div>
// //         )}
// //       </Card>

// //       {/* Razorpay Integration - FIXED JSX */}
// //       <Card className="p-4">
// //         <h5 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 break-words">
// //           Razorpay Integration
// //         </h5>
// //         <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
// //           <div>
// //             <Label htmlFor="razorpayApiKey" className="mb-2 block">
// //               API Key
// //             </Label>
// //             <div className="relative">
// //               <TextInput
// //                 id="razorpayApiKey"
// //                 type={showRazorpayApiKey ? "text" : "password"}
// //                 value={formData.razorpayApikey}
// //                 onChange={(e) => handleInputChange('razorpayApikey', e.target.value)}
// //                 color={errors.razorpayApikey ? "failure" : "gray"}
// //                 helperText={errors.razorpayApikey}
// //                 className="focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
// //               />
// //               <button
// //                 type="button"
// //                 className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
// //                 onClick={() => setShowRazorpayApiKey(!showRazorpayApiKey)}
// //               >
// //                 <EyeIcon show={showRazorpayApiKey} />
// //               </button>
// //             </div>
// //           </div>
          
// //           <div>
// //             <Label htmlFor="razorpaySecretKey" className="mb-2 block">
// //               Secret Key
// //             </Label>
// //             <div className="relative">
// //               <TextInput
// //                 id="razorpaySecretKey"
// //                 type={showRazorpaySecretKey ? "text" : "password"}
// //                 value={formData.razorpaySecretkey}
// //                 onChange={(e) => handleInputChange('razorpaySecretkey', e.target.value)}
// //                 color={errors.razorpaySecretkey ? "failure" : "gray"}
// //                 helperText={errors.razorpaySecretkey}
// //                 className="focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
// //               />
// //               <button
// //                 type="button"
// //                 className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
// //                 onClick={() => setShowRazorpaySecretKey(!showRazorpaySecretKey)}
// //               >
// //                 <EyeIcon show={showRazorpaySecretKey} />
// //               </button>
// //             </div>
// //           </div>
// //         </div>
// //       </Card>
// //     </div>
// //   );
// // };

// // export default ThirdPartyApiSetup;


import React, { useState, useEffect, useRef, useMemo, useCallback } from "react";
import { Card, Label, Select, TextInput, Textarea, Checkbox, Alert } from "flowbite-react";
import { HiInformationCircle, HiEye, HiEyeOff } from "react-icons/hi";
import { FormData } from "src/types/formTypes";
import JoditEditor from "jodit-react";

interface ThirdPartyApiSetupProps {
  formData: FormData;
  updateFormData: (updates: Partial<FormData>) => void;
  errors?: Record<string, string>;
}

const ThirdPartyApiSetup: React.FC<ThirdPartyApiSetupProps> = ({ 
  formData, 
  updateFormData,
  errors = {} 
}) => {
  const [showApiKey, setShowApiKey] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showSecretKey, setShowSecretKey] = useState(false);
  const [showRazorpaySecretKey, setShowRazorpaySecretKey] = useState(false);
  const [showSmtpPassword, setShowSmtpPassword] = useState(false);
  const [showRazorpayApiKey, setShowRazorpayApiKey] = useState(false);
  const [showPgSecretKey, setShowPgSecretKey] = useState(false);
  const [showPgMerchantId, setShowPgMerchantId] = useState(false);

  // Jodit Editor ref for email template
  const emailEditorRef = useRef(null);

  console.log('Rendering ThirdPartyApiSetup Component', formData);

  // Jodit Editor configuration
  const editorConfig = useMemo(
    () => ({
      readonly: false,
      height: 300,
      toolbarSticky: false,
      toolbarAdaptive: false,
      buttons: [
        "source",
        "|",
        "bold",
        "italic",
        "underline",
        "strikethrough",
        "|",
        "ul",
        "ol",
        "|",
        "font",
        "fontsize",
        "brush",
        "paragraph",
        "|",
        "image",
        "video",
        "table",
        "link",
        "|",
        "left",
        "center",
        "right",
        "justify",
        "|",
        "undo",
        "redo",
        "|",
        "hr",
        "eraser",
        "copyformat",
        "fullsize",
      ],
      showXPathInStatusbar: false,
      showCharsCounter: false,
      showWordsCounter: false,
      uploader: { insertImageAsBase64URI: true },
      placeholder: "Start typing your email template here...",
      theme: "default",
    }),
    []
  );

  const handleEmailTemplateChange = useCallback((newContent: string) => {
    console.log('Email template changed:', newContent);
    updateFormData({ emailTemplate: newContent });
  }, [updateFormData]);

  // Debug effect
  useEffect(() => {
    console.log('ThirdPartyApiSetup - Current paymentEnabled:', formData.paymentEnabled);
    console.log('Current Payment Type:', formData.payment_type);
    console.log('Current Payment Status:', formData.payment_status);
  }, [formData.paymentEnabled, formData.payment_type, formData.payment_status]);

  const handleCheckboxChange = (field: keyof FormData, value: boolean) => {
    console.log(`Checkbox ${field}:`, value);
    
    if (field === 'paymentEnabled') {
      if (value) {
        // Enable payments - set payment status based on selected payment type
        const paymentType = formData.payment_type || '1'; // Default to Razorpay
        const paymentStatus = paymentType === '1' ? '1' : '2'; // 1 for Razorpay, 2 for UG Payment
        
        updateFormData({ 
          paymentEnabled: true,
          payment_type: paymentType,
          payment_status: paymentStatus
        });
      } else {
        // Disable payments - Set both to empty strings (not 0)
        updateFormData({ 
          paymentEnabled: false,
          payment_type: '', // Empty string
          payment_status: '', // Empty string
          // Also clear payment credentials
          razorpayApikey: '',
          razorpaySecretkey: '',
          pgMerchantId: '',
          pgSecretKey: ''
        });
      }
    } else {
      updateFormData({ [field]: value });
    }
  };

  const handleInputChange = (field: keyof FormData, value: string) => {
    console.log(`Input ${field}:`, value);
    updateFormData({ [field]: value });
  };

  const handleSelectChange = (field: keyof FormData, value: string) => {
    console.log(`Select ${field}:`, value);
    
    if (field === 'payment_type') {
      // Only update if payments are enabled
      if (formData.paymentEnabled) {
        const paymentStatus = value === '1' ? '1' : '2';
        updateFormData({ 
          [field]: value,
          payment_status: paymentStatus
        });
      } else {
        // If payments are disabled, don't update payment_status
        updateFormData({ 
          [field]: value
          // payment_status remains empty
        });
      }
    } else {
      updateFormData({ [field]: value });
    }
  };

  // Specific handler for UserId
  const handleUserIdChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    console.log('UserId changing to:', value);
    updateFormData({ UserId: value });
  };

  // Password Input Component
  interface PasswordInputProps {
    id: string;
    value: string;
    onChange: (value: string) => void;
    showPassword: boolean;
    setShowPassword: (value: boolean) => void;
    placeholder?: string;
    error?: string;
  }

  const PasswordInput: React.FC<PasswordInputProps> = ({ 
    id, 
    value, 
    onChange, 
    showPassword, 
    setShowPassword, 
    placeholder,
    error
  }) => {
    const inputRef = React.useRef<HTMLInputElement>(null);

    const handleToggle = () => {
      setShowPassword(!showPassword);
      setTimeout(() => {
        if (inputRef.current) {
          inputRef.current.focus();
          const length = inputRef.current.value.length;
          inputRef.current.setSelectionRange(length, length);
        }
      }, 0);
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      onChange(e.target.value);
    };

    return (
      <div className="relative">
        <input
          ref={inputRef}
          id={id}
          type={showPassword ? "text" : "password"}
          value={value}
          onChange={handleChange}
          placeholder={placeholder}
          className={`block w-full border rounded-lg bg-white p-2.5 text-sm text-gray-900 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 pr-10 ${
            error ? 'border-red-500' : 'border-gray-300'
          }`}
        />
        <button
          type="button"
          className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
          onClick={handleToggle}
        >
          {showPassword ? <HiEyeOff className="w-5 h-5" /> : <HiEye className="w-5 h-5" />}
        </button>
        {error && (
          <p className="mt-1 text-sm text-red-600">{error}</p>
        )}
      </div>
    );
  };

  console.log('Form Data:', formData);

  return (
    <div className="space-y-6">
      <Alert color="info" icon={HiInformationCircle} className="break-words">
        Note: For inputs such as WhatsApp, Email, SMS, and Payment configurations, 
        you may skip entering values. If left blank, the system will automatically apply 
        the default administration settings for these services.
      </Alert>

      {/* Payment Configuration Card */}
      <Card>
        <div className="flex items-center mb-4">
          <Checkbox
            id="enablePayments"
            checked={formData.paymentEnabled || false}
            onChange={(e) => handleCheckboxChange('paymentEnabled', e.target.checked)}
            className="mr-2"
          />
          <Label htmlFor="enablePayments" className="font-semibold text-gray-900 dark:text-white cursor-pointer">
            Enable Payment Service
          </Label>
        </div>

        {formData.paymentEnabled && (
          <div className="space-y-4">
            {/* Payment Type Dropdown - Only show when enabled */}
            <div>
              <Label htmlFor="paymentType" className="mb-2 block">
                Payment Type <span className="text-red-600">*</span>
              </Label>
              <Select
                id="paymentType"
                value={formData.paymentType || '1'}
                onChange={(e) => handleSelectChange('paymentType', e.target.value)}
                color={errors.paymentType ? "failure" : "gray"}
                helperText={errors.paymentType}
                className="w-full"
              >
                <option value="1">Razorpay</option>
                <option value="2">UG Payment</option>
              </Select>
            </div>

            {/* Razorpay Integration - Show only when Razorpay is selected and enabled */}
            {formData.paymentType == '1' && (
              <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                <h5 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 break-words">
                  Razorpay Integration
                </h5>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="razorpayApiKey" className="mb-2 block">
                      API Key
                    </Label>
                    <div className="relative">
                      <input
                        id="razorpayApiKey"
                        type={showRazorpayApiKey ? "text" : "password"}
                        value={formData.razorpayApikey || ''}
                        onChange={(e) => handleInputChange('razorpayApikey', e.target.value)}
                        className={`block w-full border rounded-lg bg-white p-2.5 text-sm text-gray-900 pr-10 ${
                          errors.razorpayApikey ? 'border-red-500' : 'border-gray-300'
                        }`}
                      />
                      <button
                        type="button"
                        className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                        onClick={() => setShowRazorpayApiKey(!showRazorpayApiKey)}
                      >
                        {showRazorpayApiKey ? <HiEyeOff className="w-5 h-5" /> : <HiEye className="w-5 h-5" />}
                      </button>
                    </div>
                    {errors.razorpayApikey && (
                      <p className="mt-1 text-sm text-red-600">{errors.razorpayApikey}</p>
                    )}
                  </div>
                  
                  <div>
                    <Label htmlFor="razorpaySecretKey" className="mb-2 block">
                      Secret Key
                    </Label>
                    <div className="relative">
                      <input
                        id="razorpaySecretKey"
                        type={showRazorpaySecretKey ? "text" : "password"}
                        value={formData.razorpaySecretkey || ''}
                        onChange={(e) => handleInputChange('razorpaySecretkey', e.target.value)}
                        className={`block w-full border rounded-lg bg-white p-2.5 text-sm text-gray-900 pr-10 ${
                          errors.razorpaySecretkey ? 'border-red-500' : 'border-gray-300'
                        }`}
                      />
                      <button
                        type="button"
                        className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                        onClick={() => setShowRazorpaySecretKey(!showRazorpaySecretKey)}
                      >
                        {showRazorpaySecretKey ? <HiEyeOff className="w-5 h-5" /> : <HiEye className="w-5 h-5" />}
                      </button>
                    </div>
                    {errors.razorpaySecretkey && (
                      <p className="mt-1 text-sm text-red-600">{errors.razorpaySecretkey}</p>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* UG Payment Integration - Show only when UG Payment is selected and enabled */}
            {formData.paymentType == '2' && (
              <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                <h5 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 break-words">
                  UG Payment Integration
                </h5>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="pgMerchantId" className="mb-2 block">
                      Merchant ID
                    </Label>
                    <div className="relative">
                      <input
                        id="pgMerchantId"
                        type={showPgMerchantId ? "text" : "password"}
                        value={formData.pgMerchantId || ''}
                        onChange={(e) => handleInputChange('pgMerchantId', e.target.value)}
                        className={`block w-full border rounded-lg bg-white p-2.5 text-sm text-gray-900 pr-10 ${
                          errors.pgMerchantId ? 'border-red-500' : 'border-gray-300'
                        }`}
                      />
                      <button
                        type="button"
                        className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                        onClick={() => setShowPgMerchantId(!showPgMerchantId)}
                      >
                        {showPgMerchantId ? <HiEyeOff className="w-5 h-5" /> : <HiEye className="w-5 h-5" />}
                      </button>
                    </div>
                    {errors.pgMerchantId && (
                      <p className="mt-1 text-sm text-red-600">{errors.pgMerchantId}</p>
                    )}
                  </div>
                  
                  <div>
                    <Label htmlFor="pgSecretKey" className="mb-2 block">
                      Secret Key
                    </Label>
                    <div className="relative">
                      <input
                        id="pgSecretKey"
                        type={showPgSecretKey ? "text" : "password"}
                        value={formData.pgSecretKey || ''}
                        onChange={(e) => handleInputChange('pgSecretKey', e.target.value)}
                        className={`block w-full border rounded-lg bg-white p-2.5 text-sm text-gray-900 pr-10 ${
                          errors.pgSecretKey ? 'border-red-500' : 'border-gray-300'
                        }`}
                      />
                      <button
                        type="button"
                        className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                        onClick={() => setShowPgSecretKey(!showPgSecretKey)}
                      >
                        {showPgSecretKey ? <HiEyeOff className="w-5 h-5" /> : <HiEye className="w-5 h-5" />}
                      </button>
                    </div>
                    {errors.pgSecretKey && (
                      <p className="mt-1 text-sm text-red-600">{errors.pgSecretKey}</p>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Payment Status Display - Always show */}
        {/* <div className="mt-4 text-sm text-gray-600">
          <span className="font-medium">Payment Status:</span> 
          <span className={`ml-2 px-2 py-1 rounded ${
            !formData.paymentEnabled || !formData.payment_status ? 'bg-gray-200 text-gray-700' : 
            formData.payment_status === '1' ? 'bg-green-100 text-green-800' : 
            'bg-blue-100 text-blue-800'
          }`}>
            {!formData.paymentEnabled || !formData.payment_status ? 'Disabled' : 
             formData.payment_status === '1' ? 'Razorpay Enabled' : 
             'UG Payment Enabled'}
          </span>
        </div> */}
      </Card>

      {/* Rest of the component remains same */}
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
                  onChange={(e) => handleSelectChange('selectedServicesOption', e.target.value)}
                  color={errors.selectedServicesOption ? "failure" : "gray"}
                  helperText={errors.selectedServicesOption}
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
                <div className="border border-gray-300 rounded-lg overflow-hidden">
                  <JoditEditor
                    ref={emailEditorRef}
                    value={formData.emailTemplate || ''}
                    config={editorConfig}
                    onBlur={handleEmailTemplateChange}
                  />
                </div>
                {errors.emailTemplate && (
                  <p className="mt-1 text-sm text-red-600">{errors.emailTemplate}</p>
                )}
              </div>
            </div>

            {/* MailGun SMTP Configuration */}
            {formData.selectedServicesOption === "MailGun SMTP" && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
                <div>
                  <Label htmlFor="fromEmail" className="mb-2 block">From Email</Label>
                  <TextInput
                    id="fromEmail"
                    value={formData.fromEmail || ''}
                    onChange={(e) => handleInputChange('fromEmail', e.target.value)}
                    color={errors.fromEmail ? "failure" : "gray"}
                    helperText={errors.fromEmail}
                    className="w-full"
                  />
                </div>
                <div>
                  <Label htmlFor="smtpHost" className="mb-2 block">SMTP Host</Label>
                  <TextInput
                    id="smtpHost"
                    value={formData.smtpHost || ''}
                    onChange={(e) => handleInputChange('smtpHost', e.target.value)}
                    color={errors.smtpHost ? "failure" : "gray"}
                    helperText={errors.smtpHost}
                    className="w-full"
                  />
                </div>
                <div>
                  <Label htmlFor="smtpPort" className="mb-2 block">SMTP Port</Label>
                  <TextInput
                    id="smtpPort"
                    value={formData.smtpPort || ''}
                    onChange={(e) => handleInputChange('smtpPort', e.target.value)}
                    color={errors.smtpPort ? "failure" : "gray"}
                    helperText={errors.smtpPort}
                    className="w-full"
                  />
                </div>
                <div>
                  <Label htmlFor="smtpUsername" className="mb-2 block">SMTP Username</Label>
                  <TextInput
                    id="smtpUsername"
                    value={formData.smtpUsername || ''}
                    onChange={(e) => handleInputChange('smtpUsername', e.target.value)}
                    className="w-full"
                  />
                </div>
                <div>
                  <Label htmlFor="smtpPassword" className="mb-2 block">SMTP Password</Label>
                  <PasswordInput
                    id="smtpPassword"
                    value={formData.smtpPassword || ''}
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
                    value={formData.zohoApiKey || ''}
                    onChange={(value) => handleInputChange('zohoApiKey', value)}
                    showPassword={showApiKey}
                    setShowPassword={setShowApiKey}
                    error={errors.zohoApiKey}
                  />
                </div>
                <div>
                  <Label htmlFor="zohoFromEmail" className="mb-2 block">From Address</Label>
                  <TextInput
                    id="zohoFromEmail"
                    value={formData.zohoFromEmail || ''}
                    onChange={(e) => handleInputChange('zohoFromEmail', e.target.value)}
                    color={errors.zohoFromEmail ? "failure" : "gray"}
                    helperText={errors.zohoFromEmail}
                    className="w-full"
                  />
                </div>
                <div>
                  <Label htmlFor="bounceAddress" className="mb-2 block">Bounce Address</Label>
                  <TextInput
                    id="bounceAddress"
                    value={formData.bounceAddress || ''}
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
                value={formData.whatsappTemplate || ''}
                onChange={(e) => handleInputChange('whatsappTemplate', e.target.value)}
                color={errors.whatsappTemplate ? "failure" : "gray"}
                helperText={errors.whatsappTemplate}
                required
                className="w-full"
              />
            </div>
            
            {/* UserId Input */}
            <div>
              <Label htmlFor="userId" className="mb-2 block">User ID</Label>
              <TextInput
                id="userId"
                value={formData.UserId || ''}
                onChange={handleUserIdChange}
                className="w-full"
                placeholder="Enter User ID"
              />
              <div className="mt-1 text-xs text-gray-500">
                Current Value: {formData.UserId || 'Empty'}
              </div>
            </div>
            
            <div>
              <Label htmlFor="wPassword" className="mb-2 block">Password</Label>
              <PasswordInput
                id="wPassword"
                value={formData.wPassword || ''}
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
                value={formData.smsTemplate || ''}
                onChange={(e) => handleInputChange('smsTemplate', e.target.value)}
                color={errors.smsTemplate ? "failure" : "gray"}
                helperText={errors.smsTemplate}
                required
                className="w-full"
              />
            </div>
            <div>
              <Label htmlFor="smsApiKey" className="mb-2 block">API Key</Label>
              <TextInput
                id="smsApiKey"
                value={formData.smsApikey || ''}
                onChange={(e) => handleInputChange('smsApikey', e.target.value)}
                className="w-full"
              />
            </div>
            <div>
              <Label htmlFor="smsSecretKey" className="mb-2 block">Secret Key</Label>
              <PasswordInput
                id="smsSecretKey"
                value={formData.smsSecretkey || ''}
                onChange={(value) => handleInputChange('smsSecretkey', value)}
                showPassword={showSecretKey}
                setShowPassword={setShowSecretKey}
              />
            </div>
          </div>
        )}
      </Card>
    </div>
  );
};

export default ThirdPartyApiSetup;