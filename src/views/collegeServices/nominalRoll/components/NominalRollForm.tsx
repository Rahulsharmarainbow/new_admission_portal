import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { Button, Label, Modal, ModalHeader } from 'flowbite-react';
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
    academic_id: user?.role === 'CustomerAdmin' ? user?.academic_id?.toString() || '' : '',
    degree_id: '',
  });

  const apiUrl = import.meta.env.VITE_API_URL;
console.log(formData);
  // Fetch degrees when academic_id changes
  useEffect(() => {
    if (formData.academic_id && isOpen) {
      fetchDegrees(formData.academic_id);
    } else {
      setDegrees([]);
      setFormData(prev => ({ ...prev, degree_id: '' }));
    }
  }, [formData.academic_id, isOpen]);

  // Reset form when modal closes
  useEffect(() => {
    if (!isOpen) {
      setFormData({
        academic_id: user?.role === 'CustomerAdmin' ? user?.academic_id?.toString() || '' : '',
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
          s_id: user?.id || "",
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
    
    if (!formData.academic_id && user?.role != "CustomerAdmin") {
      toast.error('Please select academic');
      return;
    }
    if (!formData.degree_id) {
      toast.error('Please select degree');
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
    <Modal show={isOpen} onClose={onClose} size="lg">
      <ModalHeader>Add Nominal Roll</ModalHeader>

      {/* Body */}
      <div className="p-4 space-y-4">
        <div className="space-y-4">
          {/* Academic Dropdown */}
           {(user?.role === 'SuperAdmin' || user?.role === 'SupportAdmin') &&  ( <div>
            <Label htmlFor="academic_id" className="block mb-2" >
              Select Academic <span className="text-red-500">*</span>
            </Label>
            <AcademicDropdown
              value={formData.academic_id}
              onChange={handleAcademicChange}
              placeholder="Search and select academic..."
              label=""
            />
          </div> )}

          {/* Degree Dropdown */}
          <div>
            <Label htmlFor="degree_id" className="block mb-2" >
              Select Degree <span className="text-red-500">*</span> 
            </Label>
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
      <div className="flex items-end p-4 border-t border-gray-200 rounded-b dark:border-gray-600">
        <Button
          color="alternative"
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
