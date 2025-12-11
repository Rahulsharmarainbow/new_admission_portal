import React, { useState, useRef, useCallback, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router';
import axios from 'axios';
import toast from 'react-hot-toast';
import { Button, Card } from 'flowbite-react';
import { Icon } from '@iconify/react';
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
  const [formData, setFormData] = useState<{ [key: string]: any }>({});
  const [fileData, setFileData] = useState<{ [key: string]: any }>({});
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [formOptions, setFormOptions] = useState<{ [key: string]: any[] }>({});
  const [dynamicOptions, setDynamicOptions] = useState<{
    [key: string]: Array<{ value: number | string; text: string }>;
  }>({});
  const [formSections, setFormSections] = useState<FormSection[]>([]);
  const [lookups, setLookups] = useState<Lookups>({});
  const [application, setApplication] = useState<ApplicationData | null>(null);
  const [selectedFiles, setSelectedFiles] = useState<{ [key: string]: File }>({});
  const [visibleFields, setVisibleFields] = useState<{ [key: string]: boolean }>({});

  const formRefs = useRef<{ [key: string]: any }>({});
  const validationErrors = useRef<{ [key: string]: string }>({});
  const [showErrors, setShowErrors] = useState(false);

  const apiUrl = import.meta.env.VITE_API_URL;
  const apiAssetsUrl = import.meta.env.VITE_ASSET_URL;

  // Process candidate details to create proper form data with id$value format
  // const processCandidateDetails = (candidateDetails: CandidateDetails) => {
  //   const processedData: { [key: string]: any } = {};

  //   Object.keys(candidateDetails).forEach((key) => {
  //     if (!key.startsWith('S')) {
  //       const value = candidateDetails[key];
  //       const sKey = `S${key}`;
  //       const sValue = candidateDetails[sKey];

  //       // For select fields, create id$value format
  //       if (value && sValue && !value.includes('$')) {
  //         processedData[key] = `${value}$${sValue}`;
  //       } else {
  //         processedData[key] = value || '';
  //       }

  //       // Handle Aadhaar fields
  //       if (key === 'adharcard' && value && value.length === 12) {
  //         for (let i = 0; i < 12; i++) {
  //           processedData[`adharcard_${i}`] = value[i];
  //         }
  //       }

  //       // if (key === 'adharcard' && value && value.length === 12) {
  //       //   for (let i = 0; i < 12; i++) {
  //       //     processedData[`adharcard_${i}`] = value[i];
  //       //   }
  //       // }
  //     }
  //   });

  //   return processedData;
  // };
const processCandidateDetails = (candidateDetails: CandidateDetails) => {
  const processedData: { [key: string]: any } = {};

  Object.keys(candidateDetails).forEach((key) => {
    // Skip S-prefixed keys (they're the text values)
    if (!key.startsWith('S')) {
      const value = candidateDetails[key];
      const sKey = `S${key}`;
      const sValue = candidateDetails[sKey];

      // For select fields, create id$value format if we have both id and text
      if (value && sValue && !value.includes('$')) {
        processedData[key] = `${value}$${sValue}`;
      } else {
        processedData[key] = value || '';
      }

      // Store text value separately for display if needed
      if (sValue) {
        processedData[`s_${key}`] = sValue;
      }
    }
  });

  return processedData;
};
  // Get field options with proper lookup handling
  // const getFieldOptions = (field: FormField) => {
  //   let options: Array<{ value: number | string; text: string }> = [];

  //   // 1. Check dynamic options first (for state/district)
  //   if (dynamicOptions[field.name] && dynamicOptions[field.name].length > 0) {
  //     options = dynamicOptions[field.name];
  //   }
  //   // 2. Check form options (for API loaded data)
  //   else if (formOptions[field.name] && formOptions[field.name].length > 0) {
  //     options = formOptions[field.name];
  //   }
  //   // 3. Check field's own options
  //   else if (field.options && field.options.length > 0) {
  //     options = field.options;
  //   }
  //   // 4. Check lookups
  //   else {
  //     const lookupKey = Object.keys(lookups).find(
  //       (key) =>
  //         key.toLowerCase().includes(field.name.toLowerCase()) ||
  //         field.name.toLowerCase().includes(key.toLowerCase()),
  //     );

  //     if (lookupKey && lookups[lookupKey]) {
  //       options = lookups[lookupKey];
  //     }
  //   }

  //   // Convert all options to id$value format
  //   const formattedOptions = options.map((option) => {
  //     if (typeof option.value === 'string' && option.value.includes('$')) {
  //       return option;
  //     } else {
  //       return {
  //         value: `${option.value}$${option.text}`,
  //         text: option.text,
  //       };
  //     }
  //   });

  //   return formattedOptions;
  // };

  const getFieldOptions = (field: FormField) => {
  let options: Array<{ value: number | string; text: string }> = [];

  // 1. Check if this is a country field
  if (field.name === 'country' && field.options && field.options.length > 0) {
    options = field.options;
  }
  // 2. Check dynamic options first (for state/district)
  else if (dynamicOptions[field.name] && dynamicOptions[field.name].length > 0) {
    options = dynamicOptions[field.name];
  }
  // 3. Check form options (for API loaded data)
  else if (formOptions[field.name] && formOptions[field.name].length > 0) {
    options = formOptions[field.name];
  }
  // 4. Check field's own options
  else if (field.options && field.options.length > 0) {
    options = field.options;
  }
  // 5. Check lookups
  else {
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
      return option;
    } else {
      return {
        value: `${option.value}$${option.text}`,
        text: option.text,
      };
    }
  });

  return formattedOptions;
};

  // Handle input change with API calls
  const handleInputChange = useCallback(
    (name: string, value: any, fieldConfig?: any) => {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));

      if (errors[name]) {
        setErrors((prev) => ({
          ...prev,
          [name]: '',
        }));
      }

      // Handle state to district API calls
      if (
        fieldConfig?.apiurl &&
        fieldConfig.apiurl.includes('get_district_by_state_id') &&
        fieldConfig?.target
      ) {
        const stateId =
          typeof value === 'string' && value.includes('$') ? value.split('$')[0] : value;

        if (stateId) {
          fetch(`${apiUrl}/${fieldConfig.apiurl}`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${user?.token}`,
            },
            body: JSON.stringify({ state_id: stateId }),
          })
            .then((response) => {
              if (!response.ok) {
                throw new Error('Network response was not ok');
              }
              return response.json();
            })
            .then((data) => {
              if (data.districts) {
                const districts = data.districts.map((item: any) => ({
                  value: `${item.id}$${item.district_title}`,
                  text: item.district_title.trim(),
                }));

                setFormOptions((prev) => ({
                  ...prev,
                  [fieldConfig.target]: districts,
                }));

                setDynamicOptions((prev) => ({
                  ...prev,
                  [fieldConfig.target]: districts,
                }));

                // Auto-select district if we have existing district value
                const existingDistrictValue = formData[fieldConfig.target];
                if (existingDistrictValue && districts.length > 0) {
                  const existingDistrictId =
                    typeof existingDistrictValue === 'string' && existingDistrictValue.includes('$')
                      ? existingDistrictValue.split('$')[0]
                      : existingDistrictValue;

                  const matchingDistrict = districts.find((option) => {
                    const optionId =
                      typeof option.value === 'string' && option.value.includes('$')
                        ? option.value.split('$')[0]
                        : option.value;
                    return optionId === existingDistrictId;
                  });

                  if (matchingDistrict && formData[fieldConfig.target] !== matchingDistrict.value) {
                    setFormData((prev) => ({
                      ...prev,
                      [fieldConfig.target]: matchingDistrict.value,
                    }));
                  }
                }
              }
            })
            .catch((error) => {
              console.error('Error fetching districts:', error);
            });
        }
      }
    },
    [errors, apiUrl, user, formData],
  );

  // Handle select change
  // const handleSelectChange = useCallback(
  //   (name: string, value: any, fieldConfig?: any) => {
  //     const [valuePart, textPart] = typeof value === 'string' ? value.split('$') : [value, ''];

  //     setFormData((prev) => ({
  //       ...prev,
  //       [name]: value,
  //       [`s_${name}`]: textPart,
  //     }));

  //     if (errors[name]) {
  //       setErrors((prev) => ({
  //         ...prev,
  //         [name]: '',
  //       }));
  //     }

  //     // Handle state to district API calls
  //     if (
  //       fieldConfig?.apiurl &&
  //       fieldConfig.apiurl.includes('get_district_by_state_id') &&
  //       fieldConfig?.target
  //     ) {
  //       const stateId = valuePart;

  //       if (stateId) {
  //         fetch(`${apiUrl}/${fieldConfig.apiurl}`, {
  //           method: 'POST',
  //           headers: {
  //             'Content-Type': 'application/json',
  //             Authorization: `Bearer ${user?.token}`,
  //           },
  //           body: JSON.stringify({ state_id: stateId }),
  //         })
  //           .then((response) => {
  //             if (!response.ok) {
  //               throw new Error('Network response was not ok');
  //             }
  //             return response.json();
  //           })
  //           .then((data) => {
  //             if (data.districts) {
  //               const districts = data.districts.map((item: any) => ({
  //                 value: `${item.id}$${item.district_title}`,
  //                 text: item.district_title.trim(),
  //               }));

  //               setFormOptions((prev) => ({
  //                 ...prev,
  //                 [fieldConfig.target]: districts,
  //               }));

  //               setDynamicOptions((prev) => ({
  //                 ...prev,
  //                 [fieldConfig.target]: districts,
  //               }));

  //               // Auto-select district if we have existing district value
  //               const existingDistrictValue = formData[fieldConfig.target];
  //               if (existingDistrictValue && districts.length > 0) {
  //                 const existingDistrictId =
  //                   typeof existingDistrictValue === 'string' && existingDistrictValue.includes('$')
  //                     ? existingDistrictValue.split('$')[0]
  //                     : existingDistrictValue;

  //                 const matchingDistrict = districts.find((option) => {
  //                   const optionId =
  //                     typeof option.value === 'string' && option.value.includes('$')
  //                       ? option.value.split('$')[0]
  //                       : option.value;
  //                   return optionId === existingDistrictId;
  //                 });

  //                 if (matchingDistrict && formData[fieldConfig.target] !== matchingDistrict.value) {
  //                   setFormData((prev) => ({
  //                     ...prev,
  //                     [fieldConfig.target]: matchingDistrict.value,
  //                   }));
  //                 }
  //               }
  //             }
  //           })
  //           .catch((error) => {
  //             console.error('Error fetching districts:', error);
  //           });
  //       }
  //     }
  //   },
  //   [errors, apiUrl, user, formData],
  // );

  const handleSelectChange = useCallback(
  (name: string, value: any, fieldConfig?: any) => {
    const [valuePart, textPart] = typeof value === 'string' ? value.split('$') : [value, ''];

    setFormData((prev) => ({
      ...prev,
      [name]: value,
      [`s_${name}`]: textPart,
    }));

    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: '',
      }));
    }

    // Handle country to state API calls
    if (
      fieldConfig?.apiurl &&
      fieldConfig.apiurl.includes('get_state_by_country_id') &&
      fieldConfig?.target
    ) {
      const countryId = valuePart;

      if (countryId) {
        // Clear dependent fields
        setFormData((prev) => {
          const newData = { ...prev };
          
          // Clear state field
          if (fieldConfig.target) {
            newData[fieldConfig.target] = '';
            newData[`s_${fieldConfig.target}`] = '';
          }
          
          // Find district field that depends on the state field
          formSections.forEach((section) => {
            section.children.forEach((field) => {
              if (field.h_target === fieldConfig.target && field.type === 'select') {
                newData[field.name] = '';
                newData[`s_${field.name}`] = '';
              }
            });
          });
          
          return newData;
        });

        // Clear dynamic options for dependent fields
        setDynamicOptions((prev) => {
          const newOptions = { ...prev };
          if (fieldConfig.target) {
            newOptions[fieldConfig.target] = [];
            
            // Clear district options too
            formSections.forEach((section) => {
              section.children.forEach((field) => {
                if (field.h_target === fieldConfig.target) {
                  newOptions[field.name] = [];
                }
              });
            });
          }
          return newOptions;
        });

        // Fetch states for the selected country
        fetch(`${apiUrl}/${fieldConfig.apiurl}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${user?.token}`,
          },
          body: JSON.stringify({ state_id: countryId }),
        })
          .then((response) => {
            if (!response.ok) {
              throw new Error('Network response was not ok');
            }
            return response.json();
          })
          .then((data) => {
            if (data.districts) {
              const states = data.districts.map((item: any) => ({
                value: `${item.state_id}$${item.district_title}`,
                text: item.district_title.trim(),
              }));

              setFormOptions((prev) => ({
                ...prev,
                [fieldConfig.target]: states,
              }));

              setDynamicOptions((prev) => ({
                ...prev,
                [fieldConfig.target]: states,
              }));
            }
          })
          .catch((error) => {
            console.error('Error fetching states:', error);
          });
      }
    }

    // Handle state to district API calls
    if (
      fieldConfig?.apiurl &&
      fieldConfig.apiurl.includes('get_district_by_state_id') &&
      fieldConfig?.target
    ) {
      const stateId = valuePart;

      if (stateId) {
        // Clear dependent district field
        setFormData((prev) => ({
          ...prev,
          [fieldConfig.target]: '',
          [`s_${fieldConfig.target}`] : '',
        }));

        // Clear dynamic options for district
        setDynamicOptions((prev) => ({
          ...prev,
          [fieldConfig.target]: [],
        }));

        fetch(`${apiUrl}/${fieldConfig.apiurl}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${user?.token}`,
          },
          body: JSON.stringify({ state_id: stateId }),
        })
          .then((response) => {
            if (!response.ok) {
              throw new Error('Network response was not ok');
            }
            return response.json();
          })
          .then((data) => {
            if (data.districts) {
              const districts = data.districts.map((item: any) => ({
                value: `${item.id}$${item.state_id}`,
                text: item.district_title.trim(),
              }));

              setFormOptions((prev) => ({
                ...prev,
                [fieldConfig.target]: districts,
              }));

              setDynamicOptions((prev) => ({
                ...prev,
                [fieldConfig.target]: districts,
              }));
            }
          })
          .catch((error) => {
            console.error('Error fetching districts:', error);
          });
      }
    }
  },
  [errors, apiUrl, user, formData, formSections],
);


  // Handle checkbox change
  const handleCheckboxChange = useCallback((name: string, value: boolean, fieldConfig?: any) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value ? 1 : 0,
    }));

    setErrors((prev) => ({
      ...prev,
      [name]: '',
    }));
  }, []);

  // Handle date change
  const handleDateChange = useCallback(
    (name: string, date: any, fieldConfig?: any) => {
      setFormData((prev) => ({
        ...prev,
        [name]: date,
      }));

      if (errors[name]) {
        setErrors((prev) => ({
          ...prev,
          [name]: '',
        }));
      }
    },
    [errors],
  );

  // Handle Aadhaar change
  const handleAadhaarChange = useCallback(
    (index: number, value: string, name: string, fieldConfig?: any) => {
      console.log('Aadhaar value:', value, 'index:', index, 'name:', name);

      // Ensure value is a string and clean it
      const stringValue = String(value || '');
      const cleanValue = stringValue.replace(/\D/g, ''); // Remove non-digits

      if (cleanValue && cleanValue.length === 1) {
        // Only allow single digits
        setFormData((prev) => ({
          ...prev,
          [`${name}_${index}`]: cleanValue,
        }));

        // Auto-focus next input
        if (cleanValue && index < 11) {
          setTimeout(() => {
            const nextInput = document.querySelector(
              `input[name="${name}_${index + 1}"]`,
            ) as HTMLInputElement;
            if (nextInput) {
              nextInput.focus();
              nextInput.select();
            }
          }, 10);
        }
      } else if (stringValue === '') {
        // Handle backspace/delete
        setFormData((prev) => ({
          ...prev,
          [`${name}_${index}`]: '',
        }));

        // Auto-focus previous input on backspace
        if (index > 0) {
          setTimeout(() => {
            const prevInput = document.querySelector(
              `input[name="${name}_${index - 1}"]`,
            ) as HTMLInputElement;
            if (prevInput) {
              prevInput.focus();
              prevInput.select();
            }
          }, 10);
        }
      }
    },
    [],
  );

  // Handle file change
  const handleFileChange = useCallback(
    (name: string, file: File, fieldConfig?: any) => {
      if (!file) return;

      if (!file.type.match(/image\/(jpeg|png)/)) {
        toast.error('Please upload a valid JPEG or PNG image.');
        return;
      }

      if (file.size > 1048576) {
        toast.error('File size should be less than 1 MB.');
        return;
      }

      const reader = new FileReader();

      reader.onloadend = () => {
        const base64 = reader.result as string;

        setSelectedFiles((prev) => ({
          ...prev,
          [name]: file,
        }));

        setFileData((prev) => ({
          ...prev,
          [name]: base64,
        }));

        if (errors[name]) {
          setErrors((prev) => ({
            ...prev,
            [name]: '',
          }));
        }
      };

      reader.readAsDataURL(file);
    },
    [errors],
  );

  const handleFileUpload = (
    event: React.ChangeEvent<HTMLInputElement>,
    fieldName: string,
    fieldConfig: any,
  ) => {
    const file = event.target.files?.[0];
    if (file) {
      handleFileChange(fieldName, file, fieldConfig);
    }
  };

  const handleAadhaarVisibility = (name: string) => {
    const isVisible = !formData[`${name}_visible`];
    setFormData((prev) => ({
      ...prev,
      [`${name}_visible`]: isVisible,
    }));

    // Toggle input types
    const inputs = document.querySelectorAll(`input[name^="${name}_"]`);
    inputs.forEach((input: any) => {
      if (input.type === 'password' || input.type === 'text') {
        input.type = isVisible ? 'text' : 'password';
      }
    });
  };

  // Get preview box style
  const getPreviewBoxStyle = (resolution?: string) => {
    if (!resolution) return null;

    const [w, h] = resolution.split('x').map(Number);
    if (!w || !h) return null;

    if (w > h * 2) {
      return {
        width: `${w}px`,
        height: `${h}px`,
      };
    }

    return null;
  };

  // Update field visibility based on h_target and v_target
  const updateFieldVisibility = (fieldName: string, value: any) => {
    const newVisibleFields = { ...visibleFields };

    const valueString = typeof value === 'string' ? value : String(value);
    const valuePart =
      valueString && valueString.includes('$') ? valueString.split('$')[0] : valueString;
    const valueText =
      valueString && valueString.includes('$') ? valueString.split('$')[1] : valueString;

    formSections.forEach((section) => {
      section.children.forEach((field) => {
        if (field.h_target === fieldName) {
          let shouldShow = false;

          if (field.v_target) {
            const vTargetValues = field.v_target.split(',');
            shouldShow = vTargetValues.some((vTarget) => {
              const vTargetPart =
                vTarget && vTarget.includes('$') ? vTarget.split('$')[0] : vTarget;
              const vTargetText =
                vTarget && vTarget.includes('$') ? vTarget.split('$')[1] : vTarget;

              return valuePart === vTargetPart || valueText === vTargetText;
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

  // Initialize field visibility
  const initializeFieldVisibility = (data: { [key: string]: any }) => {
    const initialVisibility: { [key: string]: boolean } = {};

    formSections.forEach((section) => {
      section.children.forEach((field) => {
        if (field.h_target) {
          const targetValue = data[field.h_target];
          const targetValueString =
            typeof targetValue === 'string' ? targetValue : String(targetValue);
          const targetValuePart =
            targetValueString && targetValueString.includes('$')
              ? targetValueString.split('$')[0]
              : targetValueString;
          const targetValueText =
            targetValueString && targetValueString.includes('$')
              ? targetValueString.split('$')[1]
              : targetValueString;

          let shouldShow = false;

          if (field.v_target) {
            const vTargetValues = field.v_target.split(',');
            shouldShow = vTargetValues.some((vTarget) => {
              const vTargetPart =
                vTarget && vTarget.includes('$') ? vTarget.split('$')[0] : vTarget;
              const vTargetText =
                vTarget && vTarget.includes('$') ? vTarget.split('$')[1] : vTarget;

              return targetValuePart === vTargetPart || targetValueText === vTargetText;
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

  // Fetch application data
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

      if (response.data) {
        const formSectionsData = response.data.data || [];
        setFormSections(formSectionsData);
        setLookups(response.data.lookups || {});
        setApplication(response.data.application_data);

        if (response.data.candidate_details) {
          const candidateData = response.data.candidate_details;

          // Process candidate details to create proper form data
          
          const processedFormData = processCandidateDetails(candidateData);
          setFormData(processedFormData);

          // Load existing file previews
          const filePreviews: { [key: string]: string } = {};
          formSectionsData.forEach((section) => {
            section.children.forEach((field) => {
              if (field.type === 'file_button' && candidateData[field.name]) {
                filePreviews[field.name] = `${apiAssetsUrl}/${candidateData[field.name]}`;
              }
            });
          });
          setFileData(filePreviews);

          // Initialize field visibility
          initializeFieldVisibility(processedFormData);

          // Load states and districts for dynamic fields
          await loadDynamicOptions(formSectionsData, processedFormData);
        }
      }
    } catch (error) {
      console.error('Error fetching application data:', error);
      toast.error('Failed to load application data');
    } finally {
      setLoading(false);
    }
  };

  // Load dynamic options (states and districts)
  // const loadDynamicOptions = async (sections: FormSection[], formData: { [key: string]: any }) => {
  //   // Load states
  //   try {
  //     const statesResponse = await axios.get(`${apiUrl}/frontend/get_states`, {
  //       headers: {
  //         Authorization: `Bearer ${user?.token}`,
  //       },
  //     });

  //     if (statesResponse.data?.states) {
  //       const stateOptions = statesResponse.data.states.map((state: any) => ({
  //         value: `${state.state_id}$${state.state_title}`,
  //         text: state.state_title,
  //       }));

  //       const newDynamicOptions: any = {};

  //       // Find all state fields
  //       sections.forEach((section) => {
  //         section.children.forEach((field) => {
  //           if (field.apiurl && field.apiurl.includes('get_district_by_state_id')) {
  //             newDynamicOptions[field.name] = stateOptions;
  //           }
  //         });
  //       });

  //       setDynamicOptions((prev) => ({ ...prev, ...newDynamicOptions }));

  //       // Load districts for existing state values
  //       for (const section of sections) {
  //         for (const field of section.children) {
  //           if (field.apiurl && field.apiurl.includes('get_district_by_state_id') && field.target) {
  //             const stateValue = formData[field.name];
  //             if (stateValue) {
  //               const stateId =
  //                 typeof stateValue === 'string' && stateValue.includes('$')
  //                   ? stateValue.split('$')[0]
  //                   : stateValue;

  //               const districtsResponse = await axios.post(
  //                 `${apiUrl}/${field.apiurl}`,
  //                 { state_id: stateId },
  //                 {
  //                   headers: {
  //                     Authorization: `Bearer ${user?.token}`,
  //                   },
  //                 },
  //               );

  //               if (districtsResponse.data?.districts) {
  //                 const districtOptions = districtsResponse.data.districts.map((district: any) => ({
  //                   value: `${district.id}$${district.district_title}`,
  //                   text: district.district_title,
  //                 }));

  //                 setDynamicOptions((prev) => ({
  //                   ...prev,
  //                   [field.target]: districtOptions,
  //                 }));

  //                 // Auto-select district if we have existing district value
  //                 const existingDistrictValue = formData[field.target];
  //                 if (existingDistrictValue && districtOptions.length > 0) {
  //                   const existingDistrictId =
  //                     typeof existingDistrictValue === 'string' &&
  //                     existingDistrictValue.includes('$')
  //                       ? existingDistrictValue.split('$')[0]
  //                       : existingDistrictValue;

  //                   const matchingDistrict = districtOptions.find((option) => {
  //                     const optionId =
  //                       typeof option.value === 'string' && option.value.includes('$')
  //                         ? option.value.split('$')[0]
  //                         : option.value;
  //                     return optionId === existingDistrictId;
  //                   });

  //                   if (matchingDistrict && formData[field.target] !== matchingDistrict.value) {
  //                     setFormData((prev) => ({
  //                       ...prev,
  //                       [field.target]: matchingDistrict.value,
  //                     }));
  //                   }
  //                 }
  //               }
  //             }
  //           }
  //         }
  //       }
  //     }
  //   } catch (error) {
  //     console.error('Error loading dynamic options:', error);
  //   }
  // };

  // Load dynamic options (countries, states and districts)
const loadDynamicOptions = async (sections: FormSection[], formData: { [key: string]: any }) => {
  const newDynamicOptions: any = {};
  
  // First load countries for country fields
  try {
    // Find country fields
    sections.forEach((section) => {
      section.children.forEach((field) => {
        if (field.apiurl && field.apiurl.includes('get_state_by_country_id')) {
          // If country options are already in field.options, use them
          if (field.options && field.options.length > 0) {
            newDynamicOptions[field.name] = field.options.map((option) => ({
              value: `${option.value}$${option.text}`,
              text: option.text,
            }));
          }
        }
      });
    });

    setDynamicOptions((prev) => ({ ...prev, ...newDynamicOptions }));

    // Load states for existing country values
    for (const section of sections) {
      for (const field of section.children) {
        if (field.apiurl && field.apiurl.includes('get_state_by_country_id') && field.target) {
          const countryValue = formData[field.name];
          if (countryValue) {
            const countryId = 
              typeof countryValue === 'string' && countryValue.includes('$') 
                ? countryValue.split('$')[0] 
                : countryValue;

            try {
              const statesResponse = await axios.post(
                `${apiUrl}/${field.apiurl}`,
                { state_id: countryId },
                {
                  headers: {
                    Authorization: `Bearer ${user?.token}`,
                  },
                },
              );

              if (statesResponse.data?.districts) {
                const stateOptions = statesResponse.data.districts.map((state: any) => ({
                  value: `${state.state_id}$${state.district_title}`,
                  text: state.district_title,
                }));

                setDynamicOptions((prev) => ({
                  ...prev,
                  [field.target]: stateOptions,
                }));

                // Auto-select state if we have existing state value
                const existingStateValue = formData[field.target];
                if (existingStateValue && stateOptions.length > 0) {
                  const existingStateId = 
                    typeof existingStateValue === 'string' && existingStateValue.includes('$')
                      ? existingStateValue.split('$')[0]
                      : existingStateValue;

                  const matchingState = stateOptions.find((option) => {
                    const optionId = 
                      typeof option.value === 'string' && option.value.includes('$')
                        ? option.value.split('$')[0]
                        : option.value;
                    return optionId === existingStateId;
                  });

                  if (matchingState && formData[field.target] !== matchingState.value) {
                    setFormData((prev) => ({
                      ...prev,
                      [field.target]: matchingState.value,
                    }));
                  }

                  // Now load districts for the state
                  const stateField = section.children.find(f => f.name === field.target);
                  if (stateField?.apiurl && stateField.apiurl.includes('get_district_by_state_id') && stateField.target) {
                    const districtResponse = await axios.post(
                      `${apiUrl}/${stateField.apiurl}`,
                      { state_id: existingStateId },
                      {
                        headers: {
                          Authorization: `Bearer ${user?.token}`,
                        },
                      },
                    );

                    if (districtResponse.data?.districts) {
                      const districtOptions = districtResponse.data.districts.map((district: any) => ({
                        value: `${district.id}$${district.district_title}`,
                        text: district.district_title,
                      }));

                      setDynamicOptions((prev) => ({
                        ...prev,
                        [stateField.target]: districtOptions,
                      }));

                      // Auto-select district if we have existing district value
                      const existingDistrictValue = formData[stateField.target];
                      if (existingDistrictValue && districtOptions.length > 0) {
                        const existingDistrictId = 
                          typeof existingDistrictValue === 'string' && existingDistrictValue.includes('$')
                            ? existingDistrictValue.split('$')[0]
                            : existingDistrictValue;

                        const matchingDistrict = districtOptions.find((option) => {
                          const optionId = 
                            typeof option.value === 'string' && option.value.includes('$')
                              ? option.value.split('$')[0]
                              : option.value;
                          return optionId === existingDistrictId;
                        });

                        if (matchingDistrict && formData[stateField.target] !== matchingDistrict.value) {
                          setFormData((prev) => ({
                            ...prev,
                            [stateField.target]: matchingDistrict.value,
                          }));
                        }
                      }
                    }
                  }
                }
              }
            } catch (error) {
              console.error('Error loading states:', error);
            }
          }
        }
      }
    }
  } catch (error) {
    console.error('Error loading dynamic options:', error);
  }
};

  useEffect(() => {
    fetchApplicationData();
  }, [applicationId]);

  // Update visibility when form data changes
  useEffect(() => {
    if (Object.keys(formData).length > 0) {
      Object.keys(formData).forEach((key) => {
        updateFieldVisibility(key, formData[key]);
      });
    }
  }, [formData]);

  // Validate form
  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

    formSections.forEach((section) => {
      section.children.forEach((field) => {
        if (field.required === 1 && visibleFields[field.name] !== false) {
          if (field.type === 'file_button') {
            if (!fileData[field.name] && !formData[field.name]) {
              newErrors[field.name] = `${field.label} is required`;
            }
          } else if (field.name === 'adharcard') {
            let aadhaarCard = '';
            let hasError = false;
            for (let i = 0; i < 12; i++) {
              const digit = formData[`adharcard_${i}`];
              if (!digit) {
                newErrors[field.name] = 'All Aadhaar card digits are required';
                hasError = true;
                break;
              }
              aadhaarCard += digit;
            }
            if (!hasError && aadhaarCard.length === 12) {
              delete newErrors[field.name];
            }
          } else if (!formData[field.name] && formData[field.name] !== 0) {
            newErrors[field.name] = `${field.label} is required`;
          } else if (field.validation === 'email') {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(formData[field.name])) {
              newErrors[field.name] = 'Invalid email address';
            }
          } else if (field.validation === 'mobile') {
            const phoneRegex = /^\d{10}$/;
            if (!phoneRegex.test(formData[field.name])) {
              newErrors[field.name] = 'Phone number must be 10 digits';
            }
          }
        }
      });
    });

    const filteredErrors = Object.fromEntries(
      Object.entries(newErrors).filter(([_, value]) => value !== ''),
    );

    setErrors(filteredErrors);
    validationErrors.current = filteredErrors;
    return Object.keys(filteredErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    if (!validateForm()) {
      setShowErrors(true);
      setSaving(false);
      return;
    }

    try {
      const submitFormData = new FormData();

      submitFormData.append('application_id', applicationId || '');
      submitFormData.append('customer_id', user?.id?.toString() || '');
      submitFormData.append('academic_id', application?.academic_id?.toString() || '');
      submitFormData.append('s_id', user?.id?.toString() || '');

      const mainData: any = { ...formData };
      const sData: any = {};

      if (mainData.adharcard_0 !== undefined) {
        let combinedAadhaar = '';
        for (let i = 0; i < 12; i++) {
          combinedAadhaar += mainData[`adharcard_${i}`] || '';
        }
        mainData.adharcard = combinedAadhaar;
        console.log('Combined Aadhaar:', combinedAadhaar);
      }

      Object.keys(mainData).forEach((key) => {
        const value = mainData[key];

        if (typeof value === 'string' && value.includes('$')) {
          const [idPart, ...textParts] = value.split('$');
          const textValue = textParts.join('$');

          mainData[key] = value;
          sData[`S${key}`] = textValue;
        }
      });

      Object.keys(selectedFiles).forEach((fieldName) => {
        submitFormData.append(fieldName, selectedFiles[fieldName]);
        delete mainData[fieldName];
      });

      submitFormData.append('maindata', JSON.stringify(mainData));
      submitFormData.append('sdata', JSON.stringify(sData));

      const response = await axios.post(
        `${apiUrl}/${user?.role}/Applications/Applications-update`,
        submitFormData,
        {
          headers: {
            Authorization: `Bearer ${user?.token}`,
            'Content-Type': 'multipart/form-data',
          },
        },
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

  // Render form field
  const renderField = (child: FormField, boxIndex: number, childIndex: number) => {
    const commonProps = {
      key: `${boxIndex}-${childIndex}`,
      value: formData[child.name] || '',
      ref: (el: any) => {
        if (el) formRefs.current[child.name] = el;
      },
    };

    const fieldConfig = {
      type: child.type,
      validation: child.validation,
      validation_message: child.validation_message,
      required: child.required,
      apiurl: child.apiurl,
      target: child.target,
      h_target: child.h_target,
      resolution: child.resolution,
      max_date: child.max_date,
    };

    // Skip rendering if field is not visible
    if (visibleFields[child.name] === false) {
      return null;
    }

    const baseInputClasses =
      'w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors outline-none';
    const baseSelectClasses =
      'w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors outline-none';

    switch (child.type) {
      case 'text':
        return (
          <div className={`space-y-2 ${getColumnSpan(child.width)}`}>
            <label className="block text-sm font-medium text-gray-700">
              {child.label}
              {child.required === 1 && <span className="text-red-500 ml-1">*</span>}
            </label>
            <input
              {...commonProps}
              type="text"
              placeholder={child.placeholder}
              onChange={(e) => handleInputChange(child.name, e.target.value, fieldConfig)}
              className={`${baseInputClasses} ${
                errors[child.name] ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            {errors[child.name] && (
              <p className="text-red-500 text-xs mt-1">{errors[child.name]}</p>
            )}
          </div>
        );

      // case 'select':
      //   const selectOptions = getFieldOptions(child);

      //   return (
      //     <div className={`space-y-2 ${getColumnSpan(child.width)}`}>
      //       <label className="block text-sm font-medium text-gray-700">
      //         {child.label}
      //         {child.required === 1 && <span className="text-red-500 ml-1">*</span>}
      //       </label>
      //       <select
      //         {...commonProps}
      //         onChange={(e) => handleSelectChange(child.name, e.target.value, fieldConfig)}
      //         className={`${baseSelectClasses} ${
      //           errors[child.name] ? 'border-red-500' : 'border-gray-300'
      //         }`}
      //       >
      //         <option value="">Select {child.label}</option>
      //         {selectOptions.map((option: any) => (
      //           <option key={option.value} value={option.value}>
      //             {option.text}
      //           </option>
      //         ))}
      //       </select>
      //       {errors[child.name] && (
      //         <p className="text-red-500 text-xs mt-1">{errors[child.name]}</p>
      //       )}
      //     </div>
      //   );

      case 'select':
  const selectOptions = getFieldOptions(child);

  return (
    <div className={`space-y-2 ${getColumnSpan(child.width)}`}>
      <label className="block text-sm font-medium text-gray-700">
        {child.label}
        {child.required === 1 && <span className="text-red-500 ml-1">*</span>}
      </label>
      <select
        {...commonProps}
        onChange={(e) => handleSelectChange(child.name, e.target.value, child)}
        className={`${baseSelectClasses} ${
          errors[child.name] ? 'border-red-500' : 'border-gray-300'
        }`}
      >
        <option value="">Select {child.label}</option>
        {selectOptions.map((option: any) => (
          <option 
            key={option.value} 
            value={option.value}
            selected={formData[child.name] === option.value}
          >
            {option.text}
          </option>
        ))}
      </select>
      {errors[child.name] && (
        <p className="text-red-500 text-xs mt-1">{errors[child.name]}</p>
      )}
    </div>
  );

      case 'date':
        const getMaxDate = () => {
          if (child.max_date) {
            const today = new Date();
            const maxDate = new Date(
              today.getFullYear() - child.max_date,
              today.getMonth(),
              today.getDate(),
            );
            return maxDate.toISOString().split('T')[0];
          }
          return undefined;
        };

        return (
          <div className={`space-y-2 ${getColumnSpan(child.width)}`}>
            <label className="block text-sm font-medium text-gray-700">
              {child.label}
              {child.required === 1 && <span className="text-red-500 ml-1">*</span>}
            </label>
            <input
              {...commonProps}
              type="date"
              onChange={(e) => handleDateChange(child.name, e.target.value, fieldConfig)}
              max={getMaxDate()}
              className={`${baseInputClasses} ${
                errors[child.name] ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            {errors[child.name] && (
              <p className="text-red-500 text-xs mt-1">{errors[child.name]}</p>
            )}
          </div>
        );

      case 'checkbox':
        return (
          <div className={`flex flex-col space-y-2 ${getColumnSpan(child.width)}`}>
            <div className="flex items-start space-x-3">
              <input
                type="checkbox"
                id={child.name}
                checked={formData[child.name] === 1}
                onChange={(e) => handleCheckboxChange(child.name, e.target.checked, fieldConfig)}
                className={`w-4 h-4 mt-1 text-blue-600 border-gray-300 rounded focus:ring-blue-500 focus:ring-2 ${
                  errors[child.name] ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              <label
                htmlFor={child.name}
                className={`text-sm leading-tight ${
                  errors[child.name] ? 'text-red-600' : 'text-gray-700'
                }`}
              >
                {child.content}
                {child.required === 1 && <span className="text-red-500 ml-1">*</span>}
              </label>
            </div>
            {errors[child.name] && (
              <p className="text-red-500 text-xs mt-1 ml-7">{errors[child.name]}</p>
            )}
          </div>
        );

      case 'file_button':
        const previewStyle = getPreviewBoxStyle(child.resolution);
        const previewUrl = fileData[child.name];

        return (
          <div className={`text-center space-y-3 ${getColumnSpan(child.width)}`}>
            <input
              type="file"
              id={child.name}
              className="hidden"
              onChange={(e) => handleFileUpload(e, child.name, fieldConfig)}
              accept="image/*"
            />

            <div className="bg-gray-50 p-3 rounded-xl border-2 border-dashed border-gray-300 hover:border-blue-500 transition-colors duration-200">
              <div
                className={`mx-auto bg-gray-100 rounded-lg flex items-center justify-center mb-2 overflow-hidden ${
                  previewStyle ? '' : 'w-20 h-20'
                }`}
                style={previewStyle || {}}
              >
                {previewUrl ? (
                  <img
                    src={previewUrl}
                    alt={child.label}
                    className="object-contain w-full h-full rounded-lg"
                  />
                ) : (
                  <Icon icon="solar:upload-line-duotone" className="w-8 h-8 text-gray-400" />
                )}
              </div>

              <p className="text-xs text-gray-600 mb-2">{child.content}</p>
              {child.resolution && <p className="text-xs text-gray-600 mb-2">{child.resolution}</p>}

              <div className="flex justify-center gap-2">
                <label
                  htmlFor={child.name}
                  className="flex items-center gap-1 bg-blue-600 text-white px-3 py-1 rounded-lg text-xs font-semibold hover:shadow-lg transition-all duration-200 cursor-pointer"
                >
                  <Icon icon="solar:upload-line-duotone" className="w-4 h-4" />
                  Upload
                </label>
              </div>
            </div>

            {errors[child.name] && <p className="text-red-500 text-xs">{errors[child.name]}</p>}
          </div>
        );

      case 'adhar':
        return (
           <div className={`space-y-2 ${getColumnSpan(child.width)}`}>
            <label className="block text-sm font-medium text-gray-700">
              {child.label}
              {child.required === 1 && <span className="text-red-500 ml-1">*</span>}
            </label>
            <input
              {...commonProps}
              type="text"
              placeholder={child.placeholder}
              onChange={(e) => handleInputChange(child.name, e.target.value, fieldConfig)}
              className={`${baseInputClasses} ${
                errors[child.name] ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            {errors[child.name] && (
              <p className="text-red-500 text-xs mt-1">{errors[child.name]}</p>
            )}
          </div>
        );

      case 'email':
        return (
          <div className={`space-y-2 ${getColumnSpan(child.width)}`}>
            <label className="block text-sm font-medium text-gray-700">
              {child.label}
              {child.required === 1 && <span className="text-red-500 ml-1">*</span>}
            </label>
            <input
              {...commonProps}
              type="email"
              placeholder={child.placeholder}
              onChange={(e) => handleInputChange(child.name, e.target.value, fieldConfig)}
              className={`${baseInputClasses} ${
                errors[child.name] ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            {errors[child.name] && (
              <p className="text-red-500 text-xs mt-1">{errors[child.name]}</p>
            )}
          </div>
        );

      case 'tel':
        return (
          <div className={`space-y-2 ${getColumnSpan(child.width)}`}>
            <label className="block text-sm font-medium text-gray-700">
              {child.label}
              {child.required === 1 && <span className="text-red-500 ml-1">*</span>}
            </label>
            <input
              {...commonProps}
              type="tel"
              placeholder={child.placeholder}
              pattern="[0-9]{10}"
              maxLength={10}
              onInput={(e) => {
                e.currentTarget.value = e.currentTarget.value.replace(/[^0-9]/g, '');
                handleInputChange(child.name, e.currentTarget.value, fieldConfig);
              }}
              className={`${baseInputClasses} ${
                errors[child.name] ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            {errors[child.name] && (
              <p className="text-red-500 text-xs mt-1">{errors[child.name]}</p>
            )}
          </div>
        );

      default:
        return null;
    }
  };

  // Get column span based on width
  const getColumnSpan = (width: string) => {
    const widthValue = parseInt(width);
    if (widthValue >= 80) return 'col-span-full';
    if (widthValue >= 60) return 'sm:col-span-2 lg:col-span-2';
    if (widthValue >= 40) return 'sm:col-span-2 lg:col-span-2';
    if (widthValue >= 30) return 'sm:col-span-1 lg:col-span-1';
    if (widthValue >= 20) return 'sm:col-span-1 lg:col-span-1';
    return 'sm:col-span-1 lg:col-span-1';
  };

  // Calculate grid columns based on section width
  const getGridColumns = (section: FormSection) => {
    console.log('section', section);
    const width = parseInt(section.width);
    if (width >= 70 && width <= 80) return 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3';
    if (width >= 45 && width <= 55) return 'grid-cols-1 md:grid-cols-2';
    if (width >= 20 && width <= 30) return 'grid-cols-1';
    return 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3';
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
            title="Edit Application"
            paths={[
              { name: 'Applications', link: '/applications' },
              { name: 'Edit Application', link: '#' },
            ]}
          />
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit}>
          <div className="space-y-6">
            {formSections.map((section, sectionIndex) => {
              if (section.children.length === 0) return null;

              const headingFields = section.children.filter((f) => f.type === 'heading');
              const normalFields = section.children.filter(
                (f) => f.type !== 'heading' && f.type !== 'file_button',
              );
              const fileFields = section.children.filter((f) => f.type === 'file_button');

              return (
                <Card key={sectionIndex} className="p-6">
                  {/* ---- HEADING ALWAYS ON TOP ---- */}
                  {headingFields.map((field) => (
                    <div key={field.id} className="mb-6 w-full">
                      <h4 className="text-lg font-bold text-[#dc2626] inline-flex items-center">
                        <Icon
                          icon={field.icon || 'solar:document-line-duotone'}
                          className="w-4 h-4 mr-2"
                        />
                        {field.content}
                      </h4>
                    </div>
                  ))}

                  {/* ---- NORMAL FIELDS IN GRID ---- */}
                  {normalFields.length > 0 && (
                    <div className={`grid ${getGridColumns(section)} gap-6`}>
                      {normalFields.map((field, fieldIndex) => (
                        <div key={field.id}>{renderField(field, sectionIndex, fieldIndex)}</div>
                      ))}
                    </div>
                  )}

                  {/* ---- FILE UPLOAD FIELDS ---- */}
                  {fileFields.length > 0 && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                      {fileFields.map((field, fileIndex) => (
                        <div key={field.id} className="w-full">
                          {renderField(field, sectionIndex, fileIndex)}
                        </div>
                      ))}
                    </div>
                  )}
                </Card>
              );
            })}
          </div>

          {/* Error Display */}
          {showErrors && Object.keys(errors).length > 0 && (
            <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
              <div className="flex items-center gap-2 text-red-700">
                <Icon icon="solar:danger-triangle-line-duotone" className="w-5 h-5" />
                <span className="font-semibold">
                  Please complete all mandatory fields to proceed.
                </span>
              </div>
            </div>
          )}

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
