
import React, { useState, useEffect } from 'react';
import { Alert, Breadcrumb, Button, Card } from 'flowbite-react';
import {
  HiCheckCircle,
  HiArrowLeft,
  HiArrowRight,
  HiHome,
  HiInformationCircle,
} from 'react-icons/hi';
import { useAuth } from 'src/hook/useAuth';
import { useNavigate, useParams } from 'react-router';
import { FormData as FormDataType } from 'src/types/formTypes';
import {
  fetchStates,
  fetchAcademicData,
  updateAcademicData,
  fetchDistricts,
} from 'src/services/apiService';
import AcademicInformation from './components/AcademicInformation';
import ThirdPartyApiSetup from './components/ThirdPartyApiSetup';
import RollBasedAccess from './components/RollBasedAccess';
import DnsConfiguration from './components/DnsConfiguration';
import ContactInformation from './components/ContactInformation';
import Loader from 'src/Frontend/Common/Loader';
import BreadcrumbHeader from 'src/Frontend/Common/BreadcrumbHeader';

// Custom Stepper Component
interface StepperProps {
  steps: string[];
  activeStep: number;
}

const CustomStepper: React.FC<StepperProps> = ({ steps, activeStep }) => {
  return (
    <div className="flex items-center w-full mb-6 overflow-x-auto">
      {steps.map((step, index) => (
        <React.Fragment key={step}>
          <div className="flex flex-col items-center min-w-max">
            <div
              className={`w-8 h-6 rounded-full flex items-center justify-center text-sm font-medium ${
                index <= activeStep ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-500'
              }`}
            >
              {index + 1}
            </div>
            <span
              className={`text-xs mt-1 text-center max-w-20 break-words ${
                index <= activeStep ? 'text-blue-600 font-medium' : 'text-gray-500'
              }`}
            >
              {step}
            </span>
          </div>

          {index < steps.length - 1 && (
            <div
              className={`flex-1 h-1 mx-2 min-w-8 ${
                index < activeStep ? 'bg-blue-600' : 'bg-gray-200'
              }`}
            />
          )}
        </React.Fragment>
      ))}
    </div>
  );
};

const MakeItLive: React.FC = () => {
  const [activeStep, setActiveStep] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [loading, setLoading] = useState(true);
  const [submitMessage, setSubmitMessage] = useState('');
  const { user } = useAuth();
  const authToken = user?.token;
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [stepErrors, setStepErrors] = useState<Record<number, Record<string, string>>>({});

  const [formData, setFormData] = useState<FormDataType>({
    // Academic Information
    selectType: '',
    selectSubtype: '',
    academicName: '',
    selectState: '',
    selectDistrict: '',
    Pincode: '',
    area: '',
    website_url: '',
    primary_email: '',
    academicAddress: '',
    academicDescription: '',
    academicLogo: null,
    academic_new_logo: null,
    previewNewLogo: null,
    previewImage: null,
    director_signature: null,

    // Contact Information
    technicalName: '',
    technicalEmail: '',
    technicalPhone: '',
    technicalLocation: '',
    billingName: '',
    billingEmail: '',
    billingPhone: '',
    billingLocation: '',
    additionalName: '',
    additionalEmail: '',
    additionalPhone: '',
    additionalLocation: '',

    // API Configurations
    selectedServicesOption: 'Zoho Api',
    fromEmail: '',
    smtpHost: '',
    smtpPort: '',
    smtpUsername: '',
    smtpPassword: '',
    zohoApiKey: '',
    zohoFromEmail: '',
    bounceAddress: '',
    UserId: '', // UserId field
    wPassword: '',
    smsApikey: '',
    smsSecretkey: '',
    razorpayApikey: '',
    razorpaySecretkey: '',
    send_email_status: '',
    platform_fee: '',

    // Templates
    whatsappTemplate: '',
    smsTemplate: '',
    emailTemplate: '',

    // Toggles
    isDropdownEnabled: false,
    isTemplatesVisible: false,
    isSmsApiEnabled: false,
    switchState: false,
    nominalState: false,
    rankCardState: false,

    // Domain Configuration
    domainName: '',
    domainNameError: false,
    domainNameErrorMsg: '',
    configure: '',
    updateConfigure: 0,

    // API Data
    states: [],
    districts: [],
    academicData: null,
    templateData: null,
    credentialsData: null,
  });

  // Validation functions
  const validateAcademicInfo = (data: FormDataType) => {
    const errors: Record<string, string> = {};

    const isEmpty = (v: string | null | undefined) => !v || String(v).trim() === '';
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i;
    const urlRegex = /^(https?:\/\/)[\w.-]+(?:\.[\w\.-]+)+[\w\-\.~:\/?#\[\]@!$&'()*+,;=.]+$/i;
    const pinRegex = /^\d{6}$/;

    if (isEmpty(data.selectType)) errors.selectType = 'Please select organization type.';
    if (data.selectType === '3' && isEmpty(data.selectSubtype)) {
      errors.selectSubtype = 'Please select subtype for University.';
    }
    if (isEmpty(data.academicName)) errors.academicName = 'Organization name is required.';
    if (isEmpty(data.selectState)) errors.selectState = 'State is required.';
    if (isEmpty(data.selectDistrict)) errors.selectDistrict = 'District is required.';
    if (isEmpty(data.Pincode) || !pinRegex.test(data.Pincode)) errors.Pincode = 'Enter a valid 6-digit pincode.';
    if (isEmpty(data.website_url) || !urlRegex.test(data.website_url)) errors.website_url = 'Enter a valid URL starting with http or https.';
    if (isEmpty(data.primary_email) || !emailRegex.test(data.primary_email)) errors.primary_email = 'Enter a valid email.';
    if (isEmpty(data.academicAddress)) errors.academicAddress = 'Full address is required.';
    if (isEmpty(data.academicDescription)) errors.academicDescription = 'Description is required.';

    const hasExistingLogo = Boolean(data.previewImage) || Boolean(data.academicData?.academic_logo);
    if (!hasExistingLogo && !data.academicLogo) {
      errors.academicLogo = 'Logo is required.';
    }

    return errors;
  };

  const validateContactInfo = (data: FormDataType) => {
    const errors: Record<string, string> = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /^\d{10}$/;

    // Technical Contact Validation
    if (data.technicalName && !data.technicalEmail) {
      errors.technicalEmail = 'Email is required when name is provided';
    }
    if (data.technicalEmail && !emailRegex.test(data.technicalEmail)) {
      errors.technicalEmail = 'Please enter a valid email address';
    }
    if (data.technicalPhone && !phoneRegex.test(data.technicalPhone.replace(/\D/g, ''))) {
      errors.technicalPhone = 'Please enter a valid 10-digit phone number';
    }

    // Billing Contact Validation
    if (data.billingName && !data.billingEmail) {
      errors.billingEmail = 'Email is required when name is provided';
    }
    if (data.billingEmail && !emailRegex.test(data.billingEmail)) {
      errors.billingEmail = 'Please enter a valid email address';
    }
    if (data.billingPhone && !phoneRegex.test(data.billingPhone.replace(/\D/g, ''))) {
      errors.billingPhone = 'Please enter a valid 10-digit phone number';
    }

    // Additional Contact Validation
    if (data.additionalName && !data.additionalEmail) {
      errors.additionalEmail = 'Email is required when name is provided';
    }
    if (data.additionalEmail && !emailRegex.test(data.additionalEmail)) {
      errors.additionalEmail = 'Please enter a valid email address';
    }
    if (data.additionalPhone && !phoneRegex.test(data.additionalPhone.replace(/\D/g, ''))) {
      errors.additionalPhone = 'Please enter a valid 10-digit phone number';
    }

    return errors;
  };

  const validateThirdPartyApi = (data: FormDataType) => {
    const errors: Record<string, string> = {};

    // Email Service Validation
    if (data.isDropdownEnabled) {
      if (!data.selectedServicesOption) {
        errors.selectedServicesOption = 'Please select an email service';
      }
      if (!data.emailTemplate?.trim()) {
        errors.emailTemplate = 'Email template is required when email service is enabled';
      }

      // Zoho API Validation
      if (data.selectedServicesOption === 'Zoho Api') {
        if (!data.zohoApiKey?.trim()) {
          errors.zohoApiKey = 'Zoho API Key is required';
        }
        if (!data.zohoFromEmail?.trim()) {
          errors.zohoFromEmail = 'From Email is required';
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.zohoFromEmail)) {
          errors.zohoFromEmail = 'Please enter a valid email address';
        }
      }

      // SMTP Validation
      if (data.selectedServicesOption === 'MailGun SMTP' || data.selectedServicesOption === 'Google SMTP') {
        if (!data.fromEmail?.trim()) {
          errors.fromEmail = 'From Email is required';
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.fromEmail)) {
          errors.fromEmail = 'Please enter a valid email address';
        }
        if (!data.smtpHost?.trim()) {
          errors.smtpHost = 'SMTP Host is required';
        }
        if (!data.smtpPort?.trim()) {
          errors.smtpPort = 'SMTP Port is required';
        }
      }
    }

    // WhatsApp Service Validation
    if (data.isTemplatesVisible) {
      if (!data.whatsappTemplate?.trim()) {
        errors.whatsappTemplate = 'WhatsApp template is required when WhatsApp service is enabled';
      }
    }

    // SMS Service Validation
    if (data.isSmsApiEnabled) {
      if (!data.smsTemplate?.trim()) {
        errors.smsTemplate = 'SMS template is required when SMS service is enabled';
      }
    }

    // Razorpay Validation
    if (data.razorpayApikey && !data.razorpaySecretkey) {
      errors.razorpaySecretkey = 'Razorpay Secret Key is required when API Key is provided';
    }
    if (data.razorpaySecretkey && !data.razorpayApikey) {
      errors.razorpayApikey = 'Razorpay API Key is required when Secret Key is provided';
    }

    return errors;
  };

  const validateDnsConfiguration = (data: FormDataType) => {
    const errors: Record<string, string> = {};
    const domainNameRegex = /^(?:[a-zA-Z0-9-]+\.)+[a-zA-Z]{2,}$/;

    if (data.configure === "0" && !data.domainName?.trim()) {
      errors.domainName = 'Domain name is required';
    } else if (data.domainName && !domainNameRegex.test(data.domainName)) {
      errors.domainName = 'Please enter a valid domain name (e.g., example.com)';
    }

    return errors;
  }

  // Populate form data with API response
  const populateFormData = async (data: any) => {
    const academic = data.academic;
    const credentials = data.credentials;
    const template = data.template;

    console.log('Raw API Data:', { academic, credentials, template });

    // Parse contact information
    let technicalContact = { name: '', email: '', phone: '', location: '' };
    let billingContact = { name: '', email: '', phone: '', location: '' };
    let additionalContact = { name: '', email: '', phone: '', location: '' };

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

    const updates: Partial<FormDataType> = {
      academicData: academic,
      templateData: template,
      credentialsData: credentials,
      academicName: academic.academic_name || '',
      primary_email: academic.academic_email || '',
      area: academic.academic_area || '',
      academicAddress: academic.academic_address || '',
      academicDescription: academic.academic_description || '',
      Pincode: academic.academic_pincode || '',
      selectState: academic.state_id ? String(academic.state_id) : '',
      selectDistrict: academic.district_id ? String(academic.district_id) : '',
      website_url: academic.academic_website || '',
      selectType: academic.academic_type ? String(academic.academic_type) : '',
      selectSubtype: academic.academic_subtype || '',
      director_signature: academic.director_signature  ||'',
      academic_logo: academic.academic_logo || '',
      // Logo preview
      previewImage: academic.academic_logo
        ? `${import.meta.env.VITE_ASSET_URL}/${academic.academic_logo}`
        : null,
      // Contact Information
       academic_new_logo: null, 
       previewNewLogo: academic.academic_new_logo
      ? `${import.meta.env.VITE_ASSET_URL}/${academic.academic_new_logo}`
      : null,
       signature_seal: academic.signature_seal || '',
    previewSignatureSeal: academic.signature_seal
      ? `${import.meta.env.VITE_ASSET_URL}/${academic.signature_seal}`
      : null,
      technicalName: technicalContact.name || '',
      technicalEmail: technicalContact.email || '',
      technicalPhone: technicalContact.phone || '',
      technicalLocation: technicalContact.location || '',
      billingName: billingContact.name || '',
      billingEmail: billingContact.email || '',
      billingPhone: billingContact.phone || '',
      billingLocation: billingContact.location || '',
      additionalName: additionalContact.name || '',
      additionalEmail: additionalContact.email || '',
      additionalPhone: additionalContact.phone || '',
      additionalLocation: additionalContact.location || '',
      // Templates
      whatsappTemplate: template?.whatsapp_template || '',
      smsTemplate: template?.sms_template || '',
      emailTemplate: template?.email_template || '',
      // Domain configuration - Remove autofill
      domainName: academic.configured_domain || '',
      configure: academic.configured.toString() || '0',
      updateConfigure: 0,
      // API Configurations - INCLUDING UserId
      UserId: credentials?.wtsp_api_key || '', // IMPORTANT: UserId को populate करें
      zohoApiKey: credentials?.zoho_api_key || '',
      zohoFromEmail: credentials?.zoho_from_email || '',
      bounceAddress: credentials?.bounce_address || '',
      wPassword: credentials?.wtsp_pass || '',
      smsApikey: credentials?.sms_api_key || '',
      smsSecretkey: credentials?.sms_secret_key || '',
      razorpayApikey: credentials?.razorpay_api_key || '',
      razorpaySecretkey: credentials?.razorpay_secret_key || '',
      selectedServicesOption: credentials?.mail_type || 'Zoho Api',
      pgMerchantId: credentials?.pg_merchant_id || '',
      pgSecretKey: credentials?.pg_secret_key || '',
      paymentType: credentials?.payment_type || '',
      paymentEnabled: credentials?.payment_status,
      send_email_status: sendEmailStatus, 
      platform_fee: credentials?.platform_fee,
      // Permissions
      isDropdownEnabled: Boolean(credentials?.email_status),
      isTemplatesVisible: Boolean(credentials?.whatsapp_status),
      isSmsApiEnabled: Boolean(credentials?.sms_status),
      switchState: Boolean(credentials?.hallticket_generate_permission),
      nominalState: Boolean(credentials?.nominal_permission),
      rankCardState: Boolean(credentials?.rankcard_permission),
    };

    console.log('Form Data Updates:', updates);
    console.log('UserId being set to:', updates.UserId);

    setFormData((prev) => ({ ...prev, ...updates }));

    // Fetch districts if state is selected
    if (academic.state_id) {
      try {
        const districtsData = await fetchDistricts(String(academic.state_id));
        console.log('Fetched Districts:', districtsData);

        setFormData((prev) => ({
          ...prev,
          districts: districtsData,
          selectDistrict: academic.district_id ? String(academic.district_id) : '',
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

        setFormData((prev) => ({
          ...prev,
          states: statesData,
        }));

        if (id && authToken && user?.id) {
          console.log('Fetching academic data...');
          const academicData = await fetchAcademicData(String(id), String(user.id), authToken, user.role);
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
      } finally {
        setLoading(false);
      }
    };

    initializeData();
  }, [id, authToken, user?.id]);

  // Update form data with debugging
  const updateFormData = (updates: Partial<FormDataType>) => {
    console.log('Updating form data with:', updates);
    if ('UserId' in updates) {
      console.log('UserId is being updated to:', updates.UserId);
    }
    setFormData((prev) => {
      const newData = { ...prev, ...updates };
      console.log('New form data state:', newData);
      return newData;
    });
  };

  // Steps configuration
  const getSteps = () => {
    const baseSteps = [
      'Academic information',
      'Contact Information',
      'Third party api setup',
      'Roll based access',
      'Dns Configuration',
    ];

    if (formData.selectType === '1') {
      return baseSteps.filter((step) => step !== 'Roll based access');
    }

    return baseSteps;
  };

  const steps = getSteps();

  // Check if current step is valid
  const isCurrentStepValid = () => {
    const currentStepName = steps[activeStep];
    
    switch (currentStepName) {
      case 'Academic information':
        return Object.keys(validateAcademicInfo(formData)).length === 0;
      
      case 'Contact Information':
        return Object.keys(validateContactInfo(formData)).length === 0;
      
      case 'Third party api setup':
        return Object.keys(validateThirdPartyApi(formData)).length === 0;
      
      case 'Dns Configuration':
        return Object.keys(validateDnsConfiguration(formData)).length === 0;
      
      case 'Roll based access':
        // Roll based access doesn't require validation
        return true;
      
      default:
        return true;
    }
  };

  const handleNext = () => {
    const currentStepName = steps[activeStep];
    let errors: Record<string, string> = {};

    switch (currentStepName) {
      case 'Academic information':
        errors = validateAcademicInfo(formData);
        setStepErrors(prev => ({ ...prev, 0: errors }));
        if (Object.keys(errors).length > 0) return;
        break;
      
      case 'Contact Information':
        errors = validateContactInfo(formData);
        setStepErrors(prev => ({ ...prev, 1: errors }));
        if (Object.keys(errors).length > 0) return;
        break;
      
      case 'Third party api setup':
        errors = validateThirdPartyApi(formData);
        setStepErrors(prev => ({ ...prev, 2: errors }));
        if (Object.keys(errors).length > 0) return;
        break;
      
      case 'Dns Configuration':
        errors = validateDnsConfiguration(formData);
        setStepErrors(prev => ({ ...prev, 3: errors }));
        if (Object.keys(errors).length > 0) return;
        break;
    }

    setActiveStep((prev) => Math.min(prev + 1, steps.length - 1));
  };

  const handleBack = () => {
    setActiveStep((prev) => Math.max(prev - 1, 0));
  };

  
  // Submit form data with enhanced debugging
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Debug: Check final form data before submit
    console.log('=== FINAL FORM DATA BEFORE SUBMIT ===');
    console.log('UserId:', formData.UserId);
    console.log('Complete formData:', formData);
    console.log('=====================================');
    
    if (!id || !user?.id || !authToken) {
      setSubmitMessage('Error: Missing required data');
      return;
    }

    setIsLoading(true);
    setSubmitMessage('');

    try {
      const result = await updateAcademicData(formData as any, String(id), String(user.id), authToken, user.role);

      if (result.status) {
        setSubmitMessage('Account updated successfully!');
        const academicData = await fetchAcademicData(String(id), String(user.id), authToken, user.role);
        navigate(`/${user?.role}/live-accounts`);
        if (academicData.academic) {
          await populateFormData(academicData);
        }
      } else {
        setSubmitMessage('Error updating account: ' + (result.message || 'Unknown error'));
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      setSubmitMessage(
        'Error updating account: ' + (error instanceof Error ? error.message : 'Unknown error'),
      );
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
      'Academic information': (
        <AcademicInformation 
          formData={formData} 
          updateFormData={updateFormData} 
          errors={stepErrors[0] || {}} 
        />
      ),
      'Contact Information': (
        <ContactInformation 
          formData={formData} 
          updateFormData={updateFormData} 
          errors={stepErrors[1] || {}} 
        />
      ),
      'Third party api setup': (
        <ThirdPartyApiSetup 
          formData={formData} 
          updateFormData={updateFormData} 
          errors={stepErrors[2] || {}} 
        />
      ),
      'Roll based access': <RollBasedAccess formData={formData} updateFormData={updateFormData} />,
      'Dns Configuration': (
        <DnsConfiguration 
          formData={formData} 
          updateFormData={updateFormData} 
          isEditMode={true} 
          errors={stepErrors[3] || {}} 
        />
      ),
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
            title={'Live Account Onboarding'}
            paths={[
              { name: 'Demo Accounts', link: `/${user?.role}/demo-accounts` },
              { name: 'Live Account Onboarding', link: '#' },
            ]}
          />

          <Card className="overflow-hidden">
            <div className="p-0">
              <CustomStepper steps={steps} activeStep={activeStep} />

              {submitMessage && (
                <Alert
                  color={submitMessage.includes('successfully') ? 'success' : 'failure'}
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
                  <div className="mb-8">{renderStepContent(activeStep)}</div>

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
                        {isLoading ? 'Updating...' : 'Update'}
                        <HiCheckCircle className="w-4 h-4" />
                      </Button>
                    ) : (
                      <Button 
                        onClick={handleNext} 
                        color="blue" 
                        className="flex items-center gap-2"
                        disabled={!isCurrentStepValid()}
                      >
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