// "use client";
// import React from "react";
// import { useState } from "react";
// import { Alert, Breadcrumb, Button, Card } from "flowbite-react";
// import { HiCheckCircle, HiArrowLeft, HiArrowRight, HiHome } from "react-icons/hi";

// // Import separate step components
// import AcademicInformation from "./AcademicInformation";
// import ContactInformation from "./ContactInformation";
// import ThirdPartyApiSetup from "./ThirdPartyApiSetup";
// import RollBasedAccess from "./RollBasedAccess";
// import DnsConfiguration from "./DnsConfiguration";

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

// // Types for form data
// export interface FormData {
//   // Academic Information
//   selectType: string;
//   selectSubtype: string;
//   academicName: string;
//   selectState: string;
//   selectDistrict: string;
//   Pincode: string;
//   area: string;
//   website_url: string;
//   primary_email: string;
//   academicAddress: string;
//   academicDescription: string;
//   academicLogo: File | null;
//   previewImage: string | null;

//   // Contact Information
//   technicalName: string;
//   technicalEmail: string;
//   technicalPhone: string;
//   technicalLocation: string;
//   billingName: string;
//   billingEmail: string;
//   billingPhone: string;
//   billingLocation: string;
//   additionalName: string;
//   additionalEmail: string;
//   additionalPhone: string;
//   additionalLocation: string;

//   // API Configurations
//   selectedServicesOption: string;
//   fromEmail: string;
//   smtpHost: string;
//   smtpPort: string;
//   smtpUsername: string;
//   smtpPassword: string;
//   zohoApiKey: string;
//   zohoFromEmail: string;
//   bounceAddress: string;
//   UserId: string;
//   wPassword: string;
//   smsApikey: string;
//   smsSecretkey: string;
//   razorpayApikey: string;
//   razorpaySecretkey: string;
  
//   // Templates
//   whatsappTemplate: string;
//   smsTemplate: string;
//   emailTemplate: string;
  
//   // Toggles
//   isDropdownEnabled: boolean;
//   isTemplatesVisible: boolean;
//   isSmsApiEnabled: boolean;
//   switchState: boolean;
//   nominalState: boolean;
  
//   // Domain Configuration
//   domainName: string;
//   domainNameError: boolean;
//   domainNameErrorMsg: string;
//   configure: string;
//   updateConfigure: number;
// }

// interface FormWizardProps {}

// const FormWizard: React.FC<FormWizardProps> = () => {
//   const [activeStep, setActiveStep] = useState(0);
//   const [formData, setFormData] = useState<FormData>({
//     // Academic Information
//     selectType: "",
//     selectSubtype: "",
//     academicName: "",
//     selectState: "",
//     selectDistrict: "",
//     Pincode: "",
//     area: "",
//     website_url: "",
//     primary_email: "",
//     academicAddress: "",
//     academicDescription: "",
//     academicLogo: null,
//     previewImage: null,

//     // Contact Information
//     technicalName: "",
//     technicalEmail: "",
//     technicalPhone: "",
//     technicalLocation: "",
//     billingName: "",
//     billingEmail: "",
//     billingPhone: "",
//     billingLocation: "",
//     additionalName: "",
//     additionalEmail: "",
//     additionalPhone: "",
//     additionalLocation: "",

//     // API Configurations
//     selectedServicesOption: "Zoho Api",
//     fromEmail: "",
//     smtpHost: "",
//     smtpPort: "",
//     smtpUsername: "",
//     smtpPassword: "",
//     zohoApiKey: "",
//     zohoFromEmail: "",
//     bounceAddress: "",
//     UserId: "",
//     wPassword: "",
//     smsApikey: "",
//     smsSecretkey: "",
//     razorpayApikey: "",
//     razorpaySecretkey: "",
    
//     // Templates
//     whatsappTemplate: "",
//     smsTemplate: "",
//     emailTemplate: "",
    
//     // Toggles
//     isDropdownEnabled: false,
//     isTemplatesVisible: false,
//     isSmsApiEnabled: false,
//     switchState: false,
//     nominalState: false,
    
//     // Domain Configuration
//     domainName: "",
//     domainNameError: false,
//     domainNameErrorMsg: "",
//     configure: "",
//     updateConfigure: 0,
//   });

//   // Steps configuration - step 4 will be hidden when "School" is selected
//   const getSteps = () => {
//     const baseSteps = [
//       "Academic information",
//       "Contact Information",
//       "Third party api setup",
//       "Roll based access",
//       "Dns Configuration",
//     ];
    
//     if (formData.selectType === "1") {
//       return baseSteps.filter(step => step !== "Roll based access");
//     }
    
//     return baseSteps;
//   };

//   const steps = getSteps();

//   // Update form data
//   const updateFormData = (updates: Partial<FormData>) => {
//     setFormData(prev => ({ ...prev, ...updates }));
//   };

//   const handleNext = () => {
//     // Add validation logic here if needed
//     setActiveStep((prev) => prev + 1);
//   };

//   const handleBack = () => {
//     setActiveStep((prev) => prev - 1);
//   };

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     console.log("Form submitted with data:", formData);
//     // Submit logic would go here
//   };

//   // When selectType changes, update steps and adjust activeStep if needed
//   React.useEffect(() => {
//     const newSteps = getSteps();
//     if (activeStep >= newSteps.length) {
//       setActiveStep(newSteps.length - 1);
//     }
//   }, [formData.selectType, activeStep]);

//   // Get the actual step content based on current step
//   const renderStepContent = (step: number) => {
//     const stepComponents = [
//       <AcademicInformation 
//         key="academic" 
//         formData={formData} 
//         updateFormData={updateFormData} 
//       />,
//       <ContactInformation 
//         key="contact" 
//         formData={formData} 
//         updateFormData={updateFormData} 
//       />,
//       <ThirdPartyApiSetup 
//         key="api" 
//         formData={formData} 
//         updateFormData={updateFormData} 
//       />,
//       <RollBasedAccess 
//         key="roll" 
//         formData={formData} 
//         updateFormData={updateFormData} 
//       />,
//       <DnsConfiguration 
//         key="dns" 
//         formData={formData} 
//         updateFormData={updateFormData} 
//       />,
//     ];

//     const currentStepIndex = steps[step];
//     const baseSteps = [
//       "Academic information",
//       "Contact Information", 
//       "Third party api setup",
//       "Roll based access",
//       "Dns Configuration",
//     ];
    
//     const contentIndex = baseSteps.indexOf(currentStepIndex);
//     return stepComponents[contentIndex];
//   };

//   return (
//     <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4">
//       <div className="max-w-7xl mx-auto">
//         <CustomBreadcrumb />

//         <div className="mb-6">
//           <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Live Account Onboarding</h1>
//           <p className="text-gray-600 dark:text-gray-400">Live Account Onboarding</p>
//         </div>

//         <Card>
//           <h5 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">Live Account Onboarding</h5>

//           <CustomStepper steps={steps} activeStep={activeStep} />

//           {activeStep === steps.length ? (
//             <Alert color="success" className="mb-4">
//               All steps completed - you're finished
//             </Alert>
//           ) : (
//             <>
//               <div className="mb-8">
//                 {renderStepContent(activeStep)}
//               </div>

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


















// "use client";
// import React from "react";
// import { useState, useEffect } from "react";
// import { Alert, Breadcrumb, Button, Card, Spinner } from "flowbite-react";
// import { HiCheckCircle, HiArrowLeft, HiArrowRight, HiHome } from "react-icons/hi";
// import { useParams } from "react-router"; // Ya fir next/navigation based on your setup

// // Import separate step components
// import AcademicInformation from "./AcademicInformation";
// import ContactInformation from "./ContactInformation";
// import ThirdPartyApiSetup from "./ThirdPartyApiSetup";
// import RollBasedAccess from "./RollBasedAccess";
// import DnsConfiguration from "./DnsConfiguration";

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

// // Types for form data
// export interface FormData {
//   // Academic Information
//   selectType: string;
//   selectSubtype: string;
//   academicName: string;
//   selectState: string;
//   selectDistrict: string;
//   Pincode: string;
//   area: string;
//   website_url: string;
//   primary_email: string;
//   academicAddress: string;
//   academicDescription: string;
//   academicLogo: File | null;
//   previewImage: string | null;

//   // Contact Information
//   technicalName: string;
//   technicalEmail: string;
//   technicalPhone: string;
//   technicalLocation: string;
//   billingName: string;
//   billingEmail: string;
//   billingPhone: string;
//   billingLocation: string;
//   additionalName: string;
//   additionalEmail: string;
//   additionalPhone: string;
//   additionalLocation: string;

//   // API Configurations
//   selectedServicesOption: string;
//   fromEmail: string;
//   smtpHost: string;
//   smtpPort: string;
//   smtpUsername: string;
//   smtpPassword: string;
//   zohoApiKey: string;
//   zohoFromEmail: string;
//   bounceAddress: string;
//   UserId: string;
//   wPassword: string;
//   smsApikey: string;
//   smsSecretkey: string;
//   razorpayApikey: string;
//   razorpaySecretkey: string;
  
//   // Templates
//   whatsappTemplate: string;
//   smsTemplate: string;
//   emailTemplate: string;
  
//   // Toggles
//   isDropdownEnabled: boolean;
//   isTemplatesVisible: boolean;
//   isSmsApiEnabled: boolean;
//   switchState: boolean;
//   nominalState: boolean;
  
//   // Domain Configuration
//   domainName: string;
//   domainNameError: boolean;
//   domainNameErrorMsg: string;
//   configure: string;
//   updateConfigure: number;
// }

// // API Response Types
// interface AcademicData {
//   id: number;
//   state_id: string | null;
//   sales_id: number;
//   district_id: string | null;
//   unique_code: string;
//   academic_type: number;
//   academic_subtype: string | null;
//   academic_name: string;
//   academic_area: string | null;
//   academic_pincode: string | null;
//   academic_landmark: string | null;
//   academic_address: string | null;
//   academic_website: string | null;
//   configured_domain: string | null;
//   configured: number;
//   technical_contact: string | null;
//   billing_contact: string | null;
//   additional_contact: string | null;
//   academic_logo: string | null;
//   director_signature: string | null;
//   academic_description: string | null;
//   academic_email: string;
//   academic_mobile: string | null;
//   customer_id: string | null;
//   eng_home_data: string | null;
//   eng_form_data: string | null;
//   footer_data: string | null;
//   header_data: string | null;
//   status: number;
//   created_at: string;
//   custom_setup: number;
//   footer_mobile: string;
//   footer_email: string;
//   footer_address: string | null;
//   admissio_query_mobile: string;
//   admissio_query_email: string;
//   technical_support_email: string;
//   technical_primary_contact: string;
//   footer_line: string;
//   technical_secondary_contact: string;
//   account_type: number;
// }

// interface TemplateData {
//   id: number;
//   academic_id: number;
//   default_template: number;
//   template_name: string;
//   whatsapp_template: string;
//   email_template: string;
//   s_template_name: string | null;
//   s_whatsapp_template: string;
//   s_email_template: string;
//   sms_template: string;
//   s_sms_template: string;
// }

// interface ApiResponse {
//   academic: AcademicData;
//   credentials: any;
//   template: TemplateData;
// }

// interface FormWizardProps {
//   accountId?: string; // Optional prop for account ID
// }

// const FormWizard: React.FC<FormWizardProps> = ({ accountId }) => {
//   // Agar accountId prop nahi diya gaya to URL se ID lelo
//   const params = useParams();
//   const dynamicAccountId = accountId || (params.id as string) || "50";
  
//   const [activeStep, setActiveStep] = useState(0);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);
  
//   const apiUrl = import.meta.env.VITE_API_URL || "https://rainbowsolutionandtechnology.com/NewAdmissionPortal/public/api";

//   const [formData, setFormData] = useState<FormData>({
//     // Academic Information
//     selectType: "",
//     selectSubtype: "",
//     academicName: "",
//     selectState: "",
//     selectDistrict: "",
//     Pincode: "",
//     area: "",
//     website_url: "",
//     primary_email: "",
//     academicAddress: "",
//     academicDescription: "",
//     academicLogo: null,
//     previewImage: null,

//     // Contact Information
//     technicalName: "",
//     technicalEmail: "",
//     technicalPhone: "",
//     technicalLocation: "",
//     billingName: "",
//     billingEmail: "",
//     billingPhone: "",
//     billingLocation: "",
//     additionalName: "",
//     additionalEmail: "",
//     additionalPhone: "",
//     additionalLocation: "",

//     // API Configurations
//     selectedServicesOption: "Zoho Api",
//     fromEmail: "",
//     smtpHost: "",
//     smtpPort: "",
//     smtpUsername: "",
//     smtpPassword: "",
//     zohoApiKey: "",
//     zohoFromEmail: "",
//     bounceAddress: "",
//     UserId: "",
//     wPassword: "",
//     smsApikey: "",
//     smsSecretkey: "",
//     razorpayApikey: "",
//     razorpaySecretkey: "",
    
//     // Templates
//     whatsappTemplate: "",
//     smsTemplate: "",
//     emailTemplate: "",
    
//     // Toggles
//     isDropdownEnabled: false,
//     isTemplatesVisible: false,
//     isSmsApiEnabled: false,
//     switchState: false,
//     nominalState: false,
    
//     // Domain Configuration
//     domainName: "",
//     domainNameError: false,
//     domainNameErrorMsg: "",
//     configure: "",
//     updateConfigure: 0,
//   });

//   // Fetch account data on component mount
//   useEffect(() => {
//     fetchAccountData();
//   }, [dynamicAccountId]);

//   const fetchAccountData = async () => {
//     try {
//       setLoading(true);
//       setError(null);

//       const response = await fetch(
//         `${apiUrl}/SuperAdmin/Accounts/Get-Academic-details`,
//         {
//           method: 'POST',
//           headers: {
//             'accept': '*/*',
//             'accept-language': 'en-IN,en-GB;q=0.9,en-US;q=0.8,en;q=0.7,hi;q=0.6',
//             'origin': 'http://localhost:3010',
//             'priority': 'u=1, i',
//             'referer': 'http://localhost:3010/',
//             'sec-ch-ua': '"Chromium";v="140", "Not=A?Brand";v="24", "Google Chrome";v="140"',
//             'sec-ch-ua-mobile': '?0',
//             'sec-ch-ua-platform': '"Windows"',
//             'sec-fetch-dest': 'empty',
//             'sec-fetch-mode': 'cors',
//             'sec-fetch-site': 'cross-site',
//             'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36',
//             'Authorization': 'Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJodHRwczovL3JhaW5ib3dzb2x1dGlvbmFuZHRlY2hub2xvZ3kuY29tL05ld0FkbWlzc2lvblBvcnRhbC9wdWJsaWMvYXBpL2F1dGgvdmVyaWZ5LW90cCIsImlhdCI6MTc1OTMwNjA1NywiZXhwIjoxNzYxODk4MDU3LCJuYmYiOjE3NTkzMDYwNTcsImp0aSI6IlRyUmhvcHdvYkJFNHBleHUiLCJzdWIiOiI0MzQiLCJlbWFpbCI6InNoYWFubXNrNEBnbWFpbC5jb20iLCJsb2dpbl90eXBlIjoxLCJyb2xlIjoiU1VQRVJBRE1JTiJ9.uU1-gvBhIrbSrnJ-2rvsBmRuGzpyE4DiazagpC61sZQ',
//             'Content-Type': 'application/json'
//           },
//           body: JSON.stringify({
//             s_id: "6",
//             academic_id: dynamicAccountId
//           })
//         }
//       );

//       if (!response.ok) {
//         throw new Error(`HTTP error! status: ${response.status}`);
//       }

//       const result: ApiResponse = await response.json();

//       if (result.academic) {
//         const academic = result.academic;
//         const template = result.template;

//         // Parse contact information if available
//         let technicalContact = { name: "", email: "", phone: "", location: "" };
//         let billingContact = { name: "", email: "", phone: "", location: "" };
//         let additionalContact = { name: "", email: "", phone: "", location: "" };

//         try {
//           if (academic.technical_contact) {
//             technicalContact = JSON.parse(academic.technical_contact);
//           }
//           if (academic.billing_contact) {
//             billingContact = JSON.parse(academic.billing_contact);
//           }
//           if (academic.additional_contact) {
//             additionalContact = JSON.parse(academic.additional_contact);
//           }
//         } catch (parseError) {
//           console.warn('Error parsing contact information:', parseError);
//         }

//         // Update form data with API response
//         setFormData(prev => ({
//           ...prev,
//           // Academic Information
//           selectType: academic.academic_type?.toString() || "",
//           selectSubtype: academic.academic_subtype || "",
//           academicName: academic.academic_name || "",
//           selectState: academic.state_id || "",
//           selectDistrict: academic.district_id || "",
//           Pincode: academic.academic_pincode || "",
//           area: academic.academic_area || "",
//           website_url: academic.academic_website || "",
//           primary_email: academic.academic_email || "",
//           academicAddress: academic.academic_address || "",
//           academicDescription: academic.academic_description || "",
//           previewImage: academic.academic_logo ? `${apiUrl}/${academic.academic_logo}` : null,

//           // Contact Information
//           technicalName: technicalContact.name || "",
//           technicalEmail: technicalContact.email || "",
//           technicalPhone: technicalContact.phone || "",
//           technicalLocation: technicalContact.location || "",
//           billingName: billingContact.name || "",
//           billingEmail: billingContact.email || "",
//           billingPhone: billingContact.phone || "",
//           billingLocation: billingContact.location || "",
//           additionalName: additionalContact.name || "",
//           additionalEmail: additionalContact.email || "",
//           additionalPhone: additionalContact.phone || "",
//           additionalLocation: additionalContact.location || "",

//           // Templates
//           whatsappTemplate: template?.whatsapp_template || "",
//           smsTemplate: template?.sms_template || "",
//           emailTemplate: template?.email_template || "",

//           // Domain Configuration
//           domainName: academic.configured_domain || "",
//           configure: academic.configured?.toString() || "",

//           // Additional fields from API
//           fromEmail: academic.footer_email || "",
//         }));
//       } else {
//         throw new Error('No academic data found in response');
//       }
//     } catch (err) {
//       console.error('Error fetching account data:', err);
//       setError('Failed to load account data. Please try again later.');
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Steps configuration - step 4 will be hidden when "School" is selected
//   const getSteps = () => {
//     const baseSteps = [
//       "Academic information",
//       "Contact Information",
//       "Third party api setup",
//       "Roll based access",
//       "Dns Configuration",
//     ];
    
//     if (formData.selectType === "1") {
//       return baseSteps.filter(step => step !== "Roll based access");
//     }
    
//     return baseSteps;
//   };

//   const steps = getSteps();

//   // Update form data
//   const updateFormData = (updates: Partial<FormData>) => {
//     setFormData(prev => ({ ...prev, ...updates }));
//   };

//   const handleNext = () => {
//     // Add validation logic here if needed
//     setActiveStep((prev) => prev + 1);
//   };

//   const handleBack = () => {
//     setActiveStep((prev) => prev - 1);
//   };

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     console.log("Form submitted with data:", formData);
//     // Submit logic would go here
//   };

//   // When selectType changes, update steps and adjust activeStep if needed
//   React.useEffect(() => {
//     const newSteps = getSteps();
//     if (activeStep >= newSteps.length) {
//       setActiveStep(newSteps.length - 1);
//     }
//   }, [formData.selectType, activeStep]);

//   // Get the actual step content based on current step
//   const renderStepContent = (step: number) => {
//     const stepComponents = [
//       <AcademicInformation 
//         key="academic" 
//         formData={formData} 
//         updateFormData={updateFormData} 
//       />,
//       <ContactInformation 
//         key="contact" 
//         formData={formData} 
//         updateFormData={updateFormData} 
//       />,
//       <ThirdPartyApiSetup 
//         key="api" 
//         formData={formData} 
//         updateFormData={updateFormData} 
//       />,
//       <RollBasedAccess 
//         key="roll" 
//         formData={formData} 
//         updateFormData={updateFormData} 
//       />,
//       <DnsConfiguration 
//         key="dns" 
//         formData={formData} 
//         updateFormData={updateFormData} 
//       />,
//     ];

//     const currentStepIndex = steps[step];
//     const baseSteps = [
//       "Academic information",
//       "Contact Information", 
//       "Third party api setup",
//       "Roll based access",
//       "Dns Configuration",
//     ];
    
//     const contentIndex = baseSteps.indexOf(currentStepIndex);
//     return stepComponents[contentIndex];
//   };

//   // Loading state
//   if (loading) {
//     return (
//       <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4 flex items-center justify-center">
//         <div className="text-center">
//           <Spinner size="xl" className="mb-4" />
//           <p className="text-lg text-gray-600 dark:text-gray-400">Loading account data...</p>
//         </div>
//       </div>
//     );
//   }

//   // Error state
//   if (error) {
//     return (
//       <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4 flex items-center justify-center">
//         <div className="text-center">
//           <Alert color="failure" className="mb-4">
//             {error}
//           </Alert>
//           <Button onClick={fetchAccountData}>
//             Retry
//           </Button>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4">
//       <div className="max-w-7xl mx-auto">
//         <CustomBreadcrumb />

//         <div className="mb-6">
//           <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Live Account Onboarding</h1>
//           <p className="text-gray-600 dark:text-gray-400">
//             Editing: {formData.academicName || "Account"}
//           </p>
//         </div>

//         <Card>
//           <h5 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
//             Edit Account - {formData.academicName || "Loading..."}
//           </h5>

//           <CustomStepper steps={steps} activeStep={activeStep} />

//           {activeStep === steps.length ? (
//             <Alert color="success" className="mb-4">
//               All steps completed - you're finished
//             </Alert>
//           ) : (
//             <>
//               <div className="mb-8">
//                 {renderStepContent(activeStep)}
//               </div>

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






























// "use client";
// import React from "react";
// import { useState, useEffect } from "react";
// import { Alert, Breadcrumb, Button, Card, Spinner } from "flowbite-react";
// import { HiCheckCircle, HiArrowLeft, HiArrowRight, HiHome } from "react-icons/hi";
// import { useParams } from "react-router"; // Ya fir next/navigation based on your setup
// import toast from "react-hot-toast";

// // Import separate step components
// import AcademicInformation from "./AcademicInformation";
// import ContactInformation from "./ContactInformation";
// import ThirdPartyApiSetup from "./ThirdPartyApiSetup";
// import RollBasedAccess from "./RollBasedAccess";
// import DnsConfiguration from "./DnsConfiguration";

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

// // Types for form data
// export interface FormWizardData {
//   // Academic Information
//   selectType: string;
//   selectSubtype: string;
//   academicName: string;
//   selectState: string;
//   selectDistrict: string;
//   Pincode: string;
//   area: string;
//   website_url: string;
//   primary_email: string;
//   academicAddress: string;
//   academicDescription: string;
//   academicLogo: File | null;
//   previewImage: string | null;

//   // Contact Information
//   technicalName: string;
//   technicalEmail: string;
//   technicalPhone: string;
//   technicalLocation: string;
//   billingName: string;
//   billingEmail: string;
//   billingPhone: string;
//   billingLocation: string;
//   additionalName: string;
//   additionalEmail: string;
//   additionalPhone: string;
//   additionalLocation: string;

//   // API Configurations
//   selectedServicesOption: string;
//   fromEmail: string;
//   smtpHost: string;
//   smtpPort: string;
//   smtpUsername: string;
//   smtpPassword: string;
//   zohoApiKey: string;
//   zohoFromEmail: string;
//   bounceAddress: string;
//   UserId: string;
//   wPassword: string;
//   smsApikey: string;
//   smsSecretkey: string;
//   razorpayApikey: string;
//   razorpaySecretkey: string;
  
//   // Templates
//   whatsappTemplate: string;
//   smsTemplate: string;
//   emailTemplate: string;
  
//   // Toggles
//   isDropdownEnabled: boolean;
//   isTemplatesVisible: boolean;
//   isSmsApiEnabled: boolean;
//   switchState: boolean;
//   nominalState: boolean;
  
//   // Domain Configuration
//   domainName: string;
//   domainNameError: boolean;
//   domainNameErrorMsg: string;
//   configure: string;
//   updateConfigure: number;
// }

// // API Response Types
// interface AcademicData {
//   id: number;
//   state_id: string | null;
//   sales_id: number;
//   district_id: string | null;
//   unique_code: string;
//   academic_type: number;
//   academic_subtype: string | null;
//   academic_name: string;
//   academic_area: string | null;
//   academic_pincode: string | null;
//   academic_landmark: string | null;
//   academic_address: string | null;
//   academic_website: string | null;
//   configured_domain: string | null;
//   configured: number;
//   technical_contact: string | null;
//   billing_contact: string | null;
//   additional_contact: string | null;
//   academic_logo: string | null;
//   director_signature: string | null;
//   academic_description: string | null;
//   academic_email: string;
//   academic_mobile: string | null;
//   customer_id: string | null;
//   eng_home_data: string | null;
//   eng_form_data: string | null;
//   footer_data: string | null;
//   header_data: string | null;
//   status: number;
//   created_at: string;
//   custom_setup: number;
//   footer_mobile: string;
//   footer_email: string;
//   footer_address: string | null;
//   admissio_query_mobile: string;
//   admissio_query_email: string;
//   technical_support_email: string;
//   technical_primary_contact: string;
//   footer_line: string;
//   technical_secondary_contact: string;
//   account_type: number;
// }

// interface TemplateData {
//   id: number;
//   academic_id: number;
//   default_template: number;
//   template_name: string;
//   whatsapp_template: string;
//   email_template: string;
//   s_template_name: string | null;
//   s_whatsapp_template: string;
//   s_email_template: string;
//   sms_template: string;
//   s_sms_template: string;
// }

// interface ApiResponse {
//   academic: AcademicData;
//   credentials: any;
//   template: TemplateData;
// }

// interface FormWizardProps {
//   accountId?: string; // Optional prop for account ID
// }

// const FormWizard: React.FC<FormWizardProps> = ({ accountId }) => {
//   // Agar accountId prop nahi diya gaya to URL se ID lelo
//   const params = useParams();
//   const dynamicAccountId = accountId || (params.id as string) || "50";
  
//   const [activeStep, setActiveStep] = useState(0);
//   const [loading, setLoading] = useState(true);
//   const [submitting, setSubmitting] = useState(false);
//   const [error, setError] = useState<string | null>(null);
  
//   const apiUrl = import.meta.env.VITE_API_URL || "https://rainbowsolutionandtechnology.com/NewAdmissionPortal/public/api";

//   const [formData, setFormData] = useState<FormWizardData>({
//     // Academic Information
//     selectType: "",
//     selectSubtype: "",
//     academicName: "",
//     selectState: "",
//     selectDistrict: "",
//     Pincode: "",
//     area: "",
//     website_url: "",
//     primary_email: "",
//     academicAddress: "",
//     academicDescription: "",
//     academicLogo: null,
//     previewImage: null,

//     // Contact Information
//     technicalName: "",
//     technicalEmail: "",
//     technicalPhone: "",
//     technicalLocation: "",
//     billingName: "",
//     billingEmail: "",
//     billingPhone: "",
//     billingLocation: "",
//     additionalName: "",
//     additionalEmail: "",
//     additionalPhone: "",
//     additionalLocation: "",

//     // API Configurations
//     selectedServicesOption: "Zoho Api",
//     fromEmail: "",
//     smtpHost: "",
//     smtpPort: "",
//     smtpUsername: "",
//     smtpPassword: "",
//     zohoApiKey: "",
//     zohoFromEmail: "",
//     bounceAddress: "",
//     UserId: "",
//     wPassword: "",
//     smsApikey: "",
//     smsSecretkey: "",
//     razorpayApikey: "",
//     razorpaySecretkey: "",
    
//     // Templates
//     whatsappTemplate: "",
//     smsTemplate: "",
//     emailTemplate: "",
    
//     // Toggles
//     isDropdownEnabled: false,
//     isTemplatesVisible: false,
//     isSmsApiEnabled: false,
//     switchState: false,
//     nominalState: false,
    
//     // Domain Configuration
//     domainName: "",
//     domainNameError: false,
//     domainNameErrorMsg: "",
//     configure: "",
//     updateConfigure: 0,
//   });

//   // Fetch account data on component mount
//   useEffect(() => {
//     fetchAccountData();
//   }, [dynamicAccountId]);

//   const fetchAccountData = async () => {
//     try {
//       setLoading(true);
//       setError(null);

//       const response = await fetch(
//         `${apiUrl}/SuperAdmin/Accounts/Get-Academic-details`,
//         {
//           method: 'POST',
//           headers: {
//             'accept': '*/*',
//             'accept-language': 'en-IN,en-GB;q=0.9,en-US;q=0.8,en;q=0.7,hi;q=0.6',
//             'origin': 'http://localhost:3010',
//             'priority': 'u=1, i',
//             'referer': 'http://localhost:3010/',
//             'sec-ch-ua': '"Chromium";v="140", "Not=A?Brand";v="24", "Google Chrome";v="140"',
//             'sec-ch-ua-mobile': '?0',
//             'sec-ch-ua-platform': '"Windows"',
//             'sec-fetch-dest': 'empty',
//             'sec-fetch-mode': 'cors',
//             'sec-fetch-site': 'cross-site',
//             'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36',
//             'Authorization': 'Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJodHRwczovL3JhaW5ib3dzb2x1dGlvbmFuZHRlY2hub2xvZ3kuY29tL05ld0FkbWlzc2lvblBvcnRhbC9wdWJsaWMvYXBpL2F1dGgvdmVyaWZ5LW90cCIsImlhdCI6MTc1OTMwNjA1NywiZXhwIjoxNzYxODk4MDU3LCJuYmYiOjE3NTkzMDYwNTcsImp0aSI6IlRyUmhvcHdvYkJFNHBleHUiLCJzdWIiOiI0MzQiLCJlbWFpbCI6InNoYWFubXNrNEBnbWFpbC5jb20iLCJsb2dpbl90eXBlIjoxLCJyb2xlIjoiU1VQRVJBRE1JTiJ9.uU1-gvBhIrbSrnJ-2rvsBmRuGzpyE4DiazagpC61sZQ',
//             'Content-Type': 'application/json'
//           },
//           body: JSON.stringify({
//             s_id: "6",
//             academic_id: dynamicAccountId
//           })
//         }
//       );

//       if (!response.ok) {
//         throw new Error(`HTTP error! status: ${response.status}`);
//       }

//       const result: ApiResponse = await response.json();

//       if (result.academic) {
//         const academic = result.academic;
//         const template = result.template;

//         // Parse contact information if available
//         let technicalContact = { name: "", email: "", phone: "", location: "" };
//         let billingContact = { name: "", email: "", phone: "", location: "" };
//         let additionalContact = { name: "", email: "", phone: "", location: "" };

//         try {
//           if (academic.technical_contact) {
//             technicalContact = JSON.parse(academic.technical_contact);
//           }
//           if (academic.billing_contact) {
//             billingContact = JSON.parse(academic.billing_contact);
//           }
//           if (academic.additional_contact) {
//             additionalContact = JSON.parse(academic.additional_contact);
//           }
//         } catch (parseError) {
//           console.warn('Error parsing contact information:', parseError);
//         }

//         // Update form data with API response
//         setFormData(prev => ({
//           ...prev,
//           // Academic Information
//           selectType: academic.academic_type?.toString() || "",
//           selectSubtype: academic.academic_subtype || "",
//           academicName: academic.academic_name || "",
//           selectState: academic.state_id || "",
//           selectDistrict: academic.district_id || "",
//           Pincode: academic.academic_pincode || "",
//           area: academic.academic_area || "",
//           website_url: academic.academic_website || "",
//           primary_email: academic.academic_email || "",
//           academicAddress: academic.academic_address || "",
//           academicDescription: academic.academic_description || "",
//           previewImage: academic.academic_logo ? `${apiUrl}/${academic.academic_logo}` : null,

//           // Contact Information
//           technicalName: technicalContact.name || "",
//           technicalEmail: technicalContact.email || "",
//           technicalPhone: technicalContact.phone || "",
//           technicalLocation: technicalContact.location || "",
//           billingName: billingContact.name || "",
//           billingEmail: billingContact.email || "",
//           billingPhone: billingContact.phone || "",
//           billingLocation: billingContact.location || "",
//           additionalName: additionalContact.name || "",
//           additionalEmail: additionalContact.email || "",
//           additionalPhone: additionalContact.phone || "",
//           additionalLocation: additionalContact.location || "",

//           // Templates
//           whatsappTemplate: template?.whatsapp_template || "",
//           smsTemplate: template?.sms_template || "",
//           emailTemplate: template?.email_template || "",

//           // Domain Configuration
//           domainName: academic.configured_domain || "",
//           configure: academic.configured?.toString() || "",

//           // Additional fields from API
//           fromEmail: academic.footer_email || "",
//         }));
//       } else {
//         throw new Error('No academic data found in response');
//       }
//     } catch (err) {
//       console.error('Error fetching account data:', err);
//       setError('Failed to load account data. Please try again later.');
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Steps configuration - step 4 will be hidden when "School" is selected
//   const getSteps = () => {
//     const baseSteps = [
//       "Academic information",
//       "Contact Information",
//       "Third party api setup",
//       "Roll based access",
//       "Dns Configuration",
//     ];
    
//     if (formData.selectType === "1") {
//       return baseSteps.filter(step => step !== "Roll based access");
//     }
    
//     return baseSteps;
//   };

//   const steps = getSteps();

//   // Update form data
//   const updateFormData = (updates: Partial<FormWizardData>) => {
//     setFormData(prev => ({ ...prev, ...updates }));
//   };

//   const handleNext = () => {
//     // Add validation logic here if needed
//     setActiveStep((prev) => prev + 1);
//   };

//   const handleBack = () => {
//     setActiveStep((prev) => prev - 1);
//   };

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setSubmitting(true);
    
//     try {
//       // Create FormData object for final submission
//       const submitFormData = new FormData();
      
//       // Add all form data fields
//       submitFormData.append('s_id', '6');
//       submitFormData.append('account_id', dynamicAccountId);
//       submitFormData.append('select_type', formData.selectType || '');
//       submitFormData.append('select_subtype', formData.selectSubtype || '');
//       submitFormData.append('email', formData.primary_email || '');
//       submitFormData.append('academic_name', formData.academicName || '');
//       submitFormData.append('academic_area', formData.area || '');
//       submitFormData.append('academic_address', formData.academicAddress || '');
//       submitFormData.append('academic_description', formData.academicDescription || '');
//       submitFormData.append('academic_pincode', formData.Pincode || '');
//       submitFormData.append('state_id', formData.selectState || '');
//       submitFormData.append('district_id', formData.selectDistrict || '');
//       submitFormData.append('website_url', formData.website_url || '');
      
//       // Contact Information
//       submitFormData.append('technicalName', formData.technicalName || '');
//       submitFormData.append('technicalEmail', formData.technicalEmail || '');
//       submitFormData.append('technicalPhone', formData.technicalPhone || '');
//       submitFormData.append('technicalLocation', formData.technicalLocation || '');
//       submitFormData.append('billingName', formData.billingName || '');
//       submitFormData.append('billingEmail', formData.billingEmail || '');
//       submitFormData.append('billingPhone', formData.billingPhone || '');
//       submitFormData.append('billingLocation', formData.billingLocation || '');
//       submitFormData.append('additionalName', formData.additionalName || '');
//       submitFormData.append('additionalEmail', formData.additionalEmail || '');
//       submitFormData.append('additionalPhone', formData.additionalPhone || '');
//       submitFormData.append('additionalLocation', formData.additionalLocation || '');
      
//       // Domain Configuration
//       submitFormData.append('configured', formData.configure || '0');
//       submitFormData.append('configured_domain', formData.domainName || '');
      
//       // Templates
//       submitFormData.append('template_id', '22'); // You might need to get this dynamically
//       submitFormData.append('whatsapp_template', formData.whatsappTemplate || '');
//       submitFormData.append('sms_template', formData.smsTemplate || '');
//       submitFormData.append('email_template', formData.emailTemplate || '');
      
//       // API Keys
//       submitFormData.append('wtsp_api_key', formData.UserId || '');
//       submitFormData.append('sms_api_key', formData.smsApikey || '');
//       submitFormData.append('razorpay_api_key', formData.razorpayApikey || '');
//       submitFormData.append('razorpay_secret_key', formData.razorpaySecretkey || '');
//       submitFormData.append('zoho_api_key', formData.zohoApiKey || '');
//       submitFormData.append('zoho_from_email', formData.zohoFromEmail || '');
//       submitFormData.append('bounce_address', formData.bounceAddress || '');
      
//       // Permissions
//       submitFormData.append('hallticket_generate_permission', formData.switchState ? '1' : '0');
//       submitFormData.append('nominal_permission', formData.nominalState ? '1' : '0');
//       submitFormData.append('email_service_dropdown_enabled', formData.isDropdownEnabled ? '1' : '0');
//       submitFormData.append('whatsapp_details_enable', formData.isTemplatesVisible ? '1' : '0');
//       submitFormData.append('sms_details_enable', formData.isSmsApiEnabled ? '1' : '0');
      
//       // Academic Logo
//       if (formData.academicLogo) {
//         submitFormData.append('academic_logo', formData.academicLogo);
//       }

//       const response = await fetch(
//         `${apiUrl}/SuperAdmin/Accounts/live-Account-Update`,
//         {
//           method: 'POST',
//           headers: {
//             'accept': '*/*',
//             'accept-language': 'en-IN,en-GB;q=0.9,en-US;q=0.8,en;q=0.7,hi;q=0.6',
//             'origin': 'http://localhost:3010',
//             'priority': 'u=1, i',
//             'referer': 'http://localhost:3010/',
//             'sec-ch-ua': '"Chromium";v="140", "Not=A?Brand";v="24", "Google Chrome";v="140"',
//             'sec-ch-ua-mobile': '?0',
//             'sec-ch-ua-platform': '"Windows"',
//             'sec-fetch-dest': 'empty',
//             'sec-fetch-mode': 'cors',
//             'sec-fetch-site': 'cross-site',
//             'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36',
//             'Authorization': 'Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJodHRwczovL3JhaW5ib3dzb2x1dGlvbmFuZHRlY2hub2xvZ3kuY29tL05ld0FkbWlzc2lvblBvcnRhbC9wdWJsaWMvYXBpL2F1dGgvdmVyaWZ5LW90cCIsImlhdCI6MTc1OTMwNjA1NywiZXhwIjoxNzYxODk4MDU3LCJuYmYiOjE3NTkzMDYwNTcsImp0aSI6IlRyUmhvcHdvYkJFNHBleHUiLCJzdWIiOiI0MzQiLCJlbWFpbCI6InNoYWFubXNrNEBnbWFpbC5jb20iLCJsb2dpbl90eXBlIjoxLCJyb2xlIjoiU1VQRVJBRE1JTiJ9.uU1-gvBhIrbSrnJ-2rvsBmRuGzpyE4DiazagpC61sZQ',
//           },
//           body: submitFormData
//         }
//       );

//       if (!response.ok) {
//         throw new Error(`HTTP error! status: ${response.status}`);
//       }

//       const result = await response.json();

//       if (result.status) {
//         toast.success(result.message || 'Account updated successfully!');
//         // Optionally redirect or show success message
//         console.log('Update successful:', result);
//       } else {
//         throw new Error(result.message || 'Failed to update account');
//       }

//     } catch (error) {
//       console.error('Error updating account:', error);
//       toast.error('Failed to update account. Please try again.');
//     } finally {
//       setSubmitting(false);
//     }
//   };

//   // When selectType changes, update steps and adjust activeStep if needed
//   React.useEffect(() => {
//     const newSteps = getSteps();
//     if (activeStep >= newSteps.length) {
//       setActiveStep(newSteps.length - 1);
//     }
//   }, [formData.selectType, activeStep]);

//   // Get the actual step content based on current step
//   const renderStepContent = (step: number) => {
//     const stepComponents = [
//       <AcademicInformation 
//         key="academic" 
//         formData={formData} 
//         updateFormData={updateFormData} 
//       />,
//       <ContactInformation 
//         key="contact" 
//         formData={formData} 
//         updateFormData={updateFormData} 
//       />,
//       <ThirdPartyApiSetup 
//         key="api" 
//         formData={formData} 
//         updateFormData={updateFormData} 
//       />,
//       <RollBasedAccess 
//         key="roll" 
//         formData={formData} 
//         updateFormData={updateFormData} 
//       />,
//       <DnsConfiguration 
//         key="dns" 
//         formData={formData} 
//         updateFormData={updateFormData} 
//         accountId={dynamicAccountId}
//       />,
//     ];

//     const currentStepIndex = steps[step];
//     const baseSteps = [
//       "Academic information",
//       "Contact Information", 
//       "Third party api setup",
//       "Roll based access",
//       "Dns Configuration",
//     ];
    
//     const contentIndex = baseSteps.indexOf(currentStepIndex);
//     return stepComponents[contentIndex];
//   };

//   // Loading state
//   if (loading) {
//     return (
//       <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4 flex items-center justify-center">
//         <div className="text-center">
//           <Spinner size="xl" className="mb-4" />
//           <p className="text-lg text-gray-600 dark:text-gray-400">Loading account data...</p>
//         </div>
//       </div>
//     );
//   }

//   // Error state
//   if (error) {
//     return (
//       <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4 flex items-center justify-center">
//         <div className="text-center">
//           <Alert color="failure" className="mb-4">
//             {error}
//           </Alert>
//           <Button onClick={fetchAccountData}>
//             Retry
//           </Button>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4">
//       <div className="max-w-7xl mx-auto">
//         <CustomBreadcrumb />

//         <div className="mb-6">
//           <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Live Account Onboarding</h1>
//           <p className="text-gray-600 dark:text-gray-400">
//             Editing: {formData.academicName || "Account"}
//           </p>
//         </div>

//         <Card>
//           <h5 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
//             Edit Account - {formData.academicName || "Loading..."}
//           </h5>

//           <CustomStepper steps={steps} activeStep={activeStep} />

//           {activeStep === steps.length ? (
//             <Alert color="success" className="mb-4">
//               All steps completed - you're finished
//             </Alert>
//           ) : (
//             <>
//               <div className="mb-8">
//                 {renderStepContent(activeStep)}
//               </div>

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
//                   <Button 
//                     onClick={handleSubmit} 
//                     color="blue" 
//                     className="flex items-center gap-2"
//                     disabled={submitting}
//                   >
//                     {submitting ? (
//                       <>
//                         <Spinner size="sm" className="mr-2" />
//                         Updating...
//                       </>
//                     ) : (
//                       <>
//                         Update
//                         <HiCheckCircle className="w-4 h-4" />
//                       </>
//                     )}
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






































// "use client";
// import React, { useState, useEffect } from "react";
// import { Alert, Breadcrumb, Button, Card } from "flowbite-react";
// import { HiCheckCircle, HiArrowLeft, HiArrowRight, HiHome, HiInformationCircle } from "react-icons/hi";

// // Import components
// import AcademicInformation from "./AcademicInformation";
// import ContactInformation from "./ContactInformation";
// import ThirdPartyApiSetup from "./ThirdPartyApiSetup";
// import RollBasedAccess from "./RollBasedAccess";
// import DnsConfiguration from "./DnsConfiguration";

// // Types
// export interface FormData {
//   // Academic Information
//   selectType: string;
//   selectSubtype: string;
//   academicName: string;
//   selectState: string;
//   selectDistrict: string;
//   Pincode: string;
//   area: string;
//   website_url: string;
//   primary_email: string;
//   academicAddress: string;
//   academicDescription: string;
//   academicLogo: File | null;
//   previewImage: string | null;

//   // Contact Information
//   technicalName: string;
//   technicalEmail: string;
//   technicalPhone: string;
//   technicalLocation: string;
//   billingName: string;
//   billingEmail: string;
//   billingPhone: string;
//   billingLocation: string;
//   additionalName: string;
//   additionalEmail: string;
//   additionalPhone: string;
//   additionalLocation: string;

//   // API Configurations
//   selectedServicesOption: string;
//   fromEmail: string;
//   smtpHost: string;
//   smtpPort: string;
//   smtpUsername: string;
//   smtpPassword: string;
//   zohoApiKey: string;
//   zohoFromEmail: string;
//   bounceAddress: string;
//   UserId: string;
//   wPassword: string;
//   smsApikey: string;
//   smsSecretkey: string;
//   razorpayApikey: string;
//   razorpaySecretkey: string;
  
//   // Templates
//   whatsappTemplate: string;
//   smsTemplate: string;
//   emailTemplate: string;
  
//   // Toggles
//   isDropdownEnabled: boolean;
//   isTemplatesVisible: boolean;
//   isSmsApiEnabled: boolean;
//   switchState: boolean;
//   nominalState: boolean;
  
//   // Domain Configuration
//   domainName: string;
//   domainNameError: boolean;
//   domainNameErrorMsg: string;
//   configure: string;
//   updateConfigure: number;

//   // API Data
//   states: any[];
//   districts: any[];
//   academicData: any;
//   templateData: any;
// }

// interface FormWizardProps {
//   s_id: string;
//   academic_id: string;
// }

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

// const FormWizard: React.FC<FormWizardProps> = ({ s_id, academic_id }) => {
//   const [activeStep, setActiveStep] = useState(0);
//   const [isLoading, setIsLoading] = useState(false);
//   const [submitMessage, setSubmitMessage] = useState("");

//   const [formData, setFormData] = useState<FormData>({
//     // Academic Information
//     selectType: "",
//     selectSubtype: "",
//     academicName: "",
//     selectState: "",
//     selectDistrict: "",
//     Pincode: "",
//     area: "",
//     website_url: "",
//     primary_email: "",
//     academicAddress: "",
//     academicDescription: "",
//     academicLogo: null,
//     previewImage: null,

//     // Contact Information
//     technicalName: "",
//     technicalEmail: "",
//     technicalPhone: "",
//     technicalLocation: "",
//     billingName: "",
//     billingEmail: "",
//     billingPhone: "",
//     billingLocation: "",
//     additionalName: "",
//     additionalEmail: "",
//     additionalPhone: "",
//     additionalLocation: "",

//     // API Configurations
//     selectedServicesOption: "Zoho Api",
//     fromEmail: "",
//     smtpHost: "",
//     smtpPort: "",
//     smtpUsername: "",
//     smtpPassword: "",
//     zohoApiKey: "",
//     zohoFromEmail: "",
//     bounceAddress: "",
//     UserId: "",
//     wPassword: "",
//     smsApikey: "",
//     smsSecretkey: "",
//     razorpayApikey: "",
//     razorpaySecretkey: "",
    
//     // Templates
//     whatsappTemplate: "",
//     smsTemplate: "",
//     emailTemplate: "",
    
//     // Toggles
//     isDropdownEnabled: false,
//     isTemplatesVisible: false,
//     isSmsApiEnabled: false,
//     switchState: false,
//     nominalState: false,
    
//     // Domain Configuration
//     domainName: "",
//     domainNameError: false,
//     domainNameErrorMsg: "",
//     configure: "",
//     updateConfigure: 0,

//     // API Data
//     states: [],
//     districts: [],
//     academicData: null,
//     templateData: null,
//   });

//   // Fetch initial data
//   useEffect(() => {
//     fetchStates();
//     fetchAcademicData();
//   }, []);

//   // Fetch states API
//   const fetchStates = async () => {
//     try {
//       const response = await fetch('https://rainbowsolutionandtechnology.com/NewAdmissionPortal/public/api/Public/state', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//       });
      
//       const data = await response.json();
//       if (data.status) {
//         setFormData(prev => ({
//           ...prev,
//           states: data.states
//         }));
//       }
//     } catch (error) {
//       console.error('Error fetching states:', error);
//     }
//   };

//   // Fetch academic data API
//   const fetchAcademicData = async () => {
//     try {
//       const response = await fetch('https://rainbowsolutionandtechnology.com/NewAdmissionPortal/public/api/SuperAdmin/Accounts/Get-Academic-details', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//           'Authorization': 'Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJodHRwczovL3JhaW5ib3dzb2x1dGlvbmFuZHRlY2hub2xvZ3kuY29tL05ld0FkbWlzc2lvblBvcnRhbC9wdWJsaWMvYXBpL2F1dGgvdmVyaWZ5LW90cCIsImlhdCI6MTc1OTMwNjA1NywiZXhwIjoxNzYxODk4MDU3LCJuYmYiOjE3NTkzMDYwNTcsImp0aSI6IlRyUmhvcHdvYkJFNHBleHUiLCJzdWIiOiI0MzQiLCJlbWFpbCI6InNoYWFubXNrNEBnbWFpbC5jb20iLCJsb2dpbl90eXBlIjoxLCJyb2xlIjoiU1VQRVJBRE1JTiJ9.uU1-gvBhIrbSrnJ-2rvsBmRuGzpyE4DiazagpC61sZQ',
//         },
//         body: JSON.stringify({
//           s_id: s_id,
//           academic_id: academic_id
//         })
//       });
      
//       const data = await response.json();
//       if (data.academic) {
//         setFormData(prev => ({
//           ...prev,
//           academicData: data.academic,
//           templateData: data.template,
//           // Pre-fill form data
//           academicName: data.academic.academic_name || "",
//           primary_email: data.academic.academic_email || "",
//           area: data.academic.academic_area || "",
//           academicAddress: data.academic.academic_address || "",
//           academicDescription: data.academic.academic_description || "",
//           Pincode: data.academic.academic_pincode || "",
//           selectState: data.academic.state_id || "",
//           selectDistrict: data.academic.district_id || "",
//           website_url: data.academic.academic_website || "",
//           // Pre-fill template data
//           whatsappTemplate: data.template?.whatsapp_template || "",
//           smsTemplate: data.template?.sms_template || "",
//           emailTemplate: data.template?.email_template || "",
//         }));
//       }
//     } catch (error) {
//       console.error('Error fetching academic data:', error);
//     }
//   };

//   // Update form data
//   const updateFormData = (updates: Partial<FormData>) => {
//     setFormData(prev => ({ ...prev, ...updates }));
//   };

//   // Steps configuration
//   const getSteps = () => {
//     const baseSteps = [
//       "Academic information",
//       "Contact Information",
//       "Third party api setup",
//       "Roll based access",
//       "Dns Configuration",
//     ];
    
//     if (formData.selectType === "1") {
//       return baseSteps.filter(step => step !== "Roll based access");
//     }
    
//     return baseSteps;
//   };

//   const steps = getSteps();

//   const handleNext = () => {
//     setActiveStep((prev) => prev + 1);
//   };

//   const handleBack = () => {
//     setActiveStep((prev) => prev - 1);
//   };

//   // Submit form data
//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setIsLoading(true);
//     setSubmitMessage("");

//     try {
//       const formDataToSend = new FormData();
      
//       // Add all form fields
//       formDataToSend.append('s_id', s_id);
//       formDataToSend.append('account_id', academic_id);
//       formDataToSend.append('select_type', formData.selectType);
//       formDataToSend.append('select_subtype', formData.selectSubtype);
//       formDataToSend.append('email', formData.primary_email);
//       formDataToSend.append('academic_name', formData.academicName);
//       formDataToSend.append('academic_area', formData.area);
//       formDataToSend.append('academic_address', formData.academicAddress);
//       formDataToSend.append('academic_description', formData.academicDescription);
//       formDataToSend.append('academic_pincode', formData.Pincode);
//       formDataToSend.append('state_id', formData.selectState);
//       formDataToSend.append('district_id', formData.selectDistrict);
//       formDataToSend.append('website_url', formData.website_url);
      
//       // Contact information
//       formDataToSend.append('technicalName', formData.technicalName);
//       formDataToSend.append('technicalEmail', formData.technicalEmail);
//       formDataToSend.append('technicalPhone', formData.technicalPhone);
//       formDataToSend.append('technicalLocation', formData.technicalLocation);
//       formDataToSend.append('billingName', formData.billingName);
//       formDataToSend.append('billingEmail', formData.billingEmail);
//       formDataToSend.append('billingPhone', formData.billingPhone);
//       formDataToSend.append('billingLocation', formData.billingLocation);
//       formDataToSend.append('additionalName', formData.additionalName);
//       formDataToSend.append('additionalEmail', formData.additionalEmail);
//       formDataToSend.append('additionalPhone', formData.additionalPhone);
//       formDataToSend.append('additionalLocation', formData.additionalLocation);
      
//       // Domain configuration
//       formDataToSend.append('configured', formData.configure === "1" ? "1" : "0");
//       formDataToSend.append('configured_domain', formData.domainName);
      
//       // Templates
//       formDataToSend.append('template_id', formData.templateData?.id || "22");
//       formDataToSend.append('whatsapp_template', formData.whatsappTemplate);
//       formDataToSend.append('sms_template', formData.smsTemplate);
//       formDataToSend.append('email_template', formData.emailTemplate);
      
//       // API keys
//       formDataToSend.append('wtsp_api_key', formData.wPassword);
//       formDataToSend.append('sms_api_key', formData.smsApikey);
//       formDataToSend.append('razorpay_api_key', formData.razorpayApikey);
//       formDataToSend.append('razorpay_secret_key', formData.razorpaySecretkey);
//       formDataToSend.append('zoho_api_key', formData.zohoApiKey);
//       formDataToSend.append('zoho_from_email', formData.zohoFromEmail);
//       formDataToSend.append('bounce_address', formData.bounceAddress);
      
//       // Permissions
//       formDataToSend.append('hallticket_generate_permission', formData.switchState ? "1" : "0");
//       formDataToSend.append('nominal_permission', formData.nominalState ? "1" : "0");
//       formDataToSend.append('email_service_dropdown_enabled', formData.isDropdownEnabled ? "1" : "0");
//       formDataToSend.append('whatsapp_details_enable', formData.isTemplatesVisible ? "1" : "0");
//       formDataToSend.append('sms_details_enable', formData.isSmsApiEnabled ? "1" : "0");
      
//       // Logo file
//       if (formData.academicLogo) {
//         formDataToSend.append('academic_logo', formData.academicLogo);
//       }

//       const response = await fetch('https://rainbowsolutionandtechnology.com/NewAdmissionPortal/public/api/SuperAdmin/Accounts/live-Account-Update', {
//         method: 'POST',
//         headers: {
//           'Authorization': 'Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJodHRwczovL3JhaW5ib3dzb2x1dGlvbmFuZHRlY2hub2xvZ3kuY29tL05ld0FkbWlzc2lvblBvcnRhbC9wdWJsaWMvYXBpL2F1dGgvdmVyaWZ5LW90cCIsImlhdCI6MTc1OTMwNjA1NywiZXhwIjoxNzYxODk4MDU3LCJuYmYiOjE3NTkzMDYwNTcsImp0aSI6IlRyUmhvcHdvYkJFNHBleHUiLCJzdWIiOiI0MzQiLCJlbWFpbCI6InNoYWFubXNrNEBnbWFpbC5jb20iLCJsb2dpbl90eXBlIjoxLCJyb2xlIjoiU1VQRVJBRE1JTiJ9.uU1-gvBhIrbSrnJ-2rvsBmRuGzpyE4DiazagpC61sZQ',
//         },
//         body: formDataToSend
//       });

//       const result = await response.json();
      
//       if (result.status) {
//         setSubmitMessage(result.message);
//       } else {
//         setSubmitMessage("Error updating account");
//       }
//     } catch (error) {
//       console.error('Error submitting form:', error);
//       setSubmitMessage("Error updating account");
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   // When selectType changes, update steps
//   useEffect(() => {
//     const newSteps = getSteps();
//     if (activeStep >= newSteps.length) {
//       setActiveStep(newSteps.length - 1);
//     }
//   }, [formData.selectType, activeStep]);

//   // Get step content
//   const renderStepContent = (step: number) => {
//     const stepComponents = [
//       <AcademicInformation 
//         key="academic" 
//         formData={formData} 
//         updateFormData={updateFormData} 
//       />,
//       <ContactInformation 
//         key="contact" 
//         formData={formData} 
//         updateFormData={updateFormData} 
//       />,
//       <ThirdPartyApiSetup 
//         key="api" 
//         formData={formData} 
//         updateFormData={updateFormData} 
//       />,
//       <RollBasedAccess 
//         key="roll" 
//         formData={formData} 
//         updateFormData={updateFormData} 
//       />,
//       <DnsConfiguration 
//         key="dns" 
//         formData={formData} 
//         updateFormData={updateFormData} 
//       />,
//     ];

//     const currentStepIndex = steps[step];
//     const baseSteps = [
//       "Academic information",
//       "Contact Information", 
//       "Third party api setup",
//       "Roll based access",
//       "Dns Configuration",
//     ];
    
//     const contentIndex = baseSteps.indexOf(currentStepIndex);
//     return stepComponents[contentIndex];
//   };

//   return (
//     <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4">
//       <div className="max-w-7xl mx-auto">
//         <CustomBreadcrumb />

//         <div className="mb-6">
//           <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Live Account Onboarding</h1>
//           <p className="text-gray-600 dark:text-gray-400">Live Account Onboarding</p>
//         </div>

//         <Card>
//           <h5 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">Live Account Onboarding</h5>

//           <CustomStepper steps={steps} activeStep={activeStep} />

//           {submitMessage && (
//             <Alert color={submitMessage.includes("successfully") ? "success" : "failure"} className="mb-4">
//               {submitMessage}
//             </Alert>
//           )}

//           {activeStep === steps.length ? (
//             <Alert color="success" className="mb-4">
//               All steps completed - you're finished
//             </Alert>
//           ) : (
//             <>
//               <div className="mb-8">
//                 {renderStepContent(activeStep)}
//               </div>

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
//                   <Button 
//                     onClick={handleSubmit} 
//                     color="blue" 
//                     className="flex items-center gap-2"
//                     disabled={isLoading}
//                   >
//                     {isLoading ? "Updating..." : "Update"}
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




































"use client";
import React, { useState, useEffect } from "react";
import { Alert, Breadcrumb, Button, Card } from "flowbite-react";
import { HiCheckCircle, HiArrowLeft, HiArrowRight, HiHome, HiInformationCircle } from "react-icons/hi";

// Import components
import AcademicInformation from "./AcademicInformation";
import ContactInformation from "./ContactInformation";
import ThirdPartyApiSetup from "./ThirdPartyApiSetup";
import RollBasedAccess from "./RollBasedAccess";
import DnsConfiguration from "./DnsConfiguration";
import { useAuth } from "src/hook/useAuth";
import { useParams } from "react-router";

// Types
export interface FormData {
  // Academic Information
  selectType: string;
  selectSubtype: string;
  academicName: string;
  selectState: string;
  selectDistrict: string;
  Pincode: string;
  area: string;
  website_url: string;
  primary_email: string;
  academicAddress: string;
  academicDescription: string;
  academicLogo: File | null;
  previewImage: string | null;

  // Contact Information
  technicalName: string;
  technicalEmail: string;
  technicalPhone: string;
  technicalLocation: string;
  billingName: string;
  billingEmail: string;
  billingPhone: string;
  billingLocation: string;
  additionalName: string;
  additionalEmail: string;
  additionalPhone: string;
  additionalLocation: string;

  // API Configurations
  selectedServicesOption: string;
  fromEmail: string;
  smtpHost: string;
  smtpPort: string;
  smtpUsername: string;
  smtpPassword: string;
  zohoApiKey: string;
  zohoFromEmail: string;
  bounceAddress: string;
  UserId: string;
  wPassword: string;
  smsApikey: string;
  smsSecretkey: string;
  razorpayApikey: string;
  razorpaySecretkey: string;
  
  // Templates
  whatsappTemplate: string;
  smsTemplate: string;
  emailTemplate: string;
  
  // Toggles
  isDropdownEnabled: boolean;
  isTemplatesVisible: boolean;
  isSmsApiEnabled: boolean;
  switchState: boolean;
  nominalState: boolean;
  
  // Domain Configuration
  domainName: string;
  domainNameError: boolean;
  domainNameErrorMsg: string;
  configure: string;
  updateConfigure: number;

  // API Data
  states: any[];
  districts: any[];
  academicData: any;
  templateData: any;
}

interface FormWizardProps {
  s_id: string;
  academic_id: string;
  authToken: string; // Add auth token as prop
}

// Custom Stepper Component
interface StepperProps {
  steps: string[];
  activeStep: number;
}

const CustomStepper: React.FC<StepperProps> = ({ steps, activeStep }) => {
  return (
    <div className="flex items-center w-full mb-8">
      {steps.map((step, index) => (
        <React.Fragment key={step}>
          <div className="flex flex-col items-center">
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                index <= activeStep
                  ? "bg-blue-600 text-white"
                  : "bg-gray-200 text-gray-500"
              }`}
            >
              {index + 1}
            </div>
            <span
              className={`text-xs mt-1 text-center ${
                index <= activeStep ? "text-blue-600 font-medium" : "text-gray-500"
              }`}
            >
              {step}
            </span>
          </div>
          
          {index < steps.length - 1 && (
            <div
              className={`flex-1 h-1 mx-2 ${
                index < activeStep ? "bg-blue-600" : "bg-gray-200"
              }`}
            />
          )}
        </React.Fragment>
      ))}
    </div>
  );
};

// Custom Breadcrumb Component
const CustomBreadcrumb = () => {
  return (
    <nav className="flex mb-6" aria-label="Breadcrumb">
      <ol className="inline-flex items-center space-x-1 md:space-x-3">
        <li className="inline-flex items-center">
          <a href="#" className="inline-flex items-center text-sm font-medium text-gray-700 hover:text-blue-600 dark:text-gray-400 dark:hover:text-white">
            <HiHome className="w-4 h-4 mr-2" />
            Home
          </a>
        </li>
        <li>
          <div className="flex items-center">
            <svg className="w-3 h-3 text-gray-400 mx-1" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 6 10">
              <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 9 4-4-4-4"/>
            </svg>
            <a href="#" className="ml-1 text-sm font-medium text-gray-700 hover:text-blue-600 md:ml-2 dark:text-gray-400 dark:hover:text-white">
              Accounts
            </a>
          </div>
        </li>
        <li aria-current="page">
          <div className="flex items-center">
            <svg className="w-3 h-3 text-gray-400 mx-1" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 6 10">
              <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 9 4-4-4-4"/>
            </svg>
            <span className="ml-1 text-sm font-medium text-gray-500 md:ml-2 dark:text-gray-400">
              Live Account Onboarding
            </span>
          </div>
        </li>
      </ol>
    </nav>
  );
};

const FormWizard: React.FC<FormWizardProps> = () => {
  const [activeStep, setActiveStep] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [submitMessage, setSubmitMessage] = useState("");
  const { user } = useAuth();
  const s_id = user?.id;
  const authToken = user?.token;
  const { id } = useParams<{ id: string }>();

  const [formData, setFormData] = useState<FormData>({
    // Academic Information
    selectType: "",
    selectSubtype: "",
    academicName: "",
    selectState: "",
    selectDistrict: "",
    Pincode: "",
    area: "",
    website_url: "",
    primary_email: "",
    academicAddress: "",
    academicDescription: "",
    academicLogo: null,
    previewImage: null,

    // Contact Information
    technicalName: "",
    technicalEmail: "",
    technicalPhone: "",
    technicalLocation: "",
    billingName: "",
    billingEmail: "",
    billingPhone: "",
    billingLocation: "",
    additionalName: "",
    additionalEmail: "",
    additionalPhone: "",
    additionalLocation: "",

    // API Configurations
    selectedServicesOption: "Zoho Api",
    fromEmail: "",
    smtpHost: "",
    smtpPort: "",
    smtpUsername: "",
    smtpPassword: "",
    zohoApiKey: "",
    zohoFromEmail: "",
    bounceAddress: "",
    UserId: "",
    wPassword: "",
    smsApikey: "",
    smsSecretkey: "",
    razorpayApikey: "",
    razorpaySecretkey: "",
    
    // Templates
    whatsappTemplate: "",
    smsTemplate: "",
    emailTemplate: "",
    
    // Toggles
    isDropdownEnabled: false,
    isTemplatesVisible: false,
    isSmsApiEnabled: false,
    switchState: false,
    nominalState: false,
    
    // Domain Configuration
    domainName: "",
    domainNameError: false,
    domainNameErrorMsg: "",
    configure: "",
    updateConfigure: 0,

    // API Data
    states: [],
    districts: [],
    academicData: null,
    templateData: null,
  });

  // Fetch initial data
  useEffect(() => {
    fetchStates();
    if (id && authToken) {
      fetchAcademicData();
    }
  }, [id, authToken]);

  // Fetch states API - FIXED
  const fetchStates = async () => {
    try {
      console.log('Fetching states...');
      const response = await fetch('https://rainbowsolutionandtechnology.com/NewAdmissionPortal/public/api/Public/state', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      console.log('States API Response:', data);
      
      if (data.status) {
        setFormData(prev => ({
          ...prev,
          states: data.states
        }));
      }
    } catch (error) {
      console.error('Error fetching states:', error);
    }
  };

  // Fetch academic data API - FIXED (CORS issue resolved)
  const fetchAcademicData = async () => {
    try {
      //console.log('Fetching academic data...', { s_id, id });
      
      const response = await fetch('/api/proxy-academic-data', { // Proxy through Next.js API route
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authToken}`,
        },
        body: JSON.stringify({
          s_id: s_id,
          academic_id: id
        })
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      console.log('Academic Data API Response:', data);
      
      if (data.academic) {
        setFormData(prev => ({
          ...prev,
          academicData: data.academic,
          templateData: data.template,
          // Pre-fill form data
          academicName: data.academic.academic_name || "",
          primary_email: data.academic.academic_email || "",
          area: data.academic.academic_area || "",
          academicAddress: data.academic.academic_address || "",
          academicDescription: data.academic.academic_description || "",
          Pincode: data.academic.academic_pincode || "",
          selectState: data.academic.state_id || "",
          selectDistrict: data.academic.district_id || "",
          website_url: data.academic.academic_website || "",
          // Pre-fill template data
          whatsappTemplate: data.template?.whatsapp_template || "",
          smsTemplate: data.template?.sms_template || "",
          emailTemplate: data.template?.email_template || "",
          // Pre-fill contact data if available
          technicalName: data.academic.technical_contact?.name || "",
          technicalEmail: data.academic.technical_contact?.email || "",
          technicalPhone: data.academic.technical_contact?.phone || "",
          // Domain configuration
          domainName: data.academic.configured_domain || "",
          configure: data.academic.configured ? "1" : "0",
        }));
      }
    } catch (error) {
      console.error('Error fetching academic data:', error);
    }
  };

  // Update form data
  const updateFormData = (updates: Partial<FormData>) => {
    setFormData(prev => ({ ...prev, ...updates }));
  };

  // Steps configuration
  const getSteps = () => {
    const baseSteps = [
      "Academic information",
      "Contact Information",
      "Third party api setup",
      "Roll based access",
      "Dns Configuration",
    ];
    
    if (formData.selectType === "1") {
      return baseSteps.filter(step => step !== "Roll based access");
    }
    
    return baseSteps;
  };

  const steps = getSteps();

  const handleNext = () => {
    setActiveStep((prev) => prev + 1);
  };

  const handleBack = () => {
    setActiveStep((prev) => prev - 1);
  };

  // Submit form data - FIXED
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setSubmitMessage("");

    try {
      const formDataToSend = new FormData();
      
      // Add all form fields - FIXED field names
      formDataToSend.append('s_id', s_id);
      formDataToSend.append('account_id', id);
      formDataToSend.append('select_type', formData.selectType);
      formDataToSend.append('select_subtype', formData.selectSubtype || '');
      formDataToSend.append('email', formData.primary_email);
      formDataToSend.append('academic_name', formData.academicName);
      formDataToSend.append('academic_area', formData.area);
      formDataToSend.append('academic_address', formData.academicAddress);
      formDataToSend.append('academic_description', formData.academicDescription);
      formDataToSend.append('academic_pincode', formData.Pincode);
      formDataToSend.append('state_id', formData.selectState);
      formDataToSend.append('district_id', formData.selectDistrict);
      formDataToSend.append('website_url', formData.website_url);
      
      // Contact information - FIXED field names
      formDataToSend.append('technicalName', formData.technicalName);
      formDataToSend.append('technicalEmail', formData.technicalEmail);
      formDataToSend.append('technicalPhone', formData.technicalPhone);
      formDataToSend.append('technicalLocation', formData.technicalLocation);
      formDataToSend.append('billingName', formData.billingName);
      formDataToSend.append('billingEmail', formData.billingEmail);
      formDataToSend.append('billingPhone', formData.billingPhone);
      formDataToSend.append('billingLocation', formData.billingLocation);
      formDataToSend.append('additionalName', formData.additionalName);
      formDataToSend.append('additionalEmail', formData.additionalEmail);
      formDataToSend.append('additionalPhone', formData.additionalPhone);
      formDataToSend.append('additionalLocation', formData.additionalLocation);
      
      // Domain configuration
      formDataToSend.append('configured', formData.configure === "1" ? "1" : "0");
      formDataToSend.append('configured_domain', formData.domainName);
      
      // Templates
      formDataToSend.append('template_id', formData.templateData?.id || "22");
      formDataToSend.append('whatsapp_template', formData.whatsappTemplate);
      formDataToSend.append('sms_template', formData.smsTemplate);
      formDataToSend.append('email_template', formData.emailTemplate);
      
      // API keys - FIXED field names
      formDataToSend.append('wtsp_api_key', formData.wPassword);
      formDataToSend.append('sms_api_key', formData.smsApikey);
      formDataToSend.append('razorpay_api_key', formData.razorpayApikey);
      formDataToSend.append('razorpay_secret_key', formData.razorpaySecretkey);
      formDataToSend.append('zoho_api_key', formData.zohoApiKey);
      formDataToSend.append('zoho_from_email', formData.zohoFromEmail);
      formDataToSend.append('bounce_address', formData.bounceAddress);
      
      // Permissions - FIXED field names
      formDataToSend.append('hallticket_generate_permission', formData.switchState ? "1" : "0");
      formDataToSend.append('nominal_permission', formData.nominalState ? "1" : "0");
      formDataToSend.append('email_service_dropdown_enabled', formData.isDropdownEnabled ? "1" : "0");
      formDataToSend.append('whatsapp_details_enable', formData.isTemplatesVisible ? "1" : "0");
      formDataToSend.append('sms_details_enable', formData.isSmsApiEnabled ? "1" : "0");
      
      // Logo file
      if (formData.academicLogo) {
        formDataToSend.append('academic_logo', formData.academicLogo);
      }

      console.log('Submitting form data...');

      // Use proxy API route to avoid CORS issues
      const response = await fetch('/api/proxy-update-account', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${authToken}`,
        },
        body: formDataToSend
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      console.log('Update API Response:', result);
      
      if (result.status) {
        setSubmitMessage(result.message);
      } else {
        setSubmitMessage("Error updating account: " + (result.message || "Unknown error"));
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      setSubmitMessage("Error updating account: " + (error instanceof Error ? error.message : "Unknown error"));
    } finally {
      setIsLoading(false);
    }
  };

  // When selectType changes, update steps
  useEffect(() => {
    const newSteps = getSteps();
    if (activeStep >= newSteps.length) {
      setActiveStep(newSteps.length - 1);
    }
  }, [formData.selectType, activeStep]);

  // Get step content
  const renderStepContent = (step: number) => {
    const stepComponents = [
      <AcademicInformation 
        key="academic" 
        formData={formData} 
        updateFormData={updateFormData} 
      />,
      <ContactInformation 
        key="contact" 
        formData={formData} 
        updateFormData={updateFormData} 
      />,
      <ThirdPartyApiSetup 
        key="api" 
        formData={formData} 
        updateFormData={updateFormData} 
      />,
      <RollBasedAccess 
        key="roll" 
        formData={formData} 
        updateFormData={updateFormData} 
      />,
      <DnsConfiguration 
        key="dns" 
        formData={formData} 
        updateFormData={updateFormData} 
      />,
    ];

    const currentStepIndex = steps[step];
    const baseSteps = [
      "Academic information",
      "Contact Information", 
      "Third party api setup",
      "Roll based access",
      "Dns Configuration",
    ];
    
    const contentIndex = baseSteps.indexOf(currentStepIndex);
    return stepComponents[contentIndex];
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4">
      <div className="max-w-7xl mx-auto">
        <CustomBreadcrumb />

        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Live Account Onboarding</h1>
          <p className="text-gray-600 dark:text-gray-400">Live Account Onboarding</p>
        </div>

        <Card>
          <h5 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">Live Account Onboarding</h5>

          <CustomStepper steps={steps} activeStep={activeStep} />

          {submitMessage && (
            <Alert color={submitMessage.includes("successfully") ? "success" : "failure"} className="mb-4">
              {submitMessage}
            </Alert>
          )}

          {activeStep === steps.length ? (
            <Alert color="success" className="mb-4">
              All steps completed - you're finished
            </Alert>
          ) : (
            <>
              <div className="mb-8">
                {renderStepContent(activeStep)}
              </div>

              <div className="flex justify-between items-center">
                <Button
                  color="light"
                  onClick={handleBack}
                  disabled={activeStep === 0}
                  className="flex items-center gap-2"
                >
                  <HiArrowLeft className="w-4 h-4" />
                  Back
                </Button>

                {activeStep === steps.length - 1 ? (
                  <Button 
                    onClick={handleSubmit} 
                    color="blue" 
                    className="flex items-center gap-2"
                    disabled={isLoading}
                  >
                    {isLoading ? "Updating..." : "Update"}
                    <HiCheckCircle className="w-4 h-4" />
                  </Button>
                ) : (
                  <Button onClick={handleNext} color="blue" className="flex items-center gap-2">
                    Next
                    <HiArrowRight className="w-4 h-4" />
                  </Button>
                )}
              </div>
            </>
          )}
        </Card>
      </div>
    </div>
  );
};

export default FormWizard;