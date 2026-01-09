// AddEditJobModal.tsx
import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import {
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  TextInput,
  Label,
  Spinner
} from 'flowbite-react';
import JoditEditor from 'jodit-react';

interface JobTypeConfig {
  type_name: string;
  data: Array<{
    id: number;
    name: string;
  }>;
}

interface AddEditJobModalProps {
  show: boolean;
  onClose: () => void;
  onSubmit: (data: any) => Promise<void>;
  modalType: 'add' | 'edit';
  selectedJob: any;
  jobTypeConfig: JobTypeConfig[];
  loadingJobDetails: boolean;
  academicId: string;
}

const AddEditJobModal: React.FC<AddEditJobModalProps> = ({
  show,
  onClose,
  onSubmit,
  modalType,
  selectedJob,
  jobTypeConfig,
  loadingJobDetails,
  academicId
}) => {
  const [jobTitle, setJobTitle] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [description, setDescription] = useState('');
  const [requirements, setRequirements] = useState<string[]>(['']);
  const [tempRequirement, setTempRequirement] = useState('');
  const [saving, setSaving] = useState(false);
  
  // Dynamic dropdown values
  const [dropdownValues, setDropdownValues] = useState<Record<string, number | ''>>({});

  const editorRef = useRef(null);

  const editorConfig = useMemo(
    () => ({
      readonly: false,
      height: 300,
      toolbarSticky: false,
      toolbarAdaptive: false,
      buttons: [
        'source',
        '|',
        'bold',
        'italic',
        'underline',
        'strikethrough',
        '|',
        'ul',
        'ol',
        '|',
        'font',
        'fontsize',
        'brush',
        'paragraph',
        '|',
        'image',
        'video',
        'table',
        'link',
        '|',
        'left',
        'center',
        'right',
        'justify',
        '|',
        'undo',
        'redo',
        '|',
        'hr',
        'eraser',
        'copyformat',
        'fullsize',
      ],
      showXPathInStatusbar: false,
      showCharsCounter: false,
      showWordsCounter: false,
      uploader: { insertImageAsBase64URI: true },
      placeholder: 'Enter job description here...',
      theme: 'default',
    }),
    [],
  );

  const handleEditorBlur = useCallback((newContent: string) => {
    setDescription(newContent);
  }, []);

  // Initialize dropdown values from jobTypeConfig
  useEffect(() => {
    if (jobTypeConfig.length > 0) {
      const initialValues: Record<string, number | ''> = {};
      jobTypeConfig.forEach(config => {
        initialValues[config.type_name] = '';
      });
      setDropdownValues(initialValues);
    }
  }, [jobTypeConfig]);

  // Load job data for edit mode
  useEffect(() => {
    if (modalType === 'edit' && selectedJob) {
      setJobTitle(selectedJob.job_title || '');
      setCompanyName(selectedJob.company_name || '');
      setDescription(selectedJob.description || '');
      
      // Load dropdown values if available in selectedJob
      if (selectedJob.job_meta) {
        const metaValues: Record<string, number | ''> = { ...dropdownValues };
        Object.entries(selectedJob.job_meta).forEach(([key, value]) => {
          if (typeof value === 'number') {
            metaValues[key] = value;
          }
        });
        setDropdownValues(metaValues);
      }
      
      // Load requirements
      if (selectedJob.requirements && Array.isArray(selectedJob.requirements)) {
        setRequirements(selectedJob.requirements);
      }
    } else {
      // Reset form for add mode
      resetForm();
    }
  }, [modalType, selectedJob]);

  const resetForm = () => {
    setJobTitle('');
    setCompanyName('');
    setDescription('');
    setRequirements(['']);
    setTempRequirement('');
    
    // Reset dropdown values
    const resetValues: Record<string, number | ''> = {};
    jobTypeConfig.forEach(config => {
      resetValues[config.type_name] = '';
    });
    setDropdownValues(resetValues);
  };

  const addRequirement = () => {
    if (tempRequirement.trim()) {
      setRequirements([...requirements, tempRequirement.trim()]);
      setTempRequirement('');
    }
  };

  const removeRequirement = (index: number) => {
    const newRequirements = [...requirements];
    newRequirements.splice(index, 1);
    setRequirements(newRequirements);
  };

  const updateRequirement = (index: number, value: string) => {
    const newRequirements = [...requirements];
    newRequirements[index] = value;
    setRequirements(newRequirements);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!jobTitle || !companyName || !description) {
      alert('Please fill all required fields');
      return;
    }

    const filteredRequirements = requirements.filter(req => req.trim() !== '');

    if (filteredRequirements.length === 0) {
      alert('Please add at least one requirement');
      return;
    }

    setSaving(true);

    try {
      // Prepare job_meta object with all dropdown values
      const job_meta: Record<string, number> = {};
      Object.entries(dropdownValues).forEach(([key, value]) => {
        if (value !== '') {
          job_meta[key] = value as number;
        }
      });

      const requestData: any = {
        academic_id: parseInt(academicId),
        job_title: jobTitle,
        company_name: companyName,
        description: description,
        requirements: filteredRequirements,
        job_meta: job_meta // Send all dropdown values in job_meta
      };

      // Add job_id for edit mode
      if (modalType === 'edit' && selectedJob?.id) {
        requestData.job_id = selectedJob.id;
      }

      await onSubmit(requestData);
      
      // Reset form and close modal on success
      resetForm();
      onClose();
    } catch (error) {
      console.error('Error saving job:', error);
    } finally {
      setSaving(false);
    }
  };

  const handleDropdownChange = (typeName: string, value: string) => {
    setDropdownValues(prev => ({
      ...prev,
      [typeName]: value ? parseInt(value) : ''
    }));
  };

  return (
    <Modal 
      show={show} 
      onClose={onClose} 
      size="3xl"
      className="overflow-y-auto max-h-[90vh]"
    >
      <ModalHeader>
        {modalType === 'add' ? 'Add New Job' : 'Edit Job'}
        {loadingJobDetails && modalType === 'edit' && (
          <Spinner size="sm" className="ml-2" />
        )}
      </ModalHeader>
      <form onSubmit={handleSubmit}>
        <ModalBody className="overflow-y-auto max-h-[60vh]">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Label htmlFor="jobTitle" className="block mb-2">
                Job Title *
              </Label>
              <TextInput
                id="jobTitle"
                type="text"
                value={jobTitle}
                onChange={(e) => setJobTitle(e.target.value)}
                placeholder="e.g., Software Engineer"
                required
                disabled={loadingJobDetails}
              />
            </div>

            <div>
              <Label htmlFor="companyName" className="block mb-2">
                Company Name *
              </Label>
              <TextInput
                id="companyName"
                type="text"
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                placeholder="e.g., Tech Solutions Inc."
                required
                disabled={loadingJobDetails}
              />
            </div>

            {/* Dynamic Dropdowns from API */}
            {jobTypeConfig.map((config) => (
              <div key={config.type_name}>
                <Label htmlFor={config.type_name} className="block mb-2">
                  {config.type_name}
                </Label>
                <select
                  id={config.type_name}
                  value={dropdownValues[config.type_name] || ''}
                  onChange={(e) => handleDropdownChange(config.type_name, e.target.value)}
                  disabled={loadingJobDetails}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">Select {config.type_name}</option>
                  {config.data.map((option) => (
                    <option key={option.id} value={option.id}>
                      {option.name}
                    </option>
                  ))}
                </select>
              </div>
            ))}

            {/* Requirements Section */}
            <div className="md:col-span-2">
              <Label className="block mb-2">
                Requirements *
              </Label>
              <div className="space-y-2 mb-3">
                {requirements.map((req, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <TextInput
                      type="text"
                      value={req}
                      onChange={(e) => updateRequirement(index, e.target.value)}
                      placeholder={`Requirement ${index + 1}`}
                      className="flex-1"
                      disabled={loadingJobDetails}
                    />
                    {requirements.length > 1 && (
                      <Button
                        type="button"
                        color="failure"
                        size="xs"
                        onClick={() => removeRequirement(index)}
                        disabled={loadingJobDetails}
                      >
                        Remove
                      </Button>
                    )}
                  </div>
                ))}
              </div>
              
              <div className="flex items-center gap-2">
                <TextInput
                  type="text"
                  value={tempRequirement}
                  onChange={(e) => setTempRequirement(e.target.value)}
                  placeholder="Add new requirement"
                  className="flex-1"
                  disabled={loadingJobDetails}
                />
                <Button
                  type="button"
                  color="success"
                  onClick={addRequirement}
                  disabled={loadingJobDetails || !tempRequirement.trim()}
                >
                  Add
                </Button>
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Click "Add" to add a new requirement. At least one requirement is required.
              </p>
            </div>

            {/* Job Description Editor */}
            <div className="md:col-span-2">
              <Label htmlFor="description" className="block mb-2">
                Job Description *
              </Label>
              <div className="border border-gray-300 rounded-lg overflow-hidden">
                <JoditEditor
                  ref={editorRef}
                  value={description}
                  config={editorConfig}
                  onBlur={handleEditorBlur}
                />
              </div>
            </div>
          </div>
        </ModalBody>
        <ModalFooter>
          <Button
            type="button"
            color="light"
            onClick={onClose}
            disabled={saving || loadingJobDetails}
          >
            Cancel
          </Button>
          <Button 
            type="submit" 
            color="primary" 
            disabled={saving || loadingJobDetails}
          >
            {saving ? (
              <>
                <Spinner size="sm" className="mr-2" />
                {modalType === 'add' ? 'Adding...' : 'Updating...'}
              </>
            ) : (
              modalType === 'add' ? 'Add Job' : 'Update Job'
            )}
          </Button>
        </ModalFooter>
      </form>
    </Modal>
  );
};

export default AddEditJobModal;