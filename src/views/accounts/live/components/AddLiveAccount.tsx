import React, { useState, useEffect } from "react";
import { Alert, Breadcrumb, Button, Card } from "flowbite-react";
import { HiCheckCircle, HiArrowLeft, HiArrowRight, HiHome, HiInformationCircle } from "react-icons/hi";
import { useAuth } from "src/hook/useAuth";
import { useNavigate } from "react-router";
import { FormData } from "src/types/formTypes";
import { fetchStates, fetchDistricts, addLiveAccount } from "src/services/apiService";
import Loader from "src/Frontend/Common/Loader";
import BreadcrumbHeader from "src/Frontend/Common/BreadcrumbHeader";
import AcademicInformation from "src/views/newForm/components/AcademicInformation";
import ContactInformation from "src/views/newForm/components/ContactInformation";
import ThirdPartyApiSetup from "src/views/newForm/components/ThirdPartyApiSetup";
import RollBasedAccess from "./RollBasedAccess";
import DnsConfiguration from "src/views/newForm/components/DnsConfiguration";

// Custom Stepper Component (आपका existing component)
interface StepperProps {
  steps: string[];
  activeStep: number;
}

const CustomStepper: React.FC<StepperProps> = ({ steps, activeStep }) => {
  return (
    <div className="flex items-center w-full mb-8 overflow-x-auto">
      {steps.map((step, index) => (
        <React.Fragment key={step}>
          <div className="flex flex-col items-center min-w-max">
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                index <= activeStep
                  ? "bg-blue-600 text-white"
                  : "bg-gray-200 text-gray-500"
              }`}
            >
              {index + 1}
            </div>
            <span
              className={`text-xs mt-1 text-center max-w-20 break-words ${
                index <= activeStep ? "text-blue-600 font-medium" : "text-gray-500"
              }`}
            >
              {step}
            </span>
          </div>
          
          {index < steps.length - 1 && (
            <div
              className={`flex-1 h-1 mx-2 min-w-8 ${
                index < activeStep ? "bg-blue-600" : "bg-gray-200"
              }`}
            />
          )}
        </React.Fragment>
      ))}
    </div>
  );
};

const AddLiveAccount: React.FC = () => {
  const [activeStep, setActiveStep] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [loading, setLoading] = useState(true);
  const [submitMessage, setSubmitMessage] = useState("");
  const { user } = useAuth();
  const authToken = user?.token;
  const navigate = useNavigate();

  const [formData, setFormData] = useState<FormData>({
    // Academic Information
    selectType: "",
    selectSubtype: "",
    academicName: "",
    selectState: "",
    selectDistrict: "",
    Pincode: "",
    area: "",
    website_url: "",
    primary_email: "",
    academicAddress: "",
    academicDescription: "",
    academicLogo: null,
    previewImage: null,

    // Contact Information
    technicalName: "",
    technicalEmail: "",
    technicalPhone: "",
    technicalLocation: "",
    billingName: "",
    billingEmail: "",
    billingPhone: "",
    billingLocation: "",
    additionalName: "",
    additionalEmail: "",
    additionalPhone: "",
    additionalLocation: "",

    // API Configurations
    selectedServicesOption: "Zoho Api",
    fromEmail: "",
    smtpHost: "",
    smtpPort: "",
    smtpUsername: "",
    smtpPassword: "",
    zohoApiKey: "",
    zohoFromEmail: "",
    bounceAddress: "",
    UserId: "",
    wPassword: "",
    smsApikey: "",
    smsSecretkey: "",
    razorpayApikey: "",
    razorpaySecretkey: "",
    
    // Templates
    whatsappTemplate: "",
    smsTemplate: "",
    emailTemplate: "",
    
    // Toggles
    isDropdownEnabled: false,
    isTemplatesVisible: false,
    isSmsApiEnabled: false,
    switchState: false,
    nominalState: false,
    rankCardState: false,
    
    // Domain Configuration
    domainName: "",
    domainNameError: false,
    domainNameErrorMsg: "",
    configure: "0",
    updateConfigure: 0,

    // API Data
    states: [],
    districts: [],
    academicData: null,
    templateData: null,
  });

  // Fetch initial data (states)
  useEffect(() => {
    const initializeData = async () => {
      try {
        console.log('Initializing data for new account...');
        
        const statesData = await fetchStates();
        console.log('Fetched States:', statesData);
        
        setFormData(prev => ({
          ...prev,
          states: statesData
        }));
      } catch (error) {
        console.error('Error initializing data:', error);
      } finally {
        setLoading(false);
      }
    };

    initializeData();
  }, []);

  // Update form data
  const updateFormData = (updates: Partial<FormData>) => {
    setFormData(prev => ({ ...prev, ...updates }));
  };

  // Steps configuration
  const getSteps = () => {
    const baseSteps = [
      "Academic information",
      "Contact Information",
      "Third party api setup",
      "Roll based access",
      "Dns Configuration",
    ];
    
    if (formData.selectType === "1") {
      return baseSteps.filter(step => step !== "Roll based access");
    }
    
    return baseSteps;
  };

  const steps = getSteps();

  const handleNext = () => {
    setActiveStep((prev) => Math.min(prev + 1, steps.length - 1));
  };

  const handleBack = () => {
    setActiveStep((prev) => Math.max(prev - 1, 0));
  };

  // Form validation
  const validateForm = (): boolean => {
    // Basic required fields validation
    if (!formData.selectType) {
      setSubmitMessage("Error: Please select organization type");
      return false;
    }

    if (!formData.academicName) {
      setSubmitMessage("Error: Please enter organization name");
      return false;
    }

    if (!formData.primary_email) {
      setSubmitMessage("Error: Please enter primary email");
      return false;
    }

    if (!formData.selectState) {
      setSubmitMessage("Error: Please select state");
      return false;
    }

    if (!formData.selectDistrict) {
      setSubmitMessage("Error: Please select district");
      return false;
    }

    if (!formData.website_url) {
      setSubmitMessage("Error: Please enter website URL");
      return false;
    }

    return true;
  };

  // Submit form data for new account
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user?.id || !authToken) {
      setSubmitMessage("Error: User not authenticated");
      return;
    }

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    setSubmitMessage("");

    try {
      const result = await addLiveAccount(formData, user.id, authToken, user?.role);
      
      if (result.status) {
        setSubmitMessage("Live account created successfully!");
        setTimeout(() => {
          navigate(`/${user?.role}/live-accounts`);
        }, 2000);
      } else {
        setSubmitMessage("Error creating account: " + (result.message || "Unknown error"));
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      setSubmitMessage("Error creating account: " + (error instanceof Error ? error.message : "Unknown error"));
    } finally {
      setIsLoading(false);
    }
  };

  // When selectType changes, update steps
  useEffect(() => {
    const newSteps = getSteps();
    if (activeStep >= newSteps.length) {
      setActiveStep(Math.max(newSteps.length - 1, 0));
    }
  }, [formData.selectType, activeStep]);

  // Get step content
  const renderStepContent = (step: number) => {
    const stepComponents = {
      "Academic information": <AcademicInformation formData={formData} updateFormData={updateFormData} />,
      "Contact Information": <ContactInformation formData={formData} updateFormData={updateFormData} />,
      "Third party api setup": <ThirdPartyApiSetup formData={formData} updateFormData={updateFormData} />,
      "Roll based access": <RollBasedAccess formData={formData} updateFormData={updateFormData} />,
      "Dns Configuration": <DnsConfiguration formData={formData} updateFormData={updateFormData} isEditMode={false} />,
    };

    const currentStep = steps[step];
    return stepComponents[currentStep as keyof typeof stepComponents] || null;
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4">
      {loading ? (
        <Loader />
      ) : (
        <div className="max-w-7xl mx-auto">
          {/* Breadcrumb Header */}
          <BreadcrumbHeader
            title={'Add Live Account'}
            paths={[
              { name: 'Live Accounts', link: `/${user?.role}/live-accounts` },
              { name: 'Add Live Account', link: '#' },
            ]}
          />

          <Card className="overflow-hidden">
            <div className="p-6">
              <CustomStepper steps={steps} activeStep={activeStep} />

              {submitMessage && (
                <Alert 
                  color={submitMessage.includes("successfully") ? "success" : "failure"} 
                  className="mb-4 break-words"
                >
                  {submitMessage}
                </Alert>
              )}

              {activeStep === steps.length ? (
                <Alert color="success" className="mb-4">
                  All steps completed - you're finished
                </Alert>
              ) : (
                <>
                  <div className="mb-8">
                    {renderStepContent(activeStep)}
                  </div>

                  <div className="flex justify-between items-center flex-wrap gap-4">
                    <Button
                      color="light"
                      onClick={handleBack}
                      disabled={activeStep === 0}
                      className="flex items-center gap-2"
                    >
                      <HiArrowLeft className="w-4 h-4" />
                      Back
                    </Button>

                    {activeStep === steps.length - 1 ? (
                      <Button 
                        onClick={handleSubmit} 
                        color="blue" 
                        className="flex items-center gap-2"
                        disabled={isLoading}
                      >
                        {isLoading ? "Creating..." : "Create Live Account"}
                        <HiCheckCircle className="w-4 h-4" />
                      </Button>
                    ) : (
                      <Button onClick={handleNext} color="blue" className="flex items-center gap-2">
                        Next
                        <HiArrowRight className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                </>
              )}
            </div>
          </Card>
        </div>
      )}
    </div>
  );
};

export default AddLiveAccount;