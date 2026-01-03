export interface FormData {
  paymentType: string;
  // Academic Information
  selectType: string;
  selectSubtype: string;
  academicName: string;
  selectState: string;
  selectDistrict: string;
  Pincode: string;
  area: string;
  website_url: string;
  primary_email: string;
  academicAddress: string;
  academicDescription: string;
  academicLogo: File | null;
  previewImage: string | null;
  director_signature?: File | null;
  previewSignature?: string;
  academic_new_logo: File | null;
  previewNewLogo?: string | null;
   signature_seal: File | null;
  previewSignatureSeal: string | null;
  // Contact Information
  technicalName: string;
  technicalEmail: string;
  technicalPhone: string;
  technicalLocation: string;
  billingName: string;
  billingEmail: string;
  billingPhone: string;
  billingLocation: string;
  additionalName: string;
  additionalEmail: string;
  additionalPhone: string;
  additionalLocation: string;

  // API Configurations
  selectedServicesOption: string;
  fromEmail: string;
  smtpHost: string;
  smtpPort: string;
  smtpUsername: string;
  smtpPassword: string;
  zohoApiKey: string;
  zohoFromEmail: string;
  bounceAddress: string;
  UserId: string;
  wPassword: string;
  smsApikey: string;
  smsSecretkey: string;
  razorpayApikey: string;
  razorpaySecretkey: string;
  send_email_status: string;

  // Templates
  whatsappTemplate: string;
  smsTemplate: string;
  emailTemplate: string;

  // Toggles
  isDropdownEnabled: boolean;
  isTemplatesVisible: boolean;
  isSmsApiEnabled: boolean;
  switchState: boolean;
  nominalState: boolean;
  rankCardState: boolean;

  // Domain Configuration
  domainName: string;
  domainNameError: boolean;
  domainNameErrorMsg: string;
  configure: string;
  updateConfigure: number;

  // API Data
  states: any[];
  districts: any[];
  academicData: any;
  templateData: any;
  credentialsData: any;
}

export interface State {
  state_id: string;
  state_title: string;
}

export interface District {
  id: string;
  district_title: string;
}
