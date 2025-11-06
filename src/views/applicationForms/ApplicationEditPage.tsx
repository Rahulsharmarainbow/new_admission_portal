// // src/Frontend/Components/ApplicationEditPage.tsx
// import React, { useState, useEffect } from 'react';
// import { useParams, useNavigate } from 'react-router';
// import axios from 'axios';
// import toast from 'react-hot-toast';
// import { Button, Card } from 'flowbite-react';
// import { FaArrowLeft } from 'react-icons/fa';
// import Loader from 'src/Frontend/Common/Loader';
// import { useAuth } from 'src/hook/useAuth';

// interface FormField {
//   type: string;
//   id: number;
//   name: string;
//   apiurl?: string;
//   label: string;
//   resolution?: string;
//   width: string;
//   placeholder?: string;
//   options: Array<{ value: number | string; text: string }>;
//   required: number;
//   style?: string | object;
//   target?: string;
//   validation?: string;
//   max_date?: string;
//   content?: string;
//   h_target?: string;
//   v_target?: string;
// }

// interface FormSection {
//   width: string;
//   gap: number;
//   justify: string;
//   children: FormField[];
// }

// interface ApplicationData {
//   id: number;
//   applicant_name: string;
//   academic_id?: number;
// }

// interface CandidateDetails {
//   [key: string]: string;
// }

// interface Lookups {
//   [key: string]: Array<{ value: number | string; text: string }>;
// }

// interface ApiResponse {
//   data: FormSection[];
//   application_data: ApplicationData;
//   candidate_details: CandidateDetails;
//   lookups: Lookups;
// }

// interface StateOption {
//   value: number | string;
//   text: string;
// }

// interface DistrictOption {
//   value: number | string;
//   text: string;
// }

// const ApplicationEditPage: React.FC = () => {
//   const { applicationId } = useParams<{ applicationId: string }>();
//   const navigate = useNavigate();
//   const { user } = useAuth();
  
//   const [loading, setLoading] = useState(true);
//   const [saving, setSaving] = useState(false);
//   const [formData, setFormData] = useState<CandidateDetails>({});
//   const [formSections, setFormSections] = useState<FormSection[]>([]);
//   const [lookups, setLookups] = useState<Lookups>({});
//   const [application, setApplication] = useState<ApplicationData | null>(null);
//   const [dynamicOptions, setDynamicOptions] = useState<{[key: string]: Array<{value: number | string; text: string}>}>({});
//   const [states, setStates] = useState<StateOption[]>([]);

//   const apiUrl = import.meta.env.VITE_API_URL;
//   const apiAssetsUrl = import.meta.env.VITE_ASSET_URL;

//   // Fetch states data
//   const fetchStates = async () => {
//     try {
//       const response = await axios.get(
//         `${apiUrl}/${user?.role}/Public/state`,
//         {
//           headers: {
//             Authorization: `Bearer ${user?.token}`,
//             'Content-Type': 'application/json',
//           },
//         }
//       );

//       if (response.data && Array.isArray(response.data)) {
//         const stateOptions = response.data.map((state: any) => ({
//           value: state.id,
//           text: state.name
//         }));
//         setStates(stateOptions);
//         setDynamicOptions(prev => ({
//           ...prev,
//           'state': stateOptions,
//           'selectBelong': stateOptions,
//           'address_state': stateOptions,
//           'class6_state': stateOptions,
//           'class7_state': stateOptions,
//           'class8_state': stateOptions,
//           'class9_state': stateOptions,
//           'class10_state': stateOptions,
//           'inter1st_state': stateOptions,
//           'inter2nd_state': stateOptions
//         }));
//       }
//     } catch (error) {
//       console.error('Error fetching states:', error);
//     }
//   };

//   // Fetch districts by state ID
//   const fetchDistricts = async (stateId: string | number, targetField: string) => {
//     try {
//       const response = await axios.post(
//         `${apiUrl}/${user?.role}/frontend/get_district_by_state_id`,
//         { state_id: stateId },
//         {
//           headers: {
//             Authorization: `Bearer ${user?.token}`,
//             'Content-Type': 'application/json',
//           },
//         }
//       );

//       if (response.data && Array.isArray(response.data)) {
//         const districtOptions = response.data.map((district: any) => ({
//           value: district.id,
//           text: district.name
//         }));
        
//         setDynamicOptions(prev => ({
//           ...prev,
//           [targetField]: districtOptions
//         }));
//       }
//     } catch (error) {
//       console.error('Error fetching districts:', error);
//     }
//   };

//   // Fetch application form data
//   const fetchApplicationData = async () => {
//     if (!applicationId) return;

//     setLoading(true);
//     try {
//       const response = await axios.post<ApiResponse>(
//         `${apiUrl}/${user?.role}/Applications/get-Applications-form-data`,
//         { application_id: parseInt(applicationId) },
//         {
//           headers: {
//             Authorization: `Bearer ${user?.token}`,
//             'Content-Type': 'application/json',
//           },
//         }
//       );

//       if (response.data) {
//         setFormSections(response.data.data || []);
//         setLookups(response.data.lookups || {});
//         setApplication(response.data.application_data);
        
//         // Set form data from candidate_details
//         if (response.data.candidate_details) {
//           setFormData(response.data.candidate_details);
//         }
//       }
//     } catch (error) {
//       console.error('Error fetching application data:', error);
//       toast.error('Failed to load application data');
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchApplicationData();
//     fetchStates();
//   }, [applicationId]);

//   // Handle state change - fetch districts
//   const handleStateChange = (fieldName: string, value: string, targetField: string) => {
//     setFormData(prev => ({
//       ...prev,
//       [fieldName]: value,
//       [targetField]: '' // Clear district when state changes
//     }));

//     if (value) {
//       fetchDistricts(value, targetField);
//     }
//   };

//   // Handle input changes
//   const handleInputChange = (fieldName: string, value: string) => {
//     setFormData(prev => ({
//       ...prev,
//       [fieldName]: value
//     }));
//   };

//   // Handle file upload with preview
//   const handleFileUpload = async (fieldName: string, file: File) => {
//     const formDataObj = new FormData();
//     formDataObj.append('file', file);
//     formDataObj.append('application_id', applicationId || '');
//     formDataObj.append('field_name', fieldName);

//     try {
//       const response = await axios.post(
//         `${apiUrl}/${user?.role}/Applications/upload-file`,
//         formDataObj,
//         {
//           headers: {
//             Authorization: `Bearer ${user?.token}`,
//             'Content-Type': 'multipart/form-data',
//           },
//         }
//       );

//       if (response.data.success) {
//         setFormData(prev => ({
//           ...prev,
//           [fieldName]: response.data.file_path
//         }));
//         toast.success('File uploaded successfully');
//       }
//     } catch (error) {
//       console.error('Error uploading file:', error);
//       toast.error('Failed to upload file');
//     }
//   };

//   // Handle form submission
//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setSaving(true);

//     try {
//       const response = await axios.post(
//         `${apiUrl}/${user?.role}/Applications/Applications-update`,
//         {
//           application_id: applicationId,
//           customer_id: user?.id,
//           academic_id: application?.academic_id,
//           maindata: formData,
//           s_id: user?.id,
//           apiUrl: apiUrl
//         },
//         {
//           headers: {
//             Authorization: `Bearer ${user?.token}`,
//             'Content-Type': 'application/json',
//           },
//         }
//       );

//       if (response.data.success) {
//         toast.success('Application updated successfully');
//         navigate(-1);
//       } else {
//         throw new Error(response.data.message || 'Failed to update application');
//       }
//     } catch (error: any) {
//       console.error('Error updating application:', error);
//       toast.error(error.response?.data?.message || 'Failed to update application');
//     } finally {
//       setSaving(false);
//     }
//   };

//   // Get field options with proper fallback
//   const getFieldOptions = (field: FormField) => {
//     // First check dynamic options (for states and districts)
//     if (dynamicOptions[field.name] && dynamicOptions[field.name].length > 0) {
//       return dynamicOptions[field.name];
//     }
    
//     // Then check field's own options
//     if (field.options && field.options.length > 0) {
//       return field.options;
//     }
    
//     // Then check lookups
//     const lookupKey = Object.keys(lookups).find(key => 
//       key.toLowerCase().includes(field.name.toLowerCase()) ||
//       field.name.toLowerCase().includes(key.toLowerCase())
//     );
    
//     if (lookupKey && lookups[lookupKey]) {
//       return lookups[lookupKey];
//     }
    
//     return [];
//   };

//   // Check if field is a state field
//   const isStateField = (fieldName: string) => {
//     return fieldName.includes('state') && !fieldName.includes('district');
//   };

//   // Check if field is a district field
//   const isDistrictField = (fieldName: string) => {
//     return fieldName.includes('district');
//   };

//   // Get target field for state dropdown
//   const getTargetField = (field: FormField) => {
//     if (field.target) return field.target;
    
//     if (field.name.includes('state')) {
//       return field.name.replace('state', 'district');
//     }
    
//     return '';
//   };

//   // Render form field based on type
//   const renderFormField = (field: FormField) => {
//     const value = formData[field.name] || '';
//     const fieldOptions = getFieldOptions(field);

//     switch (field.type) {
//       case 'text':
//       case 'adhar':
//         return (
//           <input
//             type="text"
//             value={value}
//             onChange={(e) => handleInputChange(field.name, e.target.value)}
//             placeholder={field.placeholder}
//             className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//             required={field.required === 1}
//           />
//         );

//       case 'select':
//         // State dropdown
//         if (isStateField(field.name) && field.apiurl) {
//           const targetField = getTargetField(field);
//           return (
//             <select
//               value={value}
//               onChange={(e) => handleStateChange(field.name, e.target.value, targetField)}
//               className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//               required={field.required === 1}
//             >
//               <option value="">Select {field.label || 'State'}</option>
//               {fieldOptions.map(option => (
//                 <option key={option.value} value={option.value}>
//                   {option.text}
//                 </option>
//               ))}
//             </select>
//           );
//         }
        
//         // District dropdown
//         if (isDistrictField(field.name)) {
//           const districtOptions = dynamicOptions[field.name] || [];
//           return (
//             <select
//               value={value}
//               onChange={(e) => handleInputChange(field.name, e.target.value)}
//               className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//               required={field.required === 1}
//               disabled={districtOptions.length === 0}
//             >
//               <option value="">{districtOptions.length === 0 ? 'Select State First' : 'Select District'}</option>
//               {districtOptions.map(option => (
//                 <option key={option.value} value={option.value}>
//                   {option.text}
//                 </option>
//               ))}
//             </select>
//           );
//         }
        
//         // Regular select dropdown
//         return (
//           <select
//             value={value}
//             onChange={(e) => handleInputChange(field.name, e.target.value)}
//             className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//             required={field.required === 1}
//           >
//             <option value="">Select {field.label}</option>
//             {fieldOptions.map(option => (
//               <option key={option.value} value={option.value}>
//                 {option.text}
//               </option>
//             ))}
//           </select>
//         );

//       case 'date':
//         return (
//           <input
//             type="date"
//             value={value}
//             onChange={(e) => handleInputChange(field.name, e.target.value)}
//             className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//             required={field.required === 1}
//           />
//         );

//       case 'file_button':
//         const fileUrl = value ? `${apiAssetsUrl}/${value}` : '';
        
//         return (
//           <div className="flex flex-col items-center space-y-3">
//             {/* File Preview */}
//             {fileUrl && (
//               <div className="text-center">
//                 <p className="text-sm text-gray-600 mb-2">Current File:</p>
//                 {field.name.includes('pic') || field.name.includes('image') || field.name.includes('candidate_pic') ? (
//                   <img
//                     src={fileUrl}
//                     alt="Preview"
//                     className="w-24 h-24 object-cover border rounded-lg mx-auto"
//                     onError={(e) => {
//                       const target = e.target as HTMLImageElement;
//                       target.style.display = 'none';
//                     }}
//                   />
//                 ) : field.name.includes('signature') ? (
//                   <img
//                     src={fileUrl}
//                     alt="Signature Preview"
//                     className="w-32 h-16 object-contain border rounded mx-auto"
//                     onError={(e) => {
//                       const target = e.target as HTMLImageElement;
//                       target.style.display = 'none';
//                     }}
//                   />
//                 ) : (
//                   <div className="bg-gray-100 p-3 rounded-lg">
//                     <span className="text-sm text-gray-600">
//                       {value.split('/').pop()}
//                     </span>
//                   </div>
//                 )}
//               </div>
//             )}
            
//             {/* Upload Button */}
//             <div>
//               <input
//                 type="file"
//                 onChange={(e) => {
//                   if (e.target.files && e.target.files[0]) {
//                     handleFileUpload(field.name, e.target.files[0]);
//                   }
//                 }}
//                 className="hidden"
//                 id={field.name}
//                 accept={field.name.includes('pic') ? 'image/*' : '*/*'}
//               />
//               <label
//                 htmlFor={field.name}
//                 className="cursor-pointer bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors inline-block"
//               >
//                 {field.content || 'Upload File'}
//               </label>
//             </div>
//           </div>
//         );

//       default:
//         return (
//           <input
//             type="text"
//             value={value}
//             onChange={(e) => handleInputChange(field.name, e.target.value)}
//             placeholder={field.placeholder}
//             className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//           />
//         );
//     }
//   };

//   // Calculate grid columns based on section width
//   const getGridColumns = (section: FormSection) => {
//     if (section.width === '100%') {
//       return 'grid-cols-1 md:grid-cols-2';
//     }
//     if (section.width === '50%') {
//       return 'grid-cols-1 md:grid-cols-2';
//     }
//     if (section.width === '80%') {
//       return 'grid-cols-1 md:grid-cols-2';
//     }
//     if (section.width === '20%') {
//       return 'grid-cols-1';
//     }
//     return 'grid-cols-1 md:grid-cols-2';
//   };

//   if (loading) {
//     return <Loader />;
//   }

//   return (
//     <div className="min-h-screen bg-gray-50 py-8">
//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//         {/* Header */}
//         <div className="mb-8">
//           <Button
//             onClick={() => navigate(-1)}
//             color="light"
//             className="mb-4"
//           >
//             <FaArrowLeft className="w-4 h-4 mr-2" />
//             Back
//           </Button>
          
//           <div className="flex justify-between items-center">
//             <div>
//               <h1 className="text-3xl font-bold text-gray-900">
//                 Edit Application
//               </h1>
//               <p className="text-gray-600 mt-2">
//                 {application?.applicant_name}
//               </p>
//             </div>
//           </div>
//         </div>

//         {/* Form */}
//         <form onSubmit={handleSubmit}>
//           <div className="space-y-6">
//             {formSections.map((section, sectionIndex) => (
//               <Card key={sectionIndex} className="p-6">
//                 <div className={`grid ${getGridColumns(section)} gap-6`}>
//                   {section.children.map((field) => (
//                     <div 
//                       key={field.id}
//                       className="space-y-2"
//                     >
//                       <label className="block text-sm font-medium text-gray-700">
//                         {field.label || field.name.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
//                         {field.required === 1 && (
//                           <span className="text-red-500 ml-1">*</span>
//                         )}
//                       </label>
//                       {renderFormField(field)}
//                     </div>
//                   ))}
//                 </div>
//               </Card>
//             ))}
//           </div>

//           {/* Submit Button */}
//           <div className="mt-8 flex justify-end space-x-4">
//             <Button
//               type="button"
//               color="light"
//               onClick={() => navigate(-1)}
//               disabled={saving}
//             >
//               Cancel
//             </Button>
//             <Button
//               type="submit"
//               color="blue"
//               disabled={saving}
//               className="bg-blue-600 hover:bg-blue-700"
//             >
//               {saving ? 'Saving...' : 'Save Changes'}
//             </Button>
//           </div>
//         </form>
//       </div>
//     </div>
//   );
// };

// export default ApplicationEditPage;



















// // src/Frontend/Components/ApplicationEditPage.tsx
// import React, { useState, useEffect } from 'react';
// import { useParams, useNavigate } from 'react-router';
// import axios from 'axios';
// import toast from 'react-hot-toast';
// import { Button, Card } from 'flowbite-react';
// import { FaArrowLeft } from 'react-icons/fa';
// import Loader from 'src/Frontend/Common/Loader';
// import { useAuth } from 'src/hook/useAuth';

// interface FormField {
//   type: string;
//   id: number;
//   name: string;
//   apiurl?: string;
//   label: string;
//   resolution?: string;
//   width: string;
//   placeholder?: string;
//   options: Array<{ value: number | string; text: string }>;
//   required: number;
//   style?: string | object;
//   target?: string;
//   validation?: string;
//   max_date?: string;
//   content?: string;
//   h_target?: string;
//   v_target?: string;
// }

// interface FormSection {
//   width: string;
//   gap: number;
//   justify: string;
//   children: FormField[];
// }

// interface ApplicationData {
//   id: number;
//   applicant_name: string;
//   academic_id?: number;
// }

// interface CandidateDetails {
//   [key: string]: string;
// }

// interface Lookups {
//   [key: string]: Array<{ value: number | string; text: string }>;
// }

// interface ApiResponse {
//   data: FormSection[];
//   application_data: ApplicationData;
//   candidate_details: CandidateDetails;
//   lookups: Lookups;
// }

// const ApplicationEditPage: React.FC = () => {
//   const { applicationId } = useParams<{ applicationId: string }>();
//   const navigate = useNavigate();
//   const { user } = useAuth();
  
//   const [loading, setLoading] = useState(true);
//   const [saving, setSaving] = useState(false);
//   const [formData, setFormData] = useState<CandidateDetails>({});
//   const [formSections, setFormSections] = useState<FormSection[]>([]);
//   const [lookups, setLookups] = useState<Lookups>({});
//   const [application, setApplication] = useState<ApplicationData | null>(null);
//   const [dynamicOptions, setDynamicOptions] = useState<{[key: string]: Array<{value: number | string; text: string}>}>({});

//   const apiUrl = import.meta.env.VITE_API_URL;
//   const apiAssetsUrl = import.meta.env.VITE_ASSET_URL;

//   // Fetch states data from lookups or API
//   const fetchStates = async () => {
//     try {
//       // First try to get states from lookups
//       if (lookups.states && lookups.states.length > 0) {
//         setDynamicOptions(prev => ({
//           ...prev,
//           'state': lookups.states,
//           'selectBelong': lookups.states,
//           'address_state': lookups.states,
//           'class6_state': lookups.states,
//           'class7_state': lookups.states,
//           'class8_state': lookups.states,
//           'class9_state': lookups.states,
//           'class10_state': lookups.states,
//           'inter1st_state': lookups.states,
//           'inter2nd_state': lookups.states
//         }));
//         return;
//       }

//       // If not in lookups, try API
//       const response = await axios.get(
//         `${apiUrl}/frontend/get_states`,
//         {
//           headers: {
//             Authorization: `Bearer ${user?.token}`,
//             'Content-Type': 'application/json',
//           },
//         }
//       );

//       let stateOptions: Array<{value: number | string; text: string}> = [];

//       // Handle different response formats
//       console.log('States API response:', response.data.states);

//       if (response.status) {
//         stateOptions = response?.data.states?.map((state: any) => ({
//           value: state.state_id || state.value,
//           text: state.state_title || state.text
//         }));
//       }

//       if (stateOptions.length > 0) {
//         setDynamicOptions(prev => ({
//           ...prev,
//           'state': stateOptions,
//           'selectBelong': stateOptions,
//           'address_state': stateOptions,
//           'class6_state': stateOptions,
//           'class7_state': stateOptions,
//           'class8_state': stateOptions,
//           'class9_state': stateOptions,
//           'class10_state': stateOptions,
//           'inter1st_state': stateOptions,
//           'inter2nd_state': stateOptions
//         }));
//       }
//     } catch (error) {
//       console.error('Error fetching states:', error);
//       // If API fails, use empty array
//       setDynamicOptions(prev => ({
//         ...prev,
//         'state': [],
//         'selectBelong': [],
//         'address_state': [],
//         'class6_state': [],
//         'class7_state': [],
//         'class8_state': [],
//         'class9_state': [],
//         'class10_state': [],
//         'inter1st_state': [],
//         'inter2nd_state': []
//       }));
//     }
//   };

//   // Fetch districts by state ID
//   const fetchDistricts = async (stateId: string | number, targetField: string) => {
//     try {
//       const response = await axios.post(
//         `${apiUrl}/frontend/get_district_by_state_id`,
//         { state_id: stateId },
//         {
//           headers: {
//             Authorization: `Bearer ${user?.token}`,
//             'Content-Type': 'application/json',
//           },
//         }
//       );

//       let districtOptions: Array<{value: number | string; text: string}> = [];

//       // Handle different response formats
//       if (response.status) {
//         districtOptions = response?.data.districts?.map((district: any) => ({
//           value: district.id || district.value,
//           text: district.district_title || district.text
//         }));
//       } else if (response.data.data && Array.isArray(response.data.data)) {
//         districtOptions = response.data.data.map((district: any) => ({
//           value: district.id || district.value,
//           text: district.name || district.text
//         }));
//       }

//       setDynamicOptions(prev => ({
//         ...prev,
//         [targetField]: districtOptions
//       }));
//     } catch (error) {
//       console.error('Error fetching districts:', error);
//       setDynamicOptions(prev => ({
//         ...prev,
//         [targetField]: []
//       }));
//     }
//   };

//   // Fetch application form data
//   const fetchApplicationData = async () => {
//     if (!applicationId) return;

//     setLoading(true);
//     try {
//       const response = await axios.post<ApiResponse>(
//         `${apiUrl}/${user?.role}/Applications/get-Applications-form-data`,
//         { application_id: parseInt(applicationId) },
//         {
//           headers: {
//             Authorization: `Bearer ${user?.token}`,
//             'Content-Type': 'application/json',
//           },
//         }
//       );

//       if (response.data) {
//         setFormSections(response.data.data || []);
//         setLookups(response.data.lookups || {});
//         setApplication(response.data.application_data);
        
//         // Set form data from candidate_details
//         if (response.data.candidate_details) {
//           setFormData(response.data.candidate_details);
//         }

//         // After setting lookups, fetch states
//         setTimeout(() => {
//           fetchStates();
//         }, 100);
//       }
//     } catch (error) {
//       console.error('Error fetching application data:', error);
//       toast.error('Failed to load application data');
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchApplicationData();
//   }, [applicationId]);

//   // Handle state change - fetch districts
//   const handleStateChange = (fieldName: string, value: string, targetField: string) => {
//     setFormData(prev => ({
//       ...prev,
//       [fieldName]: value,
//       [targetField]: '' // Clear district when state changes
//     }));

//     if (value) {
//       fetchDistricts(value, targetField);
//     } else {
//       // Clear districts if no state selected
//       setDynamicOptions(prev => ({
//         ...prev,
//         [targetField]: []
//       }));
//     }
//   };

//   // Handle input changes
//   const handleInputChange = (fieldName: string, value: string) => {
//     setFormData(prev => ({
//       ...prev,
//       [fieldName]: value
//     }));
//   };

//   // Handle file upload with preview
//   const handleFileUpload = async (fieldName: string, file: File) => {
//     const formDataObj = new FormData();
//     formDataObj.append('file', file);
//     formDataObj.append('application_id', applicationId || '');
//     formDataObj.append('field_name', fieldName);

//     try {
//       const response = await axios.post(
//         `${apiUrl}/Applications/upload-file`,
//         formDataObj,
//         {
//           headers: {
//             Authorization: `Bearer ${user?.token}`,
//             'Content-Type': 'multipart/form-data',
//           },
//         }
//       );

//       if (response.data.success) {
//         setFormData(prev => ({
//           ...prev,
//           [fieldName]: response.data.file_path
//         }));
//         toast.success('File uploaded successfully');
//       }
//     } catch (error) {
//       console.error('Error uploading file:', error);
//       toast.error('Failed to upload file');
//     }
//   };

//   // Handle form submission
//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setSaving(true);

//     try {
//       const response = await axios.post(
//         `${apiUrl}/${user?.role}/Applications/Applications-update`,
//         {
//           application_id: applicationId,
//           customer_id: user?.id,
//           academic_id: application?.academic_id,
//           maindata: formData,
//           s_id: user?.id,
//           apiUrl: apiUrl
//         },
//         {
//           headers: {
//             Authorization: `Bearer ${user?.token}`,
//             'Content-Type': 'application/json',
//           },
//         }
//       );

//       if (response.data.success) {
//         toast.success('Application updated successfully');
//         navigate(-1);
//       } else {
//         throw new Error(response.data.message || 'Failed to update application');
//       }
//     } catch (error: any) {
//       console.error('Error updating application:', error);
//       toast.error(error.response?.data?.message || 'Failed to update application');
//     } finally {
//       setSaving(false);
//     }
//   };

//   // Get field options with proper fallback
//   const getFieldOptions = (field: FormField) => {
//     // For state fields with apiurl
//     if (field.apiurl && field.apiurl.includes('get_district_by_state_id')) {
//       return dynamicOptions[field.name] || [];
//     }

//     // For district fields
//     if (field.name.includes('district')) {
//       return dynamicOptions[field.name] || [];
//     }

//     // For regular fields - check dynamic options first
//     if (dynamicOptions[field.name] && dynamicOptions[field.name].length > 0) {
//       return dynamicOptions[field.name];
//     }
    
//     // Then check field's own options
//     if (field.options && field.options.length > 0) {
//       return field.options;
//     }
    
//     // Then check lookups
//     const lookupKey = Object.keys(lookups).find(key => 
//       key.toLowerCase().includes(field.name.toLowerCase()) ||
//       field.name.toLowerCase().includes(key.toLowerCase())
//     );
    
//     if (lookupKey && lookups[lookupKey]) {
//       return lookups[lookupKey];
//     }
    
//     return [];
//   };

//   // Check if field is a state field with district API
//   const isStateFieldWithAPI = (field: FormField) => {
//     return field.apiurl && field.apiurl.includes('get_district_by_state_id');
//   };

//   // Check if field is a district field
//   const isDistrictField = (fieldName: string) => {
//     return fieldName.includes('district');
//   };

//   // Get target field for state dropdown
//   const getTargetField = (field: FormField) => {
//     if (field.target) return field.target;
    
//     if (field.name.includes('state')) {
//       return field.name.replace('state', 'district');
//     }
    
//     return '';
//   };

//   // Get field label
//   const getFieldLabel = (field: FormField) => {
//     if (field.label && field.label.trim() !== '') {
//       return field.label;
//     }
    
//     // Generate label from field name
//     const name = field.name.replace(/([A-Z])/g, ' $1').replace(/_/g, ' ');
//     return name.charAt(0).toUpperCase() + name.slice(1);
//   };

//   // Render form field based on type
//   const renderFormField = (field: FormField) => {
//     const value = formData[field.name] || '';
//     const fieldOptions = getFieldOptions(field);

//     switch (field.type) {
//       case 'text':
//       case 'adhar':
//         return (
//           <input
//             type="text"
//             value={value}
//             onChange={(e) => handleInputChange(field.name, e.target.value)}
//             placeholder={field.placeholder}
//             className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//             required={field.required === 1}
//           />
//         );

//       case 'select':
//         // State dropdown with district API
//         if (isStateFieldWithAPI(field)) {
//           const targetField = getTargetField(field);
//           const stateOptions = dynamicOptions[field.name] || [];
          
//           return (
//             <div>
//               <select
//                 value={value}
//                 onChange={(e) => handleStateChange(field.name, e.target.value, targetField)}
//                 className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//                 required={field.required === 1}
//               >
//                 <option value="">Select {getFieldLabel(field)}</option>
//                 {stateOptions.map(option => (
//                   <option key={option.value} value={option.value}>
//                     {option.text}
//                   </option>
//                 ))}
//               </select>
//               {stateOptions.length === 0 && (
//                 <p className="text-xs text-gray-500 mt-1">Loading states...</p>
//               )}
//             </div>
//           );
//         }
        
//         // District dropdown
//         if (isDistrictField(field.name)) {
//           const districtOptions = dynamicOptions[field.name] || [];
//           const isDisabled = districtOptions.length === 0;
          
//           return (
//             <div>
//               <select
//                 value={value}
//                 onChange={(e) => handleInputChange(field.name, e.target.value)}
//                 className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
//                   isDisabled ? 'bg-gray-100 text-gray-500 border-gray-200' : 'border-gray-300'
//                 }`}
//                 required={field.required === 1}
//                 disabled={isDisabled}
//               >
//                 <option value="">
//                   {isDisabled ? 'Select State First' : `Select ${getFieldLabel(field)}`}
//                 </option>
//                 {districtOptions.map(option => (
//                   <option key={option.value} value={option.value}>
//                     {option.text}
//                   </option>
//                 ))}
//               </select>
//             </div>
//           );
//         }
        
//         // Regular select dropdown
//         return (
//           <select
//             value={value}
//             onChange={(e) => handleInputChange(field.name, e.target.value)}
//             className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//             required={field.required === 1}
//           >
//             <option value="">Select {getFieldLabel(field)}</option>
//             {fieldOptions.map(option => (
//               <option key={option.value} value={option.value}>
//                 {option.text}
//               </option>
//             ))}
//           </select>
//         );

//       case 'date':
//         return (
//           <input
//             type="date"
//             value={value}
//             onChange={(e) => handleInputChange(field.name, e.target.value)}
//             className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//             required={field.required === 1}
//           />
//         );

//       case 'file_button':
//         const fileUrl = value ? `${apiAssetsUrl}/${value}` : '';
        
//         return (
//           <div className="flex flex-col items-center space-y-3">
//             {/* File Preview */}
//             {fileUrl && (
//               <div className="text-center">
//                 <p className="text-sm text-gray-600 mb-2">Current File:</p>
//                 {field.name.includes('pic') || field.name.includes('image') || field.name.includes('candidate_pic') ? (
//                   <img
//                     src={fileUrl}
//                     alt="Preview"
//                     className="w-24 h-24 object-cover border rounded-lg mx-auto"
//                     onError={(e) => {
//                       const target = e.target as HTMLImageElement;
//                       target.style.display = 'none';
//                     }}
//                   />
//                 ) : field.name.includes('signature') ? (
//                   <img
//                     src={fileUrl}
//                     alt="Signature Preview"
//                     className="w-32 h-16 object-contain border rounded mx-auto"
//                     onError={(e) => {
//                       const target = e.target as HTMLImageElement;
//                       target.style.display = 'none';
//                     }}
//                   />
//                 ) : (
//                   <div className="bg-gray-100 p-3 rounded-lg">
//                     <span className="text-sm text-gray-600">
//                       {value.split('/').pop()}
//                     </span>
//                   </div>
//                 )}
//               </div>
//             )}
            
//             {/* Upload Button */}
//             <div>
//               <input
//                 type="file"
//                 onChange={(e) => {
//                   if (e.target.files && e.target.files[0]) {
//                     handleFileUpload(field.name, e.target.files[0]);
//                   }
//                 }}
//                 className="hidden"
//                 id={field.name}
//                 accept={field.name.includes('pic') ? 'image/*' : '*/*'}
//               />
//               <label
//                 htmlFor={field.name}
//                 className="cursor-pointer bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors inline-block"
//               >
//                 {field.content || 'Upload File'}
//               </label>
//             </div>
//           </div>
//         );

//       default:
//         return (
//           <input
//             type="text"
//             value={value}
//             onChange={(e) => handleInputChange(field.name, e.target.value)}
//             placeholder={field.placeholder}
//             className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//           />
//         );
//     }
//   };

//   // Calculate grid columns based on section width
//   const getGridColumns = (section: FormSection) => {
//     if (section.width === '100%') {
//       return 'grid-cols-1 md:grid-cols-2';
//     }
//     if (section.width === '50%') {
//       return 'grid-cols-1 md:grid-cols-2';
//     }
//     if (section.width === '80%') {
//       return 'grid-cols-1 md:grid-cols-2';
//     }
//     if (section.width === '20%') {
//       return 'grid-cols-1';
//     }
//     return 'grid-cols-1 md:grid-cols-2';
//   };

//   if (loading) {
//     return <Loader />;
//   }

//   return (
//     <div className="min-h-screen bg-gray-50 py-8">
//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//         {/* Header */}
//         <div className="mb-8">
//           <Button
//             onClick={() => navigate(-1)}
//             color="light"
//             className="mb-4"
//           >
//             <FaArrowLeft className="w-4 h-4 mr-2" />
//             Back
//           </Button>
          
//           <div className="flex justify-between items-center">
//             <div>
//               <h1 className="text-3xl font-bold text-gray-900">
//                 Edit Application
//               </h1>
//               <p className="text-gray-600 mt-2">
//                 {application?.applicant_name}
//               </p>
//             </div>
//           </div>
//         </div>

//         {/* Form */}
//         <form onSubmit={handleSubmit}>
//           <div className="space-y-6">
//             {formSections.map((section, sectionIndex) => (
//               <Card key={sectionIndex} className="p-6">
//                 <div className={`grid ${getGridColumns(section)} gap-6`}>
//                   {section.children.map((field) => (
//                     <div 
//                       key={field.id}
//                       className="space-y-2"
//                     >
//                       <label className="block text-sm font-medium text-gray-700">
//                         {getFieldLabel(field)}
//                         {field.required === 1 && (
//                           <span className="text-red-500 ml-1">*</span>
//                         )}
//                       </label>
//                       {renderFormField(field)}
//                     </div>
//                   ))}
//                 </div>
//               </Card>
//             ))}
//           </div>

//           {/* Submit Button */}
//           <div className="mt-8 flex justify-end space-x-4">
//             <Button
//               type="button"
//               color="light"
//               onClick={() => navigate(-1)}
//               disabled={saving}
//             >
//               Cancel
//             </Button>
//             <Button
//               type="submit"
//               color="blue"
//               disabled={saving}
//               className="bg-blue-600 hover:bg-blue-700"
//             >
//               {saving ? 'Saving...' : 'Save Changes'}
//             </Button>
//           </div>
//         </form>
//       </div>
//     </div>
//   );
// };

// export default ApplicationEditPage;














// // src/Frontend/Components/ApplicationEditPage.tsx
// import React, { useState, useEffect } from 'react';
// import { useParams, useNavigate } from 'react-router';
// import axios from 'axios';
// import toast from 'react-hot-toast';
// import { Button, Card } from 'flowbite-react';
// import { FaArrowLeft } from 'react-icons/fa';
// import Loader from 'src/Frontend/Common/Loader';
// import { useAuth } from 'src/hook/useAuth';

// interface FormField {
//   type: string;
//   id: number;
//   name: string;
//   apiurl?: string;
//   label: string;
//   resolution?: string;
//   width: string;
//   placeholder?: string;
//   options: Array<{ value: number | string; text: string }>;
//   required: number;
//   style?: string | object;
//   target?: string;
//   validation?: string;
//   max_date?: string;
//   content?: string;
//   h_target?: string;
//   v_target?: string;
// }

// interface FormSection {
//   width: string;
//   gap: number;
//   justify: string;
//   children: FormField[];
// }

// interface ApplicationData {
//   id: number;
//   applicant_name: string;
//   academic_id?: number;
// }

// interface CandidateDetails {
//   [key: string]: string;
// }

// interface Lookups {
//   [key: string]: Array<{ value: number | string; text: string }>;
// }

// interface ApiResponse {
//   data: FormSection[];
//   application_data: ApplicationData;
//   candidate_details: CandidateDetails;
//   lookups: Lookups;
// }

// const ApplicationEditPage: React.FC = () => {
//   const { applicationId } = useParams<{ applicationId: string }>();
//   const navigate = useNavigate();
//   const { user } = useAuth();
  
//   const [loading, setLoading] = useState(true);
//   const [saving, setSaving] = useState(false);
//   const [formData, setFormData] = useState<CandidateDetails>({});
//   const [formSections, setFormSections] = useState<FormSection[]>([]);
//   const [lookups, setLookups] = useState<Lookups>({});
//   const [application, setApplication] = useState<ApplicationData | null>(null);
//   const [dynamicOptions, setDynamicOptions] = useState<{[key: string]: Array<{value: number | string; text: string}>}>({});
//   const [filePreviews, setFilePreviews] = useState<{[key: string]: string}>({});
//   const [selectedFiles, setSelectedFiles] = useState<{[key: string]: File}>({});

//   const apiUrl = import.meta.env.VITE_API_URL;
//   const apiAssetsUrl = import.meta.env.VITE_ASSET_URL;

//   // Fetch states data
//   const fetchStates = async () => {
//     try {
//       const response = await axios.get(
//         `${apiUrl}/frontend/get_states`,
//         {
//           headers: {
//             Authorization: `Bearer ${user?.token}`,
//             'Content-Type': 'application/json',
//           },
//         }
//       );

//       let stateOptions: Array<{value: number | string; text: string}> = [];

//       if (response.data && response.data.states) {
//         stateOptions = response.data.states.map((state: any) => ({
//           value: state.state_id,
//           text: state.state_title
//         }));
//       }

//       if (stateOptions.length > 0) {
//         // Set states for all state fields
//         const stateFields = [
//           'selectBelong', 'address_state', 'class6_state', 'class7_state', 
//           'class8_state', 'class9_state', 'class10_state', 'inter1st_state', 'inter2nd_state'
//         ];
        
//         const newDynamicOptions: any = {};
//         stateFields.forEach(field => {
//           newDynamicOptions[field] = stateOptions;
//         });
        
//         setDynamicOptions(prev => ({
//           ...prev,
//           ...newDynamicOptions
//         }));
//       }
//     } catch (error) {
//       console.error('Error fetching states:', error);
//     }
//   };

//   // Fetch districts by state ID
//   const fetchDistricts = async (stateId: string | number, targetField: string) => {
//     try {
//       const response = await axios.post(
//         `${apiUrl}/frontend/get_district_by_state_id`,
//         { state_id: stateId },
//         {
//           headers: {
//             Authorization: `Bearer ${user?.token}`,
//             'Content-Type': 'application/json',
//           },
//         }
//       );

//       let districtOptions: Array<{value: number | string; text: string}> = [];

//       if (response.data && response.data.districts) {
//         districtOptions = response.data.districts.map((district: any) => ({
//           value: district.id,
//           text: district.district_title
//         }));
//       }

//       setDynamicOptions(prev => ({
//         ...prev,
//         [targetField]: districtOptions
//       }));
//     } catch (error) {
//       console.error('Error fetching districts:', error);
//     }
//   };

//   // Fetch application form data
//   const fetchApplicationData = async () => {
//     if (!applicationId) return;

//     setLoading(true);
//     try {
//       const response = await axios.post<ApiResponse>(
//         `${apiUrl}/${user?.role}/Applications/get-Applications-form-data`,
//         { application_id: parseInt(applicationId) },
//         {
//           headers: {
//             Authorization: `Bearer ${user?.token}`,
//             'Content-Type': 'application/json',
//           },
//         }
//       );

//       if (response.data) {
//         setFormSections(response.data.data || []);
//         setLookups(response.data.lookups || {});
//         setApplication(response.data.application_data);
        
//         // Set form data from candidate_details
//         if (response.data.candidate_details) {
//           const candidateData = response.data.candidate_details;
//           setFormData(candidateData);
          
//           // Set file previews for existing files
//           const previews: {[key: string]: string} = {};
//           if (candidateData.candidate_pic) {
//             previews.candidate_pic = `${apiAssetsUrl}/${candidateData.candidate_pic}`;
//           }
//           if (candidateData.candidate_signature) {
//             previews.candidate_signature = `${apiAssetsUrl}/${candidateData.candidate_signature}`;
//           }
//           if (candidateData.caste_certificate) {
//             previews.caste_certificate = `${apiAssetsUrl}/${candidateData.caste_certificate}`;
//           }
//           setFilePreviews(previews);
//         }

//         // Fetch states after form data is loaded
//         setTimeout(() => {
//           fetchStates();
//         }, 100);
//       }
//     } catch (error) {
//       console.error('Error fetching application data:', error);
//       toast.error('Failed to load application data');
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchApplicationData();
//   }, [applicationId]);

//   // Handle state change - fetch districts
//   const handleStateChange = (fieldName: string, value: string, targetField: string) => {
//     setFormData(prev => ({
//       ...prev,
//       [fieldName]: value,
//       [targetField]: '' // Clear district when state changes
//     }));

//     if (value) {
//       fetchDistricts(value, targetField);
//     }
//   };

//   // Handle input changes
//   const handleInputChange = (fieldName: string, value: string) => {
//     setFormData(prev => ({
//       ...prev,
//       [fieldName]: value
//     }));
//   };

//   // Handle file selection with preview
//   const handleFileSelect = (fieldName: string, file: File) => {
//     if (file) {
//       // Store the file
//       setSelectedFiles(prev => ({
//         ...prev,
//         [fieldName]: file
//       }));

//       // Create preview for images
//       if (file.type.startsWith('image/')) {
//         const reader = new FileReader();
//         reader.onload = (e) => {
//           setFilePreviews(prev => ({
//             ...prev,
//             [fieldName]: e.target?.result as string
//           }));
//         };
//         reader.readAsDataURL(file);
//       }

//       toast.success(`${file.name} selected for upload`);
//     }
//   };

//   // Handle form submission with file upload
//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setSaving(true);

//     try {
//       // Create FormData for file upload
//       const submitFormData = new FormData();
      
//       // Add basic data
//       submitFormData.append('application_id', applicationId || '');
//       submitFormData.append('customer_id', user?.id?.toString() || '');
//       submitFormData.append('academic_id', application?.academic_id?.toString() || '');
//       submitFormData.append('s_id', user?.id?.toString() || '');
      
//       // Add text fields data as JSON
//       const mainData: any = { ...formData };
      
//       // Add files to FormData
//       Object.keys(selectedFiles).forEach(fieldName => {
//         submitFormData.append(fieldName, selectedFiles[fieldName]);
//         // Remove file fields from mainData since they'll be sent as files
//         delete mainData[fieldName];
//       });
      
//       submitFormData.append('maindata', JSON.stringify(mainData));

//       const response = await axios.post(
//         `${apiUrl}/${user?.role}/Applications/Applications-update`,
//         submitFormData,
//         {
//           headers: {
//             Authorization: `Bearer ${user?.token}`,
//             'Content-Type': 'multipart/form-data',
//           },
//         }
//       );

//       if (response.data.success) {
//         toast.success('Application updated successfully');
//         navigate(-1);
//       } else {
//         throw new Error(response.data.message || 'Failed to update application');
//       }
//     } catch (error: any) {
//       console.error('Error updating application:', error);
//       toast.error(error.response?.data?.message || 'Failed to update application');
//     } finally {
//       setSaving(false);
//     }
//   };

//   // Get field options with proper fallback
//   const getFieldOptions = (field: FormField) => {
//     // For state and district fields
//     if (dynamicOptions[field.name] && dynamicOptions[field.name].length > 0) {
//       return dynamicOptions[field.name];
//     }
    
//     // For regular fields - check field's own options
//     if (field.options && field.options.length > 0) {
//       return field.options;
//     }
    
//     // Then check lookups
//     const lookupKey = Object.keys(lookups).find(key => 
//       key.toLowerCase().includes(field.name.toLowerCase()) ||
//       field.name.toLowerCase().includes(key.toLowerCase())
//     );
    
//     if (lookupKey && lookups[lookupKey]) {
//       return lookups[lookupKey];
//     }
    
//     return [];
//   };

//   // Check if field is a state field with district API
//   const isStateFieldWithAPI = (field: FormField) => {
//     return field.apiurl && field.apiurl.includes('get_district_by_state_id');
//   };

//   // Check if field is a district field
//   const isDistrictField = (fieldName: string) => {
//     return fieldName.includes('district');
//   };

//   // Get target field for state dropdown
//   const getTargetField = (field: FormField) => {
//     if (field.target) return field.target;
//     return '';
//   };

//   // Get field label
//   const getFieldLabel = (field: FormField) => {
//     if (field.label && field.label.trim() !== '') {
//       return field.label;
//     }
    
//     // Generate label from field name
//     const name = field.name.replace(/([A-Z])/g, ' $1').replace(/-/g, ' ').replace(/_/g, ' ');
//     return name.charAt(0).toUpperCase() + name.slice(1);
//   };

//   // Render form field based on type
//   const renderFormField = (field: FormField) => {
//     const value = formData[field.name] || '';
//     const fieldOptions = getFieldOptions(field);
//     const hasSelectedFile = !!selectedFiles[field.name];
//     const existingFileUrl = formData[field.name] && typeof formData[field.name] === 'string' ? `${apiAssetsUrl}/${formData[field.name]}` : '';

//     switch (field.type) {
//       case 'text':
//       case 'adhar':
//         return (
//           <input
//             type="text"
//             value={value}
//             onChange={(e) => handleInputChange(field.name, e.target.value)}
//             placeholder={field.placeholder}
//             className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//             required={field.required === 1}
//           />
//         );

//       case 'select':
//         // State dropdown with district API
//         if (isStateFieldWithAPI(field)) {
//           const targetField = getTargetField(field);
//           const stateOptions = dynamicOptions[field.name] || [];
          
//           return (
//             <div>
//               <select
//                 value={value}
//                 onChange={(e) => handleStateChange(field.name, e.target.value, targetField)}
//                 className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//                 required={field.required === 1}
//               >
//                 <option value="">Select {getFieldLabel(field)}</option>
//                 {stateOptions.map(option => (
//                   <option key={option.value} value={option.value}>
//                     {option.text}
//                   </option>
//                 ))}
//               </select>
//               {stateOptions.length === 0 && (
//                 <p className="text-xs text-gray-500 mt-1">Loading states...</p>
//               )}
//             </div>
//           );
//         }
        
//         // District dropdown
//         if (isDistrictField(field.name)) {
//           const districtOptions = dynamicOptions[field.name] || [];
//           const isDisabled = districtOptions.length === 0;
          
//           return (
//             <div>
//               <select
//                 value={value}
//                 onChange={(e) => handleInputChange(field.name, e.target.value)}
//                 className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
//                   isDisabled ? 'bg-gray-100 text-gray-500 border-gray-200' : 'border-gray-300'
//                 }`}
//                 required={field.required === 1}
//                 disabled={isDisabled}
//               >
//                 <option value="">
//                   {isDisabled ? 'Select State First' : `Select ${getFieldLabel(field)}`}
//                 </option>
//                 {districtOptions.map(option => (
//                   <option key={option.value} value={option.value}>
//                     {option.text}
//                   </option>
//                 ))}
//               </select>
//             </div>
//           );
//         }
        
//         // Regular select dropdown
//         return (
//           <select
//             value={value}
//             onChange={(e) => handleInputChange(field.name, e.target.value)}
//             className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//             required={field.required === 1}
//           >
//             <option value="">Select {getFieldLabel(field)}</option>
//             {fieldOptions.map(option => (
//               <option key={option.value} value={option.value}>
//                 {option.text}
//               </option>
//             ))}
//           </select>
//         );

//       case 'date':
//         return (
//           <input
//             type="date"
//             value={value}
//             onChange={(e) => handleInputChange(field.name, e.target.value)}
//             className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//             required={field.required === 1}
//           />
//         );

//       case 'file_button':
//         const previewUrl = filePreviews[field.name] || existingFileUrl;
//         const selectedFile = selectedFiles[field.name];
        
//         return (
//           <div className="flex flex-col items-center space-y-4 p-4 border border-gray-200 rounded-lg bg-gray-50">
//             {/* File Preview Section */}
//             <div className="text-center w-full">
//               <p className="text-sm font-medium text-gray-700 mb-3">
//                 {getFieldLabel(field)} {field.required === 1 && <span className="text-red-500">*</span>}
//               </p>
              
//               {/* Preview Image */}
//               {previewUrl && (
//                 <div className="mb-3">
//                   <p className="text-xs text-gray-600 mb-2">Preview:</p>
//                   {field.name.includes('signature') ? (
//                     <img
//                       src={previewUrl}
//                       alt="Signature Preview"
//                       className="w-40 h-20 object-contain border-2 border-blue-300 rounded mx-auto"
//                     />
//                   ) : (
//                     <img
//                       src={previewUrl}
//                       alt="Image Preview"
//                       className="w-32 h-32 object-cover border-2 border-blue-300 rounded-lg mx-auto"
//                     />
//                   )}
//                 </div>
//               )}
              
//               {/* File Info */}
//               {(selectedFile || existingFileUrl) && (
//                 <div className="text-xs text-gray-600 bg-white p-2 rounded border">
//                   {selectedFile ? (
//                     <p>Selected: <strong>{selectedFile.name}</strong> ({(selectedFile.size / 1024).toFixed(1)} KB)</p>
//                   ) : (
//                     <p>Current: <strong>{formData[field.name]?.split('/').pop()}</strong></p>
//                   )}
//                 </div>
//               )}
//             </div>
            
//             {/* Upload Button */}
//             <div className="w-full">
//               <input
//                 type="file"
//                 onChange={(e) => {
//                   if (e.target.files && e.target.files[0]) {
//                     handleFileSelect(field.name, e.target.files[0]);
//                   }
//                 }}
//                 className="hidden"
//                 id={field.name}
//                 accept="image/*"
//               />
//               <label
//                 htmlFor={field.name}
//                 className="cursor-pointer bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors inline-block w-full text-center"
//               >
//                 {field.content || `📁 Upload ${getFieldLabel(field)}`}
//               </label>
//             </div>

//             {/* Resolution Info */}
//             {field.resolution && (
//               <p className="text-xs text-gray-500 text-center">
//                 Recommended: {field.resolution}
//               </p>
//             )}
//           </div>
//         );

//       default:
//         return (
//           <input
//             type="text"
//             value={value}
//             onChange={(e) => handleInputChange(field.name, e.target.value)}
//             placeholder={field.placeholder}
//             className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//           />
//         );
//     }
//   };

//   // Calculate grid columns based on section width
//   const getGridColumns = (section: FormSection) => {
//     if (section.width === '100%') {
//       return 'grid-cols-1 md:grid-cols-2';
//     }
//     if (section.width === '50%') {
//       return 'grid-cols-1 md:grid-cols-2';
//     }
//     if (section.width === '80%') {
//       return 'grid-cols-1 md:grid-cols-2';
//     }
//     if (section.width === '20%') {
//       return 'grid-cols-1';
//     }
//     return 'grid-cols-1 md:grid-cols-2';
//   };

//   if (loading) {
//     return <Loader />;
//   }

//   return (
//     <div className="min-h-screen bg-gray-50 py-8">
//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//         {/* Header */}
//         <div className="mb-8">
//           <Button
//             onClick={() => navigate(-1)}
//             color="light"
//             className="mb-4"
//           >
//             <FaArrowLeft className="w-4 h-4 mr-2" />
//             Back
//           </Button>
          
//           <div className="flex justify-between items-center">
//             <div>
//               <h1 className="text-3xl font-bold text-gray-900">
//                 Edit Application
//               </h1>
//               <p className="text-gray-600 mt-2">
//                 {application?.applicant_name}
//               </p>
//             </div>
//           </div>
//         </div>

//         {/* Form */}
//         <form onSubmit={handleSubmit}>
//           <div className="space-y-6">
//             {formSections.map((section, sectionIndex) => (
//               <Card key={sectionIndex} className="p-6">
//                 <div className={`grid ${getGridColumns(section)} gap-6`}>
//                   {section.children.map((field) => (
//                     <div 
//                       key={field.id}
//                       className="space-y-2"
//                     >
//                       {field.type !== 'file_button' && (
//                         <label className="block text-sm font-medium text-gray-700">
//                           {getFieldLabel(field)}
//                           {field.required === 1 && (
//                             <span className="text-red-500 ml-1">*</span>
//                           )}
//                         </label>
//                       )}
//                       {renderFormField(field)}
//                     </div>
//                   ))}
//                 </div>
//               </Card>
//             ))}
//           </div>

//           {/* Submit Button */}
//           <div className="mt-8 flex justify-end space-x-4">
//             <Button
//               type="button"
//               color="light"
//               onClick={() => navigate(-1)}
//               disabled={saving}
//             >
//               Cancel
//             </Button>
//             <Button
//               type="submit"
//               color="blue"
//               disabled={saving}
//               className="bg-blue-600 hover:bg-blue-700"
//             >
//               {saving ? 'Saving...' : 'Save Changes'}
//             </Button>
//           </div>
//         </form>
//       </div>
//     </div>
//   );
// };

// export default ApplicationEditPage;













// src/Frontend/Components/ApplicationEditPage.tsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router';
import axios from 'axios';
import toast from 'react-hot-toast';
import { Button, Card } from 'flowbite-react';
import { FaArrowLeft } from 'react-icons/fa';
import Loader from 'src/Frontend/Common/Loader';
import { useAuth } from 'src/hook/useAuth';

interface FormField {
  type: string;
  id: number;
  name: string;
  apiurl?: string;
  label: string;
  resolution?: string;
  width: string;
  placeholder?: string;
  options: Array<{ value: number | string; text: string }>;
  required: number;
  style?: string | object;
  target?: string;
  validation?: string;
  max_date?: string;
  content?: string;
  h_target?: string;
  v_target?: string;
}

interface FormSection {
  width: string;
  gap: number;
  justify: string;
  children: FormField[];
}

interface ApplicationData {
  id: number;
  applicant_name: string;
  academic_id?: number;
}

interface CandidateDetails {
  [key: string]: string;
}

interface Lookups {
  [key: string]: Array<{ value: number | string; text: string }>;
}

interface ApiResponse {
  data: FormSection[];
  application_data: ApplicationData;
  candidate_details: CandidateDetails;
  lookups: Lookups;
}

const ApplicationEditPage: React.FC = () => {
  const { applicationId } = useParams<{ applicationId: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState<CandidateDetails>({});
  const [formSections, setFormSections] = useState<FormSection[]>([]);
  const [lookups, setLookups] = useState<Lookups>({});
  const [application, setApplication] = useState<ApplicationData | null>(null);
  const [dynamicOptions, setDynamicOptions] = useState<{[key: string]: Array<{value: number | string; text: string}>}>({});
  const [filePreviews, setFilePreviews] = useState<{[key: string]: string}>({});
  const [selectedFiles, setSelectedFiles] = useState<{[key: string]: File}>({});

  const apiUrl = import.meta.env.VITE_API_URL;
  const apiAssetsUrl = import.meta.env.VITE_ASSET_URL;

  // Fetch states data
  const fetchStates = async () => {
    try {
      const response = await axios.get(
        `${apiUrl}/frontend/get_states`,
        {
          headers: {
            Authorization: `Bearer ${user?.token}`,
            'Content-Type': 'application/json',
          },
        }
      );

      let stateOptions: Array<{value: number | string; text: string}> = [];

      if (response.data && response.data.states) {
        stateOptions = response.data.states.map((state: any) => ({
          value: state.state_id,
          text: state.state_title
        }));
      }

      if (stateOptions.length > 0) {
        // Set states for all state fields
        const stateFields = [
          'selectBelong', 'address_state', 'class6_state', 'class7_state', 
          'class8_state', 'class9_state', 'class10_state', 'inter1st_state', 'inter2nd_state'
        ];
        
        const newDynamicOptions: any = {};
        stateFields.forEach(field => {
          newDynamicOptions[field] = stateOptions;
        });
        
        setDynamicOptions(prev => ({
          ...prev,
          ...newDynamicOptions
        }));
      }
    } catch (error) {
      console.error('Error fetching states:', error);
    }
  };

  // Fetch districts by state ID
  const fetchDistricts = async (stateId: string | number, targetField: string) => {
    try {
      const response = await axios.post(
        `${apiUrl}/frontend/get_district_by_state_id`,
        { state_id: stateId },
        {
          headers: {
            Authorization: `Bearer ${user?.token}`,
            'Content-Type': 'application/json',
          },
        }
      );

      let districtOptions: Array<{value: number | string; text: string}> = [];

      if (response.data && response.data.districts) {
        districtOptions = response.data.districts.map((district: any) => ({
          value: district.id,
          text: district.district_title
        }));
      }

      setDynamicOptions(prev => ({
        ...prev,
        [targetField]: districtOptions
      }));
    } catch (error) {
      console.error('Error fetching districts:', error);
    }
  };

  // Fetch application form data
  const fetchApplicationData = async () => {
    if (!applicationId) return;

    setLoading(true);
    try {
      const response = await axios.post<ApiResponse>(
        `${apiUrl}/${user?.role}/Applications/get-Applications-form-data`,
        { application_id: parseInt(applicationId) },
        {
          headers: {
            Authorization: `Bearer ${user?.token}`,
            'Content-Type': 'application/json',
          },
        }
      );

      if (response.data) {
        setFormSections(response.data.data || []);
        setLookups(response.data.lookups || {});
        setApplication(response.data.application_data);
        
        // Set form data from candidate_details
        if (response.data.candidate_details) {
          const candidateData = response.data.candidate_details;
          setFormData(candidateData);
          
          // Set file previews for existing files
          const previews: {[key: string]: string} = {};
          if (candidateData.candidate_pic) {
            previews.candidate_pic = `${apiAssetsUrl}/${candidateData.candidate_pic}`;
          }
          if (candidateData.candidate_signature) {
            previews.candidate_signature = `${apiAssetsUrl}/${candidateData.candidate_signature}`;
          }
          if (candidateData.caste_certificate) {
            previews.caste_certificate = `${apiAssetsUrl}/${candidateData.caste_certificate}`;
          }
          setFilePreviews(previews);
        }

        // Fetch states after form data is loaded
        setTimeout(() => {
          fetchStates();
        }, 100);
      }
    } catch (error) {
      console.error('Error fetching application data:', error);
      toast.error('Failed to load application data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApplicationData();
  }, [applicationId]);

  // Handle state change - fetch districts
  const handleStateChange = (fieldName: string, value: string, targetField: string) => {
    setFormData(prev => ({
      ...prev,
      [fieldName]: value,
      [targetField]: '' // Clear district when state changes
    }));

    if (value) {
      fetchDistricts(value, targetField);
    }
  };

  // Handle input changes
  const handleInputChange = (fieldName: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [fieldName]: value
    }));
  };

  // Handle file selection with preview
  const handleFileSelect = (fieldName: string, file: File) => {
    if (file) {
      // Store the file
      setSelectedFiles(prev => ({
        ...prev,
        [fieldName]: file
      }));

      // Create preview for images
      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = (e) => {
          setFilePreviews(prev => ({
            ...prev,
            [fieldName]: e.target?.result as string
          }));
        };
        reader.readAsDataURL(file);
      }

      toast.success(`${file.name} selected for upload`);
    }
  };

  // Handle form submission with file upload
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      // Create FormData for file upload
      const submitFormData = new FormData();
      
      // Add basic data
      submitFormData.append('application_id', applicationId || '');
      submitFormData.append('customer_id', user?.id?.toString() || '');
      submitFormData.append('academic_id', application?.academic_id?.toString() || '');
      submitFormData.append('s_id', user?.id?.toString() || '');
      
      // Add text fields data as JSON
      const mainData: any = { ...formData };
      
      // Add files to FormData
      Object.keys(selectedFiles).forEach(fieldName => {
        submitFormData.append(fieldName, selectedFiles[fieldName]);
        // Remove file fields from mainData since they'll be sent as files
        delete mainData[fieldName];
      });
      
      submitFormData.append('maindata', JSON.stringify(mainData));

      const response = await axios.post(
        `${apiUrl}/${user?.role}/Applications/Applications-update`,
        submitFormData,
        {
          headers: {
            Authorization: `Bearer ${user?.token}`,
            'Content-Type': 'multipart/form-data',
          },
        }
      );

      if (response.data.success) {
        toast.success('Application updated successfully');
        navigate(-1);
      } else {
        throw new Error(response.data.message || 'Failed to update application');
      }
    } catch (error: any) {
      console.error('Error updating application:', error);
      toast.error(error.response?.data?.message || 'Failed to update application');
    } finally {
      setSaving(false);
    }
  };

  // Get field options with proper fallback - FIXED FOR BOARDS
  const getFieldOptions = (field: FormField) => {
    // For board fields - check lookups.boards first
    if (field.name === 'board' || field.name === 'board1') {
      if (lookups.boards && lookups.boards.length > 0) {
        return lookups.boards;
      }
    }

    // For state fields with apiurl
    if (field.apiurl && field.apiurl.includes('get_district_by_state_id')) {
      return dynamicOptions[field.name] || [];
    }

    // For district fields
    if (field.name.includes('district')) {
      return dynamicOptions[field.name] || [];
    }

    // For regular fields - check dynamic options first
    if (dynamicOptions[field.name] && dynamicOptions[field.name].length > 0) {
      return dynamicOptions[field.name];
    }
    
    // Then check field's own options
    if (field.options && field.options.length > 0) {
      return field.options;
    }
    
    // Then check lookups for other fields
    const lookupKey = Object.keys(lookups).find(key => 
      key.toLowerCase().includes(field.name.toLowerCase()) ||
      field.name.toLowerCase().includes(key.toLowerCase())
    );
    
    if (lookupKey && lookups[lookupKey]) {
      return lookups[lookupKey];
    }
    
    return [];
  };

  // Check if field is a state field with district API
  const isStateFieldWithAPI = (field: FormField) => {
    return field.apiurl && field.apiurl.includes('get_district_by_state_id');
  };

  // Check if field is a district field
  const isDistrictField = (fieldName: string) => {
    return fieldName.includes('district');
  };

  // Check if field is a board field
  const isBoardField = (fieldName: string) => {
    return fieldName.includes('board');
  };

  // Get target field for state dropdown
  const getTargetField = (field: FormField) => {
    if (field.target) return field.target;
    return '';
  };

  // Get field label
  const getFieldLabel = (field: FormField) => {
    if (field.label && field.label.trim() !== '') {
      return field.label;
    }
    
    // Generate label from field name
    const name = field.name.replace(/([A-Z])/g, ' $1').replace(/-/g, ' ').replace(/_/g, ' ');
    return name.charAt(0).toUpperCase() + name.slice(1);
  };

  // Render form field based on type
  const renderFormField = (field: FormField) => {
    const value = formData[field.name] || '';
    const fieldOptions = getFieldOptions(field);

    // Debug info for board fields
    if (isBoardField(field.name)) {
      console.log(`Board Field: ${field.name}`, {
        value,
        options: fieldOptions,
        lookupsBoards: lookups.boards,
        fieldOptions: field.options
      });
    }

    switch (field.type) {
      case 'text':
      case 'adhar':
        return (
          <input
            type="text"
            value={value}
            onChange={(e) => handleInputChange(field.name, e.target.value)}
            placeholder={field.placeholder}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            required={field.required === 1}
          />
        );

      case 'select':
        // State dropdown with district API
        if (isStateFieldWithAPI(field)) {
          const targetField = getTargetField(field);
          const stateOptions = dynamicOptions[field.name] || [];
          
          return (
            <div>
              <select
                value={value}
                onChange={(e) => handleStateChange(field.name, e.target.value, targetField)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required={field.required === 1}
              >
                <option value="">Select {getFieldLabel(field)}</option>
                {stateOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.text}
                  </option>
                ))}
              </select>
              {stateOptions.length === 0 && (
                <p className="text-xs text-gray-500 mt-1">Loading states...</p>
              )}
            </div>
          );
        }
        
        // District dropdown
        if (isDistrictField(field.name)) {
          const districtOptions = dynamicOptions[field.name] || [];
          const isDisabled = districtOptions.length === 0;
          
          return (
            <div>
              <select
                value={value}
                onChange={(e) => handleInputChange(field.name, e.target.value)}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                  isDisabled ? 'bg-gray-100 text-gray-500 border-gray-200' : 'border-gray-300'
                }`}
                required={field.required === 1}
                disabled={isDisabled}
              >
                <option value="">
                  {isDisabled ? 'Select State First' : `Select ${getFieldLabel(field)}`}
                </option>
                {districtOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.text}
                  </option>
                ))}
              </select>
            </div>
          );
        }

        // Board dropdown - SPECIAL HANDLING
        if (isBoardField(field.name)) {
          const boardOptions = fieldOptions;
          
          return (
            <div>
              <select
                value={value}
                onChange={(e) => handleInputChange(field.name, e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required={field.required === 1}
              >
                <option value="">Select {getFieldLabel(field)}</option>
                {boardOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.text}
                  </option>
                ))}
              </select>
              {boardOptions.length === 0 && (
                <p className="text-xs text-yellow-600 mt-1">No boards available</p>
              )}
            </div>
          );
        }
        
        // Regular select dropdown
        return (
          <select
            value={value}
            onChange={(e) => handleInputChange(field.name, e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            required={field.required === 1}
          >
            <option value="">Select {getFieldLabel(field)}</option>
            {fieldOptions.map(option => (
              <option key={option.value} value={option.value}>
                {option.text}
              </option>
            ))}
          </select>
        );

      case 'date':
        return (
          <input
            type="date"
            value={value}
            onChange={(e) => handleInputChange(field.name, e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            required={field.required === 1}
          />
        );

      case 'file_button':
        const selectedFile = selectedFiles[field.name];
        const existingFileUrl = formData[field.name] && typeof formData[field.name] === 'string' ? `${apiAssetsUrl}/${formData[field.name]}` : '';
        const previewUrl = filePreviews[field.name] || existingFileUrl;
        
        return (
          <div className="flex flex-col items-center space-y-4 p-4 border border-gray-200 rounded-lg bg-gray-50">
            {/* File Preview Section */}
            <div className="text-center w-full">
              <p className="text-sm font-medium text-gray-700 mb-3">
                {getFieldLabel(field)} {field.required === 1 && <span className="text-red-500">*</span>}
              </p>
              
              {/* Preview Image */}
              {previewUrl && (
                <div className="mb-3">
                  <p className="text-xs text-gray-600 mb-2">Preview:</p>
                  {field.name.includes('signature') ? (
                    <img
                      src={previewUrl}
                      alt="Signature Preview"
                      className="w-40 h-20 object-contain border-2 border-blue-300 rounded mx-auto"
                    />
                  ) : (
                    <img
                      src={previewUrl}
                      alt="Image Preview"
                      className="w-32 h-32 object-cover border-2 border-blue-300 rounded-lg mx-auto"
                    />
                  )}
                </div>
              )}
              
              {/* File Info */}
              {(selectedFile || existingFileUrl) && (
                <div className="text-xs text-gray-600 bg-white p-2 rounded border">
                  {selectedFile ? (
                    <p>Selected: <strong>{selectedFile.name}</strong> ({(selectedFile.size / 1024).toFixed(1)} KB)</p>
                  ) : (
                    <p>Current: <strong>{formData[field.name]?.split('/').pop()}</strong></p>
                  )}
                </div>
              )}
            </div>
            
            {/* Upload Button */}
            <div className="w-full">
              <input
                type="file"
                onChange={(e) => {
                  if (e.target.files && e.target.files[0]) {
                    handleFileSelect(field.name, e.target.files[0]);
                  }
                }}
                className="hidden"
                id={field.name}
                accept="image/*"
              />
              <label
                htmlFor={field.name}
                className="cursor-pointer bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors inline-block w-full text-center"
              >
                {field.content || `📁 Upload ${getFieldLabel(field)}`}
              </label>
            </div>

            {/* Resolution Info */}
            {field.resolution && (
              <p className="text-xs text-gray-500 text-center">
                Recommended: {field.resolution}
              </p>
            )}
          </div>
        );

      default:
        return (
          <input
            type="text"
            value={value}
            onChange={(e) => handleInputChange(field.name, e.target.value)}
            placeholder={field.placeholder}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        );
    }
  };

  // Calculate grid columns based on section width
  const getGridColumns = (section: FormSection) => {
    if (section.width === '100%') {
      return 'grid-cols-1 md:grid-cols-2';
    }
    if (section.width === '50%') {
      return 'grid-cols-1 md:grid-cols-2';
    }
    if (section.width === '80%') {
      return 'grid-cols-1 md:grid-cols-2';
    }
    if (section.width === '20%') {
      return 'grid-cols-1';
    }
    return 'grid-cols-1 md:grid-cols-2';
  };

  if (loading) {
    return <Loader />;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <Button
            onClick={() => navigate(-1)}
            color="light"
            className="mb-4"
          >
            <FaArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Edit Application
              </h1>
              <p className="text-gray-600 mt-2">
                {application?.applicant_name}
              </p>
            </div>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit}>
          <div className="space-y-6">
            {formSections.map((section, sectionIndex) => (
              <Card key={sectionIndex} className="p-6">
                <div className={`grid ${getGridColumns(section)} gap-6`}>
                  {section.children.map((field) => (
                    <div 
                      key={field.id}
                      className="space-y-2"
                    >
                      {field.type !== 'file_button' && (
                        <label className="block text-sm font-medium text-gray-700">
                          {getFieldLabel(field)}
                          {field.required === 1 && (
                            <span className="text-red-500 ml-1">*</span>
                          )}
                        </label>
                      )}
                      {renderFormField(field)}
                    </div>
                  ))}
                </div>
              </Card>
            ))}
          </div>

          {/* Submit Button */}
          <div className="mt-8 flex justify-end space-x-4">
            <Button
              type="button"
              color="light"
              onClick={() => navigate(-1)}
              disabled={saving}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              color="blue"
              disabled={saving}
              className="bg-blue-600 hover:bg-blue-700"
            >
              {saving ? 'Saving...' : 'Save Changes'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ApplicationEditPage;