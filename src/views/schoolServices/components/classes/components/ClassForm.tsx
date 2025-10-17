import React, { useState, useEffect } from 'react';
import { Button, Modal, TextInput, Label, Select } from 'flowbite-react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useAuth } from 'src/hook/useAuth';

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

interface Academic {
  id: number;
  academic_name: string;
}

interface ClassFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  classData: Class | null;
  academics: Academic[];
}

const ClassForm: React.FC<ClassFormProps> = ({ isOpen, onClose, onSuccess, classData, academics }) => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    className: '',
    availableSeat: '',
    academic_id: '',
    tution_fee_1: '',
    tution_fee_2: '',
    tution_fee_3: '',
    registration_fees: ''
  });

  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const apiUrl = import.meta.env.VITE_API_URL;

  // Reset form when modal opens/closes or classData changes
  useEffect(() => {
    if (isOpen && classData) {
      console.log('Editing class data:', classData); // Debug log
      // Edit mode - populate form with existing data
      setFormData({
        className: classData.class_name || '',
        availableSeat: classData.available_seat || '',
        academic_id: classData.academic_id?.toString() || '',
        tution_fee_1: classData.tution_fee_1 || '',
        tution_fee_2: classData.tution_fee_2 || '',
        tution_fee_3: classData.tution_fee_3 || '',
        registration_fees: classData.registration_fee || ''
      });
    } else if (isOpen && !classData) {
      console.log('Adding new class'); // Debug log
      // Add mode - reset form
      setFormData({
        className: '',
        availableSeat: '',
        academic_id: '',
        tution_fee_1: '',
        tution_fee_2: '',
        tution_fee_3: '',
        registration_fees: ''
      });
    }
    setErrors({});
  }, [isOpen, classData]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

    if (!formData.academic_id) newErrors.academic_id = 'Please select an academic';
    if (!formData.className.trim()) newErrors.className = 'Class name is required';
    if (!formData.availableSeat) newErrors.availableSeat = 'Available seats is required';
    if (!formData.tution_fee_1) newErrors.tution_fee_1 = 'Tuition fee 1 is required';
    if (!formData.tution_fee_2) newErrors.tution_fee_2 = 'Tuition fee 2 is required';
    if (!formData.tution_fee_3) newErrors.tution_fee_3 = 'Tuition fee 3 is required';
    if (!formData.registration_fees) newErrors.registration_fees = 'Registration fees is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      const payload = {
        className: formData.className,
        availableSeat: formData.availableSeat,
        academic_id: formData.academic_id,
        s_id: user?.id,
        tution_fee_1: formData.tution_fee_1,
        tution_fee_2: formData.tution_fee_2,
        tution_fee_3: formData.tution_fee_3,
        registration_fees: formData.registration_fees
      };

      let response;

      if (classData) {
        // Update existing class
        console.log('Updating class with payload:', { ...payload, id: classData.id }); // Debug log
        response = await axios.post(
          `${apiUrl}/${user?.role}/SchoolManagement/class-Update`,
          {
            ...payload,
            id: classData.id
          },
          {
            headers: {
              'Authorization': `Bearer ${user?.token}`,
              'Content-Type': 'application/json'
            }
          }
        );
      } else {
        // Create new class
        console.log('Adding new class with payload:', payload); // Debug log
        response = await axios.post(
          `${apiUrl}/${user?.role}/SchoolManagement/class-Add`,
          payload,
          {
            headers: {
              'Authorization': `Bearer ${user?.token}`,
              'Content-Type': 'application/json'
            }
          }
        );
      }

      if (response.data.status) {
        toast.success(classData ? 'Class updated successfully!' : 'Class added successfully!');
        onSuccess();
      } else {
        toast.error(response.data.message || 'Operation failed');
      }
    } catch (error: any) {
      console.error('Error saving class:', error);
      toast.error(error.response?.data?.message || 'Failed to save class');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-2xl">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">
            {classData ? 'Edit Class' : 'Add Class'}
          </h3>
        </div>

        {/* Body */}
        <form onSubmit={handleSubmit}>
          <div className="px-6 py-4 max-h-96 overflow-y-auto">
            <div className="space-y-4">
              <p className="text-sm text-gray-600 mb-4">
                Fill in the details of the {classData ? 'class' : 'new class'}.
              </p>

              {/* Select Academic */}
              <div>
                <div className="mb-2">
                  <Label htmlFor="academic_id" >
                    Select Academic <span className="text-red-500">*</span>
                  </Label>
                </div>
                <Select
                  id="academic_id"
                  name="academic_id"
                  value={formData.academic_id}
                  onChange={handleInputChange}
                  className={`w-full ${errors.academic_id ? 'border-red-500' : ''}`}
                >
                  <option value="">Select Academic</option>
                  {academics.map((academic) => (
                    <option key={academic.id} value={academic.id}>
                      {academic.academic_name}
                    </option>
                  ))}
                </Select>
                {errors.academic_id && (
                  <p className="mt-1 text-sm text-red-600">{errors.academic_id}</p>
                )}
              </div>

              {/* Class Name */}
              <div>
                <div className="mb-2">
                  <Label htmlFor="className" >
                    Class Name <span className="text-red-500">*</span>
                  </Label>
                </div>
                <TextInput
                  id="className"
                  name="className"
                  value={formData.className}
                  onChange={handleInputChange}
                  placeholder="Enter class name"
                  className={errors.className ? 'border-red-500' : ''}
                />
                {errors.className && (
                  <p className="mt-1 text-sm text-red-600">{errors.className}</p>
                )}
              </div>

              {/* Available Seat */}
              <div>
                <div className="mb-2">
                  <Label htmlFor="availableSeat" >
                    Available Seat <span className="text-red-500">*</span>
                  </Label>
                </div>
                <TextInput
                  id="availableSeat"
                  name="availableSeat"
                  type="number"
                  value={formData.availableSeat}
                  onChange={handleInputChange}
                  placeholder="Enter available seats"
                  className={errors.availableSeat ? 'border-red-500' : ''}
                />
                {errors.availableSeat && (
                  <p className="mt-1 text-sm text-red-600">{errors.availableSeat}</p>
                )}
              </div>

              {/* Fees Section - 2 columns layout */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Tuition Fee 1 */}
                <div>
                  <div className="mb-2">
                    <Label htmlFor="tution_fee_1" >
                      Tuition Fee 1 <span className="text-red-500">*</span>
                    </Label>
                  </div>
                  <TextInput
                    id="tution_fee_1"
                    name="tution_fee_1"
                    type="number"
                    value={formData.tution_fee_1}
                    onChange={handleInputChange}
                    placeholder="Enter tuition fee 1"
                    className={errors.tution_fee_1 ? 'border-red-500' : ''}
                  />
                  {errors.tution_fee_1 && (
                    <p className="mt-1 text-sm text-red-600">{errors.tution_fee_1}</p>
                  )}
                </div>

                {/* Tuition Fee 2 */}
                <div>
                  <div className="mb-2">
                    <Label htmlFor="tution_fee_2" >
                      Tuition Fee 2 <span className="text-red-500">*</span>
                    </Label>
                  </div>
                  <TextInput
                    id="tution_fee_2"
                    name="tution_fee_2"
                    type="number"
                    value={formData.tution_fee_2}
                    onChange={handleInputChange}
                    placeholder="Enter tuition fee 2"
                    className={errors.tution_fee_2 ? 'border-red-500' : ''}
                  />
                  {errors.tution_fee_2 && (
                    <p className="mt-1 text-sm text-red-600">{errors.tution_fee_2}</p>
                  )}
                </div>

                {/* Tuition Fee 3 */}
                <div>
                  <div className="mb-2">
                    <Label htmlFor="tution_fee_3" >
                      Tuition Fee 3 <span className="text-red-500">*</span>
                    </Label>
                  </div>
                  <TextInput
                    id="tution_fee_3"
                    name="tution_fee_3"
                    type="number"
                    value={formData.tution_fee_3}
                    onChange={handleInputChange}
                    placeholder="Enter tuition fee 3"
                    className={errors.tution_fee_3 ? 'border-red-500' : ''}
                  />
                  {errors.tution_fee_3 && (
                    <p className="mt-1 text-sm text-red-600">{errors.tution_fee_3}</p>
                  )}
                </div>

                {/* Registration Fees */}
                <div>
                  <div className="mb-2">
                    <Label htmlFor="registration_fees" >
                      Registration Fees <span className="text-red-500">*</span>
                    </Label>
                  </div>
                  <TextInput
                    id="registration_fees"
                    name="registration_fees"
                    type="number"
                    value={formData.registration_fees}
                    onChange={handleInputChange}
                    placeholder="Enter registration fees"
                    className={errors.registration_fees ? 'border-red-500' : ''}
                  />
                  {errors.registration_fees && (
                    <p className="mt-1 text-sm text-red-600">{errors.registration_fees}</p>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="px-6 py-4 border-t border-gray-200 flex justify-end space-x-3">
            <Button
              type="button"
              color="gray"
              onClick={onClose}
              disabled={loading}
            >
              Close
            </Button>
            <Button
              type="submit"
              color="blue"
              disabled={loading}
              isProcessing={loading}
            >
              {classData ? 'Update Class' : 'Add Class'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ClassForm;