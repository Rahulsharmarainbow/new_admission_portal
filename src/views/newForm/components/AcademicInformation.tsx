import React, { useEffect } from "react";
import { Card, Label, Select, TextInput, Textarea, FileInput } from "flowbite-react";
import { FormData } from "src/types/formTypes";
import { fetchDistricts } from "src/services/apiService";

interface AcademicInformationProps {
  formData: FormData;
  updateFormData: (updates: Partial<FormData>) => void;
  errors?: Record<string, string>;
}

const AcademicInformation: React.FC<AcademicInformationProps> = ({ 
  formData, 
  updateFormData,
  errors = {}
}) => {
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

  // Logo upload handler
  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const file = files[0];
      
      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        updateFormData({ 
          academicLogo: file, // Store file object
          previewImage: reader.result as string // Store preview URL
        });
      };
      reader.readAsDataURL(file);
    } else {
      // Clear logo if file input is cleared
      updateFormData({ 
        academicLogo: null,
        previewImage: formData.academicData?.academic_logo 
          ? `${assetUrl}/${formData.academicData.academic_logo}`
          : null
      });
    }
  };

  // Add this handler function in the AcademicInformation component
const handleNewLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
  const files = e.target.files;
  if (files && files.length > 0) {
    const file = files[0];
    
    // Create preview
    const reader = new FileReader();
    reader.onloadend = () => {
      updateFormData({ 
        academic_new_logo: file, // Store file object
        previewNewLogo: reader.result as string // Store preview URL
      });
    };
    reader.readAsDataURL(file);
  } else {
    // Clear new logo if file input is cleared
    updateFormData({ 
      academic_new_logo: null,
      previewNewLogo: formData.academicData?.academic_new_logo 
        ? `${assetUrl}/${formData.academicData.academic_new_logo}`
        : null
    });
  }
};

// Add this function to get the new logo URL
const getNewLogoUrl = () => {
  // Priority 1: New uploaded preview
  if (formData.previewNewLogo) {
    return formData.previewNewLogo;
  }
  // Priority 2: Existing new logo from API
  if (formData.academicData?.academic_new_logo) {
    return `${assetUrl}/${formData.academicData.academic_new_logo}`;
  }
  return null;
};

const displayNewLogoUrl = getNewLogoUrl();

  // Signature upload handler
  const handleSignatureUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const file = files[0];
      
      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        updateFormData({ 
          director_signature: file, // Store file object
          previewSignature: reader.result as string // Store preview URL
        });
      };
      reader.readAsDataURL(file);
    } else {
      // Clear signature if file input is cleared
      updateFormData({ 
        director_signature: null,
        previewSignature: formData.academicData?.director_signature 
          ? `${assetUrl}/${formData.academicData.director_signature}`
          : null
      });
    }
  };

  // Get logo URL for display
  const getLogoUrl = () => {
    // Priority 1: New uploaded preview
    if (formData.previewImage) {
      return formData.previewImage;
    }
    // Priority 2: Existing academic logo from API
    if (formData.academicData?.academic_logo) {
      return `${assetUrl}/${formData.academicData.academic_logo}`;
    }
    return null;
  };

  // Get signature URL for display
  const getSignatureUrl = () => {
    // Priority 1: New uploaded preview
    if (formData.previewSignature) {
      return formData.previewSignature;
    }
    // Priority 2: Existing signature from API
    if (formData.academicData?.director_signature) {
      return `${assetUrl}/${formData.academicData.director_signature}`;
    }
    return null;
  };

  const displayLogoUrl = getLogoUrl();
  const displaySignatureUrl = getSignatureUrl();

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
            {errors.selectType && (
              <p className="mt-1 text-sm text-red-600">{errors.selectType}</p>
            )}
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
              {errors.selectSubtype && (
                <p className="mt-1 text-sm text-red-600">{errors.selectSubtype}</p>
              )}
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
            {errors.academicName && (
              <p className="mt-1 text-sm text-red-600">{errors.academicName}</p>
            )}
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
            {errors.selectState && (
              <p className="mt-1 text-sm text-red-600">{errors.selectState}</p>
            )}
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
            {errors.selectDistrict && (
              <p className="mt-1 text-sm text-red-600">{errors.selectDistrict}</p>
            )}
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
            {errors.Pincode && (
              <p className="mt-1 text-sm text-red-600">{errors.Pincode}</p>
            )}
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
            {errors.website_url && (
              <p className="mt-1 text-sm text-red-600">{errors.website_url}</p>
            )}
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
            {errors.primary_email && (
              <p className="mt-1 text-sm text-red-600">{errors.primary_email}</p>
            )}
          </div>

          {/* Full Address */}
          <div className="md:col-span-2">
            <Label htmlFor="academicAddress" className="mb-2 block">
              Enter Full Address <span className="text-red-600">*</span>
            </Label>
            <TextInput
              id="academicAddress"
              value={formData.academicAddress}
              onChange={(e) => updateFormData({ academicAddress: e.target.value })}
              className="w-full"
            />
            {errors.academicAddress && (
              <p className="mt-1 text-sm text-red-600">{errors.academicAddress}</p>
            )}
          </div>

          {/* Description */}
          <div className="md:col-span-3">
            <Label htmlFor="academicDescription" className="mb-2 block">
              Enter Description <span className="text-red-600">*</span>
            </Label>
            <Textarea
              id="academicDescription"
              value={formData.academicDescription}
              onChange={(e) => updateFormData({ academicDescription: e.target.value })}
              rows={4}
              className="w-full resize-vertical"
            />
            {errors.academicDescription && (
              <p className="mt-1 text-sm text-red-600">{errors.academicDescription}</p>
            )}
          </div>

          {/* Logo and Signature Upload Section */}
          <div className="md:col-span-3">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Logo Upload */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                {displayLogoUrl && (
                  <div className="flex-shrink-0">
                    <img
                      src={displayLogoUrl}
                      alt="Organization Logo"
                      className="w-32 h-32 object-contain rounded-lg border border-gray-300 dark:border-gray-600 bg-white p-1"
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
                    onChange={handleLogoUpload}
                    className="w-full"
                  />
                  {errors.academicLogo && (
                    <p className="mt-1 text-sm text-red-600">{errors.academicLogo}</p>
                  )}
                </div>
              </div>

              {/* Director Signature Upload */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                {displaySignatureUrl && (
                  <div className="flex-shrink-0">
                    <img
                      src={displaySignatureUrl}
                      alt="Director Signature"
                      className="w-32 h-32 object-contain rounded-lg border border-gray-300 dark:border-gray-600 bg-white p-1"
                    />
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <Label htmlFor="director_signature" className="mb-2 block">
                    Upload Director Signature
                  </Label>
                  <FileInput
                    id="director_signature"
                    accept="image/*"
                    onChange={handleSignatureUpload}
                    className="w-full"
                  />
                </div>
              </div>
             {/* Other Logo Upload - Optional */}
<div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
  {displayNewLogoUrl && (
    <div className="flex-shrink-0">
      <img
        src={displayNewLogoUrl}
        alt="Other Organization Logo"
        className="w-32 h-32 object-contain rounded-lg border border-gray-300 dark:border-gray-600 bg-white p-1"
      />
    </div>
  )}
  <div className="flex-1 min-w-0">
    <Label htmlFor="academic_new_logo" className="mb-2 block">
      Upload Other Logo Here (Optional)
    </Label>
    <FileInput
      id="academic_new_logo"
      accept="image/*"
      onChange={handleNewLogoUpload}
      className="w-full"
    />
    <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
      This is an optional additional logo
    </p>
  </div>
</div>

            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default AcademicInformation;