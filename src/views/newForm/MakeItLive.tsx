import React, { useState, useEffect } from "react";
import { Alert, Breadcrumb, Button, Card } from "flowbite-react";
import { HiCheckCircle, HiArrowLeft, HiArrowRight, HiHome, HiInformationCircle } from "react-icons/hi";
import { useAuth } from "src/hook/useAuth";
import { useParams } from "react-router";
import { FormData } from "src/types/formTypes";
import { fetchStates, fetchAcademicData, updateAcademicData, fetchDistricts } from "src/services/apiService";
import AcademicInformation from "./components/AcademicInformation";
import ThirdPartyApiSetup from "./components/ThirdPartyApiSetup";
import RollBasedAccess from "./components/RollBasedAccess";
import DnsConfiguration from "./components/DnsConfiguration";
import ContactInformation from "./components/ContactInformation";
import Loader from "src/Frontend/Common/Loader";

// Custom Stepper Component
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

// Custom Breadcrumb Component
const CustomBreadcrumb = () => {
  return (
    <nav className="flex mb-6" aria-label="Breadcrumb">
      <ol className="inline-flex items-center space-x-1 md:space-x-3 flex-wrap">
        <li className="inline-flex items-center">
          <a href="#" className="inline-flex items-center text-sm font-medium text-gray-700 hover:text-blue-600 dark:text-gray-400 dark:hover:text-white">
            <HiHome className="w-4 h-4 mr-2" />
            Home
          </a>
        </li>
        <li>
          <div className="flex items-center">
            <svg className="w-3 h-3 text-gray-400 mx-1" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 6 10">
              <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 9 4-4-4-4"/>
            </svg>
            <a href="#" className="ml-1 text-sm font-medium text-gray-700 hover:text-blue-600 md:ml-2 dark:text-gray-400 dark:hover:text-white">
              Accounts
            </a>
          </div>
        </li>
        <li aria-current="page">
          <div className="flex items-center">
            <svg className="w-3 h-3 text-gray-400 mx-1" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 6 10">
              <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 9 4-4-4-4"/>
            </svg>
             <span className="ml-1 text-sm font-medium text-gray-500 md:ml-2 dark:text-gray-400">
              Live Account Onboarding 
            </span> 
          </div>
        </li>
      </ol>
    </nav>
  );
};

const MakeItLive: React.FC = () => {
  const [activeStep, setActiveStep] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [loading, setLoading] = useState(true);
  const [submitMessage, setSubmitMessage] = useState("");
  const { user } = useAuth();
  const authToken = user?.token;
  const { id } = useParams<{ id: string }>();

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
    
    // Domain Configuration
    domainName: "",
    domainNameError: false,
    domainNameErrorMsg: "",
    configure: "",
    updateConfigure: 0,

    // API Data
    states: [],
    districts: [],
    academicData: null,
    templateData: null,
  });

  // Helper function to decode base64
  const decodeBase64 = (str: string): string => {
    if (!str) return "";
    try {
      // Multiple base64 decoding (as per your data structure)
      let decoded = str;
      for (let i = 0; i < 3; i++) {
        try {
          decoded = atob(decoded);
        } catch (e) {
          break;
        }
      }
      return decoded;
    } catch (error) {
      console.error('Error decoding base64:', error);
      return str;
    }
  };

  // Populate form data with API response
  const populateFormData = async (data: any) => {
    const academic = data.academic;
    const credentials = data.credentials;
    const template = data.template;

    console.log('Raw API Data:', { academic, credentials, template });

    // Parse contact information
    let technicalContact = { name: "", email: "", phone: "", location: "" };
    let billingContact = { name: "", email: "", phone: "", location: "" };
    let additionalContact = { name: "", email: "", phone: "", location: "" };

    try {
      if (academic.technical_contact) {
        technicalContact = JSON.parse(academic.technical_contact);
      }
      if (academic.billing_contact) {
        billingContact = JSON.parse(academic.billing_contact);
      }
      if (academic.additional_contact) {
        additionalContact = JSON.parse(academic.additional_contact);
      }
    } catch (e) {
      console.error('Error parsing contact data:', e);
    }

    console.log('Parsed Contacts:', { technicalContact, billingContact, additionalContact });

    const updates: Partial<FormData> = {
      academicData: academic,
      templateData: template,
      // Academic Information
      academicName: academic.academic_name || "",
      primary_email: academic.academic_email || "",
      area: academic.academic_area || "",
      academicAddress: academic.academic_address || "",
      academicDescription: academic.academic_description || "",
      Pincode: academic.academic_pincode || "",
      selectState: academic.state_id ? String(academic.state_id) : "",
      selectDistrict: academic.district_id ? String(academic.district_id) : "",
      website_url: academic.academic_website || "",
      selectType: academic.academic_type ? String(academic.academic_type) : "",
      selectSubtype: academic.academic_subtype || "",
      // Logo preview
      previewImage: academic.academic_logo ? `${import.meta.env.VITE_ASSET_URL}/${academic.academic_logo}` : null,
      // Contact Information
      technicalName: decodeBase64(technicalContact.name) || "",
      technicalEmail: decodeBase64(technicalContact.email) || "",
      technicalPhone: decodeBase64(technicalContact.phone) || "",
      technicalLocation: decodeBase64(technicalContact.location) || "",
      billingName: decodeBase64(billingContact.name) || "",
      billingEmail: decodeBase64(billingContact.email) || "",
      billingPhone: decodeBase64(billingContact.phone) || "",
      billingLocation: decodeBase64(billingContact.location) || "",
      additionalName: decodeBase64(additionalContact.name) || "",
      additionalEmail: decodeBase64(additionalContact.email) || "",
      additionalPhone: decodeBase64(additionalContact.phone) || "",
      additionalLocation: decodeBase64(additionalContact.location) || "",
      // Templates
      whatsappTemplate: template?.whatsapp_template || "",
      smsTemplate: template?.sms_template || "",
      emailTemplate: template?.email_template || "",
      // Domain configuration
      domainName: academic.configured_domain || "",
      configure: academic.configured ? "1" : "0",
      // API Configurations
      zohoApiKey: credentials?.zoho_api_key || "",
      zohoFromEmail: credentials?.zoho_from_email || "",
      bounceAddress: credentials?.bounce_address || "",
      wPassword: credentials?.wtsp_pass || "",
      smsApikey: credentials?.sms_api_key || "",
      smsSecretkey: credentials?.sms_secret_key || "",
      razorpayApikey: credentials?.razorpay_api_key || "",
      razorpaySecretkey: credentials?.razorpay_secret_key || "",
      selectedServicesOption: credentials?.mail_type || "Zoho Api",
      // Permissions
      isDropdownEnabled: Boolean(credentials?.email_service_dropdown_enabled),
      isTemplatesVisible: Boolean(credentials?.whatsapp_details_enable),
      isSmsApiEnabled: Boolean(credentials?.sms_details_enable),
      switchState: Boolean(credentials?.hallticket_generate_permission),
      nominalState: Boolean(credentials?.nominal_permission),
    };

    console.log('Form Data Updates:', updates);

    setFormData(prev => ({ ...prev, ...updates }));

    // Fetch districts if state is selected
    if (academic.state_id) {
      try {
        const districtsData = await fetchDistricts(String(academic.state_id));
        console.log('Fetched Districts:', districtsData);
        
        setFormData(prev => ({
          ...prev,
          districts: districtsData,
          selectDistrict: academic.district_id ? String(academic.district_id) : ""
        }));
      } catch (error) {
        console.error('Error fetching districts:', error);
      }
    }
  };

  // Fetch initial data
  useEffect(() => {
    const initializeData = async () => {
      try {
        console.log('Initializing data...', { id, userId: user?.id, hasToken: !!authToken });
        
        const statesData = await fetchStates();
        console.log('Fetched States:', statesData);
        
        setFormData(prev => ({
          ...prev,
          states: statesData
        }));

        if (id && authToken && user?.id) {
          console.log('Fetching academic data...');
          const academicData = await fetchAcademicData(id, user.id, authToken);
          console.log('Fetched Academic Data:', academicData);
          
          if (academicData.academic) {
            await populateFormData(academicData);
          } else {
            console.error('No academic data found in response');
          }
        } else {
          console.log('Missing required data:', { id, authToken, userId: user?.id });
        }
      } catch (error) {
        console.error('Error initializing data:', error);
      }finally {
        setLoading(false);
      }
    };

    initializeData();
  }, [id, authToken, user?.id]);

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

  // Submit form data
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id || !user?.id || !authToken) {
      setSubmitMessage("Error: Missing required data");
      return;
    }

    setIsLoading(true);
    setSubmitMessage("");

    try {
      const result = await updateAcademicData(formData, id, user.id, authToken);
      
      if (result.status) {
        setSubmitMessage("Account updated successfully!");
        // Refresh academic data
        const academicData = await fetchAcademicData(id, user.id, authToken);
        if (academicData.academic) {
          await populateFormData(academicData);
        }
      } else {
        setSubmitMessage("Error updating account: " + (result.message || "Unknown error"));
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      setSubmitMessage("Error updating account: " + (error instanceof Error ? error.message : "Unknown error"));
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
      "Dns Configuration": <DnsConfiguration formData={formData} updateFormData={updateFormData} />,
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
        <CustomBreadcrumb />

        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white break-words">Live Account Onboarding</h1>
          <p className="text-gray-600 dark:text-gray-400 break-words">Complete the onboarding process for live accounts</p>
        </div>

        <Card className="overflow-hidden">
          <div className="p-6">
            {/* <h5 className="text-xl font-semibold text-gray-900 dark:text-white mb-6 break-words">Live Account Onboarding</h5> */}

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
                      {isLoading ? "Updating..." : "Update"}
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

export default MakeItLive;