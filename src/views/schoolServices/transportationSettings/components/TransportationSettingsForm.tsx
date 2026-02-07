import React, { useState, useEffect } from "react";
import { Button, Modal, TextInput, Label } from "flowbite-react";
import { HiEye, HiEyeOff } from "react-icons/hi";
import axios from "axios";
import { useAuth } from "src/hook/useAuth";
import toast from "react-hot-toast";
import SchoolDropdown from "src/Frontend/Common/SchoolDropdown";
import AcademicDropdown from "src/Frontend/Common/AcademicDropdown";
import RouteDropdown from "src/Frontend/Common/RouteDropdown";

interface TransportationSetting {
  id: number;
  academic_id: number;
  param_name: string;
  param_key: string;
  param_value: string;
  academic_name: string;
  creation_date: string;
}

interface TransportationSettingsFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  editingSetting?: TransportationSetting | null;
  type?: string;
}

interface FormData {
  academic_id: string;
  form_id: string;
  paramKey: string;
  paramName: string;
  paramValue: string;
}

const TransportationSettingsForm: React.FC<TransportationSettingsFormProps> = ({
  isOpen,
  onClose,
  onSuccess,
  editingSetting,
  type,
}) => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [showParamValue, setShowParamValue] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    academic_id: "",
    form_id: "",
    paramKey: "",
    paramName: "",
    paramValue: "",
  });
  const [errors, setErrors] = useState<Partial<FormData>>({});

  const apiUrl = import.meta.env.VITE_API_URL;

  // Reset form when modal opens/closes or editing setting changes
  useEffect(() => {
  
         
    if (isOpen) {
      if (editingSetting) {
        setFormData({
          academic_id: editingSetting.academic_id.toString(),
          form_id: editingSetting.form_id,
          paramKey: editingSetting.param_key,
          paramName: editingSetting.param_name,
          paramValue: editingSetting.param_value,
        });
      } else {
        setFormData({
          academic_id: "",
          form_id: "",
          paramKey: "",
          paramName: "",
          paramValue: "",
        });
      }
      setErrors({});
      setShowParamValue(false);
      if(user?.role === 'CustomerAdmin'){
        handleAcademicChange(user?.academic_id?.toString());
      }
    }
  }, [isOpen, editingSetting,user]);

  const validateForm = (): boolean => {
    const newErrors: Partial<FormData> = {};

    if (!formData.academic_id && user?.role != 'CustomerAdmin') newErrors.academic_id = "School is required";
    if (!formData.paramKey.trim()) newErrors.paramKey = "Parameter key is required";
    if (!formData.paramName.trim()) newErrors.paramName = "Parameter name is required";
    if (!formData.paramValue.trim()) newErrors.paramValue = "Parameter value is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if(formData.academic_id === '' && user?.role != 'CustomerAdmin') {
      toast.error('Please select an academic');
      return;
    }

    if (!validateForm()) return;

    setLoading(true);
    try {
      const payload = {
        academic_id: parseInt(formData.academic_id),
        form_id:formData.form_id,
        paramKey: formData.paramKey,
        paramName: formData.paramName,
        paramValue: formData.paramValue,
        s_id: user?.id,
      };

      let response;
      if (editingSetting) {
        response = await axios.post(
          `${apiUrl}/${user?.role}/SchoolManagement/Setting/update`,
          { ...payload, id: editingSetting.id },
          {
            headers: {
              Authorization: `Bearer ${user?.token}`,
              "Content-Type": "application/json",
            },
          }
        );
      } else {
        response = await axios.post(
          `${apiUrl}/${user?.role}/SchoolManagement/Setting/add`,
          payload,
          {
            headers: {
              Authorization: `Bearer ${user?.token}`,
              "Content-Type": "application/json",
            },
          }
        );
      }

      if (response.data.status === true) {
        toast.success(
          editingSetting
            ? "Transportation setting updated successfully!"
            : "Transportation setting added successfully!"
        );
        onSuccess();
      } else {
        toast.error(
          response.data.message ||
            `Failed to ${editingSetting ? "update" : "add"} transportation setting`
        );
      }
    } catch (error: any) {
      console.error("Error saving transportation setting:", error);
      toast.error(
        `Failed to ${editingSetting ? "update" : "add"} transportation setting`
      );
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
    if (errors[field]) {
      setErrors((prev) => ({
        ...prev,
        [field]: undefined,
      }));
    }
  };

  const handleAcademicChange = (academicId: string) => {
    handleInputChange("academic_id", academicId);
  };

  const handleFormSelect = (formId: string) => {
     handleInputChange("form_id", formId);
    
  };

  const toggleShowParamValue = () => {
    setShowParamValue(!showParamValue);
  };

  return (
    <Modal show={isOpen} onClose={onClose} size="lg">
      <div className="p-6">
        <h3 className="text-xl font-semibold text-gray-900 mb-4">
          {editingSetting ? "Edit Setting" : "Add New Setting"}
        </h3>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* School Dropdown */}
          {(user?.role === 'SuperAdmin' || user?.role === 'SupportAdmin') &&  ( <div>
            <label
              htmlFor="academic_id"
              className="block mb-1 text-sm font-medium text-gray-700"
            >
              Select {`${type === '2' ? 'Academic' : 'Scholl'}`} <span className="text-red-500">*</span>
            </label>
             {type === "2" ? (
                  <AcademicDropdown
                    value={formData.academic_id}
                    formData={formData}
                    setFormData={setFormData}
                    onChange={handleAcademicChange}
                    includeAllOption={false}
                  />
                ) : (
                  <SchoolDropdown
                   value={formData.academic_id}
              formData={formData}
              setFormData={setFormData}
              onChange={handleAcademicChange}
              includeAllOption={false}
                  />
                )}
              
            {errors.academic_id && (
              <p className="text-red-500 text-sm mt-1">{errors.academic_id}</p>
            )}
          </div> )}

             <label
                    htmlFor="paramName"
                    className="block mb-1 mt-3 text-sm font-medium text-gray-700"
                  >
                    Select route <span className="text-red-500">*</span>
                  </label>
                 <RouteDropdown
                    academicId={formData.academic_id}
                    value={formData.form_id}
                    onChange={handleFormSelect}
                    
                    isRequired
                    placeholder={formData.academic_id ? "Select form page..." : "Select academic first"}
                    disabled={!formData.academic_id}
                  />

          {/* Parameter Name Input */}
          <div>
            <label
              htmlFor="paramName"
              className="block mb-1 text-sm font-medium text-gray-700"
            >
              Parameter Name <span className="text-red-500">*</span>
            </label>
            <TextInput
              id="paramName"
              type="text"
              value={formData.paramName}
              onChange={(e) => handleInputChange("paramName", e.target.value)}
              placeholder="e.g., Serial No, Academic Year"
              color={errors.paramName ? "failure" : "gray"}
              helperText={errors.paramName}
            />
          </div>

          {/* Parameter Key Input */}
          <div>
            <label
              htmlFor="paramKey"
              className="block mb-1 text-sm font-medium text-gray-700"
            >
              Parameter Key <span className="text-red-500">*</span>
            </label>
            <TextInput
              id="paramKey"
              type="text"
              value={formData.paramKey}
              onChange={(e) => handleInputChange("paramKey", e.target.value)}
              placeholder="e.g., serial_no, academic_year"
              color={errors.paramKey ? "failure" : "gray"}
              helperText={errors.paramKey}
            />
          </div>

          {/* Parameter Value Input with Show/Hide Toggle */}
          <div>
            <label
              htmlFor="paramValue"
              className="block mb-1 text-sm font-medium text-gray-700"
            >
              Parameter Value <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <TextInput
                id="paramValue"
                type={showParamValue ? "text" : "password"}
                value={formData.paramValue}
                onChange={(e) => handleInputChange("paramValue", e.target.value)}
                placeholder="Enter parameter value"
                color={errors.paramValue ? "failure" : "gray"}
                helperText={errors.paramValue}
              />
              <button
                type="button"
                onClick={toggleShowParamValue}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 hover:text-gray-700"
              >
                {showParamValue ? (
                  <HiEyeOff className="w-5 h-5" />
                ) : (
                  <HiEye className="w-5 h-5" />
                )}
              </button>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
            <Button color="gray" onClick={onClose} disabled={loading}>
              Cancel
            </Button>
            <Button type="submit" gradientDuoTone="cyanToBlue" disabled={loading}>
              {loading ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  {editingSetting ? "Updating..." : "Adding..."}
                </div>
              ) : editingSetting ? (
                "Update Setting"
              ) : (
                "Add Setting"
              )}
            </Button>
          </div>
        </form>
      </div>
    </Modal>
  );
};

export default TransportationSettingsForm;