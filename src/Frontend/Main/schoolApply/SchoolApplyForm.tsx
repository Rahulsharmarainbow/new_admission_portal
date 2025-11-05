// // components/SchoolApplyForm.tsx
// import React, { useState, useRef, useCallback } from 'react';
// import { Stepper, Step, StepLabel, Button, Alert } from '@mui/material';
// import { Icon } from '@iconify/react';
// import FormStep from './FormSteps/FormStep';
// import DisclaimerStep from './FormSteps/DisclaimerStep';
// import DeclarationStep from './FormSteps/DeclarationStep';
// import FeeDetailsStep from './FormSteps/FeeDetailsStep';
// import PreviewStep from './FormSteps/PreviewStep';
// import SuccessStep from './FormSteps/SuccessStep';

// interface SchoolApplyFormProps {
//   academic_id: string;
//   dynamicBoxes: any[];
//   required_child: any[];
//   home_other_lines: any;
//   header: any;
//   content_managment: any;
//   cdata: any;
//   class: any[];
//   transportation_fee: any[];
//   transportation_setting: any;
//   apply_modal?: any;
//   OtherData?: any;
// }

// const steps = [
//   'FILL APPLICATION',
//   'DISCLAIMER FORM',
//   'DECLARATION FORM',
//   'DETAILS OF FEE',
//   'CONFIRM & PAY',
//   'SUCCESS'
// ];

// const SchoolApplyForm: React.FC<SchoolApplyFormProps> = ({
//   academic_id,
//   dynamicBoxes,
//   required_child,
//   home_other_lines,
//   header,
//   content_managment,
//   cdata,
//   class: classes,
//   transportation_fee,
//   transportation_setting,
//   apply_modal,
//   OtherData
// }) => {
//   const [activeStep, setActiveStep] = useState(0);
//   const [formData, setFormData] = useState<{ [key: string]: any }>({});
//   const [fileData, setFileData] = useState<{ [key: string]: any }>({});
//   const [loading, setLoading] = useState(false);
//   const [errors, setErrors] = useState<{ [key: string]: string }>({});
//   const [conditions, setConditions] = useState({
//     disclaimer: false,
//     declaration: false,
//     fee: false
//   });

//   const formRefs = useRef<{ [key: string]: any }>({});

//   const handleInputChange = useCallback((name: string, value: any) => {
//     setFormData(prev => ({
//       ...prev,
//       [name]: value
//     }));

//     if (errors[name]) {
//       setErrors(prev => ({
//         ...prev,
//         [name]: ''
//       }));
//     }
//   }, [errors]);

//   const handleFileChange = useCallback((name: string, file: File, previewUrl: string) => {
//     setFileData(prev => ({
//       ...prev,
//       [name]: {
//         file,
//         previewUrl,
//         width: 150,
//         height: 150
//       }
//     }));

//     if (errors[name]) {
//       setErrors(prev => ({
//         ...prev,
//         [name]: ''
//       }));
//     }
//   }, [errors]);

//   const handleConditionChange = useCallback((condition: string, value: boolean) => {
//     setConditions(prev => ({
//       ...prev,
//       [condition]: value
//     }));
//   }, []);

//   const validateStep = useCallback((step: number) => {
//     const newErrors: { [key: string]: string } = {};

//     if (step === 0) {
//       required_child.forEach(child => {
//         if (child.required && !formData[child.name] && !fileData[child.name]) {
//           newErrors[child.name] = child.validation_message || `${child.label} is required`;
//         }
//       });
//     } else if (step === 1 && !conditions.disclaimer) {
//       newErrors.disclaimer = 'Please accept the disclaimer to proceed';
//     } else if (step === 2 && !conditions.declaration) {
//       newErrors.declaration = 'Please accept the declaration to proceed';
//     } else if (step === 3 && !conditions.fee) {
//       newErrors.fee = 'Please accept the fee agreement to proceed';
//     }

//     setErrors(newErrors);
//     return Object.keys(newErrors).length === 0;
//   }, [formData, fileData, required_child, conditions]);

//   const handleNext = useCallback(async () => {
//     if (!validateStep(activeStep)) {
//       return;
//     }

//     if (activeStep === 0) {
//       setLoading(true);
//       try {
//         // Save first step data for school
//         const response = await fetch(`${import.meta.env.VITE_API_URL}/api/frontend/save_first_step_data`, {
//           method: 'POST',
//           headers: {
//             'Content-Type': 'application/json',
//           },
//           body: JSON.stringify({
//             c_id: cdata.c_id,
//             formData: formData,
//             files: fileData,
//             academic_id: academic_id
//           })
//         });

//         const result = await response.json();
//         if (result.success) {
//           setFormData(prev => ({
//             ...prev,
//             application_id: result.application_id,
//             transaction_id: result.transaction_id
//           }));
//           setActiveStep(prev => prev + 1);
//         }
//       } catch (error) {
//         console.error('Error saving form data:', error);
//       } finally {
//         setLoading(false);
//       }
//     } else {
//       setActiveStep(prev => prev + 1);
//     }
//   }, [activeStep, formData, fileData, validateStep, academic_id, cdata]);

//   const handleBack = useCallback(() => {
//     setActiveStep(prev => prev - 1);
//   }, []);

//   const handleReset = useCallback(() => {
//     setActiveStep(0);
//     setFormData({});
//     setFileData({});
//     setErrors({});
//     setConditions({
//       disclaimer: false,
//       declaration: false,
//       fee: false
//     });
//   }, []);

//   const renderStep = (step: number) => {
//     switch (step) {
//       case 0:
//         return (
//           <FormStep
//             dynamicBoxes={dynamicBoxes}
//             formData={formData}
//             fileData={fileData}
//             errors={errors}
//             onInputChange={handleInputChange}
//             onFileChange={handleFileChange}
//             formRefs={formRefs}
//           />
//         );
//       case 1:
//         return (
//           <DisclaimerStep
//             content={content_managment?.disclaimer_form}
//             formData={formData}
//             fileData={fileData}
//             accepted={conditions.disclaimer}
//             onConditionChange={handleConditionChange}
//           />
//         );
//       case 2:
//         return (
//           <DeclarationStep
//             content={content_managment?.declaration_form}
//             formData={formData}
//             fileData={fileData}
//             accepted={conditions.declaration}
//             onConditionChange={handleConditionChange}
//           />
//         );
//       case 3:
//         return (
//           <FeeDetailsStep
//             classes={classes}
//             transportation_fee={transportation_fee}
//             transportation_setting={transportation_setting}
//             formData={formData}
//             accepted={conditions.fee}
//             onConditionChange={handleConditionChange}
//           />
//         );
//       case 4:
//         return (
//           <PreviewStep
//             dynamicBoxes={dynamicBoxes}
//             formData={formData}
//             fileData={fileData}
//             payableAmount={0} // Calculate based on class and other factors
//           />
//         );
//       case 5:
//         return (
//           <SuccessStep
//             applicationId={formData.application_id}
//             onDownloadReceipt={() => {/* Handle download */}}
//           />
//         );
//       default:
//         return null;
//     }
//   };

//   return (
//     <div className="group relative mb-8">
//       <div className="absolute -inset-1 bg-gradient-to-r from-[#1e40af] to-[#dc2626] rounded-2xl blur opacity-0 group-hover:opacity-100 transition duration-300"></div>
//       <div className="relative bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
//         <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-[#1e40af] to-[#dc2626]"></div>

//         {/* Form Header */}
//         <div className="p-6 border-b border-gray-100 bg-gradient-to-r from-[#1e40af]/5 to-[#dc2626]/5">
//           <h4 className="text-center text-xl font-bold text-[#1e40af] inline-flex items-center justify-center">
//             <Icon icon="solar:school-line-duotone" className="w-5 h-5 mr-2" />
//             School Application Form
//           </h4>
//           <p className="text-center text-gray-600 mt-2">
//             {home_other_lines?.[1]?.title || 'Online Application Form'}
//           </p>
//         </div>

//         <div className="p-6">
//           {/* Stepper */}
//           <Stepper activeStep={activeStep} className="mb-8">
//             {steps.map((label) => (
//               <Step key={label}>
//                 <StepLabel>{label}</StepLabel>
//               </Step>
//             ))}
//           </Stepper>

//           {/* Step Content */}
//           <div className="min-h-[400px]">
//             {renderStep(activeStep)}
//           </div>

//           {/* Navigation Buttons */}
//           <div className="flex justify-between mt-8">
//             <Button
//               variant="outlined"
//               onClick={handleBack}
//               disabled={activeStep === 0}
//               className="flex items-center gap-2"
//             >
//               <Icon icon="solar:arrow-left-line-duotone" className="w-4 h-4" />
//               Back
//             </Button>

//             <div className="flex gap-3">
//               {activeStep === steps.length - 1 ? (
//                 <Button
//                   variant="contained"
//                   onClick={handleReset}
//                   className="bg-green-600 hover:bg-green-700"
//                 >
//                   Submit Another Application
//                 </Button>
//               ) : (
//                 <Button
//                   variant="contained"
//                   onClick={handleNext}
//                   disabled={loading}
//                   className="bg-blue-600 hover:bg-blue-700"
//                 >
//                   {loading ? 'Processing...' : activeStep === steps.length - 2 ? 'Pay Now' : 'Next'}
//                 </Button>
//               )}
//             </div>
//           </div>

//           {Object.keys(errors).length > 0 && (
//             <Alert severity="error" className="mt-4">
//               Please fix the errors above before proceeding.
//             </Alert>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default SchoolApplyForm;



import React from 'react'

const SchoolApplyForm = () => {
  return (
    <div>SchoolApplyForm</div>
  )
}

export default SchoolApplyForm