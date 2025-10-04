// import React from "react";
// import { Card, Label, Select, TextInput, Textarea, FileInput } from "flowbite-react";
// import { FormWizardData } from "./FormWizard";

// interface AcademicInformationProps {
//   formData: FormWizardData;
//   updateFormData: (updates: Partial<FormWizardData>) => void;
// }

// const AcademicInformation: React.FC<AcademicInformationProps> = ({ 
//   formData, 
//   updateFormData 
// }) => {
//   const [states, setStates] = React.useState<{ value: string; label: string }[]>([]);
//   const [districts, setDistricts] = React.useState<{ value: string; text: string }[]>([]);

//   const handleStateChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
//     const stateId = e.target.value;
//     updateFormData({ selectState: stateId, selectDistrict: "" });
    
//     if (stateId) {
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
//       updateFormData({ academicLogo: file });
      
//       const reader = new FileReader();
//       reader.onloadend = () => {
//         updateFormData({ previewImage: reader.result as string });
//       };
//       reader.readAsDataURL(file);
//     }
//   };

//   React.useEffect(() => {
//     setStates([
//       { value: "1", label: "State 1" },
//       { value: "2", label: "State 2" },
//       { value: "3", label: "State 3" },
//     ]);
//   }, []);

//   return (
//     <div className="space-y-6">
//       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//         <div>
//           <Label htmlFor="selectType">
//             Type of the Organization <span className="text-red-600">*</span>
//           </Label>
//           <Select
//             id="selectType"
//             value={formData.selectType}
//             onChange={(e) => updateFormData({ selectType: e.target.value })}
//             required
//           >
//             <option value="">Please Select</option>
//             <option value="1">School</option>
//             <option value="2">College</option>
//             <option value="3">University</option>
//           </Select>
//         </div>

//         {formData.selectType === "3" && (
//           <div>
//             <Label htmlFor="selectSubtype">
//               Subtype of Organization <span className="text-red-600">*</span>
//             </Label>
//             <Select
//               id="selectSubtype"
//               value={formData.selectSubtype}
//               onChange={(e) => updateFormData({ selectSubtype: e.target.value })}
//               required
//             >
//               <option value="">Please Select</option>
//               <option value="Arts College">Arts College</option>
//               <option value="Law University">Law University</option>
//             </Select>
//           </div>
//         )}

//         <div className={formData.selectType === "3" ? "md:col-span-1" : "md:col-span-2"}>
//           <Label htmlFor="academicName">
//             Name of the Organization <span className="text-red-600">*</span>
//           </Label>
//           <TextInput
//             id="academicName"
//             value={formData.academicName}
//             onChange={(e) => updateFormData({ academicName: e.target.value })}
//             required
//           />
//         </div>

//         <div>
//           <Label htmlFor="selectState">
//             Select State <span className="text-red-600">*</span>
//           </Label>
//           <Select
//             id="selectState"
//             value={formData.selectState}
//             onChange={handleStateChange}
//             required
//           >
//             <option value="">Please Select</option>
//             {states.map((state) => (
//               <option key={state.value} value={state.value}>
//                 {state.label}
//               </option>
//             ))}
//           </Select>
//         </div>

//         <div>
//           <Label htmlFor="selectDistrict">
//             Select District <span className="text-red-600">*</span>
//           </Label>
//           <Select
//             id="selectDistrict"
//             value={formData.selectDistrict}
//             onChange={(e) => updateFormData({ selectDistrict: e.target.value })}
//             required
//             disabled={!formData.selectState}
//           >
//             <option value="">Please Select</option>
//             {districts.map((district) => (
//               <option key={district.value} value={district.value}>
//                 {district.text}
//               </option>
//             ))}
//           </Select>
//         </div>

//         <div>
//           <Label htmlFor="pincode">
//             Enter Pincode <span className="text-red-600">*</span>
//           </Label>
//           <TextInput
//             id="pincode"
//             type="number"
//             value={formData.Pincode}
//             onChange={(e) => updateFormData({ Pincode: e.target.value })}
//             required
//           />
//         </div>

//         <div>
//           <Label htmlFor="area">Enter Area</Label>
//           <TextInput
//             id="area"
//             value={formData.area}
//             onChange={(e) => updateFormData({ area: e.target.value })}
//           />
//         </div>

//         <div>
//           <Label htmlFor="website_url">
//             Website Url <span className="text-red-600">*</span>
//           </Label>
//           <TextInput
//             id="website_url"
//             type="url"
//             value={formData.website_url}
//             onChange={(e) => updateFormData({ website_url: e.target.value })}
//             required
//           />
//         </div>

//         <div>
//           <Label htmlFor="primary_email">
//             Primary Email for Main Account <span className="text-red-600">*</span>
//           </Label>
//           <TextInput
//             id="primary_email"
//             type="email"
//             value={formData.primary_email}
//             onChange={(e) => updateFormData({ primary_email: e.target.value })}
//             required
//           />
//         </div>

//         <div className="md:col-span-2">
//           <Label htmlFor="academicAddress">Enter Full Address</Label>
//           <TextInput
//             id="academicAddress"
//             value={formData.academicAddress}
//             onChange={(e) => updateFormData({ academicAddress: e.target.value })}
//           />
//         </div>

//         <div className="md:col-span-3">
//           <Label htmlFor="academicDescription">Enter Description</Label>
//           <Textarea
//             id="academicDescription"
//             value={formData.academicDescription}
//             onChange={(e) => updateFormData({ academicDescription: e.target.value })}
//             rows={4}
//           />
//         </div>

//         <div className="flex items-center gap-4 md:col-span-3">
//           {formData.previewImage && (
//             <img
//               src={formData.previewImage}
//               alt="Preview"
//               className="w-32 h-32 object-cover rounded-lg border"
//             />
//           )}
//           <div className="flex-1">
//             <Label htmlFor="academicLogo">
//               Upload Logo Here <span className="text-red-600">*</span>
//             </Label>
//             <FileInput
//               id="academicLogo"
//               accept="image/*"
//               onChange={handleFileUpload}
//             />
//             <p className="mt-1 text-sm text-gray-500">Recommended size: 180x180 pixels</p>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default AcademicInformation;













"use client";
import React, { useEffect } from "react";
import { Card, Label, Select, TextInput, Textarea, FileInput } from "flowbite-react";
import { FormData } from "./FormWizard";

interface AcademicInformationProps {
  formData: FormData;
  updateFormData: (updates: Partial<FormData>) => void;
}

const AcademicInformation: React.FC<AcademicInformationProps> = ({ formData, updateFormData }) => {
  
  // Fetch districts when state changes
  const fetchDistricts = async (stateId: string) => {
    try {
      const response = await fetch('https://rainbowsolutionandtechnology.com/NewAdmissionPortal/public/api/Public/District', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          state_id: stateId
        })
      });
      
      const data = await response.json();
      if (data.status) {
        updateFormData({ 
          districts: data.districts,
          selectDistrict: "" // Reset district when state changes
        });
      }
    } catch (error) {
      console.error('Error fetching districts:', error);
    }
  };

  const handleStateChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const stateId = e.target.value;
    updateFormData({ selectState: stateId });
    
    if (stateId) {
      await fetchDistricts(stateId);
    } else {
      updateFormData({ districts: [], selectDistrict: "" });
    }
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

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Type of Organization */}
        <div>
          <Label htmlFor="selectType">
            Type of the Organization <span className="text-red-600">*</span>
          </Label>
          <Select
            id="selectType"
            value={formData.selectType}
            onChange={(e) => updateFormData({ selectType: e.target.value })}
            required
          >
            <option value="">Please Select</option>
            <option value="1">School</option>
            <option value="2">College</option>
            <option value="3">University</option>
          </Select>
        </div>

        {/* Subtype (only for University) */}
        {formData.selectType === "3" && (
          <div>
            <Label htmlFor="selectSubtype">
              Subtype of Organization <span className="text-red-600">*</span>
            </Label>
            <Select
              id="selectSubtype"
              value={formData.selectSubtype}
              onChange={(e) => updateFormData({ selectSubtype: e.target.value })}
              required
            >
              <option value="">Please Select</option>
              <option value="Arts College">Arts College</option>
              <option value="Law University">Law University</option>
            </Select>
          </div>
        )}

        {/* Academic Name */}
        <div className={formData.selectType === "3" ? "md:col-span-1" : "md:col-span-2"}>
          <Label htmlFor="academicName">
            Name of the Organization <span className="text-red-600">*</span>
          </Label>
          <TextInput
            id="academicName"
            value={formData.academicName}
            onChange={(e) => updateFormData({ academicName: e.target.value })}
            required
          />
        </div>

        {/* State */}
        <div>
          <Label htmlFor="selectState">
            Select State <span className="text-red-600">*</span>
          </Label>
          <Select
            id="selectState"
            value={formData.selectState}
            onChange={handleStateChange}
            required
          >
            <option value="">Please Select</option>
            {formData.states.map((state) => (
              <option key={state.state_id} value={state.state_id}>
                {state.state_title}
              </option>
            ))}
          </Select>
        </div>

        {/* District */}
        <div>
          <Label htmlFor="selectDistrict">
            Select District <span className="text-red-600">*</span>
          </Label>
          <Select
            id="selectDistrict"
            value={formData.selectDistrict}
            onChange={(e) => updateFormData({ selectDistrict: e.target.value })}
            required
            disabled={!formData.selectState}
          >
            <option value="">Please Select</option>
            {formData.districts.map((district) => (
              <option key={district.id} value={district.id}>
                {district.district_title}
              </option>
            ))}
          </Select>
        </div>

        {/* Pincode */}
        <div>
          <Label htmlFor="pincode">
            Enter Pincode <span className="text-red-600">*</span>
          </Label>
          <TextInput
            id="pincode"
            type="number"
            value={formData.Pincode}
            onChange={(e) => updateFormData({ Pincode: e.target.value })}
            required
          />
        </div>

        {/* Area */}
        <div>
          <Label htmlFor="area">Enter Area</Label>
          <TextInput
            id="area"
            value={formData.area}
            onChange={(e) => updateFormData({ area: e.target.value })}
          />
        </div>

        {/* Website URL */}
        <div>
          <Label htmlFor="website_url">
            Website Url <span className="text-red-600">*</span>
          </Label>
          <TextInput
            id="website_url"
            type="url"
            value={formData.website_url}
            onChange={(e) => updateFormData({ website_url: e.target.value })}
            required
          />
        </div>

        {/* Primary Email */}
        <div>
          <Label htmlFor="primary_email">
            Primary Email for Main Account <span className="text-red-600">*</span>
          </Label>
          <TextInput
            id="primary_email"
            type="email"
            value={formData.primary_email}
            onChange={(e) => updateFormData({ primary_email: e.target.value })}
            required
          />
        </div>

        {/* Full Address */}
        <div className="md:col-span-2">
          <Label htmlFor="academicAddress">Enter Full Address</Label>
          <TextInput
            id="academicAddress"
            value={formData.academicAddress}
            onChange={(e) => updateFormData({ academicAddress: e.target.value })}
          />
        </div>

        {/* Description */}
        <div className="md:col-span-3">
          <Label htmlFor="academicDescription">Enter Description</Label>
          <Textarea
            id="academicDescription"
            value={formData.academicDescription}
            onChange={(e) => updateFormData({ academicDescription: e.target.value })}
            rows={4}
          />
        </div>

        {/* Logo Upload */}
        <div className="flex items-center gap-4 md:col-span-3">
          {formData.previewImage && (
            <img
              src={formData.previewImage}
              alt="Preview"
              className="w-32 h-32 object-cover rounded-lg border"
            />
          )}
          <div className="flex-1">
            <Label htmlFor="academicLogo">
              Upload Logo Here <span className="text-red-600">*</span>
            </Label>
            <FileInput
              id="academicLogo"
              accept="image/*"
              onChange={handleFileUpload}
            />
            <p className="mt-1 text-sm text-gray-500">Recommended size: 180x180 pixels</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AcademicInformation;