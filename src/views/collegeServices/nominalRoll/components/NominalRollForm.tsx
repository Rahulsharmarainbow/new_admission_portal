import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { Button, Label, Modal } from 'flowbite-react';
import axios from 'axios';
import Select from 'react-select';
import { useAuth } from 'src/hook/useAuth';
import AcademicDropdown from 'src/Frontend/Common/AcademicDropdown';
import toast from 'react-hot-toast';

interface DegreeOption {
  value: number;
  label: string;
}

interface FormData {
  academic_id: string;
  degree_id: string;
}

interface NominalRollFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const NominalRollForm: React.FC<NominalRollFormProps> = ({ isOpen, onClose, onSuccess }) => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [submitting, setSubmitting] = useState(false);
  const [degrees, setDegrees] = useState<DegreeOption[]>([]);
  const [degreeLoading, setDegreeLoading] = useState(false);

  const [formData, setFormData] = useState<FormData>({
    academic_id: '',
    degree_id: '',
  });

  const apiUrl = import.meta.env.VITE_API_URL;

  // Fetch degrees when academic_id changes
  useEffect(() => {
    if (formData.academic_id) {
      fetchDegrees(formData.academic_id);
    } else {
      setDegrees([]);
      setFormData(prev => ({ ...prev, degree_id: '' }));
    }
  }, [formData.academic_id]);

  // Reset form when modal closes
  useEffect(() => {
    if (!isOpen) {
      setFormData({
        academic_id: '',
        degree_id: '',
      });
      setDegrees([]);
    }
  }, [isOpen]);

  const fetchDegrees = async (academicId: string) => {
    setDegreeLoading(true);
    try {
      const response = await axios.post(
        `${apiUrl}/${user?.role}/Dropdown/get-degree`,
        {
          academic_id: parseInt(academicId),
        },
        {
          headers: {
            Authorization: `Bearer ${user?.token}`,
            'Content-Type': 'application/json',
          },
        },
      );

      if (response.data.data) {
        const degreeOptions = response.data.data.map((degree: any) => ({
          value: degree.value,
          label: degree.text,
        }));
        setDegrees(degreeOptions);
      }
    } catch (error) {
      console.error('Error fetching degrees:', error);
      toast.error('Failed to fetch degrees');
    } finally {
      setDegreeLoading(false);
    }
  };

  const handleSelectChange = (name: keyof FormData) => (selected: any) => {
    setFormData(prev => ({
      ...prev,
      [name]: selected ? selected.value : '',
    }));
  };

  const handleAcademicChange = (academicId: string) => {
    setFormData(prev => ({
      ...prev,
      academic_id: academicId,
      degree_id: '', // Reset degree when academic changes
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.academic_id || !formData.degree_id) {
      toast.error('Please select both academic and degree');
      return;
    }

    setSubmitting(true);

    try {
      const payload = {
        academic_id: formData.academic_id,
        degree_id: formData.degree_id,
        s_id: user?.id,
      };

      console.log('Submitting payload:', payload);

      const response = await axios.post(
        `${apiUrl}/${user?.role}/CollegeManagement/Nominal/add`,
        payload,
        {
          headers: {
            Authorization: `Bearer ${user?.token}`,
            'Content-Type': 'application/json',
          },
        },
      );

      console.log('API Response:', response.data);

      if (response.data.status === true) {
        toast.success(response.data.message || 'Nominal roll added successfully!');
        onSuccess();
        onClose();
      } else {
        toast.error(response.data.message || 'Failed to add nominal roll');
      }
    } catch (error: any) {
      console.error('Error submitting form:', error);
      toast.error('Failed to add nominal roll');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal show={isOpen} onClose={onClose} size="md">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b rounded-t dark:border-gray-600">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          Add Nominal Roll
        </h3>
        <button
          type="button"
          className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white"
          onClick={onClose}
        >
          <svg className="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
            <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"/>
          </svg>
          <span className="sr-only">Close modal</span>
        </button>
      </div>

      {/* Body */}
      <div className="p-4 space-y-4">
        <div className="space-y-4">
          {/* Academic Dropdown */}
          <div>
            <Label htmlFor="academic_id" value="Select Academic *" className="block mb-2" />
            <AcademicDropdown
              value={formData.academic_id}
              onChange={handleAcademicChange}
              placeholder="Search and select academic..."
              label=""
            />
          </div>

          {/* Degree Dropdown */}
          <div>
            <Label htmlFor="degree_id" value="Select Degree *" className="block mb-2" />
            <Select
              id="degree_id"
              isLoading={degreeLoading}
              isDisabled={!formData.academic_id || degreeLoading}
              options={degrees}
              value={degrees.find(opt => opt.value.toString() === formData.degree_id)}
              onChange={handleSelectChange('degree_id')}
              placeholder={formData.academic_id ? "Select degree..." : "First select academic"}
              classNamePrefix="react-select"
              styles={{
                control: (base) => ({
                  ...base,
                  borderColor: "#d1d5db",
                  borderRadius: "0.5rem",
                  padding: "2px",
                  minHeight: "42px",
                  boxShadow: "none",
                  "&:hover": { borderColor: "#93c5fd" },
                }),
              }}
            />
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="flex items-center p-4 border-t border-gray-200 rounded-b dark:border-gray-600">
        <Button
          color="gray"
          onClick={onClose}
          disabled={submitting}
          className="mr-2"
        >
          Cancel
        </Button>
        <Button
          onClick={handleSubmit}
          color="primary"
          disabled={submitting || !formData.academic_id || !formData.degree_id}
        >
          {submitting ? 'Generating...' : 'Generate Nominal Roll'}
        </Button>
      </div>
    </Modal>
  );
};

export default NominalRollForm;
