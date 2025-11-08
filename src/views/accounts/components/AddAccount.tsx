// import React, { useState, useEffect, useRef } from 'react';
// import { useNavigate, useParams } from 'react-router';
// import axios from 'axios';
// import { Button } from 'flowbite-react';
// import { BsPlusLg } from 'react-icons/bs';
// import toast from 'react-hot-toast';
// import BreadcrumbHeader from 'src/Frontend/Common/BreadcrumbHeader';
// import { useAuth } from 'src/hook/useAuth';
// import OrganizationSelect from './OrganizationSelect';

// interface FormData {
//   organizationType: string;
//   organizationName: string;
//   clientEmail: string;
//   whatsappTemplate: string;
//   emailTemplate: string;
//   smsTemplate: string;
//   logo: File | null;
//   logoPreview: string;
//   academicAddress: string;
// }

// interface ApiResponse {
//   status: boolean;
//   message: string;
// }

// interface AccountDetails {
//   institution_id: number;
//   academic_name: string;
//   academic_email: string;
//   academic_type: number;
//   academic_address: string;
//   academic_logo: string;
//   whatsapp_template?: string;
//   email_template?: string;
//   sms_template?: string;
// }

// const AddEditAccount: React.FC = () => {
//   const navigate = useNavigate();
//   const { user } = useAuth();
//   const { id } = useParams<{ id: string }>();
//   const isEditMode = Boolean(id);

//   const [formData, setFormData] = useState<FormData>({
//     organizationType: '2', // Default to College
//     organizationName: '',
//     clientEmail: '',
//     whatsappTemplate:
//       'Dear (#name#), Your application for FADEE-2022 has been submitted successfully.',
//     emailTemplate:
//       'Dear (#name#), Your application for FADEE-2022 has been submitted successfully.',
//     smsTemplate: 'Dear (#name#), Your application for FADEE-2022 has been submitted successfully.',
//     logo: null,
//     logoPreview: '',
//     academicAddress: '',
//   });

//   const [loading, setLoading] = useState<boolean>(false);
//   const [fetchLoading, setFetchLoading] = useState<boolean>(false);
//   const [apiResponse, setApiResponse] = useState<ApiResponse | null>(null);

//   const fileInputRef = useRef<HTMLInputElement>(null);

//   const apiUrl = import.meta.env.VITE_API_URL;
//   const assetUrl = import.meta.env.VITE_ASSET_URL;

//   // Fetch account details when in edit mode
//   useEffect(() => {
//     if (isEditMode && id) {
//       fetchAccountDetails();
//     }
//   }, [id, isEditMode]);

//   const fetchAccountDetails = async () => {
//     setFetchLoading(true);
//     try {
//       const response = await axios.post(
//         `${apiUrl}/${user?.role}/Accounts/Get-Academic-details`,
//         {
//           s_id: user?.id,
//           academic_id: id,
//         },
//         {
//           headers: {
//             Authorization: `Bearer ${user?.token}`,
//             'Content-Type': 'application/json',
//             accept: '*/*',
//           },
//         },
//       );

//       const { academic, credentials, template } = response.data;

//       setFormData({
//         organizationType: academic?.academic_type?.toString() || '2',
//         organizationName: academic?.academic_name || '',
//         clientEmail: academic?.academic_email || '',
//         whatsappTemplate:
//           template?.whatsapp_template ||
//           'Dear (#name#), Your application for FADEE-2022 has been submitted successfully.',
//         emailTemplate:
//           template?.email_template ||
//           'Dear (#name#), Your application for FADEE-2022 has been submitted successfully.',
//         smsTemplate:
//           template?.sms_template ||
//           'Dear (#name#), Your application for FADEE-2022 has been submitted successfully.',
//         logo: null,
//         logoPreview: academic?.academic_logo ? `${assetUrl}/${academic.academic_logo}` : '',
//         academicAddress: academic?.footer_address || '',
//       });
//     } catch (error) {
//       console.error('Error fetching account details:', error);
//       toast.error('Error fetching account details');
//     } finally {
//       setFetchLoading(false);
//     }
//   };

//   const handleInputChange = (
//     e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>,
//   ) => {
//     const { name, value } = e.target;
//     setFormData((prev) => ({
//       ...prev,
//       [name]: value,
//     }));
//     // Clear API response when user starts typing again
//     if (apiResponse) {
//       setApiResponse(null);
//     }
//   };

//   const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const file = e.target.files?.[0];
//     if (file) {
//       const reader = new FileReader();
//       reader.onloadend = () => {
//         setFormData((prev) => ({
//           ...prev,
//           logo: file,
//           logoPreview: reader.result as string,
//         }));
//       };
//       reader.readAsDataURL(file);
//     }
//   };

//   const handleUpdateImage = () => {
//     fileInputRef.current?.click();
//   };
//   console.log(formData);
//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setLoading(true);
//     setApiResponse(null);

//     try {
//       if (isEditMode) {
//         // Edit mode - use multipart/form-data
//         const formDataToSend = new FormData();
//         formDataToSend.append('s_id', user?.id?.toString() || '');
//         formDataToSend.append('academic_id', id || '');
//         formDataToSend.append('select_type', formData.organizationType);
//         formDataToSend.append('email', formData.clientEmail);
//         formDataToSend.append('academic_name', formData.organizationName);
//         formDataToSend.append('academic_address', formData.academicAddress);
//         formDataToSend.append('whatsapp_template', formData.whatsappTemplate);
//         formDataToSend.append('sms_template', formData.smsTemplate);
//         formDataToSend.append('email_template', formData.emailTemplate);
//         formDataToSend.append('template_id', '3'); // Default template ID

//         if (formData.logo) {
//           formDataToSend.append('academic_logo', formData.logo);
//         }

//         const response = await axios.post(
//           `${apiUrl}/${user?.role}/Accounts/Demo-Account-Update`,
//           formDataToSend,
//           {
//             headers: {
//               Authorization: `Bearer ${user?.token}`,
//               'Content-Type': 'multipart/form-data',
//               accept: '*/*',
//             },
//           },
//         );

//         if (response.data.status) {
//           toast.success('Account updated successfully!');
//           navigate(`/${user?.role}/demo-accounts`);
//         } else {
//           toast.error(response.data.message || 'Failed to update account');
//         }
//       } else {
//         // Add mode - use multipart/form-data
//         const formDataToSend = new FormData();
//         formDataToSend.append('s_id', user?.id?.toString() || '');
//         formDataToSend.append('select_type', formData.organizationType);
//         formDataToSend.append('email', formData.clientEmail);
//         formDataToSend.append('academic_name', formData.organizationName);
//         formDataToSend.append('academic_address', formData.academicAddress);
//         formDataToSend.append('whatsapp_template', formData.whatsappTemplate);
//         formDataToSend.append('email_template', formData.emailTemplate);
//         formDataToSend.append('sms_template', formData.smsTemplate);

//         if (formData.logo) {
//           formDataToSend.append('academic_logo', formData.logo);
//         }

//         const response = await axios.post(
//           `${apiUrl}/${user?.role}/Accounts/add-demo-account`,
//           formDataToSend,
//           {
//             headers: {
//               Authorization: `Bearer ${user?.token}`,
//               'Content-Type': 'multipart/form-data',
//               accept: '*/*',
//             },
//           },
//         );

//         if (response.data.status) {
//           toast.success('Account created successfully!');
//           navigate(`/${user?.role}/demo-accounts`);
//         } else {
//           toast.error(response.data.message || 'Failed to create account');
//         }
//       }
//     } catch (error: any) {
//       console.error('API Error:', error);
//       const errorMessage =
//         error.response?.data?.message || 'Network error occurred. Please try again.';
//       toast.error(errorMessage);
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Function to get organization type label
//   const getOrganizationTypeLabel = (type: string): string => {
//     const typeMap: { [key: string]: string } = {
//       '1': 'University',
//       '2': 'College',
//       '3': 'School',
//       '4': 'Institute',
//     };
//     return typeMap[type] || 'College';
//   };

//   if (fetchLoading) {
//     return (
//       <div className="min-h-screen bg-gray-100 py-8 px-4 flex items-center justify-center">
//         <div className="text-center">
//           <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
//           <p className="mt-4 text-gray-600">Loading account details...</p>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-gray-100 py-8 px-4">
//       <div className="max-w-6xl mx-auto">
//         {/* Breadcrumb Header */}
//         <BreadcrumbHeader
//           title={isEditMode ? 'Edit Demo Account' : 'Add Demo Account'}
//           paths={[
//             { name: 'Demo Accounts', link: `/${user?.role}/demo-accounts` },
//             { name: isEditMode ? 'Edit Account' : 'Add Account', link: '#' },
//           ]}
//         />

//         {/* Form Container */}
//         <div className="bg-white rounded-lg border border-gray-300 shadow-sm mt-6">
//           <form onSubmit={handleSubmit} className="p-6">
//             {/* First Row - Three boxes side by side */}
//             <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
//               {/* Type of Organization */}
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-2">
//                   Type of the Organization *
//                 </label>
//                 <div >
//                   {/* <select
//                     name="organizationType"
//                     value={formData.organizationType}
//                     onChange={handleInputChange}
//                     className="w-full px-3 py-2.5 text-sm border-none outline-none bg-transparent rounded-lg"
//                     required
//                     disabled={loading}
//                   >
//                     <option value="2">College</option>
//                     <option value="3">University</option>
//                     <option value="1">School</option>
//                     <option value="4">Institute</option>
//                   </select> */}


//                 <OrganizationSelect
//         formData={formData}
//         setFormData={setFormData}
//         loading={loading}
//       />


//                 </div>
//               </div>

//               {/* Name of Organization */}
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-2">
//                   Name of the Organization *
//                 </label>
//                 <div className="border border-gray-300 rounded-lg focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-blue-500 transition-all">
//                   <input
//                     type="text"
//                     name="organizationName"
//                     value={formData.organizationName}
//                     onChange={handleInputChange}
//                     className="w-full px-3 py-2.5 text-sm border-none outline-none rounded-lg"
//                     placeholder="Enter organization name"
//                     required
//                     disabled={loading}
//                   />
//                 </div>
//               </div>

//               {/* Client Email */}
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-2">
//                   Client Email Id *
//                 </label>
//                 <div className="border border-gray-300 rounded-lg focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-blue-500 transition-all">
//                   <input
//                     type="email"
//                     name="clientEmail"
//                     value={formData.clientEmail}
//                     onChange={handleInputChange}
//                     className="w-full px-3 py-2.5 text-sm border-none outline-none rounded-lg"
//                     placeholder="Enter client email"
//                     required
//                     disabled={loading}
//                   />
//                 </div>
//               </div>
//             </div>

//             {/* Organization Address */}
//             <div className="mb-6">
//               <label className="block text-sm font-medium text-gray-700 mb-2">
//                 Organization Address *
//               </label>
//               <div className="border border-gray-300 rounded-lg focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-blue-500 transition-all">
//                 <input
//                   type="text"
//                   name="academicAddress"
//                   value={formData.academicAddress}
//                   onChange={handleInputChange}
//                   className="w-full px-3 py-2.5 text-sm border-none outline-none rounded-lg"
//                   placeholder="Enter organization address"
//                   required
//                   disabled={loading}
//                 />
//               </div>
//             </div>

//             {/* Second Row - Two boxes side by side */}
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
//               {/* WhatsApp Template */}
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-2">
//                   WhatsApp Template *
//                 </label>
//                 <div className="border border-gray-300 rounded-lg focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-blue-500 transition-all">
//                   <textarea
//                     name="whatsappTemplate"
//                     value={formData.whatsappTemplate}
//                     onChange={handleInputChange}
//                     rows={4}
//                     className="w-full px-3 py-2.5 text-sm border-none outline-none resize-none rounded-lg"
//                     placeholder="Enter WhatsApp template"
//                     required
//                     disabled={loading}
//                   />
//                 </div>
//               </div>

//               {/* SMS Template */}
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-2">
//                   SMS Template *
//                 </label>
//                 <div className="border border-gray-300 rounded-lg focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-blue-500 transition-all">
//                   <textarea
//                     name="smsTemplate"
//                     value={formData.smsTemplate}
//                     onChange={handleInputChange}
//                     rows={4}
//                     className="w-full px-3 py-2.5 text-sm border-none outline-none resize-none rounded-lg"
//                     placeholder="Enter SMS template"
//                     required
//                     disabled={loading}
//                   />
//                 </div>
//               </div>
//             </div>

//             {/* Third Row - Two boxes side by side */}
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
//               {/* Email Template */}
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-2">
//                   Email Template *
//                 </label>
//                 <div className="border border-gray-300 rounded-lg focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-blue-500 transition-all">
//                   <textarea
//                     name="emailTemplate"
//                     value={formData.emailTemplate}
//                     onChange={handleInputChange}
//                     rows={4}
//                     className="w-full px-3 py-2.5 text-sm border-none outline-none resize-none rounded-lg"
//                     placeholder="Enter email template"
//                     required
//                     disabled={loading}
//                   />
//                 </div>
//               </div>

//               {/* Upload Logo */}
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-2">
//                   Upload Logo {!isEditMode && '*'}
//                 </label>
//                 <div className="border border-gray-300 rounded-lg p-4">
//                   <div className="flex flex-col items-center justify-center space-y-4">
//                     <input
//                       type="file"
//                       ref={fileInputRef}
//                       onChange={handleFileChange}
//                       accept="image/*"
//                       className="hidden"
//                       disabled={loading}
//                     />
//                     <Button
//                       type="button"
//                       onClick={handleUpdateImage}
//                       disabled={loading}
//                       color="blue"
//                       className="px-6 py-2.5"
//                     >
//                       <BsPlusLg className="mr-2 w-4 h-4" />
//                       Update Image
//                     </Button>
//                     <div className="w-24 h-24 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center bg-gray-50">
//                       {formData.logoPreview ? (
//                         <img
//                           src={formData.logoPreview}
//                           alt="Logo preview"
//                           className="w-full h-full object-cover rounded-lg"
//                         />
//                       ) : (
//                         <span className="text-gray-400 text-xs text-center">No Image Selected</span>
//                       )}
//                     </div>
//                     <p className="text-xs text-gray-500 text-center">
//                       Supported formats: JPG, PNG, GIF
//                       <br />
//                       Max size: 2MB
//                     </p>
//                   </div>
//                 </div>
//               </div>
//             </div>

//             {/* Submit Button */}
//             <div className="pt-4 border-t border-gray-200">
//               <div className="flex gap-3">
//                 <Button type="submit" disabled={loading} color="success" className="px-8 py-2.5">
//                   {loading ? (
//                     <>
//                       <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
//                       {isEditMode ? 'Updating Account...' : 'Creating Account...'}
//                     </>
//                   ) : isEditMode ? (
//                     'Update Account'
//                   ) : (
//                     'Create Account'
//                   )}
//                 </Button>
//                 <Button
//                   type="button"
//                   onClick={() => navigate(`/${user?.role}/demo-accounts`)}
//                   disabled={loading}
//                   color="gray"
//                   className="px-6 py-2.5"
//                 >
//                   Cancel
//                 </Button>
//               </div>
//             </div>
//           </form>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default AddEditAccount;












import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router';
import axios from 'axios';
import { Button } from 'flowbite-react';
import { BsPlusLg } from 'react-icons/bs';
import toast from 'react-hot-toast';
import BreadcrumbHeader from 'src/Frontend/Common/BreadcrumbHeader';
import { useAuth } from 'src/hook/useAuth';
import OrganizationSelect from './OrganizationSelect';

interface FormData {
  organizationType: string;
  organizationName: string;
  clientEmail: string;
  whatsappTemplate: string;
  emailTemplate: string;
  smsTemplate: string;
  logo: File | null;
  logoPreview: string;
  academicAddress: string;
  directorSignature: File | null;
  directorSignaturePreview: string;
}

interface ApiResponse {
  status: boolean;
  message: string;
}

interface AccountDetails {
  institution_id: number;
  academic_name: string;
  academic_email: string;
  academic_type: number;
  academic_address: string;
  academic_logo: string;
  whatsapp_template?: string;
  email_template?: string;
  sms_template?: string;
  director_signature?: string;
}

const AddEditAccount: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { id } = useParams<{ id: string }>();
  const isEditMode = Boolean(id);

  const [formData, setFormData] = useState<FormData>({
    organizationType: '2', // Default to College
    organizationName: '',
    clientEmail: '',
    whatsappTemplate:
      'Dear (#name#), Your application for FADEE-2022 has been submitted successfully.',
    emailTemplate:
      'Dear (#name#), Your application for FADEE-2022 has been submitted successfully.',
    smsTemplate: 'Dear (#name#), Your application for FADEE-2022 has been submitted successfully.',
    logo: null,
    logoPreview: '',
    academicAddress: '',
    directorSignature: null,
    directorSignaturePreview: '',
  });

  const [loading, setLoading] = useState<boolean>(false);
  const [fetchLoading, setFetchLoading] = useState<boolean>(false);
  const [apiResponse, setApiResponse] = useState<ApiResponse | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const signatureInputRef = useRef<HTMLInputElement>(null);

  const apiUrl = import.meta.env.VITE_API_URL;
  const assetUrl = import.meta.env.VITE_ASSET_URL;

  // Fetch account details when in edit mode
  useEffect(() => {
    if (isEditMode && id) {
      fetchAccountDetails();
    }
  }, [id, isEditMode]);

  const fetchAccountDetails = async () => {
    setFetchLoading(true);
    try {
      const response = await axios.post(
        `${apiUrl}/${user?.role}/Accounts/Get-Academic-details`,
        {
          s_id: user?.id,
          academic_id: id,
        },
        {
          headers: {
            Authorization: `Bearer ${user?.token}`,
            'Content-Type': 'application/json',
            accept: '*/*',
          },
        },
      );

      console.log('Full API Response:', response.data); // Debug log

      const { academic, credentials, template } = response.data;

      // Check if director_signature exists and is not null
      const directorSignature = academic?.director_signature;
      console.log('Director Signature from API:', directorSignature); // Debug log

      setFormData({
        organizationType: academic?.academic_type?.toString() || '2',
        organizationName: academic?.academic_name || '',
        clientEmail: academic?.academic_email || '',
        whatsappTemplate:
          template?.whatsapp_template ||
          'Dear (#name#), Your application for FADEE-2022 has been submitted successfully.',
        emailTemplate:
          template?.email_template ||
          'Dear (#name#), Your application for FADEE-2022 has been submitted successfully.',
        smsTemplate:
          template?.sms_template ||
          'Dear (#name#), Your application for FADEE-2022 has been submitted successfully.',
        logo: null,
        logoPreview: academic?.academic_logo ? `${assetUrl}/${academic.academic_logo}` : '',
        academicAddress: academic?.footer_address || academic?.academic_address || '',
        directorSignature: null,
        directorSignaturePreview: directorSignature && directorSignature !== 'null' 
          ? `${assetUrl}/${directorSignature}` 
          : '',
      });

      console.log('Final directorSignaturePreview:', directorSignature && directorSignature !== 'null' 
        ? `${assetUrl}/${directorSignature}` 
        : ''); // Debug log
    } catch (error) {
      console.error('Error fetching account details:', error);
      toast.error('Error fetching account details');
    } finally {
      setFetchLoading(false);
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Clear API response when user starts typing again
    if (apiResponse) {
      setApiResponse(null);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Check file size (2MB limit)
      if (file.size > 2 * 1024 * 1024) {
        toast.error('File size should be less than 2MB');
        return;
      }
      
      // Check file type
      if (!file.type.startsWith('image/')) {
        toast.error('Please select an image file');
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData((prev) => ({
          ...prev,
          logo: file,
          logoPreview: reader.result as string,
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSignatureChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Check file size (2MB limit)
      if (file.size > 2 * 1024 * 1024) {
        toast.error('File size should be less than 2MB');
        return;
      }
      
      // Check file type
      if (!file.type.startsWith('image/')) {
        toast.error('Please select an image file');
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData((prev) => ({
          ...prev,
          directorSignature: file,
          directorSignaturePreview: reader.result as string,
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUpdateImage = () => {
    fileInputRef.current?.click();
  };

  const handleUpdateSignature = () => {
    signatureInputRef.current?.click();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setApiResponse(null);

    try {
      if (isEditMode) {
        // Edit mode - use multipart/form-data
        const formDataToSend = new FormData();
        formDataToSend.append('s_id', user?.id?.toString() || '');
        formDataToSend.append('academic_id', id || '');
        formDataToSend.append('select_type', formData.organizationType);
        formDataToSend.append('email', formData.clientEmail);
        formDataToSend.append('academic_name', formData.organizationName);
        formDataToSend.append('academic_address', formData.academicAddress);
        formDataToSend.append('whatsapp_template', formData.whatsappTemplate);
        formDataToSend.append('sms_template', formData.smsTemplate);
        formDataToSend.append('email_template', formData.emailTemplate);
        formDataToSend.append('template_id', '3'); // Default template ID

        if (formData.logo) {
          formDataToSend.append('academic_logo', formData.logo);
        }

        if (formData.directorSignature) {
          formDataToSend.append('director_signature', formData.directorSignature);
        }

        console.log('Sending update request with signature:', formData.directorSignature ? 'Yes' : 'No'); // Debug log

        const response = await axios.post(
          `${apiUrl}/${user?.role}/Accounts/Demo-Account-Update`,
          formDataToSend,
          {
            headers: {
              Authorization: `Bearer ${user?.token}`,
              'Content-Type': 'multipart/form-data',
              accept: '*/*',
            },
          },
        );

        if (response.data.status) {
          toast.success('Account updated successfully!');
          navigate(`/${user?.role}/demo-accounts`);
        } else {
          toast.error(response.data.message || 'Failed to update account');
        }
      } else {
        // Add mode - use multipart/form-data
        const formDataToSend = new FormData();
        formDataToSend.append('s_id', user?.id?.toString() || '');
        formDataToSend.append('select_type', formData.organizationType);
        formDataToSend.append('email', formData.clientEmail);
        formDataToSend.append('academic_name', formData.organizationName);
        formDataToSend.append('academic_address', formData.academicAddress);
        formDataToSend.append('whatsapp_template', formData.whatsappTemplate);
        formDataToSend.append('email_template', formData.emailTemplate);
        formDataToSend.append('sms_template', formData.smsTemplate);

        if (formData.logo) {
          formDataToSend.append('academic_logo', formData.logo);
        }

        if (formData.directorSignature) {
          formDataToSend.append('director_signature', formData.directorSignature);
        }

        const response = await axios.post(
          `${apiUrl}/${user?.role}/Accounts/add-demo-account`,
          formDataToSend,
          {
            headers: {
              Authorization: `Bearer ${user?.token}`,
              'Content-Type': 'multipart/form-data',
              accept: '*/*',
            },
          },
        );

        if (response.data.status) {
          toast.success('Account created successfully!');
          navigate(`/${user?.role}/demo-accounts`);
        } else {
          toast.error(response.data.message || 'Failed to create account');
        }
      }
    } catch (error: any) {
      console.error('API Error:', error);
      const errorMessage =
        error.response?.data?.message || 'Network error occurred. Please try again.';
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // Function to get organization type label
  const getOrganizationTypeLabel = (type: string): string => {
    const typeMap: { [key: string]: string } = {
      '1': 'University',
      '2': 'College',
      '3': 'School',
      '4': 'Institute',
    };
    return typeMap[type] || 'College';
  };

  if (fetchLoading) {
    return (
      <div className="min-h-screen bg-gray-100 py-8 px-4 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading account details...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Breadcrumb Header */}
        <BreadcrumbHeader
          title={isEditMode ? 'Edit Demo Account' : 'Add Demo Account'}
          paths={[
            { name: 'Demo Accounts', link: `/${user?.role}/demo-accounts` },
            { name: isEditMode ? 'Edit Account' : 'Add Account', link: '#' },
          ]}
        />

        {/* Form Container */}
        <div className="bg-white rounded-lg border border-gray-300 shadow-sm mt-6">
          <form onSubmit={handleSubmit} className="p-6">
            {/* First Row - Three boxes side by side */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              {/* Type of Organization */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Type of the Organization *
                </label>
                <div>
                  <OrganizationSelect
                    formData={formData}
                    setFormData={setFormData}
                    loading={loading}
                  />
                </div>
              </div>

              {/* Name of Organization */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Name of the Organization *
                </label>
                <div className="border border-gray-300 rounded-lg focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-blue-500 transition-all">
                  <input
                    type="text"
                    name="organizationName"
                    value={formData.organizationName}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2.5 text-sm border-none outline-none rounded-lg"
                    placeholder="Enter organization name"
                    required
                    disabled={loading}
                  />
                </div>
              </div>

              {/* Client Email */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Client Email Id *
                </label>
                <div className="border border-gray-300 rounded-lg focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-blue-500 transition-all">
                  <input
                    type="email"
                    name="clientEmail"
                    value={formData.clientEmail}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2.5 text-sm border-none outline-none rounded-lg"
                    placeholder="Enter client email"
                    required
                    disabled={loading}
                  />
                </div>
              </div>
            </div>

            {/* Organization Address */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Organization Address *
              </label>
              <div className="border border-gray-300 rounded-lg focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-blue-500 transition-all">
                <input
                  type="text"
                  name="academicAddress"
                  value={formData.academicAddress}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2.5 text-sm border-none outline-none rounded-lg"
                  placeholder="Enter organization address"
                  required
                  disabled={loading}
                />
              </div>
            </div>

            {/* Second Row - Two boxes side by side */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              {/* WhatsApp Template */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  WhatsApp Template *
                </label>
                <div className="border border-gray-300 rounded-lg focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-blue-500 transition-all">
                  <textarea
                    name="whatsappTemplate"
                    value={formData.whatsappTemplate}
                    onChange={handleInputChange}
                    rows={4}
                    className="w-full px-3 py-2.5 text-sm border-none outline-none resize-none rounded-lg"
                    placeholder="Enter WhatsApp template"
                    required
                    disabled={loading}
                  />
                </div>
              </div>

              {/* SMS Template */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  SMS Template *
                </label>
                <div className="border border-gray-300 rounded-lg focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-blue-500 transition-all">
                  <textarea
                    name="smsTemplate"
                    value={formData.smsTemplate}
                    onChange={handleInputChange}
                    rows={4}
                    className="w-full px-3 py-2.5 text-sm border-none outline-none resize-none rounded-lg"
                    placeholder="Enter SMS template"
                    required
                    disabled={loading}
                  />
                </div>
              </div>
            </div>

            {/* Third Row - Two boxes side by side */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              {/* Email Template */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email Template *
                </label>
                <div className="border border-gray-300 rounded-lg focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-blue-500 transition-all">
                  <textarea
                    name="emailTemplate"
                    value={formData.emailTemplate}
                    onChange={handleInputChange}
                    rows={4}
                    className="w-full px-3 py-2.5 text-sm border-none outline-none resize-none rounded-lg"
                    placeholder="Enter email template"
                    required
                    disabled={loading}
                  />
                </div>
              </div>

              {/* Upload Logo */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Upload Logo {!isEditMode && '*'}
                </label>
                <div className="border border-gray-300 rounded-lg p-4">
                  <div className="flex flex-col items-center justify-center space-y-4">
                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={handleFileChange}
                      accept="image/*"
                      className="hidden"
                      disabled={loading}
                    />
                    <Button
                      type="button"
                      onClick={handleUpdateImage}
                      disabled={loading}
                      color="blue"
                      className="px-6 py-2.5"
                    >
                      <BsPlusLg className="mr-2 w-4 h-4" />
                      Update Image
                    </Button>
                    <div className="w-24 h-24 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center bg-gray-50">
                      {formData.logoPreview ? (
                        <img
                          src={formData.logoPreview}
                          alt="Logo preview"
                          className="w-full h-full object-cover rounded-lg"
                        />
                      ) : (
                        <span className="text-gray-400 text-xs text-center">No Image Selected</span>
                      )}
                    </div>
                    <p className="text-xs text-gray-500 text-center">
                      Supported formats: JPG, PNG, GIF
                      <br />
                      Max size: 2MB
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Fourth Row - Director Signature */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              {/* Director Signature Upload */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Director Signature (Optional)
                </label>
                <div className="border border-gray-300 rounded-lg p-4">
                  <div className="flex flex-col items-center justify-center space-y-4">
                    <input
                      type="file"
                      ref={signatureInputRef}
                      onChange={handleSignatureChange}
                      accept="image/*"
                      className="hidden"
                      disabled={loading}
                    />
                    <Button
                      type="button"
                      onClick={handleUpdateSignature}
                      disabled={loading}
                      color="blue"
                      className="px-6 py-2.5"
                    >
                      <BsPlusLg className="mr-2 w-4 h-4" />
                      {formData.directorSignaturePreview ? 'Change Signature' : 'Upload Signature'}
                    </Button>
                    <div className="w-24 h-24 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center bg-gray-50">
                      {formData.directorSignaturePreview ? (
                        <img
                          src={formData.directorSignaturePreview}
                          alt="Director signature preview"
                          className="w-full h-full object-cover rounded-lg"
                        />
                      ) : (
                        <span className="text-gray-400 text-xs text-center">No Signature Selected</span>
                      )}
                    </div>
                    <p className="text-xs text-gray-500 text-center">
                      Supported formats: JPG, PNG, GIF
                      <br />
                      Max size: 2MB
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-4 border-t border-gray-200">
              <div className="flex gap-3">
                <Button type="submit" disabled={loading} color="success" className="px-8 py-2.5">
                  {loading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      {isEditMode ? 'Updating Account...' : 'Creating Account...'}
                    </>
                  ) : isEditMode ? (
                    'Update Account'
                  ) : (
                    'Create Account'
                  )}
                </Button>
                <Button
                  type="button"
                  onClick={() => navigate(`/${user?.role}/demo-accounts`)}
                  disabled={loading}
                  color="gray"
                  className="px-6 py-2.5"
                >
                  Cancel
                </Button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddEditAccount;