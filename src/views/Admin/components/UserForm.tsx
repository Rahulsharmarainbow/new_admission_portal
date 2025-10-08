// src/Frontend/UserManagement/components/UserForm.tsx
import React, { useState, useRef, ChangeEvent, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router';
import { Button } from 'flowbite-react';
import { useAuth } from 'src/hook/useAuth';
import { useAcademics } from 'src/hook/useAcademics';
import axios from 'axios';

interface FormData {
  name: string;
  email: string;
  password: string;
  number: string;
  academic_id: string;
  profile: File | null;
  profilePreview: string;
}

interface ApiResponse {
  status: boolean;
  message: string;
}

const UserForm: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { type, id } = useParams<{ type: string; id?: string }>();
  const { academics, loading: academicLoading } = useAcademics();
  
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    password: '',
    number: '',
    academic_id: '',
    profile: null,
    profilePreview: ''
  });
  
  const [loading, setLoading] = useState<boolean>(false);
  const [apiResponse, setApiResponse] = useState<ApiResponse | null>(null);
  const [isEdit, setIsEdit] = useState<boolean>(false);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const apiUrl = import.meta.env.VITE_API_URL;
  const assetUrl = import.meta.env.VITE_ASSET_URL;

  // Fetch user details for edit
  useEffect(() => {
    if (id) {
      fetchUserDetails();
      setIsEdit(true);
    }
  }, [id]);

  const fetchUserDetails = async () => {
    setLoading(true);
    try {
      const response = await axios.post(
        `${apiUrl}/SuperAdmin/Usermanagment/details-User`,
        { id: parseInt(id!) },
        {
          headers: {
            'Authorization': `Bearer ${user?.token}`,
            'accept': '/',
            'accept-language': 'en-IN,en-GB;q=0.9,en-US;q=0.8,en;q=0.7,hi;q=0.6',
            'Content-Type': 'application/json'
          }
        }
      );

      if (response.data) {
        const userData = response.data.data;
        setFormData(prev => ({
          ...prev,
          name: userData.name || '',
          email: userData.email || '',
          number: userData.number || '',
          academic_id: userData.academic_id?.toString() || '',
          profilePreview: userData.profile ? `${assetUrl}/${userData.profile}` : ''
        }));
      }
    } catch (error) {
      console.error('Error fetching user details:', error);
      setApiResponse({
        status: false,
        message: 'Failed to fetch user details'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    if (apiResponse) {
      setApiResponse(null);
    }
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({
          ...prev,
          profile: file,
          profilePreview: reader.result as string
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUpdateImage = () => {
    fileInputRef.current?.click();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setApiResponse(null);

    try {
      const formDataToSend = new FormData();
      formDataToSend.append('s_id', user?.id?.toString() || '');
      formDataToSend.append('name', formData.name);
      formDataToSend.append('email', formData.email);
      formDataToSend.append('number', formData.number);
      formDataToSend.append('type', type || '2');

      // Only append password for new users
      if (!isEdit && formData.password) {
        formDataToSend.append('password', formData.password);
      }

      // Append academic_id only for customer admin
      if (type === '3' && formData.academic_id) {
        formDataToSend.append('academic_id', formData.academic_id);
      }

      // Append profile image if selected
      if (formData.profile) {
        formDataToSend.append('profile', formData.profile);
      }

      // Append id for edit
      if (isEdit && id) {
        formDataToSend.append('id', id);
      }

      const endpoint = isEdit 
        ? `${apiUrl}/SuperAdmin/Usermanagment/Update-User`
        : `${apiUrl}/SuperAdmin/Usermanagment/Add-User`;

      const response = await axios.post(endpoint, formDataToSend, {
        headers: {
          'Authorization': `Bearer ${user?.token}`,
          'accept': '*/*',
          'accept-language': 'en-IN,en-GB;q=0.9,en-US;q=0.8,en;q=0.7,hi;q=0.6',
          'Content-Type': 'multipart/form-data'
        }
      });

      const result: ApiResponse = response.data;
      
      setApiResponse(result);
      
      if (result.status) {
        // Success case - navigate back after delay
        setTimeout(() => {
          //navigate(`/${user?.role}/user-management/${getAdminTypeRoute()}`);
          navigate(`/admin/${getAdminTypeRoute()}`);
        }, 1500);
      }

    } catch (error: any) {
      console.error('Network error:', error);
      setApiResponse({
        status: false,
        message: error.response?.data?.message || 'Network error occurred. Please try again.'
      });
    } finally {
      setLoading(false);
    }
  };

  const getAdminTypeLabel = (): string => {
    switch (type) {
      case '2': return 'Support Admin';
      case '3': return 'Customer Admin';
      case '4': return 'Sales Admin';
      default: return 'Admin';
    }
  };

  const getAdminTypeRoute = (): string => {
    switch (type) {
      case '2': return 'support-admin';
      case '3': return 'customer-admin';
      case '4': return 'sales-admin';
      default: return 'support-admin';
    }
  };

  const handleCancel = () => {
    //navigate(`/${user?.role}/user-management/${getAdminTypeRoute()}`);
    navigate(`/admin/${getAdminTypeRoute()}`);
  };

  return (
    <div className="min-h-screen bg-gray-100 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        
        {/* Header Box */}
        <div className="bg-white rounded-lg border border-gray-300 mb-6 shadow-sm">
          <div className="px-6 py-4">
            <h1 className="text-xl font-semibold text-gray-800">
              {isEdit ? 'Edit' : 'Add'} {getAdminTypeLabel()}
            </h1>
          </div>
        </div>

        {/* API Response Message */}
        {apiResponse && (
          <div className={`mb-6 p-4 rounded-lg border ${
            apiResponse.status 
              ? 'bg-green-50 border-green-200 text-green-800' 
              : 'bg-red-50 border-red-200 text-red-800'
          }`}>
            <div className="flex items-center">
              {apiResponse.status ? (
                <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              ) : (
                <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              )}
              <span className="font-medium">{apiResponse.message}</span>
            </div>
          </div>
        )}

        {/* Form Container */}
        <div className="bg-white rounded-lg border border-gray-300 shadow-sm">
          <form onSubmit={handleSubmit} className="p-6">
            
            {/* First Row - Two columns */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              {/* Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Full Name *
                </label>
                <div className="border border-gray-400 rounded-md">
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2.5 text-sm border-none outline-none"
                    required
                    disabled={loading}
                    placeholder="Enter full name"
                  />
                </div>
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address *
                </label>
                <div className="border border-gray-400 rounded-md">
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2.5 text-sm border-none outline-none"
                    required
                    disabled={loading || isEdit}
                    placeholder="Enter email address"
                  />
                </div>
              </div>
            </div>

            {/* Second Row - Two columns */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              {/* Phone Number */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Phone Number *
                </label>
                <div className="border border-gray-400 rounded-md">
                  <input
                    type="tel"
                    name="number"
                    value={formData.number}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2.5 text-sm border-none outline-none"
                    required
                    disabled={loading}
                    placeholder="Enter phone number"
                  />
                </div>
              </div>

              {/* Password - Only for new users */}
              {!isEdit && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Password *
                  </label>
                  <div className="border border-gray-400 rounded-md">
                    <input
                      type="password"
                      name="password"
                      value={formData.password}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2.5 text-sm border-none outline-none"
                      required={!isEdit}
                      disabled={loading}
                      placeholder="Enter password"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Academic Dropdown - Only for Customer Admin */}
            {type === '3' && (
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Academic Institution *
                </label>
                <div className="border border-gray-400 rounded-md">
                  <select
                    name="academic_id"
                    value={formData.academic_id}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2.5 text-sm border-none outline-none bg-transparent"
                    required={type === '3'}
                    disabled={loading || academicLoading}
                  >
                    <option value="">Select Academic Institution</option>
                    {academics.map((academic) => (
                      <option key={academic.id} value={academic.id}>
                        {academic.academic_name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            )}

            {/* Profile Image Upload */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Profile Picture {!isEdit && '*'}
              </label>
              <div className="border border-gray-400 rounded-md p-6">
                <div className="flex flex-col items-center justify-center space-y-4">
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    accept="image/*"
                    className="hidden"
                    disabled={loading}
                  />
                  <button
                    type="button"
                    onClick={handleUpdateImage}
                    disabled={loading}
                    className="px-6 py-2.5 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors disabled:bg-blue-400 disabled:cursor-not-allowed"
                  >
                    Update Image
                  </button>
                  <div className="w-32 h-32 border-2 border-dashed border-gray-300 rounded-md flex items-center justify-center bg-gray-50 overflow-hidden">
                    {formData.profilePreview ? (
                      <img
                        src={formData.profilePreview}
                        alt="Profile preview"
                        className="w-full h-full object-cover rounded-md"
                      />
                    ) : (
                      <div className="text-center">
                        <svg className="w-8 h-8 text-gray-400 mx-auto mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                        <span className="text-gray-400 text-xs">No Image Selected</span>
                      </div>
                    )}
                  </div>
                  <p className="text-xs text-gray-500 text-center">
                    Recommended: Square image, 500x500 pixels, max 2MB
                  </p>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="pt-6 border-t border-gray-200 flex justify-end space-x-4">
              <Button
                type="button"
                color="gray"
                onClick={handleCancel}
                disabled={loading}
                className="px-6 py-2.5"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                color="blue"
                disabled={loading}
                className="px-6 py-2.5"
              >
                {loading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    {isEdit ? 'Updating...' : 'Creating...'}
                  </>
                ) : (
                  `${isEdit ? 'Update' : 'Create'} ${getAdminTypeLabel()}`
                )}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default UserForm;

























// import React, { useState, useRef, ChangeEvent, useEffect } from 'react';
// import { useNavigate, useParams } from 'react-router';
// import { useLocation } from 'react-router-dom';
// import { Button } from 'flowbite-react';
// import axios from 'axios';
// import { useAuth } from 'src/hook/useAuth';
// import { useAcademics } from 'src/hook/useAcademics';

// interface FormData {
//   name: string;
//   email: string;
//   password: string;
//   number: string;
//   academic_id: string;
//   profile: File | null;
//   profilePreview: string;
// }

// interface ApiResponse {
//   status: boolean;
//   message: string;
// }

// interface UserDetails {
//   id: number;
//   name: string;
//   email: string;
//   number: string;
//   academic_id: number | null;
//   profile?: string;
// }

// const UserForm: React.FC = () => {
//   const navigate = useNavigate();
//   const location = useLocation();
//   const { id } = useParams();
//   const { user } = useAuth();
//   const { academics, loading: academicLoading } = useAcademics();
  
//   const isEdit = Boolean(id);
//   const { adminType, adminTypeLabel } = location.state || { 
//     adminType: 2, 
//     adminTypeLabel: 'Support Admin' 
//   };

//   const [formData, setFormData] = useState<FormData>({
//     name: '',
//     email: '',
//     password: '',
//     number: '',
//     academic_id: '',
//     profile: null,
//     profilePreview: ''
//   });

//   const [loading, setLoading] = useState<boolean>(false);
//   const [apiResponse, setApiResponse] = useState<ApiResponse | null>(null);
//   const [userDetails, setUserDetails] = useState<UserDetails | null>(null);
  
//   const fileInputRef = useRef<HTMLInputElement>(null);
  
//   const apiUrl = import.meta.env.VITE_API_URL;
//   const assetUrl = import.meta.env.VITE_ASSET_URL;

//   // Fetch user details for edit mode
//   useEffect(() => {
//     if (isEdit && id) {
//       fetchUserDetails();
//     }
//   }, [isEdit, id]);

//   const fetchUserDetails = async () => {
//     try {
//       const response = await axios.post(
//         `${apiUrl}/SuperAdmin/Usermanagment/details-User`,
//         { id: parseInt(id!) },
//         {
//           headers: {
//             'Authorization': `Bearer ${user?.token}`,
//             'accept': '/',
//             'accept-language': 'en-IN,en-GB;q=0.9,en-US;q=0.8,en;q=0.7,hi;q=0.6',
//             'Content-Type': 'application/json'
//           }
//         }
//       );

//       if (response.data) {
//         const userData = response.data;
//         setUserDetails(userData);
//         setFormData({
//           name: userData.name || '',
//           email: userData.email || '',
//           password: '', // Don't pre-fill password for security
//           number: userData.number || '',
//           academic_id: userData.academic_id?.toString() || '',
//           profile: null,
//           profilePreview: userData.profile ? `${assetUrl}/${userData.profile}` : ''
//         });
//       }
//     } catch (error) {
//       console.error('Error fetching user details:', error);
//       setApiResponse({
//         status: false,
//         message: 'Failed to load user details'
//       });
//     }
//   };

//   const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
//     const { name, value } = e.target;
//     setFormData(prev => ({
//       ...prev,
//       [name]: value
//     }));
//     if (apiResponse) {
//       setApiResponse(null);
//     }
//   };

//   const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
//     const file = e.target.files?.[0];
//     if (file) {
//       const reader = new FileReader();
//       reader.onloadend = () => {
//         setFormData(prev => ({
//           ...prev,
//           profile: file,
//           profilePreview: reader.result as string
//         }));
//       };
//       reader.readAsDataURL(file);
//     }
//   };

//   const handleUpdateImage = () => {
//     fileInputRef.current?.click();
//   };

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setLoading(true);
//     setApiResponse(null);

//     try {
//       const formDataToSend = new FormData();
//       formDataToSend.append('s_id', user?.id?.toString() || '');
//       formDataToSend.append('name', formData.name);
//       formDataToSend.append('email', formData.email);
//       formDataToSend.append('number', formData.number);
//       formDataToSend.append('type', adminType.toString());

//       // Only append password if it's provided (for add) or changed (for edit)
//       if (formData.password) {
//         formDataToSend.append('password', formData.password);
//       }

//       // Append academic_id only for Customer Admin
//       if (adminType === 3 && formData.academic_id) {
//         formDataToSend.append('academic_id', formData.academic_id);
//       }

//       // Append profile image if selected
//       if (formData.profile) {
//         formDataToSend.append('profile', formData.profile);
//       }

//       // For edit mode, append the user ID
//       if (isEdit && id) {
//         formDataToSend.append('id', id);
//       }

//       const endpoint = isEdit 
//         ? `${apiUrl}/SuperAdmin/Usermanagment/Update-User`
//         : `${apiUrl}/SuperAdmin/Usermanagment/Add-User`;

//       const response = await axios.post(endpoint, formDataToSend, {
//         headers: {
//           'Authorization': `Bearer ${user?.token}`,
//           'accept': '*/*',
//           'accept-language': 'en-IN,en-GB;q=0.9,en-US;q=0.8,en;q=0.7,hi;q=0.6',
//           'Content-Type': 'multipart/form-data'
//         }
//       });

//       const result: ApiResponse = await response.data;
      
//       setApiResponse(result);
      
//       if (result.status) {
//         // Success case - navigate back after delay
//         setTimeout(() => {
//           navigate(-1);
//         }, 1500);
//       }

//     } catch (error: any) {
//       console.error('API Error:', error);
//       setApiResponse({
//         status: false,
//         message: error.response?.data?.message || 'Network error occurred. Please try again.'
//       });
//     } finally {
//       setLoading(false);
//     }
//   };

//   const getButtonText = () => {
//     if (loading) {
//       return isEdit ? 'Updating...' : 'Creating...';
//     }
//     return isEdit ? 'Update' : 'Add';
//   };

//   return (
//     <div className="min-h-screen bg-gray-100 py-8 px-4">
//       <div className="max-w-4xl mx-auto">
        
//         {/* Header Box */}
//         <div className="bg-white rounded-lg border border-gray-300 mb-6 shadow-sm">
//           <div className="px-6 py-4">
//             <div className="flex items-center justify-between">
//               <div>
//                 <h1 className="text-xl font-semibold text-gray-800">
//                   {isEdit ? 'Edit' : 'Add'} {adminTypeLabel}
//                 </h1>
//                 <p className="text-gray-600 mt-1">
//                   {isEdit ? 'Update user information' : 'Create a new user account'}
//                 </p>
//               </div>
//               <Button
//                 color="gray"
//                 onClick={() => navigate(-1)}
//                 className="whitespace-nowrap"
//               >
//                 Back to List
//               </Button>
//             </div>
//           </div>
//         </div>

//         {/* API Response Message */}
//         {apiResponse && (
//           <div className={`mb-6 p-4 rounded-lg border ${
//             apiResponse.status 
//               ? 'bg-green-50 border-green-200 text-green-800' 
//               : 'bg-red-50 border-red-200 text-red-800'
//           }`}>
//             <div className="flex items-center">
//               {apiResponse.status ? (
//                 <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
//                   <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
//                 </svg>
//               ) : (
//                 <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
//                   <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
//                 </svg>
//               )}
//               <span className="font-medium">{apiResponse.message}</span>
//             </div>
//           </div>
//         )}

//         {/* Form Container */}
//         <div className="bg-white rounded-lg border border-gray-300 shadow-sm">
//           <form onSubmit={handleSubmit} className="p-6">
            
//             {/* First Row - Two columns */}
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
//               {/* Name */}
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-2">
//                   Full Name *
//                 </label>
//                 <div className="border border-gray-400 rounded-md">
//                   <input
//                     type="text"
//                     name="name"
//                     value={formData.name}
//                     onChange={handleInputChange}
//                     className="w-full px-3 py-2.5 text-sm border-none outline-none"
//                     required
//                     disabled={loading}
//                     placeholder="Enter full name"
//                   />
//                 </div>
//               </div>

//               {/* Email */}
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-2">
//                   Email Address *
//                 </label>
//                 <div className="border border-gray-400 rounded-md">
//                   <input
//                     type="email"
//                     name="email"
//                     value={formData.email}
//                     onChange={handleInputChange}
//                     className="w-full px-3 py-2.5 text-sm border-none outline-none"
//                     required
//                     disabled={loading}
//                     placeholder="Enter email address"
//                   />
//                 </div>
//               </div>
//             </div>

//             {/* Second Row - Two columns */}
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
//               {/* Phone Number */}
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-2">
//                   Phone Number *
//                 </label>
//                 <div className="border border-gray-400 rounded-md">
//                   <input
//                     type="tel"
//                     name="number"
//                     value={formData.number}
//                     onChange={handleInputChange}
//                     className="w-full px-3 py-2.5 text-sm border-none outline-none"
//                     required
//                     disabled={loading}
//                     placeholder="Enter phone number"
//                   />
//                 </div>
//               </div>

//               {/* Admin Password */}
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-2">
//                   Admin Password {!isEdit && '*'}
//                 </label>
//                 <div className="border border-gray-400 rounded-md">
//                   <input
//                     type="password"
//                     name="password"
//                     value={formData.password}
//                     onChange={handleInputChange}
//                     className="w-full px-3 py-2.5 text-sm border-none outline-none"
//                     required={!isEdit} // Required only for add
//                     disabled={loading}
//                     placeholder={isEdit ? "Leave blank to keep current" : "Enter password"}
//                   />
//                 </div>
//                 {isEdit && (
//                   <p className="text-xs text-gray-500 mt-1">Leave blank to keep current password</p>
//                 )}
//               </div>
//             </div>

//             {/* Academic Dropdown - Only for Customer Admin */}
//             {adminType === 3 && (
//               <div className="mb-6">
//                 <label className="block text-sm font-medium text-gray-700 mb-2">
//                   Academic Institution *
//                 </label>
//                 <div className="border border-gray-400 rounded-md">
//                   <select
//                     name="academic_id"
//                     value={formData.academic_id}
//                     onChange={handleInputChange}
//                     className="w-full px-3 py-2.5 text-sm border-none outline-none bg-transparent"
//                     required
//                     disabled={loading || academicLoading}
//                   >
//                     <option value="">Select Academic Institution</option>
//                     {academics.map((academic) => (
//                       <option key={academic.id} value={academic.id}>
//                         {academic.academic_name}
//                       </option>
//                     ))}
//                   </select>
//                 </div>
//               </div>
//             )}

//             {/* Profile Image Upload */}
//             <div className="mb-6">
//               <label className="block text-sm font-medium text-gray-700 mb-2">
//                 Profile Image {!isEdit && '*'}
//               </label>
//               <div className="border border-gray-400 rounded-md p-4">
//                 <div className="flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0">
//                   <div className="flex items-center space-x-4">
//                     <div className="w-20 h-20 border-2 border-dashed border-gray-300 rounded-md flex items-center justify-center bg-gray-50">
//                       {formData.profilePreview ? (
//                         <img
//                           src={formData.profilePreview}
//                           alt="Profile preview"
//                           className="w-full h-full object-cover rounded-md"
//                         />
//                       ) : (
//                         <span className="text-gray-400 text-xs text-center">No Image</span>
//                       )}
//                     </div>
//                     <div>
//                       <p className="text-sm text-gray-600 mb-2">Upload profile picture</p>
//                       <p className="text-xs text-gray-500">JPG, PNG, GIF (Max 5MB)</p>
//                     </div>
//                   </div>
                  
//                   <input
//                     type="file"
//                     ref={fileInputRef}
//                     onChange={handleFileChange}
//                     accept="image/*"
//                     className="hidden"
//                     disabled={loading}
//                   />
//                   <button
//                     type="button"
//                     onClick={handleUpdateImage}
//                     disabled={loading}
//                     className="px-6 py-2.5 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors disabled:bg-blue-400 disabled:cursor-not-allowed whitespace-nowrap"
//                   >
//                     {formData.profilePreview ? 'Change Image' : 'Upload Image'}
//                   </button>
//                 </div>
//               </div>
//             </div>

//             {/* Submit Button */}
//             <div className="pt-6 border-t border-gray-200">
//               <button
//                 type="submit"
//                 disabled={loading}
//                 className="px-8 py-2.5 bg-green-600 text-white text-sm font-medium rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 transition-colors disabled:bg-green-400 disabled:cursor-not-allowed flex items-center justify-center min-w-[120px]"
//               >
//                 {loading ? (
//                   <>
//                     <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
//                       <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
//                       <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
//                     </svg>
//                     {getButtonText()}
//                   </>
//                 ) : (
//                   getButtonText()
//                 )}
//               </button>
//             </div>
//           </form>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default UserForm;