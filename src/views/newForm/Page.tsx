// "use client";
// import React from "react";
// import { useEffect, useState } from "react";
// import { 
//   Alert, 
//   Breadcrumb, 
//   Button, 
//   Card, 
//   Checkbox, 
//   FileInput, 
//   Label, 
//   Select, 
//   TextInput, 
//   Textarea
// } from "flowbite-react";
// import { 
//   HiInformationCircle, 
//   HiEye, 
//   HiEyeOff, 
//   HiCloudUpload,
//   HiCheckCircle,
//   HiArrowLeft,
//   HiArrowRight,
//   HiHome
// } from "react-icons/hi";

// // Custom Stepper Component
// interface StepperProps {
//   steps: string[];
//   activeStep: number;
// }

// const CustomStepper: React.FC<StepperProps> = ({ steps, activeStep }) => {
//   return (
//     <div className="flex items-center w-full mb-8">
//       {steps.map((step, index) => (
//         <React.Fragment key={step}>
//           {/* Step Circle */}
//           <div className="flex flex-col items-center">
//             <div
//               className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
//                 index <= activeStep
//                   ? "bg-blue-600 text-white"
//                   : "bg-gray-200 text-gray-500"
//               }`}
//             >
//               {index + 1}
//             </div>
//             <span
//               className={`text-xs mt-1 text-center ${
//                 index <= activeStep ? "text-blue-600 font-medium" : "text-gray-500"
//               }`}
//             >
//               {step}
//             </span>
//           </div>
          
//           {/* Connector Line */}
//           {index < steps.length - 1 && (
//             <div
//               className={`flex-1 h-1 mx-2 ${
//                 index < activeStep ? "bg-blue-600" : "bg-gray-200"
//               }`}
//             />
//           )}
//         </React.Fragment>
//       ))}
//     </div>
//   );
// };

// // Custom Breadcrumb Component
// const CustomBreadcrumb = () => {
//   return (
//     <nav className="flex mb-6" aria-label="Breadcrumb">
//       <ol className="inline-flex items-center space-x-1 md:space-x-3">
//         <li className="inline-flex items-center">
//           <a href="#" className="inline-flex items-center text-sm font-medium text-gray-700 hover:text-blue-600 dark:text-gray-400 dark:hover:text-white">
//             <HiHome className="w-4 h-4 mr-2" />
//             Home
//           </a>
//         </li>
//         <li>
//           <div className="flex items-center">
//             <svg className="w-3 h-3 text-gray-400 mx-1" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 6 10">
//               <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 9 4-4-4-4"/>
//             </svg>
//             <a href="#" className="ml-1 text-sm font-medium text-gray-700 hover:text-blue-600 md:ml-2 dark:text-gray-400 dark:hover:text-white">
//               Accounts
//             </a>
//           </div>
//         </li>
//         <li aria-current="page">
//           <div className="flex items-center">
//             <svg className="w-3 h-3 text-gray-400 mx-1" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 6 10">
//               <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 9 4-4-4-4"/>
//             </svg>
//             <span className="ml-1 text-sm font-medium text-gray-500 md:ml-2 dark:text-gray-400">
//               Live Account Onboarding
//             </span>
//           </div>
//         </li>
//       </ol>
//     </nav>
//   );
// };

// // Types
// interface State {
//   value: string;
//   label: string;
// }

// interface District {
//   value: string;
//   text: string;
// }

// interface FormWizardProps {
//   // Add any props if needed
// }

// const FormWizard: React.FC<FormWizardProps> = () => {
//   // State management
//   const [activeStep, setActiveStep] = useState(0);
//   const [showApiKey, setShowApiKey] = useState(false);
//   const [showPassword, setShowPassword] = useState(false);
//   const [showSecretKey, setShowSecretKey] = useState(false);
//   const [showRazorpaySecretKey, setShowRazorpaySecretKey] = useState(false);
//   const [showSmtpPassword, setShowSmtpPassword] = useState(false);
//   const [showRazorpayApiKey, setShowRazorpayApiKey] = useState(false);
  
//   const [selectedServicesOption, setSelectedServicesOption] = useState("Zoho Api");
//   const [selectType, setSelectType] = useState("");
//   const [selectSubtype, setSelectSubtype] = useState("");
//   const [selectState, setSelectState] = useState("");
//   const [selectDistrict, setSelectDistrict] = useState("");
  
//   // Form fields
//   const [academicName, setAcademicName] = useState("");
//   const [Pincode, setPincode] = useState("");
//   const [area, setArea] = useState("");
//   const [academicAddress, setAcademicAddress] = useState("");
//   const [academicDescription, setAcademicDescription] = useState("");
//   const [website_url, setWesiteUrl] = useState("");
//   const [primary_email, setPrimaryEmail] = useState("");
  
//   // Contact information
//   const [technicalName, setTechnicalName] = useState("");
//   const [technicalEmail, setTechnicalEmail] = useState("");
//   const [technicalPhone, setTechnicalPhone] = useState("");
//   const [technicalLocation, setTechnicalLocation] = useState("");
  
//   const [billingName, setBillingName] = useState("");
//   const [billingEmail, setBillingEmail] = useState("");
//   const [billingPhone, setBillingPhone] = useState("");
//   const [billingLocation, setBillingLocation] = useState("");
  
//   const [additionalName, setAdditionalName] = useState("");
//   const [additionalEmail, setAdditionalEmail] = useState("");
//   const [additionalPhone, setAdditionalPhone] = useState("");
//   const [additionalLocation, setAdditionalLocation] = useState("");
  
//   // API configurations
//   const [fromEmail, setFromEmail] = useState("");
//   const [smtpHost, setSmtpHost] = useState("");
//   const [smtpPort, setSmtpPort] = useState("");
//   const [smtpUsername, setSmtpUsername] = useState("");
//   const [smtpPassword, setSmtpPassword] = useState("");
//   const [zohoApiKey, setZohoApiKey] = useState("");
//   const [zohoFromEmail, setZohoFromEmail] = useState("");
//   const [bounceAddress, setBounceAddress] = useState("");
//   const [UserId, setUserId] = useState("");
//   const [wPassword, setWPassword] = useState("");
//   const [smsApikey, setSmsApikey] = useState("");
//   const [smsSecretkey, setSmsSecretkey] = useState("");
//   const [razorpayApikey, setRazorpayApikey] = useState("");
//   const [razorpaySecretkey, setRazorpaySecretkey] = useState("");
  
//   // Templates
//   const [whatsappTemplate, setWhatsAppTemplate] = useState("");
//   const [smsTemplate, setSMSTemplate] = useState("");
//   const [emailTemplate, setEmailTemplate] = useState("");
  
//   // Toggles
//   const [isDropdownEnabled, setIsDropdownEnabled] = useState(false);
//   const [isTemplatesVisible, setIsTemplatesVisible] = useState(false);
//   const [isSmsApiEnabled, setIsSmsApiEnabled] = useState(false);
//   const [switchState, setSwitchState] = useState(false);
//   const [nominalState, setNominalState] = useState(false);
  
//   // Domain configuration
//   const [domainName, setDomainName] = useState("");
//   const [domainNameError, setDomainNameError] = useState(false);
//   const [domainNameErrorMsg, setDomainNameErrorMsg] = useState("");
//   const [configure, setConfigure] = useState("");
//   const [updateConfigure, setUpdateConfigure] = useState(0);
  
//   // Data
//   const [states, setStates] = useState<State[]>([]);
//   const [districts, setDistricts] = useState<District[]>([]);
//   const [academicLogo, setAcademicLogo] = useState<File | null>(null);
//   const [previewImage, setPreviewImage] = useState<string | null>(null);

//   // Steps configuration - step 4 will be hidden when "School" is selected
//   const getSteps = () => {
//     const baseSteps = [
//       "Academic information",
//       "Contact Information",
//       "Third party api setup",
//       "Roll based access",
//       "Dns Configuration",
//     ];
    
//     // If "School" is selected, remove "Roll based access" step
//     if (selectType === "1") { // "1" represents School
//       return baseSteps.filter(step => step !== "Roll based access");
//     }
    
//     return baseSteps;
//   };

//   const steps = getSteps();

//   // Validation functions
//   const validateEmail = (email: string) => {
//     const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
//     return re.test(email);
//   };

//   const validatePhone = (phone: string) => {
//     return /^\d{10}$/.test(phone);
//   };

//   const domainNameRegex = /^(?:[a-zA-Z0-9-]+\.)+[a-zA-Z]{2,}$/;

//   // Handlers
//   const handleNext = () => {
//     // Validate Technical Contact
//     if (activeStep === 1) {
//       if (technicalEmail && !validateEmail(technicalEmail)) {
//         alert("Please enter a valid Technical Contact email");
//         return;
//       }
//       if (technicalPhone && !validatePhone(technicalPhone)) {
//         alert("Please enter a valid Technical Contact phone number");
//         return;
//       }
    
//       // Validate Billing Contact
//       if (billingEmail && !validateEmail(billingEmail)) {
//         alert("Please enter a valid Billing Contact email");
//         return;
//       }
//       if (billingPhone && !validatePhone(billingPhone)) {
//         alert("Please enter a valid Billing Contact phone number");
//         return;
//       }
    
//       // Validate Additional Contact
//       if (additionalEmail && !validateEmail(additionalEmail)) {
//         alert("Please enter a valid Additional Contact email");
//         return;
//       }
//       if (additionalPhone && !validatePhone(additionalPhone)) {
//         alert("Please enter a valid Additional Contact phone number");
//         return;
//       }
//     }
    
//     setActiveStep((prev) => prev + 1);
//   };

//   const handleBack = () => {
//     setActiveStep((prev) => prev - 1);
//   };

//   const handleSelectServiceChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
//     setSelectedServicesOption(e.target.value);
//   };

//   const handleStateChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
//     const stateId = e.target.value;
//     setSelectState(stateId);
//     setSelectDistrict("");
    
//     // Fetch districts logic would go here
//     if (stateId) {
//       // Simulate API call
//       setDistricts([
//         { value: "1", text: "District 1" },
//         { value: "2", text: "District 2" },
//       ]);
//     } else {
//       setDistricts([]);
//     }
//   };

//   const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const files = e.target.files;
//     if (files && files.length > 0) {
//       const file = files[0];
//       setAcademicLogo(file);
      
//       const reader = new FileReader();
//       reader.onloadend = () => {
//         setPreviewImage(reader.result as string);
//       };
//       reader.readAsDataURL(file);
//     }
//   };

//   const handleConfigure = () => {
//     if (!domainNameError && domainName) {
//       setConfigure("1");
//       setUpdateConfigure(1);
//     }
//   };

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     // Submit logic would go here
//     console.log("Form submitted");
//   };

//   const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     setIsDropdownEnabled(e.target.checked);
//   };

//   const handleTemplateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     setIsTemplatesVisible(e.target.checked);
//   };

//   const handleCheckboxSmsApi = (e: React.ChangeEvent<HTMLInputElement>) => {
//     setIsSmsApiEnabled(e.target.checked);
//   };

//   // When selectType changes, update steps and adjust activeStep if needed
//   useEffect(() => {
//     const newSteps = getSteps();
    
//     // If the current active step is beyond the new steps length, adjust it
//     if (activeStep >= newSteps.length) {
//       setActiveStep(newSteps.length - 1);
//     }
//   }, [selectType, activeStep]);

//   // Initialize with sample data
//   useEffect(() => {
//     // Sample states data
//     setStates([
//       { value: "1", label: "State 1" },
//       { value: "2", label: "State 2" },
//       { value: "3", label: "State 3" },
//     ]);
//   }, []);

//   // Get the actual step index for rendering content
//   const getStepContentIndex = (currentStep: number) => {
//     const stepsOrder = [
//       "Academic information", // Step 0
//       "Contact Information",  // Step 1  
//       "Third party api setup", // Step 2
//       "Roll based access",    // Step 3 (will be skipped for School)
//       "Dns Configuration",    // Step 4 (becomes Step 3 for School)
//     ];
    
//     const currentStepName = steps[currentStep];
//     return stepsOrder.indexOf(currentStepName);
//   };

//   // Render steps
//   const renderStepContent = (step: number) => {
//     const contentStep = getStepContentIndex(step);
    
//     switch (contentStep) {
//       case 0:
//         return (
//           <div className="space-y-6">
//             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//               <div>
//                 <Label htmlFor="selectType">
//                   Type of the Organization <span className="text-red-600">*</span>
//                 </Label>
//                 <Select
//                   id="selectType"
//                   value={selectType}
//                   onChange={(e) => setSelectType(e.target.value)}
//                   required
//                 >
//                   <option value="">Please Select</option>
//                   <option value="1">School</option>
//                   <option value="2">College</option>
//                   <option value="3">University</option>
//                 </Select>
//               </div>

//               {selectType === "3" && (
//                 <div>
//                   <Label htmlFor="selectSubtype">
//                     Subtype of Organization <span className="text-red-600">*</span>
//                   </Label>
//                   <Select
//                     id="selectSubtype"
//                     value={selectSubtype}
//                     onChange={(e) => setSelectSubtype(e.target.value)}
//                     required
//                   >
//                     <option value="">Please Select</option>
//                     <option value="Arts College">Arts College</option>
//                     <option value="Law University">Law University</option>
//                   </Select>
//                 </div>
//               )}

//               <div className={selectType === "3" ? "md:col-span-1" : "md:col-span-2"}>
//                 <Label htmlFor="academicName">
//                   Name of the Organization <span className="text-red-600">*</span>
//                 </Label>
//                 <TextInput
//                   id="academicName"
//                   value={academicName}
//                   onChange={(e) => setAcademicName(e.target.value)}
//                   required
//                 />
//               </div>

//               <div>
//                 <Label htmlFor="selectState">
//                   Select State <span className="text-red-600">*</span>
//                 </Label>
//                 <Select
//                   id="selectState"
//                   value={selectState}
//                   onChange={handleStateChange}
//                   required
//                 >
//                   <option value="">Please Select</option>
//                   {states.map((state) => (
//                     <option key={state.value} value={state.value}>
//                       {state.label}
//                     </option>
//                   ))}
//                 </Select>
//               </div>

//               <div>
//                 <Label htmlFor="selectDistrict">
//                   Select District <span className="text-red-600">*</span>
//                 </Label>
//                 <Select
//                   id="selectDistrict"
//                   value={selectDistrict}
//                   onChange={(e) => setSelectDistrict(e.target.value)}
//                   required
//                   disabled={!selectState}
//                 >
//                   <option value="">Please Select</option>
//                   {districts.map((district) => (
//                     <option key={district.value} value={district.value}>
//                       {district.text}
//                     </option>
//                   ))}
//                 </Select>
//               </div>

//               <div>
//                 <Label htmlFor="pincode">
//                   Enter Pincode <span className="text-red-600">*</span>
//                 </Label>
//                 <TextInput
//                   id="pincode"
//                   type="number"
//                   value={Pincode}
//                   onChange={(e) => setPincode(e.target.value)}
//                   required
//                 />
//               </div>

//               <div>
//                 <Label htmlFor="area">Enter Area</Label>
//                 <TextInput
//                   id="area"
//                   value={area}
//                   onChange={(e) => setArea(e.target.value)}
//                 />
//               </div>

//               <div>
//                 <Label htmlFor="website_url">
//                   Website Url <span className="text-red-600">*</span>
//                 </Label>
//                 <TextInput
//                   id="website_url"
//                   type="url"
//                   value={website_url}
//                   onChange={(e) => setWesiteUrl(e.target.value)}
//                   required
//                 />
//               </div>

//               <div>
//                 <Label htmlFor="primary_email">
//                   Primary Email for Main Account <span className="text-red-600">*</span>
//                 </Label>
//                 <TextInput
//                   id="primary_email"
//                   type="email"
//                   value={primary_email}
//                   onChange={(e) => setPrimaryEmail(e.target.value)}
//                   required
//                 />
//               </div>

//               <div className="md:col-span-2">
//                 <Label htmlFor="academicAddress">Enter Full Address</Label>
//                 <TextInput
//                   id="academicAddress"
//                   value={academicAddress}
//                   onChange={(e) => setAcademicAddress(e.target.value)}
//                 />
//               </div>

//               <div className="md:col-span-3">
//                 <Label htmlFor="academicDescription">Enter Description</Label>
//                 <Textarea
//                   id="academicDescription"
//                   value={academicDescription}
//                   onChange={(e) => setAcademicDescription(e.target.value)}
//                   rows={4}
//                 />
//               </div>

//               <div className="flex items-center gap-4 md:col-span-3">
//                 {previewImage && (
//                   <img
//                     src={previewImage}
//                     alt="Preview"
//                     className="w-32 h-32 object-cover rounded-lg border"
//                   />
//                 )}
//                 <div className="flex-1">
//                   <Label htmlFor="academicLogo">
//                     Upload Logo Here <span className="text-red-600">*</span>
//                   </Label>
//                   <FileInput
//                     id="academicLogo"
//                     accept="image/*"
//                     onChange={handleFileUpload}
//                   />
//                   <p className="mt-1 text-sm text-gray-500">Recommended size: 180x180 pixels</p>
//                 </div>
//               </div>
//             </div>
//           </div>
//         );

//       case 1:
//         return (
//           <div className="space-y-6">
//             {/* Technical Contact */}
//             <Card>
//               <h5 className="text-lg font-semibold text-gray-900 dark:text-white">Technical Contact</h5>
//               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
//                 <div>
//                   <Label htmlFor="technicalName">Name</Label>
//                   <TextInput
//                     id="technicalName"
//                     value={technicalName}
//                     onChange={(e) => setTechnicalName(e.target.value)}
//                     placeholder="Enter Name"
//                   />
//                 </div>
//                 <div>
//                   <Label htmlFor="technicalEmail">Email</Label>
//                   <TextInput
//                     id="technicalEmail"
//                     type="email"
//                     value={technicalEmail}
//                     onChange={(e) => setTechnicalEmail(e.target.value)}
//                     placeholder="Enter Email"
//                   />
//                 </div>
//                 <div>
//                   <Label htmlFor="technicalPhone">Phone</Label>
//                   <TextInput
//                     id="technicalPhone"
//                     value={technicalPhone}
//                     onChange={(e) => setTechnicalPhone(e.target.value)}
//                     placeholder="Enter Phone"
//                   />
//                 </div>
//                 <div>
//                   <Label htmlFor="technicalLocation">Location</Label>
//                   <TextInput
//                     id="technicalLocation"
//                     value={technicalLocation}
//                     onChange={(e) => setTechnicalLocation(e.target.value)}
//                     placeholder="Enter Location"
//                   />
//                 </div>
//               </div>
//             </Card>

//             {/* Billing Contact */}
//             <Card>
//               <h5 className="text-lg font-semibold text-gray-900 dark:text-white">Billing Contact</h5>
//               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
//                 <div>
//                   <Label htmlFor="billingName">Name</Label>
//                   <TextInput
//                     id="billingName"
//                     value={billingName}
//                     onChange={(e) => setBillingName(e.target.value)}
//                     placeholder="Enter Name"
//                   />
//                 </div>
//                 <div>
//                   <Label htmlFor="billingEmail">Email</Label>
//                   <TextInput
//                     id="billingEmail"
//                     type="email"
//                     value={billingEmail}
//                     onChange={(e) => setBillingEmail(e.target.value)}
//                     placeholder="Enter Email"
//                   />
//                 </div>
//                 <div>
//                   <Label htmlFor="billingPhone">Phone</Label>
//                   <TextInput
//                     id="billingPhone"
//                     value={billingPhone}
//                     onChange={(e) => setBillingPhone(e.target.value)}
//                     placeholder="Enter Phone"
//                   />
//                 </div>
//                 <div>
//                   <Label htmlFor="billingLocation">Location</Label>
//                   <TextInput
//                     id="billingLocation"
//                     value={billingLocation}
//                     onChange={(e) => setBillingLocation(e.target.value)}
//                     placeholder="Enter Location"
//                   />
//                 </div>
//               </div>
//             </Card>

//             {/* Additional Contact */}
//             <Card>
//               <h5 className="text-lg font-semibold text-gray-900 dark:text-white">Additional Contact</h5>
//               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
//                 <div>
//                   <Label htmlFor="additionalName">Name</Label>
//                   <TextInput
//                     id="additionalName"
//                     value={additionalName}
//                     onChange={(e) => setAdditionalName(e.target.value)}
//                     placeholder="Enter Name"
//                   />
//                 </div>
//                 <div>
//                   <Label htmlFor="additionalEmail">Email</Label>
//                   <TextInput
//                     id="additionalEmail"
//                     type="email"
//                     value={additionalEmail}
//                     onChange={(e) => setAdditionalEmail(e.target.value)}
//                     placeholder="Enter Email"
//                   />
//                 </div>
//                 <div>
//                   <Label htmlFor="additionalPhone">Phone</Label>
//                   <TextInput
//                     id="additionalPhone"
//                     value={additionalPhone}
//                     onChange={(e) => setAdditionalPhone(e.target.value)}
//                     placeholder="Enter Phone"
//                   />
//                 </div>
//                 <div>
//                   <Label htmlFor="additionalLocation">Location</Label>
//                   <TextInput
//                     id="additionalLocation"
//                     value={additionalLocation}
//                     onChange={(e) => setAdditionalLocation(e.target.value)}
//                     placeholder="Enter Location"
//                   />
//                 </div>
//               </div>
//             </Card>
//           </div>
//         );

//       case 2:
//         return (
//           <div className="space-y-6">
//             <Alert color="info" icon={HiInformationCircle}>
//               Note: For inputs such as WhatsApp, Email, SMS, and Razorpay API configurations, 
//               you may skip entering values. If left blank, the system will automatically apply 
//               the default administration settings for these services.
//             </Alert>

//             {/* Email Service */}
//             <Card>
//               <div className="flex items-center mb-4">
//                 <Checkbox
//                   id="enableEmail"
//                   checked={isDropdownEnabled}
//                   onChange={handleCheckboxChange}
//                   className="mr-2"
//                 />
//                 <Label htmlFor="enableEmail" className="font-semibold text-gray-900 dark:text-white">
//                   Enabled Email Service
//                 </Label>
//               </div>

//               {isDropdownEnabled && (
//                 <div className="space-y-4">
//                   <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                     <div>
//                       <Label htmlFor="emailService">Select Email Service</Label>
//                       <Select
//                         id="emailService"
//                         value={selectedServicesOption}
//                         onChange={handleSelectServiceChange}
//                       >
//                         <option value="">Please Select</option>
//                         <option value="MailGun SMTP">MailGun SMTP</option>
//                         <option value="Google SMTP">Google SMTP</option>
//                         <option value="Zoho Api">Zoho Api</option>
//                         <option value="Other">Other</option>
//                       </Select>
//                     </div>
                    
//                     <div>
//                       <Label htmlFor="emailTemplate">
//                         Email Template <span className="text-red-600">*</span>
//                       </Label>
//                       <Textarea
//                         id="emailTemplate"
//                         value={emailTemplate}
//                         onChange={(e) => setEmailTemplate(e.target.value)}
//                         rows={4}
//                         placeholder="Enter email template"
//                         required
//                       />
//                     </div>
//                   </div>

//                   {/* MailGun SMTP Configuration */}
//                   {selectedServicesOption === "MailGun SMTP" && (
//                     <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
//                       <div>
//                         <Label htmlFor="fromEmail">From Email</Label>
//                         <TextInput
//                           id="fromEmail"
//                           value={fromEmail}
//                           onChange={(e) => setFromEmail(e.target.value)}
//                         />
//                       </div>
//                       <div>
//                         <Label htmlFor="smtpHost">SMTP Host</Label>
//                         <TextInput
//                           id="smtpHost"
//                           value={smtpHost}
//                           onChange={(e) => setSmtpHost(e.target.value)}
//                         />
//                       </div>
//                       <div>
//                         <Label htmlFor="smtpPort">SMTP Port</Label>
//                         <TextInput
//                           id="smtpPort"
//                           value={smtpPort}
//                           onChange={(e) => setSmtpPort(e.target.value)}
//                         />
//                       </div>
//                       <div>
//                         <Label htmlFor="smtpUsername">SMTP Username</Label>
//                         <TextInput
//                           id="smtpUsername"
//                           value={smtpUsername}
//                           onChange={(e) => setSmtpUsername(e.target.value)}
//                         />
//                       </div>
//                       <div>
//                         <Label htmlFor="smtpPassword">SMTP Password</Label>
//                         <div className="relative">
//                           <TextInput
//                             id="smtpPassword"
//                             type={showSmtpPassword ? "text" : "password"}
//                             value={smtpPassword}
//                             onChange={(e) => setSmtpPassword(e.target.value)}
//                           />
//                           <button
//                             type="button"
//                             className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 hover:text-gray-700"
//                             onClick={() => setShowSmtpPassword(!showSmtpPassword)}
//                           >
//                             {showSmtpPassword ? <HiEyeOff className="w-5 h-5" /> : <HiEye className="w-5 h-5" />}
//                           </button>
//                         </div>
//                       </div>
//                     </div>
//                   )}

//                   {/* Zoho API Configuration */}
//                   {selectedServicesOption === "Zoho Api" && (
//                     <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//                       <div>
//                         <Label htmlFor="zohoApiKey">Zoho API Key</Label>
//                         <div className="relative">
//                           <TextInput
//                             id="zohoApiKey"
//                             type={showApiKey ? "text" : "password"}
//                             value={zohoApiKey}
//                             onChange={(e) => setZohoApiKey(e.target.value)}
//                           />
//                           <button
//                             type="button"
//                             className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 hover:text-gray-700"
//                             onClick={() => setShowApiKey(!showApiKey)}
//                           >
//                             {showApiKey ? <HiEyeOff className="w-5 h-5" /> : <HiEye className="w-5 h-5" />}
//                           </button>
//                         </div>
//                       </div>
//                       <div>
//                         <Label htmlFor="zohoFromEmail">From Address</Label>
//                         <TextInput
//                           id="zohoFromEmail"
//                           value={zohoFromEmail}
//                           onChange={(e) => setZohoFromEmail(e.target.value)}
//                         />
//                       </div>
//                       <div>
//                         <Label htmlFor="bounceAddress">Bounce Address</Label>
//                         <TextInput
//                           id="bounceAddress"
//                           value={bounceAddress}
//                           onChange={(e) => setBounceAddress(e.target.value)}
//                         />
//                       </div>
//                     </div>
//                   )}
//                 </div>
//               )}
//             </Card>

//             {/* WhatsApp Service */}
//             <Card>
//               <div className="flex items-center mb-4">
//                 <Checkbox
//                   id="enableWhatsApp"
//                   checked={isTemplatesVisible}
//                   onChange={handleTemplateChange}
//                   className="mr-2"
//                 />
//                 <Label htmlFor="enableWhatsApp" className="font-semibold text-gray-900 dark:text-white">
//                   Enable WhatsApp Service
//                 </Label>
//               </div>

//               {isTemplatesVisible && (
//                 <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//                   <div>
//                     <Label htmlFor="whatsappTemplate">
//                       WhatsApp Template <span className="text-red-600">*</span>
//                     </Label>
//                     <TextInput
//                       id="whatsappTemplate"
//                       value={whatsappTemplate}
//                       onChange={(e) => setWhatsAppTemplate(e.target.value)}
//                       required
//                     />
//                   </div>
//                   <div>
//                     <Label htmlFor="userId">User ID</Label>
//                     <TextInput
//                       id="userId"
//                       value={UserId}
//                       onChange={(e) => setUserId(e.target.value)}
//                     />
//                   </div>
//                   <div>
//                     <Label htmlFor="wPassword">Password</Label>
//                     <div className="relative">
//                       <TextInput
//                         id="wPassword"
//                         type={showPassword ? "text" : "password"}
//                         value={wPassword}
//                         onChange={(e) => setWPassword(e.target.value)}
//                       />
//                       <button
//                         type="button"
//                         className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 hover:text-gray-700"
//                         onClick={() => setShowPassword(!showPassword)}
//                       >
//                         {showPassword ? <HiEyeOff className="w-5 h-5" /> : <HiEye className="w-5 h-5" />}
//                       </button>
//                     </div>
//                   </div>
//                 </div>
//               )}
//             </Card>

//             {/* SMS Service */}
//             <Card>
//               <div className="flex items-center mb-4">
//                 <Checkbox
//                   id="enableSMS"
//                   checked={isSmsApiEnabled}
//                   onChange={handleCheckboxSmsApi}
//                   className="mr-2"
//                 />
//                 <Label htmlFor="enableSMS" className="font-semibold text-gray-900 dark:text-white">
//                   Enable SMS Service
//                 </Label>
//               </div>

//               {isSmsApiEnabled && (
//                 <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//                   <div>
//                     <Label htmlFor="smsTemplate">
//                       SMS Template <span className="text-red-600">*</span>
//                     </Label>
//                     <TextInput
//                       id="smsTemplate"
//                       value={smsTemplate}
//                       onChange={(e) => setSMSTemplate(e.target.value)}
//                       required
//                     />
//                   </div>
//                   <div>
//                     <Label htmlFor="smsApiKey">API Key</Label>
//                     <TextInput
//                       id="smsApiKey"
//                       value={smsApikey}
//                       onChange={(e) => setSmsApikey(e.target.value)}
//                     />
//                   </div>
//                   <div>
//                     <Label htmlFor="smsSecretKey">Secret Key</Label>
//                     <div className="relative">
//                       <TextInput
//                         id="smsSecretKey"
//                         type={showSecretKey ? "text" : "password"}
//                         value={smsSecretkey}
//                         onChange={(e) => setSmsSecretkey(e.target.value)}
//                       />
//                       <button
//                         type="button"
//                         className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 hover:text-gray-700"
//                         onClick={() => setShowSecretKey(!showSecretKey)}
//                       >
//                         {showSecretKey ? <HiEyeOff className="w-5 h-5" /> : <HiEye className="w-5 h-5" />}
//                       </button>
//                     </div>
//                   </div>
//                 </div>
//               )}
//             </Card>

//             {/* Razorpay Integration */}
//             <Card>
//               <h5 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Razorpay Integration</h5>
//               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                 <div>
//                   <Label htmlFor="razorpayApiKey">
//                     API Key <span className="text-red-600">*</span>
//                   </Label>
//                   <div className="relative">
//                     <TextInput
//                       id="razorpayApiKey"
//                       type={showRazorpayApiKey ? "text" : "password"}
//                       value={razorpayApikey}
//                       onChange={(e) => setRazorpayApikey(e.target.value)}
//                       required
//                     />
//                     <button
//                       type="button"
//                       className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 hover:text-gray-700"
//                       onClick={() => setShowRazorpayApiKey(!showRazorpayApiKey)}
//                     >
//                       {showRazorpayApiKey ? <HiEyeOff className="w-5 h-5" /> : <HiEye className="w-5 h-5" />}
//                     </button>
//                   </div>
//                 </div>
//                 <div>
//                   <Label htmlFor="razorpaySecretKey">
//                     Secret Key <span className="text-red-600">*</span>
//                   </Label>
//                   <div className="relative">
//                     <TextInput
//                       id="razorpaySecretKey"
//                       type={showRazorpaySecretKey ? "text" : "password"}
//                       value={razorpaySecretkey}
//                       onChange={(e) => setRazorpaySecretkey(e.target.value)}
//                       required
//                     />
//                     <button
//                       type="button"
//                       className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 hover:text-gray-700"
//                       onClick={() => setShowRazorpaySecretKey(!showRazorpaySecretKey)}
//                     >
//                       {showRazorpaySecretKey ? <HiEyeOff className="w-5 h-5" /> : <HiEye className="w-5 h-5" />}
//                     </button>
//                   </div>
//                 </div>
//               </div>
//             </Card>
//           </div>
//         );

//       case 3: // Roll based access (only for College and University)
//         return (
//           <div className="space-y-6">
//             {selectType !== "1" && (
//               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                 <Card>
//                   <div className="flex items-center justify-between">
//                     <div className="flex items-center space-x-3">
//                       <div className="p-2 bg-gray-100 rounded-lg dark:bg-gray-700">
//                         <HiCloudUpload className="w-6 h-6 text-gray-500 dark:text-gray-400" />
//                       </div>
//                       <div>
//                         <h6 className="font-semibold text-gray-900 dark:text-white">Give Access For Hall Ticket Generate</h6>
//                       </div>
//                     </div>
//                     <Checkbox
//                       checked={switchState}
//                       onChange={(e) => setSwitchState(e.target.checked)}
//                     />
//                   </div>
//                 </Card>

//                 <Card>
//                   <div className="flex items-center justify-between">
//                     <div className="flex items-center space-x-3">
//                       <div className="p-2 bg-gray-100 rounded-lg dark:bg-gray-700">
//                         <HiCloudUpload className="w-6 h-6 text-gray-500 dark:text-gray-400" />
//                       </div>
//                       <div>
//                         <h6 className="font-semibold text-gray-900 dark:text-white">Give Access For Nominal Roll Access</h6>
//                       </div>
//                     </div>
//                     <Checkbox
//                       checked={nominalState}
//                       onChange={(e) => setNominalState(e.target.checked)}
//                     />
//                   </div>
//                 </Card>
//               </div>
//             )}
//           </div>
//         );

//       case 4: // DNS Configuration
//         return (
//           <div className="space-y-6">
//             <Alert color="info" icon={HiInformationCircle}>
//               Important: Ensure that the domain you are configuring points to our server's IP address. 
//               Please add an A record in the client domain settings with the IP address provided by us. 
//               Only after this setup, site will work properly.
//             </Alert>

//             {configure === "0" ? (
//               <div className="flex flex-col items-center justify-center space-y-4 py-8">
//                 <div className="w-full max-w-md">
//                   <Label htmlFor="domainName">Enter Domain Name</Label>
//                   <div className="relative">
//                     <TextInput
//                       id="domainName"
//                       value={domainName}
//                       onChange={(e) => {
//                         const value = e.target.value;
//                         setDomainName(value);
                        
//                         if (!domainNameRegex.test(value)) {
//                           setDomainNameError(true);
//                           setDomainNameErrorMsg("Please enter a valid domain name (e.g., example.com).");
//                         } else {
//                           setDomainNameError(false);
//                           setDomainNameErrorMsg("");
//                         }
//                       }}
//                       color={domainNameError ? "failure" : "gray"}
//                       placeholder="Enter Domain"
//                     />
//                     {domainNameError && (
//                       <p className="mt-1 text-sm text-red-600">{domainNameErrorMsg}</p>
//                     )}
//                   </div>
//                 </div>
//                 <Button onClick={handleConfigure} className="mt-4">
//                   Configure
//                 </Button>
//               </div>
//             ) : (
//               <div className="flex flex-col items-center justify-center space-y-4 py-8">
//                 <HiCheckCircle className="w-12 h-12 text-green-500" />
//                 {updateConfigure ? (
//                   <p className="text-green-600 font-semibold text-center">
//                     Domain Configured Successfully now click on update to apply
//                   </p>
//                 ) : (
//                   <p className="font-semibold text-center text-gray-900 dark:text-white">
//                     Domain Already Configured for {domainName}
//                   </p>
//                 )}
//               </div>
//             )}
//           </div>
//         );

//       default:
//         return null;
//     }
//   };

//   return (
//     <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4">
//       <div className="max-w-7xl mx-auto">
//         {/* Custom Breadcrumb */}
//         <CustomBreadcrumb />

//         {/* Header */}
//         <div className="mb-6">
//           <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Live Account Onboarding</h1>
//           <p className="text-gray-600 dark:text-gray-400">Live Account Onboarding</p>
//         </div>

//         {/* Main Card */}
//         <Card>
//           <h5 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">Live Account Onboarding</h5>

//           {/* Custom Stepper */}
//           <CustomStepper steps={steps} activeStep={activeStep} />

//           {/* Step Content */}
//           {activeStep === steps.length ? (
//             <Alert color="success" className="mb-4">
//               All steps completed - you're finished
//             </Alert>
//           ) : (
//             <>
//               <div className="mb-8">
//                 {renderStepContent(activeStep)}
//               </div>

//               {/* Navigation Buttons */}
//               <div className="flex justify-between items-center">
//                 <Button
//                   color="light"
//                   onClick={handleBack}
//                   disabled={activeStep === 0}
//                   className="flex items-center gap-2"
//                 >
//                   <HiArrowLeft className="w-4 h-4" />
//                   Back
//                 </Button>

//                 {activeStep === steps.length - 1 ? (
//                   <Button onClick={handleSubmit} color="blue" className="flex items-center gap-2">
//                     Update
//                     <HiCheckCircle className="w-4 h-4" />
//                   </Button>
//                 ) : (
//                   <Button onClick={handleNext} color="blue" className="flex items-center gap-2">
//                     Next
//                     <HiArrowRight className="w-4 h-4" />
//                   </Button>
//                 )}
//               </div>
//             </>
//           )}
//         </Card>
//       </div>
//     </div>
//   );
// };

// export default FormWizard;





