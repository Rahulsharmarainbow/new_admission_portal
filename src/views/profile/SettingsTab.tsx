import { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import Loader from 'src/Frontend/Common/Loader';
import { useAuth } from "src/hook/useAuth";
import axios from 'axios';
import { HiEye, HiEyeOff } from "react-icons/hi";

const apiUrl = import.meta.env.VITE_API_URL;

// Custom TextInput Component with proper styling
interface TextInputProps {
  id: string;
  label: string;
  type: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  required?: boolean;
  className?: string;
}

const TextInput = ({ 
  id, 
  label, 
  type, 
  value, 
  onChange, 
  placeholder = '', 
  required = false,
  className = '' 
}: TextInputProps) => {
  const [showPassword, setShowPassword] = useState(false);
  const isPasswordField = type === 'password';
  const inputType = isPasswordField && showPassword ? 'text' : type;

  return (
    <div className={className}>
      <label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-2">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      <div className="relative">
        <input
          id={id}
          type={inputType}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition-all duration-200 outline-none pr-10"
          placeholder={placeholder}
          required={required}
        />
        {isPasswordField && (
          <button
            type="button"
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 focus:outline-none focus:text-gray-700 transition-colors duration-200"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? (
              <HiEyeOff className="h-5 w-5" />
            ) : (
              <HiEye className="h-5 w-5" />
            )}
          </button>
        )}
      </div>
    </div>
  );
};

const SettingsTab = () => {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [settings, setSettings] = useState<any>(null);
  
  // Settings state
  const [whatsappApiKey, setWhatsappApiKey] = useState('');
  const [whatsappPassword, setWhatsappPassword] = useState('');
  const [zohoApiKey, setZohoApiKey] = useState('');
  const [bounceAddress, setBounceAddress] = useState('');
  const [zohoFromEmail, setZohoFromEmail] = useState('');
  const [smsApiKey, setSmsApiKey] = useState('');
  const [smsSecretKey, setSmsSecretKey] = useState('');
  const [razorpayApiKey, setRazorpayApiKey] = useState('');
  const [razorpaySecretKey, setRazorpaySecretKey] = useState('');
  const [collegePlatformFee, setCollegePlatformFee] = useState('');
  const [schoolPlatformFee, setSchoolPlatformFee] = useState('');
  const [wasabiApiKey, setWasabiApiKey] = useState('');
  const [wasabiSecretKey, setWasabiSecretKey] = useState('');
  const [wasabiRegion, setWasabiRegion] = useState('');
  const [wasabiEndpoint, setWasabiEndpoint] = useState('');
  const [wasabiBucket, setWasabiBucket] = useState('');

  // Fetch settings on component mount
  useEffect(() => {
    if (user?.id) {
      fetchSettings();
    }
  }, [user?.id]);

  const fetchSettings = async () => {
    if (!user?.id) return;
    
    setIsLoading(true);
    try {
      const response = await axios.post(
        `${apiUrl}/${user?.role}/Profile/get-settings`,
        { s_id: user.id },
        {
          headers: {
            'accept': '*/*',
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${user?.token}`,
          }
        }
      );

      if (response.data.status && response.data.Data) {
        const settingsData = response.data.Data;
        setSettings(settingsData);
        
        // Set all fields from API response
        setWhatsappApiKey(settingsData.wtsp_api_key || '');
        setWhatsappPassword(settingsData.wtsp_pass || '');
        setZohoApiKey(settingsData.zoho_api_key || '');
        setBounceAddress(settingsData.bounce_address || '');
        setZohoFromEmail(settingsData.zoho_from_email || '');
        setSmsApiKey(settingsData.sms_api_key || '');
        setSmsSecretKey(settingsData.sms_secret_key || '');
        setRazorpayApiKey(settingsData.razorpay_api_key || '');
        setRazorpaySecretKey(settingsData.razorpay_secret_key || '');
        setCollegePlatformFee(settingsData.college_platform_fee || '');
        setSchoolPlatformFee(settingsData.school_platform_fee || '');
        setWasabiApiKey(settingsData.wasabi_api_key || '');
        setWasabiSecretKey(settingsData.wasabi_secret_key || '');
        setWasabiRegion(settingsData.wasabi_region || '');
        setWasabiEndpoint(settingsData.wasabi_endpoint || '');
        setWasabiBucket(settingsData.wasabi_bucket || '');
      }
    } catch (error) {
      console.error('Error fetching settings:', error);
      toast.error('Failed to load settings');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveSettings = async () => {
    if (!user?.id || !settings) {
      toast.error('User or settings not found');
      return;
    }
    
    setIsSaving(true);
    try {
      const settingsData = {
        s_id: user.id,
        wtsp_api_key: whatsappApiKey,
        wtsp_pass: whatsappPassword,
        zoho_api_key: zohoApiKey,
        bounce_address: bounceAddress,
        zoho_from_email: zohoFromEmail,
        sms_api_key: smsApiKey,
        sms_secret_key: smsSecretKey,
        razorpay_api_key: razorpayApiKey,
        razorpay_secret_key: razorpaySecretKey,
        college_platform_fee: collegePlatformFee,
        school_platform_fee: schoolPlatformFee,
        wasabi_api_key: wasabiApiKey,
        wasabi_secret_key: wasabiSecretKey,
        wasabi_region: wasabiRegion,
        wasabi_endpoint: wasabiEndpoint,
        wasabi_bucket: wasabiBucket,
        // Include existing fields that we're not editing but need to preserve
        id: settings.id,
        ticket_prefix: settings.ticket_prefix,
        whatsapp_status: settings.whatsapp_status,
        email_status: settings.email_status,
        sms_status: settings.sms_status,
        mail_type: settings.mail_type,
        email_smtp_host: settings.email_smtp_host,
        email_smtp_port: settings.email_smtp_port,
        email_smtp_username: settings.email_smtp_username,
        email_smtp_password: settings.email_smtp_password,
        from_email: settings.from_email,
        logo: settings.logo,
        favicon: settings.favicon,
        dark_logo: settings.dark_logo,
        notification_tune: settings.notification_tune,
        notification_status: settings.notification_status,
      };

      const response = await axios.post(
        `${apiUrl}/${user?.role}/Profile/update-settings`,
        settingsData,
        {
          headers: {
            'accept': '*/*',
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${user?.token}`,
          }
        }
      );
      
      if (response.data.status) {
        toast.success('Settings saved successfully!');
        fetchSettings(); // Refresh settings
      } else {
        toast.error(response.data.message || 'Failed to save settings');
      }
    } catch (error) {
      console.error('Error saving settings:', error);
      toast.error('Failed to save settings');
    } finally {
      setIsSaving(false);
    }
  };

  const SectionHeader = ({ title, description }: { title: string; description?: string }) => (
    <div className="mb-6">
      <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
      {description && (
        <p className="text-sm text-gray-600 mt-1">{description}</p>
      )}
    </div>
  );

  if (isLoading) {
    return <Loader />;
  }

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-2xl">
        <h5 className="text-xl font-bold tracking-tight text-gray-900 mb-2">
          Application Settings
        </h5>
        <p className="font-normal text-gray-500 mb-6">
          Configure your application settings and integrations
        </p>

        <div className="space-y-8">
          {/* WhatsApp Settings */}
          <div>
            <SectionHeader 
              title="WhatsApp Integration" 
              description="Configure WhatsApp API settings for notifications"
            />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <TextInput
                id="whatsapp-api-key"
                label="WhatsApp API Key"
                type="password"
                value={whatsappApiKey}
                onChange={setWhatsappApiKey}
                placeholder="Enter WhatsApp API key"
              />
              <TextInput
                id="whatsapp-password"
                label="WhatsApp Password"
                type="password"
                value={whatsappPassword}
                onChange={setWhatsappPassword}
                placeholder="Enter WhatsApp password"
              />
            </div>
          </div>

          {/* Email Settings */}
          <div>
            <SectionHeader 
              title="Email Settings" 
              description="Configure Zoho email service for sending emails"
            />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <TextInput
                id="zoho-api-key"
                label="Zoho API Key"
                type="password"
                value={zohoApiKey}
                onChange={setZohoApiKey}
                placeholder="Enter Zoho API key"
              />
              <TextInput
                id="bounce-address"
                label="Bounce Address"
                type="text"
                value={bounceAddress}
                onChange={setBounceAddress}
                placeholder="Enter bounce email address"
              />
              <div className="md:col-span-2">
                <TextInput
                  id="zoho-from-email"
                  label="Zoho From Email"
                  type="email"
                  value={zohoFromEmail}
                  onChange={setZohoFromEmail}
                  placeholder="Enter from email address"
                />
              </div>
            </div>
          </div>

          {/* SMS Settings */}
          <div>
            <SectionHeader 
              title="SMS Settings" 
              description="Configure SMS gateway for text notifications"
            />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <TextInput
                id="sms-api-key"
                label="SMS API Key"
                type="password"
                value={smsApiKey}
                onChange={setSmsApiKey}
                placeholder="Enter SMS API key"
              />
              <TextInput
                id="sms-secret-key"
                label="SMS Secret Key"
                type="password"
                value={smsSecretKey}
                onChange={setSmsSecretKey}
                placeholder="Enter SMS secret key"
              />
            </div>
          </div>

          {/* Payment Settings */}
          <div>
            <SectionHeader 
              title="Payment Settings" 
              description="Configure Razorpay payment gateway"
            />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <TextInput
                id="razorpay-api-key"
                label="Razorpay API Key"
                type="password"
                value={razorpayApiKey}
                onChange={setRazorpayApiKey}
                placeholder="Enter Razorpay API key"
              />
              <TextInput
                id="razorpay-secret-key"
                label="Razorpay Secret Key"
                type="password"
                value={razorpaySecretKey}
                onChange={setRazorpaySecretKey}
                placeholder="Enter Razorpay secret key"
              />
            </div>
          </div>

          {/* Platform Fees */}
          <div>
            <SectionHeader 
              title="Platform Fees" 
              description="Set platform fees for colleges and schools"
            />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <TextInput
                id="college-fee"
                label="College Platform Fee"
                type="number"
                value={collegePlatformFee}
                onChange={setCollegePlatformFee}
                placeholder="Enter college platform fee"
              />
              <TextInput
                id="school-fee"
                label="School Platform Fee"
                type="number"
                value={schoolPlatformFee}
                onChange={setSchoolPlatformFee}
                placeholder="Enter school platform fee"
              />
            </div>
          </div>

          {/* Wasabi Storage */}
          <div>
            <SectionHeader 
              title="Wasabi Storage" 
              description="Configure Wasabi cloud storage settings"
            />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <TextInput
                id="wasabi-api-key"
                label="Wasabi API Key"
                type="password"
                value={wasabiApiKey}
                onChange={setWasabiApiKey}
                placeholder="Enter Wasabi API key"
              />
              <TextInput
                id="wasabi-secret-key"
                label="Wasabi Secret Key"
                type="password"
                value={wasabiSecretKey}
                onChange={setWasabiSecretKey}
                placeholder="Enter Wasabi secret key"
              />
              <TextInput
                id="wasabi-region"
                label="Wasabi Region"
                type="text"
                value={wasabiRegion}
                onChange={setWasabiRegion}
                placeholder="Enter Wasabi region"
              />
              <TextInput
                id="wasabi-endpoint"
                label="Wasabi Endpoint"
                type="text"
                value={wasabiEndpoint}
                onChange={setWasabiEndpoint}
                placeholder="Enter Wasabi endpoint"
              />
              <div className="md:col-span-2">
                <TextInput
                  id="wasabi-bucket"
                  label="Wasabi Bucket"
                  type="text"
                  value={wasabiBucket}
                  onChange={setWasabiBucket}
                  placeholder="Enter Wasabi bucket name"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Save Button */}
      <div className="flex justify-end">
        <button 
          className="bg-[#0ea5e9] hover:bg-[#0ea5e9]/80 text-white font-semibold py-3 px-8 rounded-full transition-all duration-200 hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
          onClick={handleSaveSettings}
          disabled={isSaving}
        >
          {isSaving ? (
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              Saving Settings...
            </div>
          ) : (
            'Save Settings'
          )}
        </button>
      </div>
    </div>
  );
};

export default SettingsTab;