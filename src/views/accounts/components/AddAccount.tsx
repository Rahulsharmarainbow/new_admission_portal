// import React, { useState, useRef, ChangeEvent } from 'react';

// interface FormData {
//   organizationType: string;
//   organizationName: string;
//   clientEmail: string;
//   whatsappTemplate: string;
//   emailTemplate: string;
//   smsTemplate: string;
//   logo: File | null;
//   logoPreview: string;
// }

// const AddAccount: React.FC = () => {
//   const [formData, setFormData] = useState<FormData>({
//     organizationType: 'College',
//     organizationName: 'Demo College Hydrabad',
//     clientEmail: 'rainbowcroprise@gmail.com',
//     whatsappTemplate: 'Dear (#name#), Your application for FADEE-2022 has been submitted success',
//     emailTemplate: 'Dear (#name#), Your application for FADEE-2022 has been submitted success',
//     smsTemplate: 'Dear (#name#), Your application for FADEE-2022 has been submitted success',
//     logo: null,
//     logoPreview: ''
//   });

//   const fileInputRef = useRef<HTMLInputElement>(null);

//   const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
//     const { name, value } = e.target;
//     setFormData(prev => ({
//       ...prev,
//       [name]: value
//     }));
//   };

//   const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
//     const file = e.target.files?.[0];
//     if (file) {
//       const reader = new FileReader();
//       reader.onloadend = () => {
//         setFormData(prev => ({
//           ...prev,
//           logo: file,
//           logoPreview: reader.result as string
//         }));
//       };
//       reader.readAsDataURL(file);
//     }
//   };

//   const handleUpdateImage = () => {
//     fileInputRef.current?.click();
//   };

//   const handleSubmit = (e: React.FormEvent) => {
//     e.preventDefault();
//     console.log('Form submitted:', formData);
//     // Handle form submission logic here
//   };

//   return (
//     <div className="min-h-screen bg-gray-100 py-8 px-4">
//       <div className="max-w-6xl mx-auto">
        
//         {/* Header Box */}
//         <div className="bg-white rounded-lg border border-gray-300 mb-6 shadow-sm">
//           <div className="px-6 py-4">
//             <h1 className="text-xl font-semibold text-gray-800">Add Account</h1>
//           </div>
//         </div>

//         {/* Form Container */}
//         <div className="bg-white rounded-lg border border-gray-300 shadow-sm">
//           <form onSubmit={handleSubmit} className="p-6">
            
//             {/* First Row - Three boxes side by side */}
//             <div className="grid grid-cols-3 gap-4 mb-6">
//               {/* Type of Organization */}
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-2">
//                   Type of the Organization *
//                 </label>
//                 <div className="border border-gray-400 rounded-md">
//                   <select
//                     name="organizationType"
//                     value={formData.organizationType}
//                     onChange={handleInputChange}
//                     className="w-full px-3 py-2.5 text-sm border-none outline-none bg-transparent"
//                     required
//                   >
//                     <option value="College">College</option>
//                     <option value="University">University</option>
//                     <option value="School">School</option>
//                     <option value="Institute">Institute</option>
//                   </select>
//                 </div>
//               </div>

//               {/* Name of Organization */}
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-2">
//                   Name of the Organization *
//                 </label>
//                 <div className="border border-gray-400 rounded-md">
//                   <input
//                     type="text"
//                     name="organizationName"
//                     value={formData.organizationName}
//                     onChange={handleInputChange}
//                     className="w-full px-3 py-2.5 text-sm border-none outline-none"
//                     required
//                   />
//                 </div>
//               </div>

//               {/* Client Email */}
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-2">
//                   Client Email Id *
//                 </label>
//                 <div className="border border-gray-400 rounded-md">
//                   <input
//                     type="email"
//                     name="clientEmail"
//                     value={formData.clientEmail}
//                     onChange={handleInputChange}
//                     className="w-full px-3 py-2.5 text-sm border-none outline-none"
//                     required
//                   />
//                 </div>
//               </div>
//             </div>

//             {/* Second Row - Two boxes side by side */}
//             <div className="grid grid-cols-2 gap-4 mb-6">
//               {/* WhatsApp Template */}
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-2">
//                   WhatsApp Template *
//                 </label>
//                 <div className="border border-gray-400 rounded-md">
//                   <textarea
//                     name="whatsappTemplate"
//                     value={formData.whatsappTemplate}
//                     onChange={handleInputChange}
//                     rows={4}
//                     className="w-full px-3 py-2.5 text-sm border-none outline-none resize-none"
//                     required
//                   />
//                 </div>
//               </div>

//               {/* SMS Template */}
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-2">
//                   SMS Template *
//                 </label>
//                 <div className="border border-gray-400 rounded-md">
//                   <textarea
//                     name="smsTemplate"
//                     value={formData.smsTemplate}
//                     onChange={handleInputChange}
//                     rows={4}
//                     className="w-full px-3 py-2.5 text-sm border-none outline-none resize-none"
//                     required
//                   />
//                 </div>
//               </div>
//             </div>

//             {/* Third Row - Two boxes side by side */}
//             <div className="grid grid-cols-2 gap-4 mb-6">
//               {/* Email Template */}
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-2">
//                   Email Template *
//                 </label>
//                 <div className="border border-gray-400 rounded-md">
//                   <textarea
//                     name="emailTemplate"
//                     value={formData.emailTemplate}
//                     onChange={handleInputChange}
//                     rows={4}
//                     className="w-full px-3 py-2.5 text-sm border-none outline-none resize-none"
//                     required
//                   />
//                 </div>
//               </div>

//               {/* Upload Logo */}
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-2">
//                   Upload Logo Here *
//                 </label>
//                 <div className="border border-gray-400 rounded-md p-4">
//                   <div className="flex flex-col items-center justify-center space-y-4">
//                     <input
//                       type="file"
//                       ref={fileInputRef}
//                       onChange={handleFileChange}
//                       accept="image/*"
//                       className="hidden"
//                     />
//                     <button
//                       type="button"
//                       onClick={handleUpdateImage}
//                       className="px-6 py-2.5 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
//                     >
//                       Update Image
//                     </button>
//                     <div className="w-24 h-24 border-2 border-dashed border-gray-300 rounded-md flex items-center justify-center bg-gray-50">
//                       {formData.logoPreview ? (
//                         <img
//                           src={formData.logoPreview}
//                           alt="Logo preview"
//                           className="w-full h-full object-cover rounded-md"
//                         />
//                       ) : (
//                         <span className="text-gray-400 text-xs text-center">No Image Selected</span>
//                       )}
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             </div>

//             {/* Submit Button */}
//             <div className="pt-4 border-t border-gray-200">
//               <button
//                 type="submit"
//                 className="px-8 py-2.5 bg-green-600 text-white text-sm font-medium rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 transition-colors"
//               >
//                 Save Changes
//               </button>
//             </div>
//           </form>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default AddAccount;








import React, { useState, useRef, ChangeEvent } from 'react';

interface FormData {
  organizationType: string;
  organizationName: string;
  clientEmail: string;
  whatsappTemplate: string;
  emailTemplate: string;
  smsTemplate: string;
  logo: File | null;
  logoPreview: string;
}

interface ApiResponse {
  status: boolean;
  message: string;
}

const AddAccount: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({
    organizationType: 'College',
    organizationName: 'Demo College Hydrabad',
    clientEmail: 'rainbowcroprise@gmail.com',
    whatsappTemplate: 'Dear (#name#), Your application for FADEE-2022 has been submitted success',
    emailTemplate: 'Dear (#name#), Your application for FADEE-2022 has been submitted success',
    smsTemplate: 'Dear (#name#), Your application for FADEE-2022 has been submitted success',
    logo: null,
    logoPreview: ''
  });

  const [loading, setLoading] = useState<boolean>(false);
  const [apiResponse, setApiResponse] = useState<ApiResponse | null>(null);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // Bearer token from your API
  const BEARER_TOKEN = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJodHRwczovL3JhaW5ib3dzb2x1dGlvbmFuZHRlY2hub2xvZ3kuY29tL05ld0FkbWlzc2lvblBvcnRhbC9wdWJsaWMvYXBpL2F1dGgvdmVyaWZ5LW90cCIsImlhdCI6MTc1OTMwNjA1NywiZXhwIjoxNzYxODk4MDU3LCJuYmYiOjE3NTkzMDYwNTcsImp0aSI6IlRyUmhvcHdvYkJFNHBleHUiLCJzdWIiOiI0MzQiLCJlbWFpbCI6InNoYWFubXNrNEBnbWFpbC5jb20iLCJsb2dpbl90eXBlIjoxLCJyb2xlIjoiU1VQRVJBRE1JTiJ9.uU1-gvBhIrbSrnJ-2rvsBmRuGzpyE4DiazagpC61sZQ';

  const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear API response when user starts typing again
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
          logo: file,
          logoPreview: reader.result as string
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
      // Map form data to API expected format
      const apiPayload = {
        s_id: "6", // You might want to make this dynamic
        select_type: formData.organizationType === 'College' ? '2' : '1', // Adjust based on your types
        email: formData.clientEmail,
        academic_name: formData.organizationName,
        academic_address: "Andheri West, Mumbai", // You might want to add this field to your form
        whatsappTemplate: formData.whatsappTemplate,
        emailTemplate: formData.emailTemplate,
        smsTemplate: formData.smsTemplate
      };

      const response = await fetch('https://rainbowsolutionandtechnology.com/NewAdmissionPortal/public/api/SuperAdmin/Accounts/add-demo-account', {
        method: 'POST',
        headers: {
          'accept': '*/*',
          'accept-language': 'en-IN,en-GB;q=0.9,en-US;q=0.8,en;q=0.7,hi;q=0.6',
          'origin': 'http://localhost:3010',
          'priority': 'u=1, i',
          'referer': 'http://localhost:3010/',
          'sec-ch-ua': '"Chromium";v="140", "Not=A?Brand";v="24", "Google Chrome";v="140"',
          'sec-ch-ua-mobile': '?0',
          'sec-ch-ua-platform': '"Windows"',
          'sec-fetch-dest': 'empty',
          'sec-fetch-mode': 'cors',
          'sec-fetch-site': 'cross-site',
          'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36',
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${BEARER_TOKEN}`
        },
        body: JSON.stringify(apiPayload)
      });

      const result: ApiResponse = await response.json();
      
      setApiResponse(result);
      
      if (result.status) {
        // Success case - reset form or show success message
        console.log('Account created successfully:', result.message);
        // You can reset the form here if needed
        // setFormData({...initialState});
      } else {
        // Error case - show error message
        console.error('API Error:', result.message);
      }

    } catch (error) {
      console.error('Network error:', error);
      setApiResponse({
        status: false,
        message: 'Network error occurred. Please try again.'
      });
    } finally {
      setLoading(false);
    }
  };

  // Function to map organization type to select_type
  const getSelectType = (orgType: string): string => {
    const typeMap: { [key: string]: string } = {
      'College': '2',
      'University': '1',
      'School': '3',
      'Institute': '4'
    };
    return typeMap[orgType] || '2';
  };

  return (
    <div className="min-h-screen bg-gray-100 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        
        {/* Header Box */}
        <div className="bg-white rounded-lg border border-gray-300 mb-6 shadow-sm">
          <div className="px-6 py-4">
            <h1 className="text-xl font-semibold text-gray-800">Add Account</h1>
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
            
            {/* First Row - Three boxes side by side */}
            <div className="grid grid-cols-3 gap-4 mb-6">
              {/* Type of Organization */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Type of the Organization *
                </label>
                <div className="border border-gray-400 rounded-md">
                  <select
                    name="organizationType"
                    value={formData.organizationType}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2.5 text-sm border-none outline-none bg-transparent"
                    required
                    disabled={loading}
                  >
                    <option value="College">College</option>
                    <option value="University">University</option>
                    <option value="School">School</option>
                    <option value="Institute">Institute</option>
                  </select>
                </div>
              </div>

              {/* Name of Organization */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Name of the Organization *
                </label>
                <div className="border border-gray-400 rounded-md">
                  <input
                    type="text"
                    name="organizationName"
                    value={formData.organizationName}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2.5 text-sm border-none outline-none"
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
                <div className="border border-gray-400 rounded-md">
                  <input
                    type="email"
                    name="clientEmail"
                    value={formData.clientEmail}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2.5 text-sm border-none outline-none"
                    required
                    disabled={loading}
                  />
                </div>
              </div>
            </div>

            {/* Second Row - Two boxes side by side */}
            <div className="grid grid-cols-2 gap-4 mb-6">
              {/* WhatsApp Template */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  WhatsApp Template *
                </label>
                <div className="border border-gray-400 rounded-md">
                  <textarea
                    name="whatsappTemplate"
                    value={formData.whatsappTemplate}
                    onChange={handleInputChange}
                    rows={4}
                    className="w-full px-3 py-2.5 text-sm border-none outline-none resize-none"
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
                <div className="border border-gray-400 rounded-md">
                  <textarea
                    name="smsTemplate"
                    value={formData.smsTemplate}
                    onChange={handleInputChange}
                    rows={4}
                    className="w-full px-3 py-2.5 text-sm border-none outline-none resize-none"
                    required
                    disabled={loading}
                  />
                </div>
              </div>
            </div>

            {/* Third Row - Two boxes side by side */}
            <div className="grid grid-cols-2 gap-4 mb-6">
              {/* Email Template */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email Template *
                </label>
                <div className="border border-gray-400 rounded-md">
                  <textarea
                    name="emailTemplate"
                    value={formData.emailTemplate}
                    onChange={handleInputChange}
                    rows={4}
                    className="w-full px-3 py-2.5 text-sm border-none outline-none resize-none"
                    required
                    disabled={loading}
                  />
                </div>
              </div>

              {/* Upload Logo */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Upload Logo Here *
                </label>
                <div className="border border-gray-400 rounded-md p-4">
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
                    <div className="w-24 h-24 border-2 border-dashed border-gray-300 rounded-md flex items-center justify-center bg-gray-50">
                      {formData.logoPreview ? (
                        <img
                          src={formData.logoPreview}
                          alt="Logo preview"
                          className="w-full h-full object-cover rounded-md"
                        />
                      ) : (
                        <span className="text-gray-400 text-xs text-center">No Image Selected</span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-4 border-t border-gray-200">
              <button
                type="submit"
                disabled={loading}
                className="px-8 py-2.5 bg-green-600 text-white text-sm font-medium rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 transition-colors disabled:bg-green-400 disabled:cursor-not-allowed flex items-center justify-center"
              >
                {loading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Creating Account...
                  </>
                ) : (
                  'Save Changes'
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddAccount;