// // import React from "react";
// // import { Alert, Button, Label, TextInput } from "flowbite-react";
// // import { HiInformationCircle, HiCheckCircle } from "react-icons/hi";
// // import { FormData } from "./FormWizard";

// // interface DnsConfigurationProps {
// //   formData: FormData;
// //   updateFormData: (updates: Partial<FormData>) => void;
// // }

// // const DnsConfiguration: React.FC<DnsConfigurationProps> = ({ 
// //   formData, 
// //   updateFormData 
// // }) => {
// //   const domainNameRegex = /^(?:[a-zA-Z0-9-]+\.)+[a-zA-Z]{2,}$/;

// //   const handleConfigure = () => {
// //     if (!formData.domainNameError && formData.domainName) {
// //       updateFormData({ configure: "1", updateConfigure: 1 });
// //     }
// //   };

// //   return (
// //     <div className="space-y-6">
// //       <Alert color="info" icon={HiInformationCircle}>
// //         Important: Ensure that the domain you are configuring points to our server's IP address. 
// //         Please add an A record in the client domain settings with the IP address provided by us. 
// //         Only after this setup, site will work properly.
// //       </Alert>

// //       {formData.configure === "0" ? (
// //         <div className="flex flex-col items-center justify-center space-y-4 py-8">
// //           <div className="w-full max-w-md">
// //             <Label htmlFor="domainName">Enter Domain Name</Label>
// //             <div className="relative">
// //               <TextInput
// //                 id="domainName"
// //                 value={formData.domainName}
// //                 onChange={(e) => {
// //                   const value = e.target.value;
// //                   updateFormData({ domainName: value });
                  
// //                   if (!domainNameRegex.test(value)) {
// //                     updateFormData({ 
// //                       domainNameError: true,
// //                       domainNameErrorMsg: "Please enter a valid domain name (e.g., example.com)."
// //                     });
// //                   } else {
// //                     updateFormData({ 
// //                       domainNameError: false,
// //                       domainNameErrorMsg: ""
// //                     });
// //                   }
// //                 }}
// //                 color={formData.domainNameError ? "failure" : "gray"}
// //                 placeholder="Enter Domain"
// //               />
// //               {formData.domainNameError && (
// //                 <p className="mt-1 text-sm text-red-600">{formData.domainNameErrorMsg}</p>
// //               )}
// //             </div>
// //           </div>
// //           <Button onClick={handleConfigure} className="mt-4">
// //             Configure
// //           </Button>
// //         </div>
// //       ) : (
// //         <div className="flex flex-col items-center justify-center space-y-4 py-8">
// //           <HiCheckCircle className="w-12 h-12 text-green-500" />
// //           {formData.updateConfigure ? (
// //             <p className="text-green-600 font-semibold text-center">
// //               Domain Configured Successfully now click on update to apply
// //             </p>
// //           ) : (
// //             <p className="font-semibold text-center text-gray-900 dark:text-white">
// //               Domain Already Configured for {formData.domainName}
// //             </p>
// //           )}
// //         </div>
// //       )}
// //     </div>
// //   );
// // };

// // export default DnsConfiguration;
















// // import React from "react";
// // import { Alert, Button, Label, TextInput, Spinner } from "flowbite-react";
// // import { HiInformationCircle, HiCheckCircle } from "react-icons/hi";
// // import { WizardFormData } from "./FormWizard";
// // import toast from "react-hot-toast";

// // interface DnsConfigurationProps {
// //   formData: WizardFormData;
// //   updateFormData: (updates: Partial<WizardFormData>) => void;
// //   accountId?: string;
// // }

// // const DnsConfiguration: React.FC<DnsConfigurationProps> = ({ 
// //   formData, 
// //   updateFormData,
// //   accountId = "50"
// // }) => {
// //   const [loading, setLoading] = React.useState(false);
// //   const domainNameRegex = /^(?:[a-zA-Z0-9-]+\.)+[a-zA-Z]{2,}$/;

// //   const apiUrl = import.meta.env.VITE_API_URL || "https://rainbowsolutionandtechnology.com/NewAdmissionPortal/public/api";

// //   const handleConfigure = async () => {
// //     if (!formData.domainNameError && formData.domainName) {
// //       try {
// //         setLoading(true);
        
// //         // Create FormData object for multipart/form-data
// //         const submitFormData = new FormData();
        
// //         // Add all required fields from formData
// //         submitFormData.append('s_id', '6');
// //         submitFormData.append('account_id', accountId);
// //         submitFormData.append('select_type', formData.selectType || '');
// //         submitFormData.append('select_subtype', formData.selectSubtype || '');
// //         submitFormData.append('email', formData.primary_email || '');
// //         submitFormData.append('academic_name', formData.academicName || '');
// //         submitFormData.append('academic_area', formData.area || '');
// //         submitFormData.append('academic_address', formData.academicAddress || '');
// //         submitFormData.append('academic_description', formData.academicDescription || '');
// //         submitFormData.append('academic_pincode', formData.Pincode || '');
// //         submitFormData.append('state_id', formData.selectState || '');
// //         submitFormData.append('district_id', formData.selectDistrict || '');
// //         submitFormData.append('website_url', formData.website_url || '');
        
// //         // Contact Information
// //         submitFormData.append('technicalName', formData.technicalName || '');
// //         submitFormData.append('technicalEmail', formData.technicalEmail || '');
// //         submitFormData.append('technicalPhone', formData.technicalPhone || '');
// //         submitFormData.append('technicalLocation', formData.technicalLocation || '');
// //         submitFormData.append('billingName', formData.billingName || '');
// //         submitFormData.append('billingEmail', formData.billingEmail || '');
// //         submitFormData.append('billingPhone', formData.billingPhone || '');
// //         submitFormData.append('billingLocation', formData.billingLocation || '');
// //         submitFormData.append('additionalName', formData.additionalName || '');
// //         submitFormData.append('additionalEmail', formData.additionalEmail || '');
// //         submitFormData.append('additionalPhone', formData.additionalPhone || '');
// //         submitFormData.append('additionalLocation', formData.additionalLocation || '');
        
// //         // Domain Configuration
// //         submitFormData.append('configured', '1');
// //         submitFormData.append('configured_domain', formData.domainName || '');
        
// //         // Templates
// //         submitFormData.append('template_id', '22'); // You might need to get this dynamically
// //         submitFormData.append('whatsapp_template', formData.whatsappTemplate || '');
// //         submitFormData.append('sms_template', formData.smsTemplate || '');
// //         submitFormData.append('email_template', formData.emailTemplate || '');
        
// //         // API Keys
// //         submitFormData.append('wtsp_api_key', formData.UserId || '');
// //         submitFormData.append('sms_api_key', formData.smsApikey || '');
// //         submitFormData.append('razorpay_api_key', formData.razorpayApikey || '');
// //         submitFormData.append('razorpay_secret_key', formData.razorpaySecretkey || '');
// //         submitFormData.append('zoho_api_key', formData.zohoApiKey || '');
// //         submitFormData.append('zoho_from_email', formData.zohoFromEmail || '');
// //         submitFormData.append('bounce_address', formData.bounceAddress || '');
        
// //         // Permissions
// //         submitFormData.append('hallticket_generate_permission', formData.switchState ? '1' : '0');
// //         submitFormData.append('nominal_permission', formData.nominalState ? '1' : '0');
// //         submitFormData.append('email_service_dropdown_enabled', formData.isDropdownEnabled ? '1' : '0');
// //         submitFormData.append('whatsapp_details_enable', formData.isTemplatesVisible ? '1' : '0');
// //         submitFormData.append('sms_details_enable', formData.isSmsApiEnabled ? '1' : '0');
        
// //         // Academic Logo - if available
// //         if (formData.academicLogo) {
// //           submitFormData.append('academic_logo', formData.academicLogo);
// //         }

// //         const response = await fetch(
// //           `${apiUrl}/SuperAdmin/Accounts/live-Account-Update`,
// //           {
// //             method: 'POST',
// //             headers: {
// //               'accept': '*/*',
// //               'accept-language': 'en-IN,en-GB;q=0.9,en-US;q=0.8,en;q=0.7,hi;q=0.6',
// //               'origin': 'http://localhost:3010',
// //               'priority': 'u=1, i',
// //               'referer': 'http://localhost:3010/',
// //               'sec-ch-ua': '"Chromium";v="140", "Not=A?Brand";v="24", "Google Chrome";v="140"',
// //               'sec-ch-ua-mobile': '?0',
// //               'sec-ch-ua-platform': '"Windows"',
// //               'sec-fetch-dest': 'empty',
// //               'sec-fetch-mode': 'cors',
// //               'sec-fetch-site': 'cross-site',
// //               'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36',
// //               'Authorization': 'Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJodHRwczovL3JhaW5ib3dzb2x1dGlvbmFuZHRlY2hub2xvZ3kuY29tL05ld0FkbWlzc2lvblBvcnRhbC9wdWJsaWMvYXBpL2F1dGgvdmVyaWZ5LW90cCIsImlhdCI6MTc1OTMwNjA1NywiZXhwIjoxNzYxODk4MDU3LCJuYmYiOjE3NTkzMDYwNTcsImp0aSI6IlRyUmhvcHdvYkJFNHBleHUiLCJzdWIiOiI0MzQiLCJlbWFpbCI6InNoYWFubXNrNEBnbWFpbC5jb20iLCJsb2dpbl90eXBlIjoxLCJyb2xlIjoiU1VQRVJBRE1JTiJ9.uU1-gvBhIrbSrnJ-2rvsBmRuGzpyE4DiazagpC61sZQ',
// //             },
// //             body: submitFormData
// //           }
// //         );

// //         if (!response.ok) {
// //           throw new Error(`HTTP error! status: ${response.status}`);
// //         }

// //         const result = await response.json();

// //         if (result.status) {
// //           updateFormData({ 
// //             configure: "1", 
// //             updateConfigure: 1 
// //           });
// //           toast.success(result.message || 'Domain configured successfully!');
// //         } else {
// //           throw new Error(result.message || 'Failed to configure domain');
// //         }

// //       } catch (error) {
// //         console.error('Error configuring domain:', error);
// //         toast.error('Failed to configure domain. Please try again.');
// //       } finally {
// //         setLoading(false);
// //       }
// //     }
// //   };

// //   const handleDomainChange = (value: string) => {
// //     updateFormData({ domainName: value });
    
// //     if (!domainNameRegex.test(value)) {
// //       updateFormData({ 
// //         domainNameError: true,
// //         domainNameErrorMsg: "Please enter a valid domain name (e.g., example.com)."
// //       });
// //     } else {
// //       updateFormData({ 
// //         domainNameError: false,
// //         domainNameErrorMsg: ""
// //       });
// //     }
// //   };

// //   return (
// //     <div className="space-y-6">
// //       <Alert color="info" icon={HiInformationCircle}>
// //         Important: Ensure that the domain you are configuring points to our server's IP address. 
// //         Please add an A record in the client domain settings with the IP address provided by us. 
// //         Only after this setup, site will work properly.
// //       </Alert>

// //       {formData.configure === "0" ? (
// //         <div className="flex flex-col items-center justify-center space-y-4 py-8">
// //           <div className="w-full max-w-md">
// //             <Label htmlFor="domainName">Enter Domain Name</Label>
// //             <div className="relative">
// //               <TextInput
// //                 id="domainName"
// //                 value={formData.domainName}
// //                 onChange={(e) => handleDomainChange(e.target.value)}
// //                 color={formData.domainNameError ? "failure" : "gray"}
// //                 placeholder="Enter Domain (e.g., example.com)"
// //                 disabled={loading}
// //               />
// //               {formData.domainNameError && (
// //                 <p className="mt-1 text-sm text-red-600">{formData.domainNameErrorMsg}</p>
// //               )}
// //             </div>
// //           </div>
// //           <Button 
// //             onClick={handleConfigure} 
// //             className="mt-4"
// //             disabled={!formData.domainName || formData.domainNameError || loading}
// //           >
// //             {loading ? (
// //               <>
// //                 <Spinner size="sm" className="mr-2" />
// //                 Configuring...
// //               </>
// //             ) : (
// //               'Configure Domain'
// //             )}
// //           </Button>
// //         </div>
// //       ) : (
// //         <div className="flex flex-col items-center justify-center space-y-4 py-8">
// //           <HiCheckCircle className="w-12 h-12 text-green-500" />
// //           {formData.updateConfigure ? (
// //             <div className="text-center">
// //               <p className="text-green-600 font-semibold mb-2">
// //                 Domain Configured Successfully!
// //               </p>
// //               <p className="text-gray-600 text-sm">
// //                 Domain: {formData.domainName}
// //               </p>
// //               <p className="text-gray-600 text-sm">
// //                 Click "Update" in the main form to apply all changes.
// //               </p>
// //             </div>
// //           ) : (
// //             <div className="text-center">
// //               <p className="font-semibold text-gray-900 dark:text-white mb-2">
// //                 Domain Already Configured
// //               </p>
// //               <p className="text-gray-600 text-sm">
// //                 Domain: {formData.domainName}
// //               </p>
// //             </div>
// //           )}
// //         </div>
// //       )}
// //     </div>
// //   );
// // };

// // export default DnsConfiguration;


















// import React from "react";
// import { Alert, Button, Label, TextInput, Spinner } from "flowbite-react";
// import { HiInformationCircle, HiCheckCircle } from "react-icons/hi";
// import { FormWizardData } from "./FormWizard"; // Updated import
// import toast from "react-hot-toast";

// interface DnsConfigurationProps {
//   formData: FormWizardData; // Updated type
//   updateFormData: (updates: Partial<FormWizardData>) => void; // Updated type
//   accountId?: string;
// }

// const DnsConfiguration: React.FC<DnsConfigurationProps> = ({ 
//   formData, 
//   updateFormData,
//   accountId = "50"
// }) => {
//   const [loading, setLoading] = React.useState(false);
//   const domainNameRegex = /^(?:[a-zA-Z0-9-]+\.)+[a-zA-Z]{2,}$/;

//   const apiUrl = import.meta.env.VITE_API_URL || "https://rainbowsolutionandtechnology.com/NewAdmissionPortal/public/api";

//   const handleConfigure = async () => {
//     if (!formData.domainNameError && formData.domainName) {
//       try {
//         setLoading(true);
        
//         // Create browser FormData object for multipart/form-data
//         const submitFormData = new globalThis.FormData(); // Use globalThis to avoid conflict
        
//         // Add all required fields from formData
//         submitFormData.append('s_id', '6');
//         submitFormData.append('account_id', accountId);
//         submitFormData.append('select_type', formData.selectType || '');
//         submitFormData.append('select_subtype', formData.selectSubtype || '');
//         submitFormData.append('email', formData.primary_email || '');
//         submitFormData.append('academic_name', formData.academicName || '');
//         submitFormData.append('academic_area', formData.area || '');
//         submitFormData.append('academic_address', formData.academicAddress || '');
//         submitFormData.append('academic_description', formData.academicDescription || '');
//         submitFormData.append('academic_pincode', formData.Pincode || '');
//         submitFormData.append('state_id', formData.selectState || '');
//         submitFormData.append('district_id', formData.selectDistrict || '');
//         submitFormData.append('website_url', formData.website_url || '');
        
//         // Contact Information
//         submitFormData.append('technicalName', formData.technicalName || '');
//         submitFormData.append('technicalEmail', formData.technicalEmail || '');
//         submitFormData.append('technicalPhone', formData.technicalPhone || '');
//         submitFormData.append('technicalLocation', formData.technicalLocation || '');
//         submitFormData.append('billingName', formData.billingName || '');
//         submitFormData.append('billingEmail', formData.billingEmail || '');
//         submitFormData.append('billingPhone', formData.billingPhone || '');
//         submitFormData.append('billingLocation', formData.billingLocation || '');
//         submitFormData.append('additionalName', formData.additionalName || '');
//         submitFormData.append('additionalEmail', formData.additionalEmail || '');
//         submitFormData.append('additionalPhone', formData.additionalPhone || '');
//         submitFormData.append('additionalLocation', formData.additionalLocation || '');
        
//         // Domain Configuration
//         submitFormData.append('configured', '1');
//         submitFormData.append('configured_domain', formData.domainName || '');
        
//         // Templates
//         submitFormData.append('template_id', '22');
//         submitFormData.append('whatsapp_template', formData.whatsappTemplate || '');
//         submitFormData.append('sms_template', formData.smsTemplate || '');
//         submitFormData.append('email_template', formData.emailTemplate || '');
        
//         // API Keys
//         submitFormData.append('wtsp_api_key', formData.UserId || '');
//         submitFormData.append('sms_api_key', formData.smsApikey || '');
//         submitFormData.append('razorpay_api_key', formData.razorpayApikey || '');
//         submitFormData.append('razorpay_secret_key', formData.razorpaySecretkey || '');
//         submitFormData.append('zoho_api_key', formData.zohoApiKey || '');
//         submitFormData.append('zoho_from_email', formData.zohoFromEmail || '');
//         submitFormData.append('bounce_address', formData.bounceAddress || '');
        
//         // Permissions
//         submitFormData.append('hallticket_generate_permission', formData.switchState ? '1' : '0');
//         submitFormData.append('nominal_permission', formData.nominalState ? '1' : '0');
//         submitFormData.append('email_service_dropdown_enabled', formData.isDropdownEnabled ? '1' : '0');
//         submitFormData.append('whatsapp_details_enable', formData.isTemplatesVisible ? '1' : '0');
//         submitFormData.append('sms_details_enable', formData.isSmsApiEnabled ? '1' : '0');
        
//         // Academic Logo - if available
//         if (formData.academicLogo) {
//           submitFormData.append('academic_logo', formData.academicLogo);
//         }

//         const response = await fetch(
//           `${apiUrl}/SuperAdmin/Accounts/live-Account-Update`,
//           {
//             method: 'POST',
//             headers: {
//               'accept': '*/*',
//               'accept-language': 'en-IN,en-GB;q=0.9,en-US;q=0.8,en;q=0.7,hi;q=0.6',
//               'origin': 'http://localhost:3010',
//               'priority': 'u=1, i',
//               'referer': 'http://localhost:3010/',
//               'sec-ch-ua': '"Chromium";v="140", "Not=A?Brand";v="24", "Google Chrome";v="140"',
//               'sec-ch-ua-mobile': '?0',
//               'sec-ch-ua-platform': '"Windows"',
//               'sec-fetch-dest': 'empty',
//               'sec-fetch-mode': 'cors',
//               'sec-fetch-site': 'cross-site',
//               'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36',
//               'Authorization': 'Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJodHRwczovL3JhaW5ib3dzb2x1dGlvbmFuZHRlY2hub2xvZ3kuY29tL05ld0FkbWlzc2lvblBvcnRhbC9wdWJsaWMvYXBpL2F1dGgvdmVyaWZ5LW90cCIsImlhdCI6MTc1OTMwNjA1NywiZXhwIjoxNzYxODk4MDU3LCJuYmYiOjE3NTkzMDYwNTcsImp0aSI6IlRyUmhvcHdvYkJFNHBleHUiLCJzdWIiOiI0MzQiLCJlbWFpbCI6InNoYWFubXNrNEBnbWFpbC5jb20iLCJsb2dpbl90eXBlIjoxLCJyb2xlIjoiU1VQRVJBRE1JTiJ9.uU1-gvBhIrbSrnJ-2rvsBmRuGzpyE4DiazagpC61sZQ',
//             },
//             body: submitFormData
//           }
//         );

//         if (!response.ok) {
//           throw new Error(`HTTP error! status: ${response.status}`);
//         }

//         const result = await response.json();

//         if (result.status) {
//           updateFormData({ 
//             configure: "1", 
//             updateConfigure: 1 
//           });
//           toast.success(result.message || 'Domain configured successfully!');
//         } else {
//           throw new Error(result.message || 'Failed to configure domain');
//         }

//       } catch (error) {
//         console.error('Error configuring domain:', error);
//         toast.error('Failed to configure domain. Please try again.');
//       } finally {
//         setLoading(false);
//       }
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
//       <Alert color="info" icon={HiInformationCircle}>
//         Important: Ensure that the domain you are configuring points to our server's IP address. 
//         Please add an A record in the client domain settings with the IP address provided by us. 
//         Only after this setup, site will work properly.
//       </Alert>

//       {formData.configure === "0" ? (
//         <div className="flex flex-col items-center justify-center space-y-4 py-8">
//           <div className="w-full max-w-md">
//             <Label htmlFor="domainName">Enter Domain Name</Label>
//             <div className="relative">
//               <TextInput
//                 id="domainName"
//                 value={formData.domainName}
//                 onChange={(e) => handleDomainChange(e.target.value)}
//                 color={formData.domainNameError ? "failure" : "gray"}
//                 placeholder="Enter Domain (e.g., example.com)"
//                 disabled={loading}
//               />
//               {formData.domainNameError && (
//                 <p className="mt-1 text-sm text-red-600">{formData.domainNameErrorMsg}</p>
//               )}
//             </div>
//           </div>
//           <Button 
//             onClick={handleConfigure} 
//             className="mt-4"
//             disabled={!formData.domainName || formData.domainNameError || loading}
//           >
//             {loading ? (
//               <>
//                 <Spinner size="sm" className="mr-2" />
//                 Configuring...
//               </>
//             ) : (
//               'Configure Domain'
//             )}
//           </Button>
//         </div>
//       ) : (
//         <div className="flex flex-col items-center justify-center space-y-4 py-8">
//           <HiCheckCircle className="w-12 h-12 text-green-500" />
//           {formData.updateConfigure ? (
//             <div className="text-center">
//               <p className="text-green-600 font-semibold mb-2">
//                 Domain Configured Successfully!
//               </p>
//               <p className="text-gray-600 text-sm">
//                 Domain: {formData.domainName}
//               </p>
//               <p className="text-gray-600 text-sm">
//                 Click "Update" in the main form to apply all changes.
//               </p>
//             </div>
//           ) : (
//             <div className="text-center">
//               <p className="font-semibold text-gray-900 dark:text-white mb-2">
//                 Domain Already Configured
//               </p>
//               <p className="text-gray-600 text-sm">
//                 Domain: {formData.domainName}
//               </p>
//             </div>
//           )}
//         </div>
//       )}
//     </div>
//   );
// };

// export default DnsConfiguration;











"use client";
import React from "react";
import { Alert, Button, Label, TextInput } from "flowbite-react";
import { HiInformationCircle, HiCheckCircle } from "react-icons/hi";
import { FormData } from "./FormWizard";

interface DnsConfigurationProps {
  formData: FormData;
  updateFormData: (updates: Partial<FormData>) => void;
}

const DnsConfiguration: React.FC<DnsConfigurationProps> = ({ formData, updateFormData }) => {
  
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

  return (
    <div className="space-y-6">
      <Alert color="info" icon={HiInformationCircle}>
        Important: Ensure that the domain you are configuring points to our server's IP address. 
        Please add an A record in the client domain settings with the IP address provided by us. 
        Only after this setup, site will work properly.
      </Alert>

      {formData.configure === "0" ? (
        <div className="flex flex-col items-center justify-center space-y-4 py-8">
          <div className="w-full max-w-md">
            <Label htmlFor="domainName">Enter Domain Name</Label>
            <div className="relative">
              <TextInput
                id="domainName"
                value={formData.domainName}
                onChange={(e) => handleDomainChange(e.target.value)}
                color={formData.domainNameError ? "failure" : "gray"}
                placeholder="Enter Domain"
              />
              {formData.domainNameError && (
                <p className="mt-1 text-sm text-red-600">{formData.domainNameErrorMsg}</p>
              )}
            </div>
          </div>
          <Button onClick={handleConfigure} className="mt-4">
            Configure
          </Button>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center space-y-4 py-8">
          <HiCheckCircle className="w-12 h-12 text-green-500" />
          {formData.updateConfigure ? (
            <p className="text-green-600 font-semibold text-center">
              Domain Configured Successfully now click on update to apply
            </p>
          ) : (
            <p className="font-semibold text-center text-gray-900 dark:text-white">
              Domain Already Configured for {formData.domainName}
            </p>
          )}
        </div>
      )}
    </div>
  );
};

export default DnsConfiguration;