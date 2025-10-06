import React, { useEffect } from "react";
import { Card, Label, Select, TextInput, Textarea, FileInput } from "flowbite-react";
import { FormData } from "src/types/formTypes";
import { fetchDistricts } from "src/services/apiService";

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
        const districtsData = await fetchDistricts(formData.selectState);
        updateFormData({ 
          districts: districtsData
        });
      }
    };

    loadDistricts();
  }, [formData.selectState]);

  const handleStateChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const stateId = e.target.value;
    updateFormData({ 
      selectState: stateId,
      selectDistrict: "" // Reset district when state changes
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

  // Get logo URL - use uploaded preview or existing academic logo
  const getLogoUrl = () => {
    if (formData.previewImage) {
      return formData.previewImage;
    }
    if (formData.academicData?.academic_logo) {
      return `${assetUrl}/${formData.academicData.academic_logo}`;
    }
    return null;
  };

  const logoUrl = getLogoUrl();

  return (
    <div className="space-y-6">
      <Card>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Type of Organization */}
          <div>
            <Label htmlFor="selectType" className="mb-2 block">
              Type of the Organization <span className="text-red-600">*</span>
            </Label>
            <Select
              id="selectType"
              value={formData.selectType}
              onChange={(e) => updateFormData({ selectType: e.target.value })}
              required
              className="w-full"
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
              <Label htmlFor="selectSubtype" className="mb-2 block">
                Subtype of Organization <span className="text-red-600">*</span>
              </Label>
              <Select
                id="selectSubtype"
                value={formData.selectSubtype}
                onChange={(e) => updateFormData({ selectSubtype: e.target.value })}
                required
                className="w-full"
              >
                <option value="">Please Select</option>
                <option value="Arts College">Arts College</option>
                <option value="Law University">Law University</option>
              </Select>
            </div>
          )}

          {/* Academic Name */}
          <div className={formData.selectType === "3" ? "" : "md:col-span-2"}>
            <Label htmlFor="academicName" className="mb-2 block">
              Name of the Organization <span className="text-red-600">*</span>
            </Label>
            <TextInput
              id="academicName"
              value={formData.academicName}
              onChange={(e) => updateFormData({ academicName: e.target.value })}
              required
              className="w-full"
            />
          </div>

          {/* State */}
          <div>
            <Label htmlFor="selectState" className="mb-2 block">
              Select State <span className="text-red-600">*</span>
            </Label>
            <Select
              id="selectState"
              value={formData.selectState}
              onChange={handleStateChange}
              required
              className="w-full"
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
            <Label htmlFor="selectDistrict" className="mb-2 block">
              Select District <span className="text-red-600">*</span>
            </Label>
            <Select
              id="selectDistrict"
              value={formData.selectDistrict}
              onChange={(e) => updateFormData({ selectDistrict: e.target.value })}
              required
              disabled={!formData.selectState}
              className="w-full"
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
            <Label htmlFor="pincode" className="mb-2 block">
              Enter Pincode <span className="text-red-600">*</span>
            </Label>
            <TextInput
              id="pincode"
              type="number"
              value={formData.Pincode}
              onChange={(e) => updateFormData({ Pincode: e.target.value })}
              required
              className="w-full"
            />
          </div>

          {/* Area */}
          <div>
            <Label htmlFor="area" className="mb-2 block">Enter Area</Label>
            <TextInput
              id="area"
              value={formData.area}
              onChange={(e) => updateFormData({ area: e.target.value })}
              className="w-full"
            />
          </div>

          {/* Website URL */}
          <div>
            <Label htmlFor="website_url" className="mb-2 block">
              Website Url <span className="text-red-600">*</span>
            </Label>
            <TextInput
              id="website_url"
              type="url"
              value={formData.website_url}
              onChange={(e) => updateFormData({ website_url: e.target.value })}
              required
              className="w-full"
            />
          </div>

          {/* Primary Email */}
          <div>
            <Label htmlFor="primary_email" className="mb-2 block">
              Primary Email for Main Account <span className="text-red-600">*</span>
            </Label>
            <TextInput
              id="primary_email"
              type="email"
              value={formData.primary_email}
              onChange={(e) => updateFormData({ primary_email: e.target.value })}
              required
              className="w-full"
            />
          </div>

          {/* Full Address */}
          <div className="md:col-span-2">
            <Label htmlFor="academicAddress" className="mb-2 block">Enter Full Address</Label>
            <TextInput
              id="academicAddress"
              value={formData.academicAddress}
              onChange={(e) => updateFormData({ academicAddress: e.target.value })}
              className="w-full"
            />
          </div>

          {/* Description */}
          <div className="md:col-span-3">
            <Label htmlFor="academicDescription" className="mb-2 block">Enter Description</Label>
            <Textarea
              id="academicDescription"
              value={formData.academicDescription}
              onChange={(e) => updateFormData({ academicDescription: e.target.value })}
              rows={4}
              className="w-full resize-vertical"
            />
          </div>

          {/* Logo Upload */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 md:col-span-3 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
            {logoUrl && (
              <div className="flex-shrink-0">
                <img
                  src={logoUrl}
                  alt="Organization Logo"
                  className="w-32 h-32 object-contain rounded-lg border border-gray-300 dark:border-gray-600"
                />
              </div>
            )}
            <div className="flex-1 min-w-0">
              <Label htmlFor="academicLogo" className="mb-2 block">
                Upload Logo Here <span className="text-red-600">*</span>
              </Label>
              <FileInput
                id="academicLogo"
                accept="image/*"
                onChange={handleFileUpload}
                className="w-full"
              />
              <p className="mt-2 text-sm text-gray-500 dark:text-gray-400 break-words">
                Recommended size: 180x180 pixels. Supports JPG, PNG, SVG formats.
              </p>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default AcademicInformation;