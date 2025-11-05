import React, { useState, useRef, useCallback } from 'react';
import { Icon } from '@iconify/react';
import FormStep from '../collageApply/FormStep';
import DisclaimerStep from './DisclaimerStep';
import DeclarationStep from './DeclarationStep';
import FeeDetailsStep from './FeeDetailsStep';
import PreviewStep from './PreviewStep';
import SuccessStep from './SuccessStep';
import toast from 'react-hot-toast';
import axios from 'axios';

interface SchoolApplyFormProps {
  academic_id: string;
  dynamicBoxes: any[];
  required_child: any[];
  home_other_lines: any;
  header: any;
  content_managment: any;
  cdata: any;
  class: any[];
  transportation_fee: any[];
  transportation_setting: any;
  apply_modal?: any;
  OtherData?: any;
}

const steps = [
  'FILL APPLICATION',
  'DISCLAIMER FORM',
  'DECLARATION FORM',
  'DETAILS OF FEE',
  'CONFIRM & PAY',
  'SUCCESS',
];

const SchoolApplyForm: React.FC<SchoolApplyFormProps> = ({
  academic_id,
  dynamicBoxes,
  required_child,
  home_other_lines,
  header,
  content_managment,
  cdata,
  class: classes,
  transportation_fee,
  transportation_setting,
  apply_modal,
  OtherData,
}) => {
  const [activeStep, setActiveStep] = useState(0);
  const [formData, setFormData] = useState<{ [key: string]: any }>({});
  const [fileData, setFileData] = useState<{ [key: string]: any }>({});
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [paymentData, setPaymentData] = useState<any>(null);
  const [showPaymentDialog, setShowPaymentDialog] = useState(false);
  const [formOptions, setFormOptions] = useState<{ [key: string]: any[] }>({});
  const [conditions, setConditions] = useState({
    disclaimer: false,
    declaration: false,
    fee: false,
  });

  const formRefs = useRef<{ [key: string]: any }>({});
  const validationErrors = useRef<{ [key: string]: string }>({});

  // API URL
  const apiUrl = import.meta.env.VITE_API_URL;

  // Check validation function
  const checkValidation = useCallback(
    (name: string, type: string, validation: string, validation_message: string) => {
      if (type === 'file_button') {
        validationErrors.current[name] = '';
      } else {
        if (name === 'adharCard') {
          let aadhaarCard = '';
          for (let i = 0; i < 12; i++) {
            const digit = formData[`adharCard_${i}`];
            if (!digit) {
              validationErrors.current[name] = 'All Aadhaar card digits are required';
              break;
            }
            aadhaarCard += digit;
          }
          if (aadhaarCard.length === 12) {
            validationErrors.current[name] = '';
          }
        } else if (!formData[name]) {
          validationErrors.current[name] = validation_message;
        } else if (validation === 'email') {
          const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
          if (!emailRegex.test(formData[name])) {
            validationErrors.current[name] = 'Invalid email address';
          } else {
            validationErrors.current[name] = '';
          }
        } else if (validation === 'mobile') {
          const phoneRegex = /^\d{10}$/;
          if (!phoneRegex.test(formData[name])) {
            validationErrors.current[name] = 'Phone number must be 10 digits';
          } else {
            validationErrors.current[name] = '';
          }
        } else {
          validationErrors.current[name] = '';
        }
      }
      setErrors((prev) => ({ ...prev, [name]: validationErrors.current[name] }));
    },
    [formData],
  );

  // Handle input change with API calls
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
          )}&academicId=${academic_id}&customerId=${cdata.c_id}`,
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

      // Check validation if field has validation rules
      if (fieldConfig?.validation) {
        checkValidation(
          name,
          fieldConfig.type,
          fieldConfig.validation,
          fieldConfig.validation_message,
        );
      }
    },
    [errors, apiUrl, academic_id, cdata, checkValidation],
  );

  // Handle select change
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

      // Handle API calls for select fields
      if (fieldConfig?.apiurl && fieldConfig?.target) {
        fetch(`${apiUrl}/frontend/get_district_by_state_id`, {
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

      // Check validation
      if (fieldConfig?.validation) {
        checkValidation(
          name,
          fieldConfig.type,
          fieldConfig.validation,
          fieldConfig.validation_message,
        );
      }
    },
    [errors, apiUrl, checkValidation],
  );

  // Handle checkbox change
  const handleCheckboxChange = useCallback(
    (name: string, value: boolean, fieldConfig?: any) => {
      setFormData((prev) => ({
        ...prev,
        [name]: value ? 1 : 0,
      }));

      if (fieldConfig?.required) {
        checkValidation(
          name,
          fieldConfig.type,
          fieldConfig.validation,
          fieldConfig.validation_message,
        );
      }
    },
    [checkValidation],
  );

  // Handle date change
  const handleDateChange = useCallback(
    (name: string, date: any, fieldConfig?: any) => {
      let value = '';
      try {
        const adjustedDate = new Date(date);
        adjustedDate.setDate(adjustedDate.getDate() + 1);
        value = adjustedDate.toISOString().split('T')[0] || '';
      } catch (error) {
        console.error('Date parsing error:', error);
      }

      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));

      if (fieldConfig?.required) {
        checkValidation(
          name,
          fieldConfig.type,
          fieldConfig.validation,
          fieldConfig.validation_message,
        );
      }
    },
    [checkValidation],
  );

  // Handle Aadhaar change
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

          checkValidation(
            name,
            fieldConfig.type,
            fieldConfig.validation,
            fieldConfig.validation_message,
          );
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
    [checkValidation],
  );

  const handleFileChange = useCallback(
    (name: string, file: File, fieldConfig?: any) => {
      if (!file) return;

      // Validate image type
      if (!file.type.match(/image\/(jpeg|png)/)) {
        toast.error('Please upload a valid JPEG or PNG image.');
        return;
      }

      // Validate file size (1MB limit)
      if (file.size > 1048576) {
        toast.error('File size should be less than 1 MB.');
        return;
      }

      const reader = new FileReader();

      reader.onloadend = () => {
        const base64 = reader.result as string;
        let width = 150;
        let height = 150;

        if (fieldConfig?.resolution) {
          const [w, h] = fieldConfig.resolution.split('x');
          width = parseInt(w, 10);
          height = parseInt(h, 10);
        }

        // Backend compatible structure
        setFileData((prev) => ({
          ...prev,
          [name]: base64,
        }));

        // remove error if previously set
        if (errors[name]) {
          setErrors((prev) => ({
            ...prev,
            [name]: '',
          }));
        }

        // validate if required
        if (fieldConfig?.required) {
          checkValidation(
            name,
            fieldConfig.type,
            fieldConfig.validation,
            fieldConfig.validation_message,
          );
        }
      };

      reader.readAsDataURL(file); // Base64 generation
    },
    [errors, checkValidation],
  );

  const handleConditionChange = useCallback((condition: string, value: boolean) => {
    setConditions((prev) => ({
      ...prev,
      [condition]: value,
    }));
  }, []);

  const validateStep = useCallback(
    (step: number) => {
      const newErrors: { [key: string]: string } = {};

      if (step === 0) {
        required_child.forEach((child) => {
          if (child.type === 'file_button') {
            if (!fileData[child.name]) {
              newErrors[child.name] = child.validation_message || `${child.label} is required`;
            }
          } else {
            if (child.name === 'adharCard') {
              let aadhaarCard = '';
              for (let i = 0; i < 12; i++) {
                const digit = formData[`adharCard_${i}`];
                if (!digit) {
                  newErrors[child.name] = 'All Aadhaar card digits are required';
                  break;
                }
                aadhaarCard += digit;
              }
            } else if (!formData[child.name]) {
              newErrors[child.name] = child.validation_message || `${child.label} is required`;
            } else if (child.validation === 'email') {
              const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
              if (!emailRegex.test(formData[child.name])) {
                newErrors[child.name] = 'Invalid email address';
              }
            } else if (child.validation === 'mobile') {
              const phoneRegex = /^\d{10}$/;
              if (!phoneRegex.test(formData[child.name])) {
                newErrors[child.name] = 'Phone number must be 10 digits';
              }
            }
          }
        });

        // Special validation for SC/ST categories
        const selectedCategory = formData.s_category;
        if (
          (selectedCategory === 'SC' || selectedCategory === 'ST') &&
          !fileData['caste_certificate']
        ) {
          newErrors['caste_certificate'] = 'Caste certificate preview is required';
        }
      } else if (step === 1 && !conditions.disclaimer) {
        newErrors.disclaimer = 'Please accept the disclaimer to proceed';
      } else if (step === 2 && !conditions.declaration) {
        newErrors.declaration = 'Please accept the declaration to proceed';
      } else if (step === 3 && !conditions.fee) {
        newErrors.fee = 'Please accept the fee agreement to proceed';
      }

      console.log('Validation errors:', newErrors);
      setErrors(newErrors);
      validationErrors.current = newErrors;
      return Object.keys(newErrors).length === 0;
    },
    [formData, fileData, required_child, conditions],
  );

  const handleBack = useCallback(() => {
    setActiveStep((prev) => prev - 1);
  }, []);

  const handleReset = useCallback(() => {
    setActiveStep(0);
    setFormData({});
    setFileData({});
    setErrors({});
    setFormOptions({});
    setConditions({
      disclaimer: false,
      declaration: false,
      fee: false,
    });
    validationErrors.current = {};
  }, []);

  const handlePayment = useCallback(async () => {
    setLoading(true);
    try {
      const response = await axios.post(`${apiUrl}/frontend/razorpay-order`, {
        amount: paymentData.total_payable_fee * 100,
        academic_id: academic_id,
        receipt: `receipt_${formData.application_id}`,
      });

      const order = response.data;
      console.log('Payment order:', order);
      
      const options = {
        key: cdata.razorpay_api_key,
        amount: order.amount,
        currency: order.currency,
        name: header.name,
        description: 'School Application Fee',
        order_id: order.id,
        handler: async (paymentResponse: any) => {
          try {
            const verifyResponse = await axios.post(
              `${apiUrl}/frontend/school-save-final-step-data`,
              {
                razorpay_payment_id: paymentResponse.razorpay_payment_id,
                razorpay_order_id: paymentResponse.razorpay_order_id,
                razorpay_signature: paymentResponse.razorpay_signature,
                academic_id: academic_id,
                application_id: formData.application_id,
                transaction_id: formData.transaction_id,
              },
            );

            if (verifyResponse.data.success) {
              setFormData((prev) => ({
                ...prev,
                payment_done: 1,
                transaction_id: verifyResponse.data.transaction_id,
              }));
              setActiveStep(5); // Move to SUCCESS step
            }
          } catch (error) {
            console.error('Payment verification failed:', error);
            toast.error('Payment verification failed. Please try again.');
          }
        },
        theme: {
          color: '#1e40af',
        },
      };

      const rzp = new (window as any).Razorpay(options);
      rzp.open();
    } catch (error) {
      console.error('Payment initialization failed:', error);
      toast.error('Payment initialization failed. Please try again.');
    } finally {
      setLoading(false);
      setShowPaymentDialog(false);
    }
  }, [paymentData, formData, cdata, header, apiUrl, academic_id]);

  const handleNext = useCallback(async () => {
    if (!validateStep(activeStep)) {
      return;
    }

    if (activeStep === 0) {
      setLoading(true);
      try {
        // For school, calculate payable amount based on class and other factors
        const payableResponse = await axios.post(`${apiUrl}/Public/Get-school-payable-amount`, {
          class_id: formData.class,
          academic_id: academic_id,
          transportation_required: formData.transportation_required,
        });

        if (payableResponse.data?.total_payable_fee) {
          setPaymentData(payableResponse.data);

          const response = await axios.post(`${apiUrl}/frontend/school-save-first-step-data`, {
            c_id: cdata.c_id,
            formData: formData,
            files: fileData,
            amount: payableResponse.data.total_payable_fee,
            academic_id: academic_id,
          });

          if (response.data.success) {
            setFormData((prev) => ({
              ...prev,
              application_id: response.data.application_id,
              transaction_id: response.data.transaction_id,
              amount: payableResponse.data.total_payable_fee,
            }));
            setActiveStep((prev) => prev + 1);
          }
        } else {
          toast.error('Total payable fee not found. Please try again.');
          return;
        }
      } catch (error) {
        console.error('Error saving form data:', error);
        toast.error('Error saving application data. Please try again.');
      } finally {
        setLoading(false);
      }
    } else if (activeStep === 4) {
      setShowPaymentDialog(true);
    } else {
      setActiveStep((prev) => prev + 1);
    }
  }, [activeStep, formData, fileData, validateStep, academic_id, cdata, apiUrl]);

  const handleDownloadReceipt = async (application_id: string) => {
    try {
      const response = await axios.post(
        `${apiUrl}/frontend/download-school-receipt`,
        { application_id },
        {
          responseType: "blob",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      // Create blob url
      const file = new Blob([response.data], { type: "application/pdf" });
      const fileURL = URL.createObjectURL(file);

      // Create a temporary link for download
      const link = document.createElement("a");
      link.href = fileURL;
      link.setAttribute("download", `school-receipt-${application_id}.pdf`);
      document.body.appendChild(link);
      link.click();

      // Cleanup
      link.remove();
      URL.revokeObjectURL(fileURL);

    } catch (error) {
      console.error("Receipt download failed:", error);
      toast.error("Receipt download failed. Please try again.");
    }
  };

  const renderStep = (step: number) => {
    switch (step) {
      case 0:
        return (
          <FormStep
            dynamicBoxes={dynamicBoxes}
            formData={formData}
            fileData={fileData}
            errors={errors}
            formOptions={formOptions}
            formRefs={formRefs}
            onInputChange={handleInputChange}
            onSelectChange={handleSelectChange}
            onCheckboxChange={handleCheckboxChange}
            onDateChange={handleDateChange}
            onAadhaarChange={handleAadhaarChange}
            onFileChange={handleFileChange}
          />
        );
      case 1:
        return (
          <DisclaimerStep
            content={content_managment?.disclaimer_form}
            formData={formData}
            fileData={fileData}
            accepted={conditions.disclaimer}
            onConditionChange={handleConditionChange}
          />
        );
      case 2:
        return (
          <DeclarationStep
            content={content_managment?.declaration_form}
            formData={formData}
            fileData={fileData}
            accepted={conditions.declaration}
            onConditionChange={handleConditionChange}
          />
        );
      case 3:
        return (
          <FeeDetailsStep
            classes={classes}
            transportation_fee={transportation_fee}
            transportation_setting={transportation_setting}
            formData={formData}
            accepted={conditions.fee}
            onConditionChange={handleConditionChange}
          />
        );
      case 4:
        return (
          <PreviewStep
            dynamicBoxes={dynamicBoxes}
            formData={formData}
            fileData={fileData}
            payableAmount={paymentData?.total_payable_fee}
          />
        );
      case 5:
        return (
          <SuccessStep
            applicationId={formData.application_id}
            transactionId={formData.transaction_id}
            amount={paymentData?.total_payable_fee}
            onDownloadReceipt={handleDownloadReceipt}
            onNewApplication={handleReset}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="group relative mb-8">
      <div className="absolute -inset-1 bg-gradient-to-r from-[#1e40af] to-[#dc2626] rounded-2xl blur opacity-0 group-hover:opacity-100 transition duration-300"></div>
      <div className="relative bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-[#1e40af] to-[#dc2626]"></div>

        {/* Form Header */}
        <div className="p-6 border-b border-gray-100 bg-gradient-to-r from-[#1e40af]/5 to-[#dc2626]/5">
          <h4 className="text-center text-xl font-bold text-[#1e40af] inline-flex items-center justify-center">
            <Icon icon="solar:school-line-duotone" className="w-5 h-5 mr-2" />
            School Application Form
          </h4>
          <p className="text-center text-gray-600 mt-2">
            {home_other_lines?.[1]?.title || 'Online Application Form'}
          </p>
        </div>

        <div className="p-6">
          {/* Stepper */}
          <div className="flex items-center justify-center mb-8">
            <div className="flex items-center w-full max-w-4xl">
              {steps.map((step, index) => (
                <React.Fragment key={step}>
                  {/* Step Circle */}
                  <div className="flex flex-col items-center">
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center border-2 font-semibold text-sm transition-all duration-300 ${
                        index === activeStep
                          ? 'bg-blue-600 border-blue-600 text-white shadow-lg transform scale-110'
                          : index < activeStep
                          ? 'bg-green-500 border-green-500 text-white'
                          : 'bg-white border-gray-300 text-gray-500'
                      }`}
                    >
                      {index < activeStep ? (
                        <Icon icon="solar:check-circle-line-duotone" className="w-5 h-5" />
                      ) : (
                        index + 1
                      )}
                    </div>
                    <span
                      className={`text-xs mt-2 font-medium text-center ${
                        index === activeStep ? 'text-blue-600' : 'text-gray-500'
                      }`}
                    >
                      {step}
                    </span>
                  </div>

                  {/* Connector Line */}
                  {index < steps.length - 1 && (
                    <div
                      className={`flex-1 h-1 mx-2 transition-all duration-300 ${
                        index < activeStep ? 'bg-green-500' : 'bg-gray-300'
                      }`}
                    />
                  )}
                </React.Fragment>
              ))}
            </div>
          </div>

          {/* Step Content */}
          <div className="min-h-[400px]">{renderStep(activeStep)}</div>

          {/* Navigation Buttons */}
          <div className="flex justify-between mt-8">
            <button
              onClick={handleBack}
              disabled={activeStep === 0}
              className={`flex items-center gap-2 px-6 py-2 rounded-lg border transition-all duration-200 ${
                activeStep === 0
                  ? 'border-gray-300 text-gray-400 cursor-not-allowed'
                  : 'border-blue-600 text-blue-600 hover:bg-blue-50 hover:shadow-md'
              }`}
            >
              <Icon icon="solar:arrow-left-line-duotone" className="w-4 h-4" />
              Back
            </button>

            <div className="flex gap-3">
              {activeStep === steps.length - 1 ? (
                <button
                  onClick={handleReset}
                  className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg font-semibold transition-all duration-200 hover:shadow-lg transform hover:scale-105"
                >
                  Submit Another Application
                </button>
              ) : (
                <button
                  onClick={handleNext}
                  disabled={loading}
                  className={`flex items-center gap-2 px-6 py-2 rounded-lg font-semibold text-white transition-all duration-200 ${
                    loading
                      ? 'bg-gray-400 cursor-not-allowed'
                      : 'bg-blue-600 hover:bg-blue-700 hover:shadow-lg transform hover:scale-105'
                  }`}
                >
                  {loading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Processing...
                    </>
                  ) : activeStep === steps.length - 2 ? (
                    <>
                      <Icon icon="solar:card-line-duotone" className="w-4 h-4" />
                      Pay Now
                    </>
                  ) : (
                    <>
                      <Icon icon="solar:arrow-right-line-duotone" className="w-4 h-4" />
                      Next
                    </>
                  )}
                </button>
              )}
            </div>
          </div>

          {Object.keys(errors).length > 0 && (
            <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
              <div className="flex items-center gap-2 text-red-700">
                <Icon icon="solar:danger-triangle-line-duotone" className="w-5 h-5" />
                <span className="font-semibold">
                  Please fix the errors above before proceeding.
                </span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Payment Confirmation Dialog */}
      {showPaymentDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full transform transition-all duration-300 scale-100">
            {/* Dialog Header */}
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-center text-xl font-bold text-green-600">Confirm Payment</h3>
            </div>

            {/* Dialog Content */}
            <div className="p-6">
              <div className="text-center mb-4">
                <div className="text-2xl font-bold text-gray-800 mb-2">
                  ₹ {paymentData?.total_payable_fee?.toLocaleString('en-IN')}
                </div>
                <p className="text-gray-600 text-sm">
                  You will be redirected to secure payment gateway
                </p>
              </div>

              {/* Payment Details */}
              <div className="bg-gray-50 rounded-lg p-4 mb-4">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-gray-600">Application ID:</span>
                  <span className="font-semibold">{formData.application_id}</span>
                </div>
                <div className="flex justify-between items-center text-sm mt-2">
                  <span className="text-gray-600">Payment For:</span>
                  <span className="font-semibold">School Application Fee</span>
                </div>
              </div>
            </div>

            {/* Dialog Actions */}
            <div className="flex justify-center gap-4 p-6 border-t border-gray-200">
              <button
                onClick={() => setShowPaymentDialog(false)}
                className="flex-1 px-4 py-2 border border-gray-400 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition-colors duration-200"
              >
                Cancel
              </button>
              <button
                onClick={handlePayment}
                disabled={loading}
                className={`flex-1 px-4 py-2 rounded-lg font-semibold text-white transition-all duration-200 ${
                  loading
                    ? 'bg-gray-400 cursor-not-allowed'
                    : 'bg-green-600 hover:bg-green-700 hover:shadow-lg'
                }`}
              >
                {loading ? (
                  <div className="flex items-center justify-center gap-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Processing...
                  </div>
                ) : (
                  'Proceed to Pay'
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SchoolApplyForm;

// import React from 'react'

// const SchoolApplyForm = () => {
//   return (
//     <div>SchoolApplyForm</div>
//   )
// }

// export default SchoolApplyForm
