import React, { useState, useEffect } from "react";
import { Button, Modal, TextInput, Label } from "flowbite-react";
import axios from "axios";
import { useAuth } from "src/hook/useAuth";
import toast from "react-hot-toast";
import SchoolDropdown from "src/Frontend/Common/SchoolDropdown";

interface Transportation {
  id: number;
  distance: string;
  fee1: string;
  fee2: string;
  fee3: string;
  academic_name: string;
  creation_date: string;
  academic_id: number;
}

interface TransportationFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  editingTransportation?: Transportation | null;
}

interface FormData {
  academic_id: string;
  distance: string;
  fees1: string;
  fees2: string;
  fees3: string;
}

const TransportationForm: React.FC<TransportationFormProps> = ({
  isOpen,
  onClose,
  onSuccess,
  editingTransportation,
}) => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    academic_id: "",
    distance: "",
    fees1: "",
    fees2: "",
    fees3: "",
  });
  const [errors, setErrors] = useState<Partial<FormData>>({});

  const apiUrl = import.meta.env.VITE_API_URL;

  // Reset form when modal opens/closes or editing transportation changes
  console.log(formData.academic_id);
  useEffect(() => {
    if (isOpen) {
      if (editingTransportation) {
        setFormData({
          academic_id: editingTransportation.academic_id.toString(),
          distance: editingTransportation.distance,
          fees1: editingTransportation.fee1,
          fees2: editingTransportation.fee2,
          fees3: editingTransportation.fee3,
        });
      } else {
        setFormData({
          academic_id: "",
          distance: "",
          fees1: "",
          fees2: "",
          fees3: "",
        });
      }
      setErrors({});
    }
  }, [isOpen, editingTransportation]);

  const validateForm = (): boolean => {
    const newErrors: Partial<FormData> = {};

    if (!formData.academic_id && user?.role != 'CustomerAdmin') newErrors.academic_id = "School is required";
    if (!formData.distance.trim()) newErrors.distance = "Distance is required";
    if (!formData.fees1.trim()) newErrors.fees1 = "Fee 1 is required";
    if (!formData.fees2.trim()) newErrors.fees2 = "Fee 2 is required";
    if (!formData.fees3.trim()) newErrors.fees3 = "Fee 3 is required";

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
        distance: formData.distance,
        fees1: parseFloat(formData.fees1) || 0,
        fees2: parseFloat(formData.fees2) || 0,
        fees3: parseFloat(formData.fees3) || 0,
        s_id: user?.id,
      };

      let response;
      if (editingTransportation) {
        response = await axios.post(
          `${apiUrl}/${user?.role}/SchoolManagement/Transportation/update`,
          { ...payload, id: editingTransportation.id },
          {
            headers: {
              Authorization: `Bearer ${user?.token}`,
              "Content-Type": "application/json",
            },
          }
        );
      } else {
        response = await axios.post(
          `${apiUrl}/${user?.role}/SchoolManagement/Transportation/add`,
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
          editingTransportation
            ? "Transportation updated successfully!"
            : "Transportation added successfully!"
        );
        onSuccess();
      } else {
        toast.error(
          response.data.message ||
            `Failed to ${editingTransportation ? "update" : "add"} transportation`
        );
      }
    } catch (error: any) {
      console.error("Error saving transportation:", error);
      toast.error(
        `Failed to ${editingTransportation ? "update" : "add"} transportation`
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

  return (
    <Modal show={isOpen} onClose={onClose} size="lg">
      <div className="p-6">
        <h3 className="text-xl font-semibold text-gray-900 mb-4">
          {editingTransportation ? "Edit Transportation" : "Add New Transportation"}
        </h3>

        <form onSubmit={handleSubmit} className="space-y-5">
  {/* School Dropdown */}
   {(user?.role === 'SuperAdmin' || user?.role === 'SupportAdmin') &&  ( <div>
    <label
      htmlFor="academic_id"
      className="block mb-1 text-sm font-medium text-gray-700"
    >
      Select School <span className="text-red-500">*</span>
    </label>
    <SchoolDropdown
  value={formData.academic_id} // ✅ ensure value is passed explicitly
  formData={formData}
  setFormData={setFormData}
  onChange={handleAcademicChange}
  includeAllOption={false}
/>
    {errors.academic_id && (
      <p className="text-red-500 text-sm mt-1">{errors.academic_id}</p>
    )}
  </div> )}

  {/* Distance Input */}
  <div>
    <label
      htmlFor="distance"
      className="block mb-1 text-sm font-medium text-gray-700"
    >
      Distance <span className="text-red-500">*</span>
    </label>
    <TextInput
      id="distance"
      type="text"
      value={formData.distance}
      onChange={(e) => handleInputChange("distance", e.target.value)}
      placeholder="e.g., Above 5 km – 8 km"
      color={errors.distance ? "failure" : "gray"}
      helperText={errors.distance}
    />
  </div>

  {/* Fee Inputs */}
  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
    <div>
      <label
        htmlFor="fees1"
        className="block mb-1 text-sm font-medium text-gray-700"
      >
        Fee 1 <span className="text-red-500">*</span>
      </label>
      <TextInput
        id="fees1"
        type="number"
        value={formData.fees1}
        onChange={(e) => handleInputChange("fees1", e.target.value)}
        placeholder="0.00"
        color={errors.fees1 ? "failure" : "gray"}
        helperText={errors.fees1}
      />
    </div>

    <div>
      <label
        htmlFor="fees2"
        className="block mb-1 text-sm font-medium text-gray-700"
      >
        Fee 2 <span className="text-red-500">*</span>
      </label>
      <TextInput
        id="fees2"
        type="number"
        value={formData.fees2}
        onChange={(e) => handleInputChange("fees2", e.target.value)}
        placeholder="0.00"
        color={errors.fees2 ? "failure" : "gray"}
        helperText={errors.fees2}
      />
    </div>

    <div>
      <label
        htmlFor="fees3"
        className="block mb-1 text-sm font-medium text-gray-700"
      >
        Fee 3 <span className="text-red-500">*</span>
      </label>
      <TextInput
        id="fees3"
        type="number"
        value={formData.fees3}
        onChange={(e) => handleInputChange("fees3", e.target.value)}
        placeholder="0.00"
        color={errors.fees3 ? "failure" : "gray"}
        helperText={errors.fees3}
      />
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
          {editingTransportation ? "Updating..." : "Adding..."}
        </div>
      ) : editingTransportation ? (
        "Update Transportation"
      ) : (
        "Add Transportation"
      )}
    </Button>
  </div>
</form>

      </div>
    </Modal>
  );
};

export default TransportationForm;
