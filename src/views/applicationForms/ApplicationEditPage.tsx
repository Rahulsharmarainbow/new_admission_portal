import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router';
import axios from 'axios';
import toast from 'react-hot-toast';
import { Button, Card } from 'flowbite-react';
import { FaArrowLeft } from 'react-icons/fa';
import Loader from 'src/Frontend/Common/Loader';
import { useAuth } from 'src/hook/useAuth';
import BreadcrumbHeader from 'src/Frontend/Common/BreadcrumbHeader';

interface FormField {
  type: string;
  id: number;
  name: string;
  apiurl?: string;
  label: string;
  resolution?: string;
  width: string;
  placeholder?: string;
  options: Array<{ value: number | string; text: string }>;
  required: number;
  style?: string | object;
  target?: string;
  validation?: string;
  max_date?: string;
  content?: string;
  h_target?: string;
  v_target?: string;
}

interface FormSection {
  width: string;
  gap: number;
  justify: string;
  children: FormField[];
}

interface ApplicationData {
  id: number;
  applicant_name: string;
  academic_id?: number;
}

interface CandidateDetails {
  [key: string]: string;
}

interface Lookups {
  [key: string]: Array<{ value: number | string; text: string }>;
}

interface ApiResponse {
  data: FormSection[];
  application_data: ApplicationData;
  candidate_details: CandidateDetails;
  lookups: Lookups;
}

const ApplicationEditPage: React.FC = () => {
  const { applicationId } = useParams<{ applicationId: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState<CandidateDetails>({});
  const [formSections, setFormSections] = useState<FormSection[]>([]);
  const [lookups, setLookups] = useState<Lookups>({});
  const [application, setApplication] = useState<ApplicationData | null>(null);
  const [dynamicOptions, setDynamicOptions] = useState<{
    [key: string]: Array<{ value: number | string; text: string }>;
  }>({});
  const [filePreviews, setFilePreviews] = useState<{ [key: string]: string }>({});
  const [selectedFiles, setSelectedFiles] = useState<{ [key: string]: File }>({});
  const [visibleFields, setVisibleFields] = useState<{ [key: string]: boolean }>({});

  const apiUrl = import.meta.env.VITE_API_URL;
  const apiAssetsUrl = import.meta.env.VITE_ASSET_URL;

  // Fetch states data
  const fetchStates = async () => {
    try {
      const response = await axios.get(`${apiUrl}/frontend/get_states`, {
        headers: {
          Authorization: `Bearer ${user?.token}`,
          'Content-Type': 'application/json',
        },
      });

      let stateOptions: Array<{ value: number | string; text: string }> = [];

      if (response.data && response.data.states) {
        stateOptions = response.data.states.map((state: any) => ({
          value: `${state.state_id}$${state.state_title}`,
          text: state.state_title,
        }));
      }

      if (stateOptions.length > 0) {
        // Set states for all state fields
        const stateFields = [
          'selectBelong',
          'address_state',
          'class6_state',
          'class7_state',
          'class8_state',
          'class9_state',
          'class10_state',
          'inter1st_state',
          'inter2nd_state',
        ];

        const newDynamicOptions: any = {};
        stateFields.forEach((field) => {
          newDynamicOptions[field] = stateOptions;
        });

        setDynamicOptions((prev) => ({
          ...prev,
          ...newDynamicOptions,
        }));

        // After states are loaded, fetch districts for pre-selected states
        stateFields.forEach((fieldName) => {
          const stateValue = formData[fieldName];
          if (stateValue && stateValue !== '') {
            const stateId = stateValue.split('$')[0];
            const targetField = getTargetFieldForState(fieldName);
            if (targetField && stateId) {
              fetchDistricts(stateId, targetField, stateValue);
            }
          }
        });
      }
    } catch (error) {
      console.error('Error fetching states:', error);
    }
  };

  // Get target field for state dropdown
  const getTargetFieldForState = (stateFieldName: string): string => {
    const fieldMap: { [key: string]: string } = {
      selectBelong: 'selectDistrict',
      address_state: 'address_district',
      class6_state: 'class6_district',
      class7_state: 'class7_district',
      class8_state: 'class8_district',
      class9_state: 'class9_district',
      class10_state: 'class10_district',
      inter1st_state: 'inter1st_district',
      inter2nd_state: 'inter2nd_district',
    };
    return fieldMap[stateFieldName] || '';
  };

  // Fetch districts by state ID
  const fetchDistricts = async (
    stateId: string | number,
    targetField: string,
    stateValue?: string,
  ) => {
    try {
      const response = await axios.post(
        `${apiUrl}/frontend/get_district_by_state_id`,
        { state_id: stateId },
        {
          headers: {
            Authorization: `Bearer ${user?.token}`,
            'Content-Type': 'application/json',
          },
        },
      );

      let districtOptions: Array<{ value: number | string; text: string }> = [];

      if (response.data && response.data.districts) {
        districtOptions = response.data.districts.map((district: any) => ({
          value: `${district.id}$${district.district_title}`,
          text: district.district_title,
        }));
      }

      setDynamicOptions((prev) => ({
        ...prev,
        [targetField]: districtOptions,
      }));

      // Auto-select district if we have matching district in formData
      if (stateValue && formData[targetField]) {
        const currentDistrictValue = formData[targetField];
        
        // If district value is in id$value format, check if it exists in new options
        if (currentDistrictValue.includes('$')) {
          const districtExists = districtOptions.some(
            option => option.value === currentDistrictValue
          );
          
          if (!districtExists) {
            // Clear district if it doesn't exist in new options
            setFormData(prev => ({
              ...prev,
              [targetField]: ''
            }));
          }
        } else {
          // If district value is just ID, find matching option
          const matchingDistrict = districtOptions.find(
            district => district.value.split('$')[0] === currentDistrictValue
          );
          
          if (matchingDistrict) {
            setFormData(prev => ({
              ...prev,
              [targetField]: matchingDistrict.value
            }));
          } else {
            // Clear district if no match found
            setFormData(prev => ({
              ...prev,
              [targetField]: ''
            }));
          }
        }
      }
    } catch (error) {
      console.error('Error fetching districts:', error);
    }
  };

  // Update field visibility based on h_target and v_target - APPLY FORM LOGIC
  const updateFieldVisibility = (fieldName: string, value: string) => {
    const newVisibleFields = { ...visibleFields };

    formSections.forEach((section) => {
      section.children.forEach((field) => {
        if (field.h_target === fieldName) {
          let shouldShow = false;
          
          if (field.v_target) {
            // Handle multiple v_target values (comma separated)
            const vTargetValues = field.v_target.split(',');
            
            // Extract value part for comparison (for id$value format)
            const valuePart = value && value.includes('$') ? value.split('$')[0] : value;
            
            shouldShow = vTargetValues.some(vTarget => {
              const vTargetPart = vTarget && vTarget.includes('$') ? vTarget.split('$')[0] : vTarget;
              return valuePart === vTargetPart;
            });
          } else {
            shouldShow = !!value;
          }
          
          newVisibleFields[field.name] = shouldShow;
        }
      });
    });

    setVisibleFields(newVisibleFields);
  };

  // Initialize field visibility - APPLY FORM LOGIC
  const initializeFieldVisibility = (data: CandidateDetails) => {
    const initialVisibility: { [key: string]: boolean } = {};

    formSections.forEach((section) => {
      section.children.forEach((field) => {
        if (field.h_target) {
          const targetValue = data[field.h_target];
          let shouldShow = false;
          
          if (field.v_target) {
            // Handle multiple v_target values (comma separated)
            const vTargetValues = field.v_target.split(',');
            
            // Extract value part for comparison (for id$value format)
            const targetValuePart = targetValue && targetValue.includes('$') 
              ? targetValue.split('$')[0] 
              : targetValue;
            
            shouldShow = vTargetValues.some(vTarget => {
              const vTargetPart = vTarget && vTarget.includes('$') ? vTarget.split('$')[0] : vTarget;
              return targetValuePart === vTargetPart;
            });
          } else {
            shouldShow = !!targetValue;
          }
          
          initialVisibility[field.name] = shouldShow;
        } else {
          initialVisibility[field.name] = true;
        }
      });
    });

    setVisibleFields(initialVisibility);
  };

  // Fetch application form data
  const fetchApplicationData = async () => {
    if (!applicationId) return;

    setLoading(true);
    try {
      const response = await axios.post<ApiResponse>(
        `${apiUrl}/${user?.role}/Applications/get-Applications-form-data`,
        { application_id: parseInt(applicationId) },
        {
          headers: {
            Authorization: `Bearer ${user?.token}`,
            'Content-Type': 'application/json',
          },
        },
      );

      console.log('API Response:', response.data);

      if (response.data) {
        setFormSections(response.data.data || []);
        setLookups(response.data.lookups || {});
        setApplication(response.data.application_data);

        // Set form data from candidate_details
        if (response.data.candidate_details) {
          const candidateData = response.data.candidate_details;
          const lookupsData = response.data.lookups || {};

          // Create a clean form data object with proper values
          const cleanFormData: CandidateDetails = {};

          // Map all fields from candidate_details to form data
          Object.keys(candidateData).forEach((key) => {
            // Use the actual field values (without S prefix for form data)
            if (!key.startsWith('S')) {
              const value = candidateData[key];
              const sKey = `S${key}`;
              const sValue = candidateData[sKey];

              // For select fields that have corresponding S-prefixed text values
              if (value && sValue) {
                // Convert to id$value format
                cleanFormData[key] = `${value}$${sValue}`;
              } else {
                cleanFormData[key] = value || '';
              }
            }
          });

          // Handle special cases where S-prefix might not exist
          const selectFields = [
            'blood_group', 'gender', 'relationship', 
            'child_has_any_issue', 'school_transport_required'
          ];
          
          selectFields.forEach(field => {
            if (cleanFormData[field] && !cleanFormData[field].includes('$')) {
              // Find the text value from lookups
              const lookupKey = Object.keys(lookupsData).find(
                lookup => lookupsData[lookup].some(option => 
                  option.value.toString() === cleanFormData[field] || 
                  option.value === cleanFormData[field]
                )
              );
              
              if (lookupKey) {
                const option = lookupsData[lookupKey].find(opt => 
                  opt.value.toString() === cleanFormData[field] || 
                  opt.value === cleanFormData[field]
                );
                if (option) {
                  cleanFormData[field] = `${cleanFormData[field]}$${option.text}`;
                }
              }
            }
          });

          console.log('Clean Form Data:', cleanFormData);
          setFormData(cleanFormData);
          
          // Initialize field visibility after a small delay to ensure formSections are set
          setTimeout(() => {
            initializeFieldVisibility(cleanFormData);
          }, 100);

          // Set file previews for existing files
          const previews: { [key: string]: string } = {};
          if (candidateData.candidate_pic) {
            previews.candidate_pic = `${apiAssetsUrl}/${candidateData.candidate_pic}`;
          }
          if (candidateData.candidate_signature) {
            previews.candidate_signature = `${apiAssetsUrl}/${candidateData.candidate_signature}`;
          }
          if (candidateData.caste_certificate) {
            previews.caste_certificate = `${apiAssetsUrl}/${candidateData.caste_certificate}`;
          }
          if (candidateData.birth_certificate) {
            previews.birth_certificate = `${apiAssetsUrl}/${candidateData.birth_certificate}`;
          }
          if (candidateData.transfer_certificate) {
            previews.transfer_certificate = `${apiAssetsUrl}/${candidateData.transfer_certificate}`;
          }
          if (candidateData.final_exam_report_card) {
            previews.final_exam_report_card = `${apiAssetsUrl}/${candidateData.final_exam_report_card}`;
          }
          setFilePreviews(previews);

          // Fetch states after form data is loaded
          setTimeout(() => {
            fetchStates();
          }, 200);
        }
      }
    } catch (error) {
      console.error('Error fetching application data:', error);
      toast.error('Failed to load application data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApplicationData();
  }, [applicationId]);

  // Handle lookups dependency for select fields
  useEffect(() => {
    if (Object.keys(lookups).length > 0 && Object.keys(formData).length > 0) {
      const updatedFormData = { ...formData };
      let needsUpdate = false;

      const selectFields = [
        'blood_group', 'gender', 'relationship', 
        'child_has_any_issue', 'school_transport_required'
      ];
      
      selectFields.forEach(field => {
        if (updatedFormData[field] && !updatedFormData[field].includes('$')) {
          const lookupKey = Object.keys(lookups).find(
            lookup => lookups[lookup].some(option => 
              option.value.toString() === updatedFormData[field] || 
              option.value === updatedFormData[field]
            )
          );
          
          if (lookupKey) {
            const option = lookups[lookupKey].find(opt => 
              opt.value.toString() === updatedFormData[field] || 
              opt.value === updatedFormData[field]
            );
            if (option) {
              updatedFormData[field] = `${updatedFormData[field]}$${option.text}`;
              needsUpdate = true;
            }
          }
        }
      });

      if (needsUpdate) {
        setFormData(updatedFormData);
      }
    }
  }, [lookups]);

  // Handle state change - fetch districts
  const handleStateChange = (fieldName: string, value: string, targetField: string) => {
    const stateId = value.split('$')[0];

    setFormData((prev) => ({
      ...prev,
      [fieldName]: value,
      [targetField]: '', // Clear district when state changes
    }));

    // Update field visibility
    updateFieldVisibility(fieldName, value);

    if (stateId && value) {
      fetchDistricts(stateId, targetField, value);
    }
  };

  // Handle input changes
  const handleInputChange = (fieldName: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [fieldName]: value,
    }));

    // Update field visibility for dependent fields
    updateFieldVisibility(fieldName, value);
  };

  // Handle file selection with preview
  const handleFileSelect = (fieldName: string, file: File) => {
    if (file) {
      // Store the file
      setSelectedFiles((prev) => ({
        ...prev,
        [fieldName]: file,
      }));

      // Create preview for images
      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = (e) => {
          setFilePreviews((prev) => ({
            ...prev,
            [fieldName]: e.target?.result as string,
          }));
        };
        reader.readAsDataURL(file);
      }

      toast.success(`${file.name} selected for upload`);
    }
  };

  // Handle form submission with file upload - APPLY FORM PATTERN
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      // Create FormData for file upload
      const submitFormData = new FormData();
      
      // Add basic data
      submitFormData.append('application_id', applicationId || '');
      submitFormData.append('customer_id', user?.id?.toString() || '');
      submitFormData.append('academic_id', application?.academic_id?.toString() || '');
      submitFormData.append('s_id', user?.id?.toString() || '');
      
      // Process form data - APPLY FORM PATTERN (send id$value format)
      const mainData: any = { ...formData };
      const sData: any = {}; // For text values
      
      Object.keys(mainData).forEach(key => {
        const value = mainData[key];
        
        // Handle id$value format for select fields
        if (typeof value === 'string' && value.includes('$')) {
          const [idPart, ...textParts] = value.split('$');
          const textValue = textParts.join('$');
          
          // Send only ID part in maindata (like apply form)
          mainData[key] = idPart;
          
          // Store text part in S-data
          sData[`S${key}`] = textValue;
        } else {
          // For non-select fields
          mainData[key] = value;
        }
      });
      
      // Add files to FormData
      Object.keys(selectedFiles).forEach(fieldName => {
        submitFormData.append(fieldName, selectedFiles[fieldName]);
        // Remove file fields from mainData since they'll be sent as files
        delete mainData[fieldName];
      });
      
      submitFormData.append('maindata', JSON.stringify(mainData));
      submitFormData.append('sdata', JSON.stringify(sData));

      console.log('Submitting data - MAIN DATA:', mainData);
      console.log('Submitting data - S DATA:', sData);

      const response = await axios.post(
        `${apiUrl}/${user?.role}/Applications/Applications-update`,
        submitFormData,
        {
          headers: {
            Authorization: `Bearer ${user?.token}`,
            'Content-Type': 'multipart/form-data',
          },
        }
      );

      if (response.data.success) {
        toast.success('Application updated successfully');
        navigate(-1);
      } else {
        throw new Error(response.data.message || 'Failed to update application');
      }
    } catch (error: any) {
      console.error('Error updating application:', error);
      toast.error(error.response?.data?.message || 'Failed to update application');
    } finally {
      setSaving(false);
    }
  };

  // Get field options with proper fallback and id$value format
  const getFieldOptions = (field: FormField) => {
    let options: Array<{ value: number | string; text: string }> = [];

    // For board fields - check lookups.boards first
    if (field.name === 'board' || field.name === 'board1') {
      if (lookups.boards && lookups.boards.length > 0) {
        options = lookups.boards;
      }
    }

    // For state fields with apiurl
    if (field.apiurl && field.apiurl.includes('get_district_by_state_id')) {
      options = dynamicOptions[field.name] || [];
    }

    // For district fields
    if (field.name.includes('district')) {
      options = dynamicOptions[field.name] || [];
    }

    // For regular fields - check dynamic options first
    if (dynamicOptions[field.name] && dynamicOptions[field.name].length > 0) {
      options = dynamicOptions[field.name];
    }

    // Then check field's own options
    if (options.length === 0 && field.options && field.options.length > 0) {
      options = field.options;
    }

    // Then check lookups for other fields
    if (options.length === 0) {
      const lookupKey = Object.keys(lookups).find(
        (key) =>
          key.toLowerCase().includes(field.name.toLowerCase()) ||
          field.name.toLowerCase().includes(key.toLowerCase()),
      );

      if (lookupKey && lookups[lookupKey]) {
        options = lookups[lookupKey];
      }
    }

    // Convert all options to id$value format
    const formattedOptions = options.map((option) => {
      if (typeof option.value === 'string' && option.value.includes('$')) {
        // Already in id$value format
        return option;
      } else {
        // Convert to id$value format
        return {
          value: `${option.value}$${option.text}`,
          text: option.text,
        };
      }
    });

    return formattedOptions;
  };

  // Check if field is a state field with district API
  const isStateFieldWithAPI = (field: FormField) => {
    return field.apiurl && field.apiurl.includes('get_district_by_state_id');
  };

  // Check if field is a district field
  const isDistrictField = (fieldName: string) => {
    return fieldName.includes('district');
  };

  // Get target field for state dropdown
  const getTargetField = (field: FormField) => {
    if (field.target) return field.target;
    return '';
  };

  // Get field label
  const getFieldLabel = (field: FormField) => {
    if (field.label && field.label.trim() !== '') {
      return field.label;
    }

    // Generate label from field name
    const name = field.name
      .replace(/([A-Z])/g, ' $1')
      .replace(/-/g, ' ')
      .replace(/_/g, ' ');
    return name.charAt(0).toUpperCase() + name.slice(1);
  };

  // Render form field based on type
  const renderFormField = (field: FormField) => {
    const value = formData[field.name] || '';
    const fieldOptions = getFieldOptions(field);
    const isVisible = visibleFields[field.name] !== false;

    // Skip rendering if field is not visible
    if (!isVisible) return null;

    const baseInputClasses = "w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors outline-none";
    const baseSelectClasses = "w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors outline-none";

    switch (field.type) {
      case 'text':
      case 'adhar':
        return (
          <input
            type="text"
            value={value}
            onChange={(e) => handleInputChange(field.name, e.target.value)}
            placeholder={field.placeholder}
            className={baseInputClasses}
            required={field.required === 1}
          />
        );

      case 'select':
        // State dropdown with district API
        if (isStateFieldWithAPI(field)) {
          const targetField = getTargetField(field);
          const stateOptions = dynamicOptions[field.name] || [];
          
          return (
            <div>
              <select
                value={value}
                onChange={(e) => handleStateChange(field.name, e.target.value, targetField)}
                className={baseSelectClasses}
                required={field.required === 1}
              >
                <option value="">Select {getFieldLabel(field)}</option>
                {stateOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.text}
                  </option>
                ))}
              </select>
              {stateOptions.length === 0 && (
                <p className="text-xs text-gray-500 mt-1">Loading states...</p>
              )}
            </div>
          );
        }
        
        // District dropdown - FIXED AUTO-SELECT
        if (isDistrictField(field.name)) {
          const districtOptions = dynamicOptions[field.name] || [];
          const isDisabled = districtOptions.length === 0;
          
          return (
            <div>
              <select
                value={value}
                onChange={(e) => handleInputChange(field.name, e.target.value)}
                className={`${baseSelectClasses} ${
                  isDisabled ? 'bg-gray-100 text-gray-500 border-gray-200' : ''
                }`}
                required={field.required === 1}
                disabled={isDisabled}
              >
                <option value="">
                  {isDisabled ? 'Select State First' : `Select ${getFieldLabel(field)}`}
                </option>
                {districtOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.text}
                  </option>
                ))}
              </select>
              {isDisabled && value && (
                <p className="text-xs text-yellow-600 mt-1">Please select state first to load districts</p>
              )}
            </div>
          );
        }

        // Regular select dropdown
        return (
          <select
            value={value}
            onChange={(e) => handleInputChange(field.name, e.target.value)}
            className={baseSelectClasses}
            required={field.required === 1}
          >
            <option value="">Select {getFieldLabel(field)}</option>
            {fieldOptions.map(option => (
              <option key={option.value} value={option.value}>
                {option.text}
              </option>
            ))}
          </select>
        );

      case 'date':
        return (
          <input
            type="date"
            value={value}
            onChange={(e) => handleInputChange(field.name, e.target.value)}
            className={baseInputClasses}
            required={field.required === 1}
          />
        );

      case 'file_button':
        const selectedFile = selectedFiles[field.name];
        const existingFileUrl = formData[field.name] ? `${apiAssetsUrl}/${formData[field.name]}` : '';
        const previewUrl = filePreviews[field.name] || existingFileUrl;

        return (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5 flex flex-col justify-between transition hover:shadow-md h-full">
            <div className="mb-3">
              <p className="text-sm font-semibold text-gray-800 mb-1">
                {getFieldLabel(field)}
                {field.required === 1 && <span className="text-red-500 ml-1">*</span>}
              </p>
              {field.resolution && (
                <p className="text-xs text-gray-500">Recommended: {field.resolution}</p>
              )}
            </div>

            <div className="flex flex-col items-center justify-center text-center bg-gray-50 border border-gray-100 rounded-lg p-3 mb-3">
              {previewUrl ? (
                <>
                  <p className="text-xs text-gray-600 mb-2">Preview:</p>
                  {field.name.includes('signature') ? (
                    <img
                      src={previewUrl}
                      alt="Signature Preview"
                      className="w-36 h-20 object-contain border border-blue-300 rounded"
                    />
                  ) : (
                    <img
                      src={previewUrl}
                      alt="Image Preview"
                      className="w-32 h-32 object-cover border border-blue-300 rounded-lg"
                    />
                  )}
                </>
              ) : (
                <div className="w-24 h-24 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center text-gray-400 text-xs">
                  No file selected
                </div>
              )}
            </div>

            <div>
              <input
                type="file"
                id={field.name}
                accept="image/*"
                onChange={(e) => {
                  if (e.target.files && e.target.files[0]) {
                    handleFileSelect(field.name, e.target.files[0]);
                  }
                }}
                className="hidden"
              />
              <label
                htmlFor={field.name}
                className="cursor-pointer bg-[#0084DA] text-white px-4 py-2 rounded-lg hover:bg-[#0070B8] transition-colors w-full text-center text-sm font-medium"
              >
                {field.content || `📁 Upload ${getFieldLabel(field)}`}
              </label>
            </div>
          </div>
        );

      default:
        return (
          <input
            type="text"
            value={value}
            onChange={(e) => handleInputChange(field.name, e.target.value)}
            placeholder={field.placeholder}
            className={baseInputClasses}
          />
        );
    }
  };

  // Calculate grid columns based on section width
  const getGridColumns = (section: FormSection) => {
    if (section.width === '100%') {
      return 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3';
    }
    if (section.width === '80%') {
      return 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3';
    }
    if (section.width === '50%') {
      return 'grid-cols-1 md:grid-cols-2';
    }
    if (section.width === '20%') {
      return 'grid-cols-1';
    }
    return 'grid-cols-1 md:grid-cols-2';
  };

  if (loading) {
    return <Loader />;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <BreadcrumbHeader
            title="Applications Edit"
            paths={[{ name: 'Applications Edit', link: '#' }]}
          />
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit}>
          <div className="space-y-6">
            {formSections.map((section, sectionIndex) => {
              // Skip empty sections
              if (section.children.length === 0) return null;

              // Separate file fields from normal fields
              const fileFields = section.children.filter((f) => f.type === 'file_button');
              const normalFields = section.children.filter((f) => f.type !== 'file_button');

              return (
                <Card key={sectionIndex} className="p-6">
                  {/* Normal fields (text, select, etc.) */}
                  {normalFields.length > 0 && (
                    <div className={`grid ${getGridColumns(section)} gap-6`}>
                      {normalFields.map((field) => (
                        <div key={field.id} className="space-y-2">
                          <label className="block text-sm font-medium text-gray-700">
                            {getFieldLabel(field)}
                            {field.required === 1 && <span className="text-red-500 ml-1">*</span>}
                          </label>
                          {renderFormField(field)}
                        </div>
                      ))}
                    </div>
                  )}

                  {/* File Upload Cards */}
                  {fileFields.length > 0 && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                      {fileFields.map((field) => (
                        <div key={field.id} className="w-full">
                          {renderFormField(field)}
                        </div>
                      ))}
                    </div>
                  )}
                </Card>
              );
            })}
          </div>

          {/* Submit Button */}
          <div className="mt-8 flex justify-end space-x-4">
            <Button type="button" color="light" onClick={() => navigate(-1)} disabled={saving}>
              Cancel
            </Button>
            <Button
              type="submit"
              color="blue"
              disabled={saving}
              className="bg-blue-600 hover:bg-blue-700"
            >
              {saving ? 'Saving...' : 'Save Changes'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ApplicationEditPage;