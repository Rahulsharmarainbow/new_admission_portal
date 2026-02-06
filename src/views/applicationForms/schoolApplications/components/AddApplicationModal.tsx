// components/AddApplicationModal.tsx
import React, { useState, useEffect, useCallback } from 'react';
import { Modal, Button, TextInput, Textarea, Select, Spinner, ModalHeader, ModalBody, ModalFooter } from 'flowbite-react';
import { Icon } from '@iconify/react';
import axios from 'axios';
import toast from 'react-hot-toast';
import FormStep from 'src/Frontend/Main/collageApply/FormStep';
import SchoolDropdown from 'src/Frontend/Common/SchoolDropdown';
import RouteDropdown from 'src/Frontend/Common/RouteDropdown';
import AcademicDropdown from 'src/Frontend/Common/AcademicDropdown';

interface AddApplicationModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: any;
  apiUrl: string;
  onSuccess: () => void;
  type: string;
}

const AddApplicationModal: React.FC<AddApplicationModalProps> = ({
  isOpen,
  onClose,
  user,
  apiUrl,
  onSuccess,
  type,
}) => {
  const [step, setStep] = useState(0);
  const [academicId, setAcademicId] = useState<string>('');
  const [degreeId, setDegreeId] = useState<{ value: string; label: string } | null>(null);
  const [loading, setLoading] = useState(false);
  const [fetchingForm, setFetchingForm] = useState(false);
  const [formConfig, setFormConfig] = useState<any>(null);
  const [formData, setFormData] = useState<{ [key: string]: any }>({});
  const [fileData, setFileData] = useState<{ [key: string]: any }>({});
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [formOptions, setFormOptions] = useState<{ [key: string]: any[] }>({});
  const [paymentMode, setPaymentMode] = useState<string>('cash');
  const [chequeRemark, setChequeRemark] = useState<string>('');
  const [chequeFile, setChequeFile] = useState<File | null>(null);
  const [chequeBase64, setChequeBase64] = useState<string | null>(null);


  // Academic options fetch
  const [academicOptions, setAcademicOptions] = useState<any[]>([]);
  const [degreeOptions, setDegreeOptions] = useState<any[]>([]);

  // Fetch academics list
  useEffect(() => {
    if (isOpen && user) {
      fetchAcademics();
    }
  }, [isOpen, user]);

  const fetchAcademics = async () => {
    try {
      const response = await axios.post(
        `${apiUrl}/${user.role}/Application/get-academics`,
        { s_id: user.id },
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
            'Content-Type': 'application/json',
          },
        }
      );
      setAcademicOptions(response.data.rows || []);
    } catch (error) {
      console.error('Error fetching academics:', error);
    }
  };

  // Fetch degrees when academic is selected
  useEffect(() => {
    if (academicId) {
      fetchDegrees();
    }
  }, [academicId]);

  const fetchDegrees = async () => {
    try {
      const response = await axios.post(
        `${apiUrl}/${user.role}/Dropdown/get-form-route`,
        { academic_id: academicId },
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
            'Content-Type': 'application/json',
          },
        }
      );
       const list = response.data.data.map((item: any) => ({
            value: item.id,
            label: item.page_route,
          }));
      setDegreeOptions(list || []);
    } catch (error) {
      console.error('Error fetching degrees:', error);
    }
  };

  // Fetch form config when degree is selected
  useEffect(() => {
    if (degreeId?.value && academicId) {
      fetchFormConfig();
    }
  }, [degreeId, academicId]);

  const fetchFormConfig = async () => {
    setFetchingForm(true);
    try {
      const response = await axios.post(
        `${apiUrl}/Public/Get-apply-form`,
        {
          form_route: degreeId.label,
          academic_id: academicId
        },
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
      
      if (response.data) {
        setFormConfig(response.data);
        setStep(1);
      }
    } catch (error) {
      console.error('Error fetching form config:', error);
      toast.error('Failed to load form configuration');
    } finally {
      setFetchingForm(false);
    }
  };

  // FormStep handlers
  const handleInputChange = useCallback(
    (name: string, value: any, fieldConfig?: any) => {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));

      // Clear error when user starts typing
      if (errors[name]) {
        setErrors((prev) => ({
          ...prev,
          [name]: '',
        }));
      }

      // If field has API configuration, make API call
      if (fieldConfig?.apiurl && fieldConfig?.target) {
        fetch(
          `${apiUrl}${fieldConfig.apiurl}?selectedValue=${encodeURIComponent(
            value,
          )}&academicId=${academicId}&customerId=${formConfig?.cdata.c_id}`,
          {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
            },
          },
        )
          .then((response) => {
            if (!response.ok) {
              throw new Error('Network response was not ok');
            }
            return response.json();
          })
          .then((data) => {
            if (data.success === true) {
              setFormOptions((prev) => ({
                ...prev,
                [fieldConfig.target]: data.classes || data,
              }));
            } else {
              setFormOptions((prev) => ({
                ...prev,
                [fieldConfig.target]: [],
              }));
            }
          })
          .catch((error) => {
            console.error('Error fetching data from API:', error);
            setFormOptions((prev) => ({
              ...prev,
              [fieldConfig.target]: [],
            }));
          });
      }
    },
    [errors, apiUrl, formConfig?.cdata],
  );

  const handleSelectChange = useCallback(
    (name: string, value: any, fieldConfig?: any) => {
      const [valuePart, textPart] = value.split('$');

      setFormData((prev) => ({
        ...prev,
        [name]: value,
        [`s_${name}`]: textPart,
      }));

      // Clear error
      if (errors[name]) {
        setErrors((prev) => ({
          ...prev,
          [name]: '',
        }));
      }
      console.log(fieldConfig?.apiurl);
      console.log(fieldConfig?.target);
      if (fieldConfig?.apiurl && name === 'class') {
        console.log('hello', fieldConfig?.apiurl);
        fetch(`${apiUrl}/${fieldConfig.apiurl}?selectedValue=${valuePart}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        })
          .then((response) => {
            if (!response.ok) {
              throw new Error('Network response was not ok');
            }
            return response.json();
          })
          .then((data) => {
            if (data.success == true) {
              setFormData((prev) => ({
                ...prev,
                [name]: value,
                [`s_${name}`]: textPart,
              }));
            } else {
              toast.error(data.message || 'Seats not available for this class');
              setFormData((prev) => ({
                ...prev,
                [name]: '',
                [`s_${name}`]: '',
              }));

              // Clear error
              if (errors[name]) {
                setErrors((prev) => ({
                  ...prev,
                  [name]: '',
                }));
              }
            }
          })
          .catch((error) => {
            console.error('Error fetching data from API:', error);
          });
      }

      // Handle API calls for select fields
      if (fieldConfig?.apiurl && fieldConfig?.target) {
        fetch(`${apiUrl}/${fieldConfig?.apiurl}`, {
          method: 'POST',

          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ state_id: valuePart }),
        })
          .then((response) => {
            if (!response.ok) {
              throw new Error('Network response was not ok');
            }
            return response.json();
          })
          .then((data) => {
            const districts = data.districts.map((item: any) => ({
              value: item.id,
              text: item.district_title.trim(),
            }));

            setFormOptions((prev) => ({
              ...prev,
              [fieldConfig.target]: districts,
            }));
          })
          .catch((error) => {
            console.error('Error fetching data from API:', error);
          });
      }
    },
    [errors, apiUrl],
  );

  const handleCheckboxChange = (name: string, value: boolean, fieldConfig?: any) => {
    setFormData(prev => ({ ...prev, [name]: value ? 1 : 0 }));
        // Clear error immediately when date is selected
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: '',
      }));
    }
  };

  const handleDateChange = (name: string, date: any, fieldConfig?: any) => {
    setFormData(prev => ({ ...prev, [name]: date }));
        // Clear error immediately when date is selected
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: '',
      }));
    }
  };

  const handleAadhaarChange = useCallback(
    (index: number, value: string, name: string, fieldConfig?: any) => {
      if (/^\d$/.test(value)) {
        if (!isNaN(parseInt(value)) && value !== '' && value.length === 1) {
          setFormData((prev) => ({
            ...prev,
            [`${name}_${index}`]: value,
          }));

          // Auto-focus next input
          if (value && index < 11) {
            const nextInput = document.querySelector(
              `input[name="${name}_${index + 1}"]`,
            ) as HTMLInputElement;
            nextInput?.focus();
          }
        }
      } else if (value === '') {
        setFormData((prev) => ({
          ...prev,
          [`${name}_${index}`]: '',
        }));

        // Auto-focus previous input on backspace
        if (index > 0) {
          const prevInput = document.querySelector(
            `input[name="${name}_${index - 1}"]`,
          ) as HTMLInputElement;
          prevInput?.focus();
        }
      }
    },
    [],
  );

  const handleFileChange = async (name: string, file: File, fieldConfig?: any) => {
    const base64 = await new Promise<string>((resolve) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result as string);
      reader.readAsDataURL(file);
    });
    
    setFileData(prev => ({
      ...prev,
      [name]: base64,
      [name + '_file']: file,
    }));
        // Clear error immediately when date is selected
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: '',
      }));
    }
  };

  // Validate form
  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};
    
    if (!formConfig) return false;

    // Validate required fields from formConfig
    // formConfig.required_child?.forEach((child: any) => {
    //   if (child.required && !formData[child.name] && formData[child.name] !== 0) {
    //     newErrors[child.name] = child.validation_message || `${child.label} is required`;
    //   }
    // });

    // setErrors(newErrors);
    // return Object.keys(newErrors).length === 0;


     formConfig.required_child.forEach((child) => {
          if (child.type === 'file_button') {
            if (!fileData[child.name]) {
              newErrors[child.name] = child.validation_message || `${child.label} is required`;
            }
          } else {
            if (child.name === 'adharCard') {
              let aadhaarCard = '';
              let hasError = false;
              for (let i = 0; i < 12; i++) {
                const digit = formData[`adharCard_${i}`];
                if (!digit) {
                  newErrors[child.name] = 'All Aadhaar card digits are required';
                  hasError = true;
                  break;
                }
                aadhaarCard += digit;
              }
              if (!hasError && aadhaarCard.length === 12) {
                delete newErrors[child.name];
              }
            }  else if (child.validation === 'email') {
              const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
              if (!emailRegex.test(formData[child.name])) {
                newErrors[child.name] = 'Invalid email address';
              }
            } else if (child.validation === 'mobile') {
              const phoneRegex = /^\d{10}$/;
              if (!phoneRegex.test(formData[child.name])) {
                newErrors[child.name] = 'Phone number must be 10 digits';
              }
            } else if (child.type === 'date' && formData[child.name]) {
              const inputDate = new Date(formData[child.name]);
              const today = new Date();

              if (isNaN(inputDate.getTime())) {
                newErrors[child.name] = 'Invalid date format';
              } else if (child.max_date) {
                const maxAllowedDate = new Date(
                  today.getFullYear() - child.max_date,
                  today.getMonth(),
                  today.getDate(),
                );
                if (inputDate > maxAllowedDate) {
                  newErrors[child.name] = `Age must be at most ${child.max_date} years`;
                }
              }
            }
            else if (!formData[child.name] && formData[child.name] !== 0) {
              newErrors[child.name] = child.validation_message || `${child.label} is required`;
            }
          }
        });

        // Special validation for SC/ST categories
        const selectedCategory = formData.s_category;
        const selectedhalth = formData?.child_has_any_issue?.includes('$')
          ? formData.child_has_any_issue.split('$')[1]
          : '';

        if (
          (selectedCategory === 'SC' || selectedCategory === 'ST') &&
          !fileData['caste_certificate']
        ) {
          newErrors['caste_certificate'] = 'Caste certificate preview is required';
        }
        if (selectedhalth === 'Yes' && !formData?.specified_health_issue) {
          newErrors['specified_health_issue'] = 'Please specify health issue';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
  };
console.log(errors);
  // Handle form submission
const handleSubmit = async () => {
  if (!validateForm()) {
    toast.error('Please fill all required fields');
    return;
  }
  console.log(paymentMode);

  if (!paymentMode) {
    toast.error('Please select payment mode');
    return;
  }

  if (paymentMode == 'cheque') {
    if (!chequeBase64) {
      toast.error('Please upload cheque screenshot');
      return;
    }
    if (!chequeRemark) {
      toast.error('Please enter cheque remark');
      return;
    }
  }

  if (paymentMode == 'cash') {
    if (!chequeRemark) {
      toast.error('Please enter cheque remark');
      return;
    }
  }

  setLoading(true);

  try {
    const endpoint =
      formConfig?.academic_type === 1
        ? `${apiUrl}/${user.role}/Manual/school-manual-insert-data`
        : `${apiUrl}/${user.role}/Manual/college-manual-insert-data`;

    const payload = {
      c_id: formConfig?.cdata?.c_id || user.id,
      cookieData: formData,      
      screenshot : paymentMode === "cheque" ? chequeBase64 : null,
      cheque_remark: chequeRemark || "",
      files: fileData, 
      academic_id: academicId,
      form_id: formConfig?.form_id,
      payment_type_manual: paymentMode === 'cash' ? '0' : '1',
      remark: chequeRemark || 'testing',
      admin_id: user.id,
      admin_role: user.role,
    };

    const response = await axios.post(endpoint, payload, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${user.token}`,
      },
    });

    if (response.data.success) {
      toast.success('Application added successfully!');
      onSuccess();
      onClose();
      resetForm();
    } else {
      throw new Error(response.data.message || 'Failed to add application');
    }
  } catch (error: any) {
    console.error('Error adding application:', error);
    toast.error(error.response?.data?.message || 'Failed to add application');
  } finally {
    setLoading(false);
  }
};


  const resetForm = () => {
    setStep(0);
    setAcademicId('');
    setDegreeId('');
    setFormConfig(null);
    setFormData({});
    setFileData({});
    setErrors({});
    setFormOptions({});
    setPaymentMode('cash');
    setChequeRemark('');
    setChequeFile(null);
  };

const handleFileInputChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
  const file = e.target.files?.[0];
  if (file) {
    setChequeFile(file);

    const base64 = await new Promise<string>((resolve) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result as string);
      reader.readAsDataURL(file);
    });

    setChequeBase64(base64);
  }
};


  return (
    <Modal
      show={isOpen}
      onClose={onClose}
      size="full"
      className="min-h-screen"
      dismissible={!loading}
    >
        <div className="min-h-[90vh] flex flex-col">
      <ModalHeader className="bg-gradient-to-r from-blue-600 to-blue-800 text-white">
        <div className="flex items-center gap-3">
          <Icon icon="solar:add-circle-line-duotone" className="w-6 h-6" />
          <span className="text-xl font-bold">Add New Application</span>
        </div>
      </ModalHeader>
      
      <ModalBody className="p-0 h-[calc(100vh-140px)] overflow-y-auto">
        <div className="p-6">
          {step === 0 ? (
            <div className="space-y-6">

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Academic Institution *
                  </label>
               {
                type === 'school' &&(
                       <SchoolDropdown
                value={academicId}
                onChange={(value) => setAcademicId(value)}
                placeholder="Select academic..."
                includeAllOption={true}
                label=""
                 disabled={fetchingForm}
              />
                )
               }
               {
                type === 'college' &&(
                       <AcademicDropdown
                value={academicId}
                onChange={(value) => setAcademicId(value)}
                placeholder="Select academic..."
                includeAllOption={true}
                label=""
                 disabled={fetchingForm}
              />
                )
               }
              
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Form Route *
                  </label>
                  <select
  value={degreeId ? JSON.stringify(degreeId) : ""}
  onChange={(e) => {
    const selected = JSON.parse(e.target.value);
    setDegreeId(selected);
  }}
  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
  disabled={!academicId || fetchingForm}
>
  <option value="">
    {academicId ? "Select Form Route" : "Select Academic First"}
  </option>

  {degreeOptions.map(option => (
    <option key={option.value} value={JSON.stringify(option)}>
      {option.label}
    </option>
  ))}
</select>
                </div>
              </div>

              {fetchingForm && (
                <div className="flex justify-center py-8">
                  <div className="flex flex-col items-center gap-3">
                    <Spinner size="xl" />
                    <p className="text-gray-600">Loading form configuration...</p>
                  </div>
                </div>
              )}
            </div>
          ) : step === 1 && formConfig ? (
            // Step 2: Form
            <div className="space-y-6">
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800">
                      {formConfig.header?.name || 'Application Form'}
                    </h3>
                    <p className="text-sm text-gray-600">
                      Fill in the application details below
                    </p>
                  </div>
                  <div className="text-sm text-gray-500">
                    Academic Type: {formConfig.academic_type === 1 ? 'School' : 'College'}
                  </div>
                </div>
              </div>

              {/* Form Step Component */}
              <div className="border rounded-xl p-4">
                <FormStep
                  dynamicBoxes={formConfig.data || []}
                  formData={formData}
                  fileData={fileData}
                  errors={errors}
                  formOptions={formOptions}
                  onInputChange={handleInputChange}
                  onSelectChange={handleSelectChange}
                  onCheckboxChange={handleCheckboxChange}
                  onDateChange={handleDateChange}
                  onAadhaarChange={handleAadhaarChange}
                  onFileChange={handleFileChange}
                  formRefs={{ current: {} }}
                  type={formConfig.academic_type === 1 ? 'school' : 'collage'}
                  onMultiDataChange={() => {}}
                  onRemoveMultiDataEntry={() => {}}
                  onAddMultiDataEntry={() => {}}
                />
              </div>

              {/* Payment Mode Selection */}
              <div className="border rounded-xl p-6 bg-white">
                <h4 className="text-lg font-semibold text-gray-800 mb-4">Payment Details</h4>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Payment Mode *
                    </label>
                    <div className="flex gap-4">
                      <label className="flex items-center space-x-3">
                        <input
                          type="radio"
                          value="cheque"
                          checked={paymentMode === 'cheque'}
                          onChange={(e) => setPaymentMode(e.target.value)}
                          className="w-4 h-4 text-blue-600"
                        />
                        <span className="text-gray-700">Cheque/DD</span>
                      </label>
                      <label className="flex items-center space-x-3">
                        <input
                          type="radio"
                          value="cash"
                          checked={paymentMode === 'cash'}
                          onChange={(e) => setPaymentMode(e.target.value)}
                          className="w-4 h-4 text-blue-600"
                        />
                        <span className="text-gray-700">Cash</span>
                      </label>
                    </div>
                  </div>

                  {paymentMode === 'cheque' && (
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Cheque/DD Remark
                        </label>
                        <Textarea
                          value={chequeRemark}
                          onChange={(e) => setChequeRemark(e.target.value)}
                          placeholder="Enter cheque/DD details..."
                          rows={3}
                          className="w-full"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Upload Cheque/DD Copy
                        </label>
                        <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                          <input
                            type="file"
                            id="cheque-file"
                            onChange={handleFileInputChange}
                            accept="image/*,.pdf"
                            className="hidden"
                          />
                          <label
                            htmlFor="cheque-file"
                            className="cursor-pointer flex flex-col items-center justify-center"
                          >
                            <Icon icon="solar:upload-line-duotone" className="w-12 h-12 text-gray-400 mb-3" />
                            <p className="text-sm text-gray-600 mb-2">
                              {chequeFile ? chequeFile.name : 'Click to upload cheque/DD copy'}
                            </p>
                            <p className="text-xs text-gray-500">Supports JPG, PNG, PDF (Max 5MB)</p>
                          </label>
                        </div>
                      </div>
                    </div>
                  )}

                  {paymentMode === 'cash' && (
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Cash Payment Remark
                      </label>
                      <Textarea
                        value={chequeRemark}
                        onChange={(e) => setChequeRemark(e.target.value)}
                        placeholder="Enter cash payment details..."
                        rows={3}
                        className="w-full"
                      />
                    </div>
                  )}
                </div>
              </div>
            </div>
          ) : null}
        </div>
      </ModalBody>

      <ModalFooter className="border-t bg-gray-50">
        <div className="flex justify-between w-full">
          <Button
            color="gray"
            onClick={() => {
              if (step === 0) {
                onClose();
              } else {
                setStep(0);
              }
            }}
            disabled={loading}
          >
            {step === 0 ? 'Cancel' : 'Back'}
          </Button>

          <div className="flex gap-3">
            <Button
              color="gray"
              onClick={resetForm}
              disabled={loading}
            >
              Reset
            </Button>
            
            {step === 1 && (
              <Button
                onClick={handleSubmit}
                disabled={loading}
                className="bg-green-600 hover:bg-green-700"
              >
                {loading ? (
                  <>
                    <Spinner size="sm" className="mr-2" />
                    Submitting...
                  </>
                ) : (
                  <>
                    <Icon icon="solar:check-circle-line-duotone" className="w-4 h-4 mr-2" />
                    Submit Application
                  </>
                )}
              </Button>
            )}
          </div>
        </div>
      </ModalFooter>
      </div>
    </Modal>
  );
};

export default AddApplicationModal;