import React, { useState, useEffect } from 'react';
import { Button, TextInput, Label } from 'flowbite-react';
import { MdClose } from 'react-icons/md';
import Select from 'react-select';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useAuth } from 'src/hook/useAuth';
import { CareerApplication } from './CareerManagementTable';

interface FormField {
  type: string;
  name: string;
  label: string;
  placeholder: string;
  required: number;
  validation: string | null;
  value: string;
}

interface RowItem {
  width: string;
  gap: number;
  justify: string;
  children: FormField[];
}

interface EditModalProps {
  isOpen: boolean;
  onClose: () => void;
  application: CareerApplication | null;
  onUpdate: () => void;
}

const EditModal: React.FC<EditModalProps> = ({ isOpen, onClose, application, onUpdate }) => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(false);
  const [formRows, setFormRows] = useState<RowItem[]>([]);
  const [formData, setFormData] = useState<Record<string, any>>({});
  const [allData, setAllData] = useState<Record<string, any>>({});
  const [fileData, setFileData] = useState<Record<string, File | null>>({});
  const [candidateDetails, setCandidateDetails] = useState({
    name: '',
    email: '',
    mobile: '',
  });

  const apiUrl = import.meta.env.VITE_API_URL;

  useEffect(() => {
    if (isOpen && application?.id) {
      fetchFormData();
    }
  }, [isOpen, application]);

  const fetchFormData = async () => {
    if (!application?.id) return;

    setFetching(true);
    try {
      const response = await axios.post(
        `${apiUrl}/${user?.role}/CareerApplication/edit-form-application`,
        { application_id: application.id },
        {
          headers: {
            Authorization: `Bearer ${user?.token}`,
            'Content-Type': 'application/json',
          },
        }
      );

      if (response.data?.status === true && response.data?.data) {
        const data = response.data.data;
        setAllData(data); 
        // Set candidate details
        if (data.candidate_details) {
          setCandidateDetails({
            name: data.candidate_details.name || '',
            email: data.candidate_details.email || '',
            mobile: data.candidate_details.mobile || '',
          });
        }

        // Set form rows
        if (data.result && Array.isArray(data.result)) {
          setFormRows(data.result);
          
          // Initialize form data with values from API
          const initialFormData: Record<string, any> = {};
          data.result.forEach((row: RowItem) => {
            row.children.forEach((field: FormField) => {
              initialFormData[field.name] = field.value || '';
            });
          });
          setFormData(initialFormData);
        }
      }
    } catch (error) {
      console.error('Error fetching form data:', error);
      toast.error('Failed to load form data');
    } finally {
      setFetching(false);
    }
  };

  const handleInputChange = (fieldName: string, value: string) => {
    if (fieldName === 'name' || fieldName === 'email' || fieldName === 'mobile') {
      setCandidateDetails(prev => ({
        ...prev,
        [fieldName]: value
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [fieldName]: value
      }));
    }
  };

  const handleFileChange = (fieldName: string, file: File | null) => {
    setFileData(prev => ({
      ...prev,
      [fieldName]: file
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log(application)
    if (!allData?.application_id || !allData.academic_id || !allData.job_id) return;

    setLoading(true);
    try {
      const formDataToSend = new FormData();
      
      // Add basic fields
      formDataToSend.append('application_id', allData.application_id.toString());
      formDataToSend.append('academic_id', allData.academic_id.toString());
      formDataToSend.append('job_id', allData.job_id.toString());
      
      // Add candidate details
      formDataToSend.append('candidate_details[name]', candidateDetails.name);
      formDataToSend.append('candidate_details[email]', candidateDetails.email);
      formDataToSend.append('candidate_details[mobile]', candidateDetails.mobile);
      
      // Add other form fields
      Object.entries(formData).forEach(([key, value]) => {
        if (key !== 'name' && key !== 'email' && key !== 'mobile') {
          formDataToSend.append(key, value);
        }
      });
      
      // Add files
      Object.entries(fileData).forEach(([fieldName, file]) => {
        if (file) {
          formDataToSend.append(fieldName, file);
        }
      });

      const response = await axios.post(
        `${apiUrl}/${user?.role}/CareerApplication/update-form-application`,
        formDataToSend,
        {
          headers: {
            Authorization: `Bearer ${user?.token}`,
            'Content-Type': 'multipart/form-data',
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

  const renderFormField = (field: FormField) => {
    switch (field.type) {
      case 'text':
      case 'email':
      case 'tel':
      case 'number':
        return (
          <div key={field.name} className='mb-4'>
            <Label htmlFor={field.name} value={field.label} >
              {field.label}
              {field.required === 1 && <span className="text-red-500">*</span>}
            </Label>
            <TextInput
              id={field.name}
              name={field.name}
              type={field.type === 'tel' ? 'tel' : field.type === 'email' ? 'email' : 'text'}
              value={
                field.name === 'name' ? candidateDetails.name :
                field.name === 'email' ? candidateDetails.email :
                field.name === 'mobile' ? candidateDetails.mobile :
                formData[field.name] || ''
              }
              onChange={(e) => handleInputChange(field.name, e.target.value)}
              placeholder={field.placeholder}
              required={field.required === 1}
              className="mt-1"
            />
          </div>
        );

      case 'textarea':
        return (
          <div key={field.name}>
            <Label htmlFor={field.name} value={field.label} >
              {field.label}
              {field.required === 1 && <span className="text-red-500">*</span>}
            </Label>
            <textarea
              id={field.name}
              name={field.name}
              value={formData[field.name] || ''}
              onChange={(e) => handleInputChange(field.name, e.target.value)}
              placeholder={field.placeholder}
              required={field.required === 1}
              className="mt-1 block w-full border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 p-2.5"
              rows={3}
            />
          </div>
        );

      case 'select':
        // Assuming options come as comma separated string or JSON
        const options = field.validation ? field.validation.split(',').map(opt => ({
          value: opt.trim(),
          label: opt.trim()
        })) : [];
        
        return (
          <div key={field.name}>
            <Label htmlFor={field.name} value={field.label} >
              {field.label}
              {field.required === 1 && <span className="text-red-500">*</span>}
            </Label>
            <Select
              id={field.name}
              name={field.name}
              options={options}
              value={options.find(opt => opt.value === (formData[field.name] || ''))}
              onChange={(selected) => handleInputChange(field.name, selected?.value || '')}
              className="mt-1"
              classNamePrefix="react-select"
            />
          </div>
        );

      case 'file_button':
        return (
          <div key={field.name}>
            <Label htmlFor={field.name} value={field.label} >
              {field.label}
              {field.required === 1 && <span className="text-red-500">*</span>}
            </Label>
            <div className="mt-1 mb-2">
              <input
                type="file"
                id={field.name}
                name={field.name}
                onChange={(e) => handleFileChange(field.name, e.target.files?.[0] || null)}
                className="block w-full text-sm text-gray-500
                  file:mr-4 file:py-2 file:px-4
                  file:rounded-full file:border-0
                  file:text-sm file:font-semibold
                  file:bg-blue-50 file:text-blue-700
                  hover:file:bg-blue-100"
              />
              {/* {field.value && (
                <div className="mt-2 text-sm text-gray-600">
                  <span className="font-medium">Current file:</span>{' '}
                  {field.value}
                </div>
              )} */}
            </div>
          </div>
        );

      default:
        return (
          <div key={field.name}>
            <Label htmlFor={field.name} value={field.label} >
              {field.label}
              {field.required === 1 && <span className="text-red-500">*</span>}
            </Label>
            <TextInput
              id={field.name}
              name={field.name}
              value={formData[field.name] || ''}
              onChange={(e) => handleInputChange(field.name, e.target.value)}
              placeholder={field.placeholder}
              required={field.required === 1}
              className="mt-1"
            />
          </div>
        );
    }
  };

  const renderRow = (row: RowItem, rowIndex: number) => {
    const gridCols = row.children.length === 1 ? 'grid-cols-1' : 
                     row.children.length === 2 ? 'grid-cols-1 md:grid-cols-2' :
                     row.children.length === 3 ? 'grid-cols-1 md:grid-cols-3' :
                     'grid-cols-1 md:grid-cols-4';
    
    return (
      <div 
        key={rowIndex}
        className={`mb-2`}
        style={{ 
          width: row.width,
          justifyContent: row.justify
        }}
      >
        {row.children.map((field, fieldIndex) => (
          <div key={`${rowIndex}-${fieldIndex} mb-6`}>
            {renderFormField(field)}
          </div>
        ))}
      </div>
    );
  };

  if (!isOpen || !application) return null;

  return (
    <div className="fixed inset-0 backdrop-blur-md bg-white/10 bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b">
          <div>
            <h3 className="text-xl font-semibold text-gray-900">
              Edit Application
            </h3>
            <p className="text-sm text-gray-500 mt-1">
              Job: {application.job_title} | Reference ID: {application.refference_id}
            </p>
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
            {fetching ? (
              <div className="flex justify-center items-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                <span className="ml-3 text-gray-600">Loading form data...</span>
              </div>
            ) : (
              <>
                {/* Dynamic Form Fields */}
                {formRows.map((row, index) => renderRow(row, index))}

                {/* Read-only Job Information */}
                {/* <div className="bg-gray-50 p-4 rounded-lg mt-6">
                  <h4 className="text-sm font-medium text-gray-700 mb-3">Job Information</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-sm">
                    <div>
                      <span className="text-gray-500 block">Job Title:</span>
                      <span className="text-gray-900 font-medium">{application.job_title || 'N/A'}</span>
                    </div>
                    <div>
                      <span className="text-gray-500 block">Reference ID:</span>
                      <span className="text-gray-900 font-medium">{application.refference_id}</span>
                    </div>
                    <div>
                      <span className="text-gray-500 block">Applied Date:</span>
                      <span className="text-gray-900 font-medium">
                        {new Date(application.created_at).toLocaleDateString('en-IN')}
                      </span>
                    </div>
                  </div>
                </div> */}
              </>
            )}
          </div>

          {/* Footer */}
          <div className="p-6 flex justify-end space-x-3 border-t">
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
              disabled={loading || fetching}
              className="bg-blue-600 hover:bg-blue-700 text-white disabled:opacity-50"
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