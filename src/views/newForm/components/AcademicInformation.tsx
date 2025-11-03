// import React, { useEffect } from "react";
// import { Card, Label, Select, TextInput, Textarea, FileInput } from "flowbite-react";
// import { FormData } from "src/types/formTypes";
// import { fetchDistricts } from "src/services/apiService";

// interface AcademicInformationProps {
//   formData: FormData;
//   updateFormData: (updates: Partial<FormData>) => void;
// }

// const AcademicInformation: React.FC<AcademicInformationProps> = ({ formData, updateFormData }) => {
//   const assetUrl = import.meta.env.VITE_ASSET_URL;
  
//   // Fetch districts when state changes
//   useEffect(() => {
//     const loadDistricts = async () => {
//       if (formData.selectState) {
//         const districtsData = await fetchDistricts(formData.selectState);
//         updateFormData({ 
//           districts: districtsData
//         });
//       }
//     };

//     loadDistricts();
//   }, [formData.selectState]);

//   const handleStateChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
//     const stateId = e.target.value;
//     updateFormData({ 
//       selectState: stateId,
//       selectDistrict: "" // Reset district when state changes
//     });
//   };

//   const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const files = e.target.files;
//     if (files && files.length > 0) {
//       const file = files[0];
//       updateFormData({ academicLogo: file });
      
//       const reader = new FileReader();
//       reader.onloadend = () => {
//         updateFormData({ previewImage: reader.result as string });
//       };
//       reader.readAsDataURL(file);
//     }
//   };

//   // Get logo URL - use uploaded preview or existing academic logo
//   const getLogoUrl = () => {
//     if (formData.previewImage) {
//       return formData.previewImage;
//     }
//     if (formData.academicData?.academic_logo) {
//       return `${assetUrl}/${formData.academicData.academic_logo}`;
//     }
//     return null;
//   };

//   const logoUrl = getLogoUrl();

//   return (
//     <div className="space-y-6">
//       <Card>
//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//           {/* Type of Organization */}
//           <div>
//             <Label htmlFor="selectType" className="mb-2 block">
//               Type of the Organization <span className="text-red-600">*</span>
//             </Label>
//             <Select
//               id="selectType"
//               value={formData.selectType}
//               onChange={(e) => updateFormData({ selectType: e.target.value })}
//               required
//               className="w-full"
//             >
//               <option value="">Please Select</option>
//               <option value="1">School</option>
//               <option value="2">College</option>
//               <option value="3">University</option>
//             </Select>
//           </div>

//           {/* Subtype (only for University) */}
//           {formData.selectType === "3" && (
//             <div>
//               <Label htmlFor="selectSubtype" className="mb-2 block">
//                 Subtype of Organization <span className="text-red-600">*</span>
//               </Label>
//               <Select
//                 id="selectSubtype"
//                 value={formData.selectSubtype}
//                 onChange={(e) => updateFormData({ selectSubtype: e.target.value })}
//                 required
//                 className="w-full"
//               >
//                 <option value="">Please Select</option>
//                 <option value="Arts College">Arts College</option>
//                 <option value="Law University">Law University</option>
//               </Select>
//             </div>
//           )}

//           {/* Academic Name */}
//           <div className={formData.selectType === "3" ? "" : "md:col-span-2"}>
//             <Label htmlFor="academicName" className="mb-2 block">
//               Name of the Organization <span className="text-red-600">*</span>
//             </Label>
//             <TextInput
//               id="academicName"
//               value={formData.academicName}
//               onChange={(e) => updateFormData({ academicName: e.target.value })}
//               required
//               className="w-full"
//             />
//           </div>

//           {/* State */}
//           <div>
//             <Label htmlFor="selectState" className="mb-2 block">
//               Select State <span className="text-red-600">*</span>
//             </Label>
//             <Select
//               id="selectState"
//               value={formData.selectState}
//               onChange={handleStateChange}
//               required
//               className="w-full"
//             >
//               <option value="">Please Select</option>
//               {formData.states.map((state) => (
//                 <option key={state.state_id} value={state.state_id}>
//                   {state.state_title}
//                 </option>
//               ))}
//             </Select>
//           </div>

//           {/* District */}
//           <div>
//             <Label htmlFor="selectDistrict" className="mb-2 block">
//               Select District <span className="text-red-600">*</span>
//             </Label>
//             <Select
//               id="selectDistrict"
//               value={formData.selectDistrict}
//               onChange={(e) => updateFormData({ selectDistrict: e.target.value })}
//               required
//               disabled={!formData.selectState}
//               className="w-full"
//             >
//               <option value="">Please Select</option>
//               {formData.districts.map((district) => (
//                 <option key={district.id} value={district.id}>
//                   {district.district_title}
//                 </option>
//               ))}
//             </Select>
//           </div>

//           {/* Pincode */}
//           <div>
//             <Label htmlFor="pincode" className="mb-2 block">
//               Enter Pincode <span className="text-red-600">*</span>
//             </Label>
//             <TextInput
//               id="pincode"
//               type="number"
//               value={formData.Pincode}
//               onChange={(e) => updateFormData({ Pincode: e.target.value })}
//               required
//               className="w-full"
//             />
//           </div>

//           {/* Area */}
//           <div>
//             <Label htmlFor="area" className="mb-2 block">Enter Area</Label>
//             <TextInput
//               id="area"
//               value={formData.area}
//               onChange={(e) => updateFormData({ area: e.target.value })}
//               className="w-full"
//             />
//           </div>

//           {/* Website URL */}
//           <div>
//             <Label htmlFor="website_url" className="mb-2 block">
//               Website Url <span className="text-red-600">*</span>
//             </Label>
//             <TextInput
//               id="website_url"
//               type="url"
//               value={formData.website_url}
//               onChange={(e) => updateFormData({ website_url: e.target.value })}
//               required
//               className="w-full"
//             />
//           </div>

//           {/* Primary Email */}
//           <div>
//             <Label htmlFor="primary_email" className="mb-2 block">
//               Primary Email for Main Account <span className="text-red-600">*</span>
//             </Label>
//             <TextInput
//               id="primary_email"
//               type="email"
//               value={formData.primary_email}
//               onChange={(e) => updateFormData({ primary_email: e.target.value })}
//               required
//               className="w-full"
//             />
//           </div>

//           {/* Full Address */}
//           <div className="md:col-span-2">
//             <Label htmlFor="academicAddress" className="mb-2 block">Enter Full Address</Label>
//             <TextInput
//               id="academicAddress"
//               value={formData.academicAddress}
//               onChange={(e) => updateFormData({ academicAddress: e.target.value })}
//               className="w-full"
//             />
//           </div>

//           {/* Description */}
//           <div className="md:col-span-3">
//             <Label htmlFor="academicDescription" className="mb-2 block">Enter Description</Label>
//             <Textarea
//               id="academicDescription"
//               value={formData.academicDescription}
//               onChange={(e) => updateFormData({ academicDescription: e.target.value })}
//               rows={4}
//               className="w-full resize-vertical"
//             />
//           </div>

//           {/* Logo Upload */}
//           <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 md:col-span-3 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
//             {logoUrl && (
//               <div className="flex-shrink-0">
//                 <img
//                   src={logoUrl}
//                   alt="Organization Logo"
//                   className="w-32 h-32 object-contain rounded-lg border border-gray-300 dark:border-gray-600"
//                 />
//               </div>
//             )}
//             <div className="flex-1 min-w-0">
//               <Label htmlFor="academicLogo" className="mb-2 block">
//                 Upload Logo Here <span className="text-red-600">*</span>
//               </Label>
//               <FileInput
//                 id="academicLogo"
//                 accept="image/*"
//                 onChange={handleFileUpload}
//                 className="w-full"
//               />
//               <p className="mt-2 text-sm text-gray-500 dark:text-gray-400 break-words">
//                 Recommended size: 180x180 pixels. Supports JPG, PNG, SVG formats.
//               </p>
//             </div>
//           </div>
//         </div>
//       </Card>
//     </div>
//   );
// };

// export default AcademicInformation;









import React, { useEffect } from "react";
import { MdBusiness, MdLocationOn, MdLanguage, MdEmail, MdUpload, MdDescription } from "react-icons/md";
import { FormData } from "../../../types/formTypes";

interface AcademicInformationProps {
  formData: FormData;
  updateFormData: (updates: Partial<FormData>) => void;
}

const AcademicInformation: React.FC<AcademicInformationProps> = ({ formData, updateFormData }) => {
  const assetUrl = import.meta.env.VITE_ASSET_URL;
  
  // Fetch districts when state changes
  useEffect(() => {
    const loadDistricts = async () => {
      if (formData.selectState) {
        // Add your API call here
        // const districtsData = await fetchDistricts(formData.selectState);
        // updateFormData({ districts: districtsData });
      }
    };

    loadDistricts();
  }, [formData.selectState]);

  const handleStateChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    updateFormData({ 
      selectState: e.target.value,
      selectDistrict: ""
    });
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const file = files[0];
      updateFormData({ academicLogo: file });
      
      const reader = new FileReader();
      reader.onloadend = () => {
        updateFormData({ previewImage: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  const logoUrl = formData.previewImage || 
    (formData.academicData?.academic_logo ? `${assetUrl}/${formData.academicData.academic_logo}` : null);

  return (
    <div className="">
      <div className="max-w-7xl mx-auto space-y-8 animate-fade-in">
        {/* Header */}
       

        {/* Main Form Card */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 overflow-hidden hover:shadow-blue-500/10 transition-shadow duration-500">
          
          
          <div className="p-6 md:p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Type of Organization */}
              <div className="space-y-2 group">
                <label htmlFor="selectType" className="text-sm font-semibold flex items-center gap-2 text-gray-700 dark:text-gray-300">
                  <MdBusiness className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                  Type of Organization <span className="text-red-600">*</span>
                </label>
                <select
                  id="selectType"
                  value={formData.selectType}
                  onChange={(e) => updateFormData({ selectType: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all hover:border-blue-400"
                >
                  <option value="">Please Select</option>
                  <option value="1">School</option>
                  <option value="2">College</option>
                  <option value="3">University</option>
                </select>
              </div>

              {/* Subtype (conditional) */}
              {formData.selectType === "3" && (
                <div className="space-y-2 animate-fade-in">
                  <label htmlFor="selectSubtype" className="text-sm font-semibold flex items-center gap-2 text-gray-700 dark:text-gray-300">
                    <MdDescription className="w-4 h-4 text-cyan-600 dark:text-cyan-400" />
                    Subtype <span className="text-red-600">*</span>
                  </label>
                  <select
                    id="selectSubtype"
                    value={formData.selectSubtype}
                    onChange={(e) => updateFormData({ selectSubtype: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all hover:border-cyan-400"
                  >
                    <option value="">Please Select</option>
                    <option value="Arts College">Arts College</option>
                    <option value="Law University">Law University</option>
                  </select>
                </div>
              )}

              {/* Academic Name */}
              <div className={`space-y-2 ${formData.selectType === "3" ? "" : "md:col-span-2"}`}>
                <label htmlFor="academicName" className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                  Organization Name <span className="text-red-600">*</span>
                </label>
                <input
                  id="academicName"
                  type="text"
                  value={formData.academicName}
                  onChange={(e) => updateFormData({ academicName: e.target.value })}
                  placeholder="Enter organization name"
                  className="w-full px-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all hover:border-blue-400"
                />
              </div>

              {/* State */}
              <div className="space-y-2">
                <label htmlFor="selectState" className="text-sm font-semibold flex items-center gap-2 text-gray-700 dark:text-gray-300">
                  <MdLocationOn className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                  State <span className="text-red-600">*</span>
                </label>
                <select
                  id="selectState"
                  value={formData.selectState}
                  onChange={handleStateChange}
                  className="w-full px-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all hover:border-blue-400"
                >
                  <option value="">Please Select</option>
                  {formData.states.map((state) => (
                    <option key={state.state_id} value={state.state_id}>
                      {state.state_title}
                    </option>
                  ))}
                </select>
              </div>

              {/* District */}
              <div className="space-y-2">
                <label htmlFor="selectDistrict" className="text-sm font-semibold flex items-center gap-2 text-gray-700 dark:text-gray-300">
                  <MdLocationOn className="w-4 h-4 text-cyan-600 dark:text-cyan-400" />
                  District <span className="text-red-600">*</span>
                </label>
                <select
                  id="selectDistrict"
                  value={formData.selectDistrict}
                  onChange={(e) => updateFormData({ selectDistrict: e.target.value })}
                  disabled={!formData.selectState}
                  className="w-full px-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all hover:border-cyan-400 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <option value="">Please Select</option>
                  {formData.districts.map((district) => (
                    <option key={district.id} value={district.id}>
                      {district.district_title}
                    </option>
                  ))}
                </select>
              </div>

              {/* Pincode */}
              <div className="space-y-2">
                <label htmlFor="pincode" className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                  Pincode <span className="text-red-600">*</span>
                </label>
                <input
                  id="pincode"
                  type="number"
                  value={formData.Pincode}
                  onChange={(e) => updateFormData({ Pincode: e.target.value })}
                  placeholder="Enter pincode"
                  className="w-full px-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all hover:border-blue-400"
                />
              </div>

              {/* Area */}
              <div className="space-y-2">
                <label htmlFor="area" className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                  Area
                </label>
                <input
                  id="area"
                  type="text"
                  value={formData.area}
                  onChange={(e) => updateFormData({ area: e.target.value })}
                  placeholder="Enter area"
                  className="w-full px-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all hover:border-cyan-400"
                />
              </div>

              {/* Website URL */}
              <div className="space-y-2">
                <label htmlFor="website_url" className="text-sm font-semibold flex items-center gap-2 text-gray-700 dark:text-gray-300">
                  <MdLanguage className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                  Website URL <span className="text-red-600">*</span>
                </label>
                <input
                  id="website_url"
                  type="url"
                  value={formData.website_url}
                  onChange={(e) => updateFormData({ website_url: e.target.value })}
                  placeholder="https://example.com"
                  className="w-full px-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all hover:border-blue-400"
                />
              </div>

              {/* Primary Email */}
              <div className="space-y-2">
                <label htmlFor="primary_email" className="text-sm font-semibold flex items-center gap-2 text-gray-700 dark:text-gray-300">
                  <MdEmail className="w-4 h-4 text-cyan-600 dark:text-cyan-400" />
                  Primary Email <span className="text-red-600">*</span>
                </label>
                <input
                  id="primary_email"
                  type="email"
                  value={formData.primary_email}
                  onChange={(e) => updateFormData({ primary_email: e.target.value })}
                  placeholder="admin@example.com"
                  className="w-full px-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all hover:border-cyan-400"
                />
              </div>

              {/* Full Address */}
              <div className="space-y-2 md:col-span-2">
                <label htmlFor="academicAddress" className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                  Full Address
                </label>
                <input
                  id="academicAddress"
                  type="text"
                  value={formData.academicAddress}
                  onChange={(e) => updateFormData({ academicAddress: e.target.value })}
                  placeholder="Enter complete address"
                  className="w-full px-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all hover:border-blue-400"
                />
              </div>

              {/* Description */}
              <div className="space-y-2 md:col-span-3">
                <label htmlFor="academicDescription" className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                  Description
                </label>
                <textarea
                  id="academicDescription"
                  value={formData.academicDescription}
                  onChange={(e) => updateFormData({ academicDescription: e.target.value })}
                  placeholder="Enter organization description..."
                  rows={4}
                  className="w-full px-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all hover:border-blue-400 resize-y"
                />
              </div>

              {/* Logo Upload */}
              <div className="md:col-span-3">
                <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 hover:border-blue-400 dark:hover:border-blue-500 transition-all bg-gradient-to-br from-gray-50/50 to-white dark:from-gray-800/50 dark:to-gray-700/50 rounded-xl p-6">
                  <div className="flex flex-col sm:flex-row items-center gap-6">
                    {logoUrl && (
                      <div className="flex-shrink-0 group relative">
                        <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-cyan-500/20 rounded-xl blur-xl group-hover:blur-2xl transition-all" />
                        <img
                          src={logoUrl}
                          alt="Organization Logo"
                          className="relative w-32 h-32 object-contain rounded-xl border-2 border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800 shadow-lg"
                        />
                      </div>
                    )}
                    <div className="flex-1 w-full space-y-3">
                      <label htmlFor="academicLogo" className="text-sm font-semibold flex items-center gap-2 text-gray-700 dark:text-gray-300">
                        <MdUpload className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                        Upload Logo <span className="text-red-600">*</span>
                      </label>
                      <input
                        id="academicLogo"
                        type="file"
                        accept="image/*"
                        onChange={handleFileUpload}
                        className="w-full px-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-600 file:text-white hover:file:bg-blue-700 cursor-pointer transition-all"
                      />
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        Recommended size: 180x180 pixels. Supports JPG, PNG, SVG formats.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AcademicInformation;
