import React, { useState, useRef, useCallback, useEffect } from 'react';
import { Icon } from '@iconify/react';
import axios from 'axios';
import FormStep from './FormStep';
import PreviewStep from '../schoolApply/PreviewStep';
import SuccessStep from '../schoolApply/SuccessStep';
import toast from 'react-hot-toast';
import { isImageBlurred } from '../schoolApply/Blurred';
import Loader from 'src/Frontend/Common/Loader'; 
import * as pdfjsLib from "pdfjs-dist";
import { GlobalWorkerOptions } from "pdfjs-dist/build/pdf";
import pdfWorker from "pdfjs-dist/build/pdf.worker?url";

GlobalWorkerOptions.workerSrc = pdfWorker;



interface ApplyFormProps {
  academic_id: string;
  dynamicBoxes: any[];
  required_child: any[];
  home_other_lines: any;
  header: any;
  cdata: any;
  apply_modal?: any;
  type: string;
}

const steps = ['FILL APPLICATION', 'CONFIRM & PAY', 'SUCCESS'];

const ApplyForm: React.FC<ApplyFormProps> = ({
  academic_id,
  dynamicBoxes,
  required_child,
  home_other_lines,
  header,
  cdata,
  apply_modal,
  type
}) => {
  const [activeStep, setActiveStep] = useState(0);
  const [formData, setFormData] = useState<{ [key: string]: any }>({});
  const [fileData, setFileData] = useState<{ [key: string]: any }>({});
  const [loading, setLoading] = useState(false);
  const [paymentLoading, setPaymentLoading] = useState(false); // New state for payment loading
  const [stepTransitionLoading, setStepTransitionLoading] = useState(false); // New state for step transition
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [paymentData, setPaymentData] = useState<any>(null);
  const [showPaymentDialog, setShowPaymentDialog] = useState(false);
  const [formOptions, setFormOptions] = useState<{ [key: string]: any[] }>({});

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
          let isValid = true;

          for (let i = 0; i < 12; i++) {
            const digit = formData[`adharCard_${i}`];
            if (!digit) {
              validationErrors.current[name] = 'All Aadhaar card digits are required';
              isValid = false;
              break;
            }
            aadhaarCard += digit;
          }

          // Clear error if all digits are properly filled
          if (isValid && aadhaarCard.length === 12) {
            validationErrors.current[name] = '';
          }
        } else if (!formData[name] && formData[name] !== 0) {
          // Fix: allow 0 as valid value
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

  useEffect(() => {
    required_child.forEach((child) => {
      // Only validate fields that have values or are required
      if (formData[child.name] !== undefined || child.required) {
        checkValidation(child.name, child.type, child.validation, child.validation_message);
      }
    });
  }, [formData, required_child]);

  useEffect(() => {
    // Only show errors when user tries to proceed to next step but validation fails
    if (activeStep === 1 && Object.keys(errors).length > 0) {
      const hasValidationErrors = Object.values(errors).some((error) => error !== '');
      if (hasValidationErrors) {
        toast.error('Please fill in all required fields.');
      }
    }
  }, [errors, activeStep]);

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
    },
    [errors, apiUrl, academic_id, cdata],
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
        console.log(fieldConfig);
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
    },
    [errors, apiUrl],
  );

  // Handle checkbox change
  const handleCheckboxChange = useCallback((name: string, value: boolean, fieldConfig?: any) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value ? 1 : 0,
    }));
  }, []);

  // Handle date change
  const handleDateChange = useCallback((name: string, date: any, fieldConfig?: any) => {
    setFormData((prev) => ({
      ...prev,
      [name]: date,
    }));

    // Clear error immediately when date is selected
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: '',
      }));
    }
  }, []);

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
  

// const handleFileChange = useCallback(
//     (name: string, file: File, fieldConfig?: any) => {
//       if (!file) return;

//       const { resolution, target, type, validation, validation_message, required } =
//         fieldConfig || {};

//       // ✅ Validate Type - Allow both images and PDF
//       const isImage = file.type.match(/image\/(jpeg|png|jpg)/);
//       const isPDF = file.type === 'application/pdf';
      
//       if (!isImage && !isPDF) {
//         toast.error('Please upload a valid JPEG, PNG image or PDF file.');
//         return;
//       }

//       // ✅ Validate Size (< 1 MB)
//       if (file.size > 1048576) {
//         toast.error('File size should be less than 1 MB.');
//         return;
//       }

//       // Skip resolution check for PDF files
//       if (isPDF) {
//         const reader = new FileReader();
//         reader.onloadend = () => {
//           const base64 = reader.result as string;
          
//           setFileData((prev) => ({
//             ...prev,
//             [name]: base64,
//           }));

//           if (target) {
//             setFileData((prev) => ({
//               ...prev,
//               [target]: base64,
//             }));
//           }

//           if (errors[name]) {
//             setErrors((prev) => ({
//               ...prev,
//               [name]: '',
//             }));
//           }
//         };
//         reader.readAsDataURL(file);
//         return;
//       }

//       // For images, proceed with normal processing but skip resolution check
//       const reader = new FileReader();
//       reader.onloadend = async () => {
//         const base64 = reader.result as string;

//         const img = new window.Image();
//         img.src = base64;

//         img.onload = async () => {
//           const imgWidth = img.width;
//           const imgHeight = img.height;

//           // ✅ Skip resolution check for all images
//           // if (resolution && !fieldConfig?.skipResolution) {
//           //   const [w, h] = resolution.split('x');
//           //   targetWidth = parseInt(w, 10);
//           //   targetHeight = parseInt(h, 10);
//           // 
//           //   if (imgWidth !== targetWidth || imgHeight !== targetHeight) {
//           //     toast.error(`The uploaded image must be ${targetWidth}x${targetHeight} pixels.`);
//           //     return;
//           //   }
//           // }

//           // ✅ Blur Detection (only for images)
//           try {
//             const blurry = await isImageBlurred(img.src, imgWidth, imgHeight);
//             if (blurry) {
//               toast.error('The uploaded image is too blurry. Please upload a clearer image.');
//               return;
//             }
//           } catch (err) {
//             console.error('Blur check failed:', err);
//             toast.error('There was an issue processing the image.');
//             return;
//           }

//           // ✅ Save base64 for backend submission
//           setFileData((prev) => ({
//             ...prev,
//             [name]: base64,
//           }));

//           // ✅ Preview target if defined
//           if (target) {
//             setFileData((prev) => ({
//               ...prev,
//               [target]: base64,
//             }));
//           }

//           // ✅ Remove error if previously set
//           if (errors[name]) {
//             setErrors((prev) => ({
//               ...prev,
//               [name]: '',
//             }));
//           }
//         };
//       };

//       reader.readAsDataURL(file);
//     },
//     [errors],
//   );

const getPdfFirstPageImage = async (file: File): Promise<string> => {
  const arrayBuffer = await file.arrayBuffer();
  const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
  const page = await pdf.getPage(1);

  const viewport = page.getViewport({ scale: 1.5 });

  const canvas = document.createElement("canvas");
  const context = canvas.getContext("2d")!;
  canvas.width = viewport.width;
  canvas.height = viewport.height;

  await page.render({ canvasContext: context, viewport }).promise;

  return canvas.toDataURL("image/jpeg");
};


const handleFileChange = useCallback(
  async (name: string, file: File, fieldConfig?: any) => {
    if (!file) return;

    const extension = file.name.split(".").pop()?.toLowerCase();
    let finalBase64 = "";

    const isPDF = extension === "pdf";
    const isImage = file.type.startsWith("image/");

    if (!isImage) {
      toast.error("Only Image files allowed.");
      return;
    }

    // PDF → first page preview
    if (isPDF) {
      // finalBase64 = await getPdfFirstPageImage(file);
      return
    }

    // Image → base64 convert
    if (isImage) {
      finalBase64 = await new Promise<string>((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result as string);
        reader.readAsDataURL(file);
      });
    }

    // Preview + file save
    setFileData((prev) => ({
      ...prev,
      [name]: finalBase64,
      [name + "_file"]: file
    }));

    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  },
  [errors]
);


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
            } else if (!formData[child.name] && formData[child.name] !== 0) {
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
      }

      // Filter out empty error messages
      const filteredErrors = Object.fromEntries(
        Object.entries(newErrors).filter(([_, value]) => value !== ''),
      );

      console.log('Validation errors:', filteredErrors);
      setErrors(filteredErrors);
      validationErrors.current = filteredErrors;
      return Object.keys(filteredErrors).length === 0;
    },
    [formData, fileData, required_child],
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
    validationErrors.current = {};
  }, []);

  const handlePayment = useCallback(async () => {
    setPaymentLoading(true); 
    setStepTransitionLoading(true);
    try {
      const response = await axios.post(`${apiUrl}/frontend/razorpay-order`, {
        amount: paymentData.total_payable_fee * 100,
        academic_id: academic_id,
        receipt: `receipt_${formData.application_id}`,
      });

      const order = response.data;

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
              `${apiUrl}/frontend/college-save-final-step-data`,
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
              setActiveStep(2);
            }
          } catch (error) {
            toast.error('Payment verification failed. Please try again.');
          } finally {
            setStepTransitionLoading(false);
          }
        },

        theme: {
          color: '#1e40af',
        },

        modal: {
          ondismiss: () => {
            console.log('Payment cancelled by user');
            setShowPaymentDialog(false);
            setStepTransitionLoading(false);
            toast('Payment Cancelled', { icon: '⚠️' });
          },
        },
      };

      const rzp = new (window as any).Razorpay(options);
      rzp.open();
    } catch (error) {
      console.error('Payment initialization failed:', error);
    } finally {
      setPaymentLoading(false); // Stop payment loading
      setShowPaymentDialog(false);
    }
  }, [paymentData, formData, cdata, header, apiUrl]);

  const handleNext = useCallback(async () => {
    if (!validateStep(activeStep)) {
      return;
    }

    if (activeStep === 0) {
      setLoading(true);
      console.log('formData', fileData);
      try {
        const payableResponse = await axios.post(`${apiUrl}/Public/Get-payable-amount`, {
          caste_id: formData.category,
          academic_id: academic_id,
          location_id: formData.selectBelong,
        });
        console.log('payableResponse', payableResponse.data.success);
        if (payableResponse.data?.total_payable_fee) {
          setPaymentData(payableResponse.data);

          const response = await axios.post(`${apiUrl}/frontend/college-save-first-step-data`, {
            c_id: cdata.c_id,
            cookieData: formData,
            amount: payableResponse.data.total_payable_fee,
            files: fileData,
            academic_id: academic_id,
            application_id: formData.application_id,
          });

          setFormData((prev) => ({
            ...prev,
            application_id: response.data?.application_id,
            transaction_id: response.data?.transaction_id,
            amount: payableResponse.data.total_payable_fee,
          }));

          setActiveStep((prev) => prev + 1);
        } else {
          toast.error('Total payable fee not found. Please try again.');
          return;
        }
      } catch (error) {
        console.error('Error saving form data:', error);
      } finally {
        setLoading(false);
      }
    } else if (activeStep === 1) {
      setShowPaymentDialog(true);
    } else {
      setActiveStep((prev) => prev + 1);
    }
  }, [activeStep, formData, fileData, validateStep, academic_id, cdata, apiUrl]);

  const handleDownloadReceipt = async (application_id: String) => {
    try {
      const response = await axios.post(
        `${apiUrl}/frontend/download-receipt`,
        { application_id },
        {
          responseType: 'blob',
          headers: {
            'Content-Type': 'application/json',
          },
        },
      );

      // 👉 Create blob url
      const file = new Blob([response.data], { type: 'application/pdf' });
      const fileURL = URL.createObjectURL(file);

      // 👉 Create a temporary link for download
      const link = document.createElement('a');
      link.href = fileURL;
      link.setAttribute('download', `receipt-${application_id}.pdf`);
      document.body.appendChild(link);
      link.click();

      // 👉 Cleanup
      link.remove();
      URL.revokeObjectURL(fileURL);
    } catch (error) {
      console.error('Receipt download failed:', error);
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
            type={type}
          />
        );
      case 1:
        return (
          <PreviewStep
            dynamicBoxes={dynamicBoxes}
            formData={formData}
            fileData={fileData}
            payableAmount={paymentData?.total_payable_fee}
            stepTransitionLoading={stepTransitionLoading}
          />
        );
      case 2:
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
      {stepTransitionLoading && (
        <div className="fixed inset-0 bg-transparent bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-8 shadow-2xl flex flex-col items-center gap-4">
            <Loader /> {/* Your Loader component */}
            <p className="text-gray-700 font-semibold">Processing your payment...</p>
            <p className="text-gray-500 text-sm text-center">
              Please wait while we verify your payment details
            </p>
          </div>
        </div>
      )}

      <div className="absolute -inset-1 bg-gradient-to-r from-[#1e40af] to-[#dc2626] rounded-2xl blur opacity-0 group-hover:opacity-100 transition duration-300"></div>
      <div className="relative bg-white rounded-2xl border border-gray-100 overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 sm:h-2 bg-gradient-to-r from-[#1e40af] to-[#dc2626]"></div>

        {/* Form Header */}
        <div className="p-4 sm:p-6 border-b border-gray-100 bg-gradient-to-r from-[#1e40af]/5 to-[#dc2626]/5">
          <p className="text-center text-gray-600 text-sm sm:text-base mt-1 sm:mt-2">
            {home_other_lines?.[1]?.title || 'Online Application Form'}
          </p>
        </div>

        <div className="p-4 sm:p-6">
          {/* Stepper - Mobile Responsive */}
          <div className="flex items-center justify-center mb-6 sm:mb-8">
            <div className="flex items-center w-full max-w-2xl overflow-x-auto">
              {steps?.map((step, index) => (
                <React.Fragment key={step}>
                  {/* Step Circle */}
                  <div className="flex flex-col items-center min-w-[60px] sm:min-w-0">
                    <div
                      className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center border-2 font-semibold text-xs sm:text-sm transition-all duration-300 ${
                        index === activeStep
                          ? 'bg-blue-600 border-blue-600 text-white shadow-lg transform scale-110'
                          : index < activeStep
                          ? 'bg-green-500 border-green-500 text-white'
                          : 'bg-white border-gray-300 text-gray-500'
                      }`}
                    >
                      {index < activeStep ? (
                        <Icon
                          icon="solar:check-circle-line-duotone"
                          className="w-4 h-4 sm:w-5 sm:h-5"
                        />
                      ) : (
                        index + 1
                      )}
                    </div>
                    <span
                      className={`text-xs mt-1 sm:mt-2 font-medium text-center px-1 ${
                        index === activeStep ? 'text-blue-600' : 'text-gray-500'
                      }`}
                    >
                      {step.length > 10 ? `${step.substring(0, 10)}...` : step}
                    </span>
                  </div>

                  {/* Connector Line */}
                  {index < steps.length - 1 && (
                    <div
                      className={`flex-1 h-1 mx-1 sm:mx-2 transition-all duration-300 min-w-[20px] ${
                        index < activeStep ? 'bg-green-500' : 'bg-gray-300'
                      }`}
                    />
                  )}
                </React.Fragment>
              ))}
            </div>
          </div>

          {/* Step Content */}
          <div className="min-h-[300px] sm:min-h-[400px]">{renderStep(activeStep)}</div>

          {/* Navigation Buttons - Mobile Responsive */}
          <div className="flex flex-col sm:flex-row justify-between gap-4 mt-6 sm:mt-8">
            {activeStep !== 2 ? (
              <button
                onClick={handleBack}
                disabled={activeStep === 0 || stepTransitionLoading}
                className={`flex items-center justify-center gap-2 px-4 sm:px-6 py-2 rounded-lg border transition-all duration-200 order-2 sm:order-1 ${
                  activeStep === 0 || stepTransitionLoading
                    ? 'border-gray-300 text-gray-400 cursor-not-allowed'
                    : 'border-blue-600 text-blue-600 hover:bg-blue-50 hover:shadow-md'
                }`}
              >
                <Icon icon="solar:arrow-left-line-duotone" className="w-4 h-4" />
                Back
              </button>
            ) : (
              <div className="order-2 sm:order-1"></div>
            )}

            <div className="flex gap-3 order-1 sm:order-2">
              {activeStep === steps.length - 1 ? (
                <button
                  onClick={handleReset}
                  className="bg-green-600 hover:bg-green-700 text-white px-4 sm:px-6 py-2 rounded-lg font-semibold transition-all duration-200 hover:shadow-lg transform hover:scale-105 w-full sm:w-auto"
                >
                  Submit Another Application
                </button>
              ) : (
                <button
                  onClick={handleNext}
                  disabled={loading || stepTransitionLoading}
                  className={`flex items-center justify-center gap-2 px-4 sm:px-6 py-2 rounded-lg font-semibold text-white transition-all duration-200 w-full sm:w-auto ${
                    loading || stepTransitionLoading
                      ? 'bg-gray-400 cursor-not-allowed'
                      : 'bg-blue-600 hover:bg-blue-700 hover:shadow-lg transform hover:scale-105'
                  }`}
                >
                  {loading || stepTransitionLoading ? (
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

          {Object.keys(errors).length > 0 && activeStep === 0 && (
            <div className="mt-4 p-3 sm:p-4 bg-red-50 border border-red-200 rounded-lg">
              <div className="flex items-center gap-2 text-red-700 text-sm sm:text-base">
                <Icon
                  icon="solar:danger-triangle-line-duotone"
                  className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0"
                />
                <span className="font-semibold">
                  Please complete all mandatory fields to proceed.
                </span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Payment Confirmation Dialog - Mobile Responsive */}
      {showPaymentDialog && (
        <div className="fixed inset-0 bg-transparent bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl sm:rounded-2xl shadow-2xl max-w-md w-full mx-2 transform transition-all duration-300 scale-100 max-h-[90vh] overflow-y-auto">
            {/* Dialog Header */}
            <div className="p-4 sm:p-6 border-b border-gray-200">
              <h3 className="text-center text-lg sm:text-xl font-bold text-green-600">
                Confirm Payment
              </h3>
            </div>

            {/* Dialog Content */}
            <div className="p-4 sm:p-6">
              <div className="text-center mb-4">
                <div className="text-xl sm:text-2xl font-bold text-gray-800 mb-2">
                  ₹ {paymentData?.total_payable_fee?.toLocaleString('en-IN')}
                </div>
                <p className="text-gray-600 text-xs sm:text-sm">
                  You will be redirected to secure payment gateway
                </p>
              </div>

              {/* Payment Details */}
              <div className="bg-gray-50 rounded-lg p-3 sm:p-4 mb-4">
                <div className="flex justify-between items-center text-xs sm:text-sm mt-2">
                  <span className="text-gray-600">Payment For:</span>
                  <span className="font-semibold text-xs sm:text-sm">College Application Fee</span>
                </div>
              </div>
            </div>

            {/* Dialog Actions */}
            <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 p-4 sm:p-6 border-t border-gray-200">
              <button
                onClick={() => setShowPaymentDialog(false)}
                disabled={paymentLoading}
                className={`px-4 py-2 border border-gray-400 text-gray-700 rounded-lg font-semibold transition-colors duration-200 ${
                  paymentLoading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-50'
                }`}
              >
                Cancel
              </button>
              <button
                onClick={handlePayment}
                disabled={paymentLoading}
                className={`px-4 py-2 rounded-lg font-semibold text-white transition-all duration-200 ${
                  paymentLoading
                    ? 'bg-gray-400 cursor-not-allowed'
                    : 'bg-green-600 hover:bg-green-700 hover:shadow-lg'
                }`}
              >
                {paymentLoading ? (
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

export default ApplyForm;
