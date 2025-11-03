import React, { useState, useEffect } from "react";
import { Button, Modal, TextInput, Label } from "flowbite-react";
import axios from "axios";
import { useAuth } from "src/hook/useAuth";
import toast from "react-hot-toast";
import SchoolDropdown from "src/Frontend/Common/SchoolDropdown";
import { al } from "node_modules/react-router/dist/development/context-CIdFp11b.d.mts";

interface Class {
  id: number;
  class_name: string;
  class_number: string | null;
  start_cut_off: string | null;
  end_cut_off: string | null;
  available_seat: string;
  tution_fee_1: string;
  tution_fee_2: string;
  tution_fee_3: string;
  registration_fee: string;
  academic_id: number;
}

interface ClassFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  editingClass?: Class | null;
}

interface FormData {
  academic_id: string;
  className: string;
  availableSeat: string;
  tution_fee_1: string;
  tution_fee_2: string;
  tution_fee_3: string;
  registration_fees: string;
}

const ClassForm: React.FC<ClassFormProps> = ({
  isOpen,
  onClose,
  onSuccess,
  editingClass,
}) => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    academic_id: "",
    className: "",
    availableSeat: "",
    tution_fee_1: "",
    tution_fee_2: "",
    tution_fee_3: "",
    registration_fees: "",
  });
  const [errors, setErrors] = useState<Partial<FormData>>({});

  const apiUrl = import.meta.env.VITE_API_URL;

console.log('editingClass',editingClass);
  useEffect(() => {
    if (isOpen) {
      if (editingClass) {
        setFormData({
           academic_id: editingClass.academic_id?.toString() || "",
        className: editingClass.class_name || "",
        availableSeat: editingClass.available_seat || "",
        tution_fee_1: editingClass.tution_fee_1 || "",
        tution_fee_2: editingClass.tution_fee_2 || "",
        tution_fee_3: editingClass.tution_fee_3 || "",
        registration_fees: editingClass.registration_fee || "",
        });
      } else {
        setFormData({
          academic_id: "",
          className: "",
          availableSeat: "",
          tution_fee_1: "",
          tution_fee_2: "",
          tution_fee_3: "",
          registration_fees: "",
        });
      }
      setErrors({});
    }
  }, [isOpen, editingClass]);

  const validateForm = (): boolean => {
    const newErrors: Partial<FormData> = {};

    if (!formData.academic_id && user?.role != 'CustomerAdmin') newErrors.academic_id = "School is required";
    if (!formData.className.trim()) newErrors.className = "Class name is required";
    if (!formData.availableSeat.trim()) newErrors.availableSeat = "Available seats is required";
    if (!formData.tution_fee_1.trim()) newErrors.tution_fee_1 = "Tuition fee 1 is required";
    if (!formData.tution_fee_2.trim()) newErrors.tution_fee_2 = "Tuition fee 2 is required";
    if (!formData.tution_fee_3.trim()) newErrors.tution_fee_3 = "Tuition fee 3 is required";
    if (!formData.registration_fees.trim()) newErrors.registration_fees = "Registration fee is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if(formData.academic_id === '' && user?.role != 'CustomerAdmin'){
      toast.error('Please select an academic');
      return;
    }
    if (!validateForm()) return;

    setLoading(true);
    try {
      const payload = {
        academic_id: formData.academic_id,
        className: formData.className,
        availableSeat: formData.availableSeat,
        tution_fee_1: formData.tution_fee_1,
        tution_fee_2: formData.tution_fee_2,
        tution_fee_3: formData.tution_fee_3,
        registration_fees: formData.registration_fees,
        s_id: user?.id,
      };

      let response;
      if (editingClass) {
        response = await axios.post(
          `${apiUrl}/${user?.role}/SchoolManagement/class-Update`,
          { ...payload, id: editingClass.id },
          {
            headers: {
              Authorization: `Bearer ${user?.token}`,
              "Content-Type": "application/json",
            },
          }
        );
      } else {
        response = await axios.post(
          `${apiUrl}/${user?.role}/SchoolManagement/class-Add`,
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
          editingClass
            ? "Class updated successfully!"
            : "Class added successfully!"
        );
        onSuccess();
      } else {
        toast.error(
          response.data.message ||
            `Failed to ${editingClass ? "update" : "add"} class`
        );
      }
    } catch (error: any) {
      console.error("Error saving class:", error);
      toast.error(
        `Failed to ${editingClass ? "update" : "add"} class`
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
          {editingClass ? "Edit Class" : "Add New Class"}
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
              value={formData.academic_id}
              formData={formData}
              setFormData={setFormData}
              onChange={handleAcademicChange}
              includeAllOption={false}
            />
            {errors.academic_id && (
              <p className="text-red-500 text-sm mt-1">{errors.academic_id}</p>
            )}
          </div>)}

          {/* Class Name Input */}
          <div>
            <label
              htmlFor="className"
              className="block mb-1 text-sm font-medium text-gray-700"
            >
              Class Name <span className="text-red-500">*</span>
            </label>
            <TextInput
              id="className"
              type="text"
              value={formData.className}
              onChange={(e) => handleInputChange("className", e.target.value)}
              placeholder="e.g., Class 8th, Grade 5"
              color={errors.className ? "failure" : "gray"}
              helperText={errors.className}
            />
          </div>

          {/* Available Seats Input */}
          <div>
            <label
              htmlFor="availableSeat"
              className="block mb-1 text-sm font-medium text-gray-700"
            >
              Available Seats <span className="text-red-500">*</span>
            </label>
            <TextInput
              id="availableSeat"
              type="number"
              value={formData.availableSeat}
              onChange={(e) => handleInputChange("availableSeat", e.target.value)}
              placeholder="e.g., 50"
              color={errors.availableSeat ? "failure" : "gray"}
              helperText={errors.availableSeat}
            />
          </div>

          {/* Fee Inputs */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label
                htmlFor="tution_fee_1"
                className="block mb-1 text-sm font-medium text-gray-700"
              >
                Tuition Fee 1 <span className="text-red-500">*</span>
              </label>
              <TextInput
                id="tution_fee_1"
                type="number"
                value={formData.tution_fee_1}
                onChange={(e) => handleInputChange("tution_fee_1", e.target.value)}
                placeholder="0.00"
                color={errors.tution_fee_1 ? "failure" : "gray"}
                helperText={errors.tution_fee_1}
              />
            </div>

            <div>
              <label
                htmlFor="tution_fee_2"
                className="block mb-1 text-sm font-medium text-gray-700"
              >
                Tuition Fee 2 <span className="text-red-500">*</span>
              </label>
              <TextInput
                id="tution_fee_2"
                type="number"
                value={formData.tution_fee_2}
                onChange={(e) => handleInputChange("tution_fee_2", e.target.value)}
                placeholder="0.00"
                color={errors.tution_fee_2 ? "failure" : "gray"}
                helperText={errors.tution_fee_2}
              />
            </div>

            <div>
              <label
                htmlFor="tution_fee_3"
                className="block mb-1 text-sm font-medium text-gray-700"
              >
                Tuition Fee 3 <span className="text-red-500">*</span>
              </label>
              <TextInput
                id="tution_fee_3"
                type="number"
                value={formData.tution_fee_3}
                onChange={(e) => handleInputChange("tution_fee_3", e.target.value)}
                placeholder="0.00"
                color={errors.tution_fee_3 ? "failure" : "gray"}
                helperText={errors.tution_fee_3}
              />
            </div>

            <div>
              <label
                htmlFor="registration_fees"
                className="block mb-1 text-sm font-medium text-gray-700"
              >
                Registration Fee <span className="text-red-500">*</span>
              </label>
              <TextInput
                id="registration_fees"
                type="number"
                value={formData.registration_fees}
                onChange={(e) => handleInputChange("registration_fees", e.target.value)}
                placeholder="0.00"
                color={errors.registration_fees ? "failure" : "gray"}
                helperText={errors.registration_fees}
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
                  {editingClass ? "Updating..." : "Adding..."}
                </div>
              ) : editingClass ? (
                "Update Class"
              ) : (
                "Add Class"
              )}
            </Button>
          </div>
        </form>
      </div>
    </Modal>
  );
};

export default ClassForm;