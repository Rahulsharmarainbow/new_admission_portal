import React, { useState, useEffect } from 'react';
import { Button, TextInput, Label } from 'flowbite-react';
import { MdClose } from 'react-icons/md';
import Select from 'react-select';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useAuth } from 'src/hook/useAuth';
import { CareerApplication } from './CareerManagementTable';

interface EditModalProps {
  isOpen: boolean;
  onClose: () => void;
  application: CareerApplication | null;
  onUpdate: () => void;
}

const EditModal: React.FC<EditModalProps> = ({ isOpen, onClose, application, onUpdate }) => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    mobile: '',
    status: '',
  });

  const statusOptions = [
    { value: '1', label: 'Applied' },
    { value: '2', label: 'Shortlisted' },
    { value: '3', label: 'Interview' },
    { value: '4', label: 'Offer' },
    { value: '5', label: 'Hired' },
    { value: '6', label: 'Rejected' },
  ];

  useEffect(() => {
    if (application) {
      setFormData({
        name: application.name || '',
        email: application.email || '',
        mobile: application.mobile || '',
        status: application.status.toString() || '1',
      });
    }
  }, [application]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleStatusChange = (selectedOption: any) => {
    setFormData(prev => ({
      ...prev,
      status: selectedOption?.value || '1'
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!application?.id) return;

    setLoading(true);
    try {
      // Dummy API call - replace with actual API endpoint
      const apiUrl = import.meta.env.VITE_API_URL;
      const requestBody = {
        id: application.id,
        ...formData,
        status: parseInt(formData.status),
        s_id: user?.id || '',
      };

      const response = await axios.post(
        `${apiUrl}/${user?.role}/CareerApplication/update-career-application`,
        requestBody,
        {
          headers: {
            Authorization: `Bearer ${user?.token}`,
            'Content-Type': 'application/json',
          },
        }
      );

      if (response.data) {
        toast.success(response.data.message || 'Application updated successfully');
        onUpdate();
        onClose();
      }
    } catch (error) {
      console.error('Error updating application:', error);
      toast.error('Failed to update application');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen || !application) return null;

  return (
    <div className="fixed inset-0 backdrop-blur-md bg-white/10 bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b">
          <div>
            <h3 className="text-xl font-semibold text-gray-900">
              Edit Application
            </h3>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 p-2 rounded-full hover:bg-gray-100"
          >
            <MdClose className="w-6 h-6" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit}>
          <div className="p-6 overflow-y-auto max-h-[calc(90vh-180px)]">
            <div className="space-y-6">
              <div>
                <Label htmlFor="name" value="Full Name" />
                <TextInput
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="mt-1"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="email" value="Email Address" />
                  <TextInput
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label htmlFor="mobile" value="Mobile Number" />
                  <TextInput
                    id="mobile"
                    name="mobile"
                    value={formData.mobile}
                    onChange={handleChange}
                    required
                    className="mt-1"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="status" value="Status" />
                <Select
                  options={statusOptions}
                  value={statusOptions.find(option => option.value === formData.status)}
                  onChange={handleStatusChange}
                  className="mt-1 react-select-container"
                  classNamePrefix="react-select"
                />
              </div>

              {/* Display read-only fields */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="text-sm font-medium text-gray-700 mb-2">Additional Information</h4>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-500">Job Title:</span>
                    <span className="ml-2 text-gray-900">{application.job_title || 'N/A'}</span>
                  </div>
                  <div>
                    <span className="text-gray-500">Reference ID:</span>
                    <span className="ml-2 text-gray-900">{application.refference_id}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="p-6 flex justify-end space-x-3">
            <Button
              type="button"
              onClick={onClose}
              color="gray"
              className="bg-gray-100 hover:bg-gray-200 text-gray-700"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={loading}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              {loading ? 'Updating...' : 'Update Application'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditModal;