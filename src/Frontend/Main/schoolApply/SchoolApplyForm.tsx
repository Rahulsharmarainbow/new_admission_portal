import React, { useState, useRef, useCallback, useEffect } from 'react';
import { Icon } from '@iconify/react';
import DisclaimerStep from './DisclaimerStep';
import DeclarationStep from './DeclarationStep';
import FeeDetailsStep from './FeeDetailsStep';
import PreviewStep from './PreviewStep';
import SuccessStep from './SuccessStep';
import toast from 'react-hot-toast';
import axios from 'axios';
import FormStep from '../collageApply/FormStep';
import { isImageBlurred } from './Blurred';
import Loader from 'src/Frontend/Common/Loader';
import * as pdfjsLib from 'pdfjs-dist';
import { GlobalWorkerOptions } from 'pdfjs-dist/build/pdf';
import pdfWorker from 'pdfjs-dist/build/pdf.worker?url';

GlobalWorkerOptions.workerSrc = pdfWorker;

interface SchoolApplyFormProps {
  academic_id: string;
  dynamicBoxes: any[];
  required_child: any[];
  home_other_lines: any;
  apply_page_header: any;
  header: any;
  content_managment: any;
  cdata: any;
  class: any[];
  transportation_fee: any[];
  transportation_fee_details:any[];
  fees_details: any[];
  transportation_setting: any;
  apply_modal?: any;
  OtherData?: any;
  type: string;
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
  apply_page_header,
  header,
  content_managment,
  cdata,
  class: classes,
  transportation_fee,
  transportation_fee_details,
  fees_details,
  transportation_setting,
  apply_modal,
  OtherData,
  type,
}) => {
  const [activeStep, setActiveStep] = useState(0);
  const [formData, setFormData] = useState<{ [key: string]: any }>({});
  const [fileData, setFileData] = useState<{ [key: string]: any }>({});
  const [loading, setLoading] = useState(false);
  const [loading2, setLoading2] = useState(false);
  const [paymentProcessing, setPaymentProcessing] = useState(false); // New state for payment processing
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
  const [showErrors, setShowErrors] = useState(false);

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
          let hasError = false;

          for (let i = 0; i < 12; i++) {
            const digit = formData[`adharCard_${i}`];
            if (!digit) {
              validationErrors.current[name] = 'All Aadhaar card digits are required';
              hasError = true;
              break;
            }
            aadhaarCard += digit;
          }

          // Clear error if all digits are properly filled
          if (!hasError && aadhaarCard.length === 12) {
            validationErrors.current[name] = '';
          }
        } else if (!formData[name] && formData[name] !== 0) {
          // Fix: Check for empty string, null, undefined but allow 0
          validationErrors.current[name] = validation_message;
        } else if (validation === 'email') {
          const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
          if (!emailRegex.test(formData[name])) {
            validationErrors.current[name] = 'Invalid email address';
          } else {
            validationErrors.current[name] = '';
          }
        } else if (validation === 'mobile') {
          const phoneRegex = /^\d{10}$/; // Fix: 10 digits, not 9
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

  // Improved useEffect with better filtering
  useEffect(() => {
    required_child.forEach((child) => {
      // Only validate fields that have values or are required
      if (formData[child.name] !== undefined || child.required) {
        checkValidation(child.name, child.type, child.validation, child.validation_message);
      }
    });
  }, [formData, required_child]);

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

  // Handle checkbox change
  const handleCheckboxChange = useCallback(
    (name: string, value: boolean, fieldConfig?: any) => {
      setFormData((prev) => ({
        ...prev,
        [name]: value ? 1 : 0,
      }));

      // Immediately clear error for this field
      setErrors((prev) => ({
        ...prev,
        [name]: '',
      }));
    },
    [], // Remove dependencies
  );

  // Handle date change
  const handleDateChange = useCallback((name: string, date: any, fieldConfig?: any) => {
    // Directly use the selected date without adjustment
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
  //   (name: string, file: File, fieldConfig?: any) => {
  //     if (!file) return;

  //     const { resolution, target, skipResolution } = fieldConfig || {};

  //     // ✅ Validate Type (Allow JPEG, PNG, PDF)
  //     const allowedTypes = ['image/jpeg', 'image/png', 'application/pdf'];
  //     if (!allowedTypes.includes(file.type)) {
  //       toast.error('Please upload a valid JPEG, PNG image or PDF document.');
  //       return;
  //     }

  //     // ✅ Validate Size (< 2 MB for PDF, < 1 MB for images)
  //     const maxSize = file.type === 'application/pdf' ? 2097152 : 1048576; // 2MB for PDF, 1MB for images
  //     if (file.size > maxSize) {
  //       const maxSizeMB = maxSize / 1048576;
  //       toast.error(`File size should be less than ${maxSizeMB} MB.`);
  //       return;
  //     }

  //     const reader = new FileReader();

  //     reader.onloadend = async () => {
  //       const result = reader.result as string;

  //       // For PDF files, we'll store the file directly and show PDF icon
  //       if (file.type === 'application/pdf') {
  //         // Store file for submission
  //         setSelectedFiles((prev) => ({
  //           ...prev,
  //           [name]: file,
  //         }));

  //         // Store preview URL (we'll use a PDF icon in the UI)
  //         setFileData((prev) => ({
  //           ...prev,
  //           [name]: result, // Store base64 for PDF as well
  //         }));

  //         // Preview target if defined
  //         if (target) {
  //           setFileData((prev) => ({
  //             ...prev,
  //             [target]: result,
  //           }));
  //         }
  //       } else {
  //         // For image files
  //         const img = new window.Image();
  //         img.src = result;

  //         img.onload = async () => {
  //           // ✅ Skip resolution check if skipResolution is true (for camera) or if it's PDF
  //           if (!skipResolution && resolution) {
  //             const [w, h] = resolution.split('x');
  //             const targetWidth = parseInt(w, 10);
  //             const targetHeight = parseInt(h, 10);

  //             if (img.width !== targetWidth || img.height !== targetHeight) {
  //               toast.error(`The uploaded image must be ${targetWidth}x${targetHeight} pixels.`);
  //               return;
  //             }
  //           }

  //           // ✅ Skip blur detection for PDF files
  //           if (file.type !== 'application/pdf') {
  //             try {
  //               const blurry = await isImageBlurred(img.src, img.width, img.height);
  //               if (blurry) {
  //                 toast.error('The uploaded image is too blurry. Please upload a clearer image.');
  //                 return;
  //               }
  //             } catch (err) {
  //               console.error('Blur check failed:', err);
  //               toast.error('There was an issue processing the image.');
  //               return;
  //             }
  //           }

  //           // ✅ Save for backend submission
  //           setSelectedFiles((prev) => ({
  //             ...prev,
  //             [name]: file,
  //           }));

  //           setFileData((prev) => ({
  //             ...prev,
  //             [name]: result,
  //           }));

  //           // ✅ Preview target if defined
  //           if (target) {
  //             setFileData((prev) => ({
  //               ...prev,
  //               [target]: result,
  //             }));
  //           }
  //         };
  //       }

  //       // ✅ Remove error if previously set
  //       if (errors[name]) {
  //         setErrors((prev) => ({
  //           ...prev,
  //           [name]: '',
  //         }));
  //       }

  //       toast.success(`${file.name} selected successfully`);
  //     };

  //     reader.readAsDataURL(file);
  //   },
  //   [errors],
  // );

  const getPdfFirstPageImage = async (file: File): Promise<string> => {
    const arrayBuffer = await file.arrayBuffer();
    const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
    const page = await pdf.getPage(1);

    const viewport = page.getViewport({ scale: 1.5 });

    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d')!;
    canvas.width = viewport.width;
    canvas.height = viewport.height;

    await page.render({ canvasContext: context, viewport }).promise;

    return canvas.toDataURL('image/jpeg');
  };

  const handleFileChange = useCallback(
    async (name: string, file: File, fieldConfig?: any) => {
      if (!file) return;

      const extension = file.name.split('.').pop()?.toLowerCase();
      let finalBase64 = '';

      const isPDF = extension === 'pdf';
      const isImage = file.type.startsWith('image/');

      if (!isPDF && !isImage) {
        toast.error('Only PDF or Image files allowed.');
        return;
      }

      // PDF → first page preview
      if (isPDF) {
        finalBase64 = await getPdfFirstPageImage(file);
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
        [name + '_file']: file,
      }));

      if (errors[name]) {
        setErrors((prev) => ({ ...prev, [name]: '' }));
      }
    },
    [errors],
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
      } else if (step === 1 && !conditions.disclaimer) {
        newErrors.disclaimer = 'Please accept the disclaimer to proceed';
      } else if (step === 2 && !conditions.declaration) {
        newErrors.declaration = 'Please accept the declaration to proceed';
      } else if (step === 3 && !conditions.fee) {
        newErrors.fee = 'Please accept the fee agreement to proceed';
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
    setPaymentProcessing(true); // Start payment processing
    setLoading2(true);
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
              setActiveStep(5);
            }
          } catch (error) {
            toast.error('Payment verification failed. Please try again.');
          } finally {
            setPaymentProcessing(false);
          }
        },

        theme: {
          color: '#1e40af',
        },

        modal: {
          ondismiss: () => {
            console.log('Payment cancelled by user');
            setShowPaymentDialog(false);
            setPaymentProcessing(false); // 👈 Most Important FIX
            toast('Payment Cancelled', { icon: '⚠️' });
          },
        },
      };

      const rzp = new (window as any).Razorpay(options);
      rzp.open();
    } catch (error) {
      console.error('Payment initialization failed:', error);
      toast.error('Payment initialization failed. Please try again.');
      setPaymentProcessing(false); // Stop payment processing on error
    } finally {
      setLoading2(false);
      setShowPaymentDialog(false);
    }
  }, [paymentData, formData, cdata, header, apiUrl, academic_id]);

  const handleNext = useCallback(async () => {
    // Clear previous errors first
    setErrors({});

    // Validate current step
    if (!validateStep(activeStep)) {
      setShowErrors(true);
      console.log('Validation failed, showing errors');
      return;
    }
    setShowErrors(false);
    // If validation passes, proceed
    if (activeStep === 0) {
      setLoading(true);
      try {
        // For school, calculate payable amount based on class and other factors
        const payableResponse = await axios.post(`${apiUrl}/Public/Get-payable-amount`, {
          class_id: formData.class,
          academic_id: academic_id,
          transportation_required: formData.transportation_required,
        });

        if (payableResponse.data?.total_payable_fee) {
          setPaymentData(payableResponse.data);

          const response = await axios.post(`${apiUrl}/frontend/school-save-first-step-data`, {
            c_id: cdata.c_id,
            cookieData: formData,
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
      const response = await fetch(`${apiUrl}/frontend/download-receipt`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ application_id }),
      });

      const data = await response.json();

      if (data && data.pdf && data.filename) {
        const { pdf, filename } = data;

        // Convert base64 to blob
        const binaryString = window.atob(pdf);
        const bytes = new Uint8Array(binaryString.length);

        for (let i = 0; i < binaryString.length; i++) {
          bytes[i] = binaryString.charCodeAt(i);
        }

        const blob = new Blob([bytes], { type: 'application/pdf' });
        const url = window.URL.createObjectURL(blob);

        const link = document.createElement('a');
        link.href = url;

        // Add .pdf extension if not present
        const downloadFilename = filename.endsWith('.pdf') ? filename : `${filename}.pdf`;
        link.download = downloadFilename;

        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
      } else {
        throw new Error('Invalid response format');
      }
    } catch (error) {
      console.error('Receipt download failed:', error);
      toast.error('Receipt download failed. Please try again.');
    }
  };

  const stepHeaders: Record<number, { title: string; subtitle?: string }> = {
    1: {
      title: 'GENERAL FORM OF DISCLAIMER',
      subtitle: '(Consent Form)',
    },
    2: {
      title: 'DECLARATION FORM',
      subtitle: '(Please read carefully before signing)',
    },
  };

  const currentHeader = stepHeaders[activeStep];

  const renderStep = (step: number) => {
    switch (step) {
      case 10:
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
          <DisclaimerStep
            content={content_managment?.[0].html_content}
            formData={formData}
            errors={errors}
            fileData={fileData}
            accepted={conditions.disclaimer}
            onConditionChange={handleConditionChange}
            directorSignature={header?.director_signature}
          />
        );
      case 2:
        return (
          <DeclarationStep
            content={content_managment?.[1].html_content}
            formData={formData}
            errors={errors}
            fileData={fileData}
            accepted={conditions.declaration}
            onConditionChange={handleConditionChange}
            directorSignature={header?.director_signature}
          />
        );
      case 0:
        return (
          <FeeDetailsStep
            classes={classes}
            errors={errors}
            transportation_fee={transportation_fee}
            fees_details={fees_details}
            transportation_fee_details={transportation_fee_details}
            transportation_setting={transportation_setting}
            formData={formData}
            fileData={fileData}
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
      {/* Global Loading Overlay for Payment Processing */}
      {paymentProcessing && (
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
      <div className="relative bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-[#1e40af] to-[#dc2626]"></div>

        <div className="p-2 md:p-6 border-b border-gray-100 bg-gradient-to-r from-[#1e40af]/5 to-[#dc2626]/5">
          {currentHeader && (
            <div className="school_para_header text-center">
              <h1 className="font-semibold text-lg sm:text-xl md:text-2xl">
                {currentHeader.title}
              </h1>
              {currentHeader.subtitle && (
                <p className="text-sm text-gray-600 mt-3">{currentHeader.subtitle}</p>
              )}
            </div>
          )}
        </div>

        <div className="p-2 md:p-6">
          {/* Stepper */}
          <div className="flex items-center justify-center mb-6 md:mb-8">
            <div className="flex items-center w-full max-w-4xl px-2">
              {steps.map((step, index) => (
                <React.Fragment key={step}>
                  {/* Step Circle */}
                  <div className="flex flex-col items-center flex-shrink-0">
                    <div
                      className={`w-8 h-8 md:w-10 md:h-10 rounded-full flex items-center justify-center border-2 font-semibold text-xs md:text-sm transition-all duration-300 ${
                        index === activeStep
                          ? 'bg-red-600 border-red-600 text-white shadow-lg transform scale-110'
                          : index < activeStep
                          ? 'bg-green-500 border-green-500 text-white'
                          : 'bg-white border-gray-300 text-gray-500'
                      }`}
                    >
                      {index < activeStep ? (
                        <Icon
                          icon="solar:check-circle-line-duotone"
                          className="w-4 h-4 md:w-5 md:h-5"
                        />
                      ) : (
                        index + 1
                      )}
                    </div>

                    {/* Step Label - Hidden on small mobile, visible on larger screens */}
                    <span
                      className={`hidden xs:block text-xs mt-1 md:mt-2 font-medium text-center max-w-16 md:max-w-20 truncate ${
                        index === activeStep ? 'text-blue-600 font-semibold' : 'text-gray-500'
                      }`}
                    >
                      {step}
                    </span>

                    {/* Mobile Tooltip for active step */}
                    {index === activeStep && (
                      <div className="xs:hidden absolute top-full mt-1 px-2 py-1 bg-gray-800 text-white text-xs rounded-md whitespace-nowrap z-10">
                        {step}
                      </div>
                    )}
                  </div>

                  {/* Connector Line - Hidden on very small screens, visible from sm upwards */}
                  {index < steps.length - 1 && (
                    <div
                      className={`hidden sm:flex flex-1 h-1 mx-1 md:mx-2 transition-all duration-300 ${
                        index < activeStep ? 'bg-green-500' : 'bg-gray-300'
                      }`}
                    />
                  )}
                </React.Fragment>
              ))}
            </div>
          </div>

          {/* Alternative Mobile Stepper - Shows only current step with progress */}
          <div className="sm:hidden mb-4">
            <div className="flex items-center justify-between px-4">
              <span className="text-sm text-gray-600">
                Step {activeStep + 1} of {steps.length}
              </span>
              <span className="text-sm font-semibold text-blue-600">{steps[activeStep]}</span>
            </div>

            {/* Progress Bar for Mobile */}
            <div className="mt-2 w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${((activeStep + 1) / steps.length) * 100}%` }}
              ></div>
            </div>
          </div>

          {/* Step Content with loading state */}
          <div className="min-h-[400px] relative">
            {paymentProcessing ? (
              <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-80 z-10">
                <div className="flex flex-col items-center gap-3">
                  <Loader /> {/* Your Loader component */}
                  <p className="text-gray-600 font-medium">Processing Payment...</p>
                </div>
              </div>
            ) : null}
            {renderStep(activeStep)}
          </div>

          {/* Navigation Buttons */}
          <div className="flex justify-between mt-8">
            {activeStep !== 5 ? (
              <button
                onClick={handleBack}
                disabled={activeStep === 0 || paymentProcessing}
                className={`flex items-center gap-2 px-6 py-2 rounded-lg border transition-all duration-200 ${
                  activeStep === 0 || paymentProcessing
                    ? 'border-gray-300 text-gray-400 cursor-not-allowed'
                    : 'border-blue-600 text-blue-600 hover:bg-blue-50 hover:shadow-md'
                }`}
              >
                <Icon icon="solar:arrow-left-line-duotone" className="w-4 h-4" />
                Back
              </button>
            ) : (
              <div></div>
            )}

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
                  disabled={loading || paymentProcessing}
                  className={`flex items-center gap-2 px-6 py-2 rounded-lg font-semibold text-white transition-all duration-200 ${
                    loading || paymentProcessing
                      ? 'bg-gray-400 cursor-not-allowed'
                      : 'bg-red-600 hover:bg-red-700 hover:shadow-lg transform hover:scale-105'
                  }`}
                >
                  {loading || paymentProcessing ? (
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

          {/* Error Display - Only show when there are actual errors and we're on step 0-3 */}
          {activeStep == 0 && showErrors && (
            <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
              <div className="flex items-center gap-2 text-red-700">
                <Icon icon="solar:danger-triangle-line-duotone" className="w-5 h-5" />
                <span className="font-semibold">
                  Please complete all mandatory fields to proceed.
                </span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Payment Confirmation Dialog */}
      {showPaymentDialog && (
        <div className="fixed inset-0 bg-transparent bg-opacity-50 flex items-center justify-center z-50 p-4">
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
            </div>

            {/* Dialog Actions */}
            <div className="flex justify-center gap-4 p-6 border-t border-gray-200">
              <button
                onClick={() => setShowPaymentDialog(false)}
                disabled={paymentProcessing}
                className={`flex-1 px-4 py-2 border border-gray-400 text-gray-700 rounded-lg font-semibold transition-colors duration-200 ${
                  paymentProcessing ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-50'
                }`}
              >
                Cancel
              </button>
              <button
                onClick={handlePayment}
                disabled={loading2 || paymentProcessing}
                className={`flex-1 px-4 py-2 rounded-lg font-semibold text-white transition-all duration-200 ${
                  loading2 || paymentProcessing
                    ? 'bg-gray-400 cursor-not-allowed'
                    : 'bg-green-600 hover:bg-green-700 hover:shadow-lg'
                }`}
              >
                {loading2 || paymentProcessing ? (
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
