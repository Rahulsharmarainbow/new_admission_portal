import { useState, useRef, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router';
import axios from 'axios';
import toast from 'react-hot-toast';
import Header from './Header';
import Footer from './Footer';
import Loader from 'src/Frontend/Common/Loader';
import SuccessPopup from './SuccessPopup';

const apiUrl = import.meta.env.VITE_API_URL;
const assetUrl = import.meta.env.VITE_ASSET_URL;

type FormField = {
  type: string;
  name: string;
  label: string;
  placeholder: string;
  required: number;
  validation: string | null;
  value: string | null;
  options?: string[];
  allowed_type?: string;
  max_length?: number;
};

type FormSection = {
  width?: string;
  gap?: number;
  justify?: string;
  children: FormField[];
};

type JobDetails = {
  job_id: number;
  slug: string;
  job_title: string;
  company_name: string;
  description: string;
  terms_consent_text: string;
  theme_colour: string;
  font_family: string;
  developed_by: string;
  requirements?: string[];
  academic_id: number;
  academic_name: string;
  job_meta_names?: {
    'Job Type'?: string;
    Location?: string;
    Experience?: string;
  };
  success_message: string;
  resume_size: string;
  baseUrl?: string;
  result?: FormSection[];
};

type InstituteData = {
  status: boolean;
  header: {
    header_heading?: string;
    academic_name: string;
    academic_logo: string;
    favicon: string;
    website: string;
  };
  footer: {
    academic_name: string;
    academic_email: string;
    academic_address: string;
    academic_mobile: string;
    academic_website: string;
    academic_description: string;
    social_icon: Array<{
      icon_url: string;
      icon: string;
    }>;
  };
  academic_website: string;
};

// Format file size utility
const formatFileSize = (bytes: number) => {
  if (bytes === 0) return '0 Bytes';

  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

export const ApplyJobPage: React.FC = () => {
  const navigate = useNavigate();
  const { instituteId, jobId } = useParams();
  const [jobDetails, setJobDetails] = useState<JobDetails | null>(null);
  const [institute, setInstitute] = useState<InstituteData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Form state
  const [formData, setFormData] = useState<Record<string, any>>({});
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const fileInputRefs = useRef<Record<string, HTMLInputElement | null>>({});

  // Success popup state
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  // Set favicon and title
  useEffect(() => {
    if (institute && jobDetails) {
      // Set page title
      document.title = `${jobDetails.job_title} - ${institute.header.academic_name}`;

      // Set favicon
      const setFavicon = (faviconUrl: string) => {
        const existingLinks = document.querySelectorAll('link[rel*="icon"]');
        existingLinks.forEach((link) => link.remove());

        const link = document.createElement('link');
        link.rel = 'icon';
        link.type = 'image/x-icon';
        link.href = faviconUrl;
        document.head.appendChild(link);
      };

      if (institute.header.favicon) {
        const faviconUrl = `${assetUrl}/${institute.header.favicon}`;
        setFavicon(faviconUrl);
      }

      // Apply theme color
      if (jobDetails.theme_colour) {
        document.documentElement.style.setProperty('--theme-color', jobDetails.theme_colour);
      }

      // Apply font family
      if (jobDetails.font_family) {
        document.documentElement.style.setProperty('--font-family', jobDetails.font_family);

        // Load Google Font if it's a Google Font
        if (
          !jobDetails.font_family.includes('Arial') &&
          !jobDetails.font_family.includes('Helvetica') &&
          !jobDetails.font_family.includes('Georgia') &&
          !jobDetails.font_family.includes('Times') &&
          !jobDetails.font_family.includes('Verdana')
        ) {
          const link = document.createElement('link');
          link.href = `https://fonts.googleapis.com/css2?family=${jobDetails.font_family.replace(/\s+/g, '+')}:wght@300;400;500;600;700&display=swap`;
          link.rel = 'stylesheet';
          document.head.appendChild(link);
        }
      }
    }
  }, [institute, jobDetails]);

  // CSS variables for theme
  useEffect(() => {
    const style = document.createElement('style');
    style.innerHTML = `
      :root {
        --theme-color: ${jobDetails?.theme_colour || '#3B82F6'};
        --font-family: ${jobDetails?.font_family || 'Inter, system-ui, -apple-system, sans-serif'};
      }
      
      .theme-bg {
        background-color: var(--theme-color);
      }
      
      .theme-text {
        color: var(--theme-color);
      }
      
      .theme-border {
        border-color: var(--theme-color);
      }
      
      .theme-hover:hover {
        background-color: var(--theme-color);
      }
      
      body {
        font-family: var(--font-family);
      }
    `;
    document.head.appendChild(style);

    return () => {
      document.head.removeChild(style);
    };
  }, [jobDetails?.theme_colour, jobDetails?.font_family]);

  // Fetch job details
  useEffect(() => {
    const fetchJobDetails = async () => {
      try {
        if (!jobId) {
          setError('Job ID not found');
          toast.error('Job ID not found');
          setLoading(false);
          return;
        }

        setLoading(true);
        setError(null);

        const response = await axios.post<{
          status: boolean;
          data: JobDetails;
          institude: InstituteData;
          message?: string;
        }>(
          `${apiUrl}/PublicCareer/get-job-details`,
          { slug: jobId },
          { headers: { 'Content-Type': 'application/json' } },
        );

        if (response.data?.status === true) {
          const { data: jobData, institude: instituteData } = response.data;
          setJobDetails(jobData);
          setInstitute(instituteData);

          // Initialize form data
          const initialFormData: Record<string, any> = {};
          if (jobData.result && Array.isArray(jobData.result)) {
            jobData.result.forEach((section: FormSection) => {
              section.children?.forEach((field: FormField) => {
                switch (field.type) {
                  case 'text':
                  case 'email':
                  case 'tel':
                  case 'number':
                  case 'textarea':
                    initialFormData[field.name] = field.value || '';
                    break;
                  case 'select':
                  case 'dropdown':
                    initialFormData[field.name] = field.value || '';
                    break;
                  case 'checkbox':
                  case 'radio':
                    initialFormData[field.name] = field.value || false;
                    break;
                  case 'file':
                  case 'file_button':
                    initialFormData[field.name] = null;
                    break;
                  default:
                    initialFormData[field.name] = field.value || '';
                }
              });
            });
          }

          // Add default fields if not present
          const defaultFields = ['name', 'email', 'mobile', 'resume'];
          defaultFields.forEach((field) => {
            if (!(field in initialFormData)) {
              initialFormData[field] = '';
              if (field === 'resume') initialFormData[field] = null;
            }
          });

          setFormData(initialFormData);
          setSuccessMessage(jobData.success_message);
        } else {
          setError(response.data?.message || 'Job details not found');
        }
      } catch (err: any) {
        console.error('Error fetching job details:', err);
        setError(err.response?.data?.message || 'Failed to load job details');
      } finally {
        setLoading(false);
      }
    };

    fetchJobDetails();
  }, [jobId]);

  // Handle input changes
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>,
  ) => {
    const { name, value, type } = e.target;

    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData((prev) => ({ ...prev, [name]: checked }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }

    // Clear error for this field
    if (formErrors[name]) {
      setFormErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  // File validation
  const validateFile = (file: File, max_size?: number, allowed_types?: string) => {
    let isValid = true;
    let message = '';

    // Convert max_size from string to number if needed
    const maxSizeMB = max_size
      ? Number(max_size)
      : jobDetails?.resume_size
        ? Number(jobDetails.resume_size)
        : 5;
    const maxSizeBytes = maxSizeMB * 1024 * 1024;

    // Check file size
    if (file.size > maxSizeBytes) {
      isValid = false;
      message = `File size exceeds maximum limit of ${maxSizeMB}MB. Please upload a smaller file.`;
      return { isValid, message };
    }

    // Get file extension
    const fileExtension = '.' + file.name.split('.').pop()?.toLowerCase();

    // Check if allowed_types is provided
    if (allowed_types) {
      const allowedExtensions = allowed_types.split(',').map((t) => `.${t.trim().toLowerCase()}`);

      const hasValidExtension = allowedExtensions.some(
        (ext) => fileExtension === ext.toLowerCase(),
      );

      const mimeTypeMap: Record<string, string[]> = {
        '.pdf': ['application/pdf'],
        '.doc': ['application/msword'],
        '.docx': ['application/vnd.openxmlformats-officedocument.wordprocessingml.document'],
        '.txt': ['text/plain'],
      };

      const allowedMimeTypes = allowedExtensions.flatMap(
        (ext) => mimeTypeMap[ext.toLowerCase()] || [],
      );

      const hasValidMimeType = allowedMimeTypes.includes(file.type.toLowerCase());

      if (!hasValidExtension && !hasValidMimeType) {
        isValid = false;
        message = `Invalid file type. Allowed types: ${allowed_types}.`;
        return { isValid, message };
      }
    }

    return { isValid, message };
  };

  // Handle file change
  const handleFileChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    fieldName: string,
    field: FormField,
  ) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const validation = validateFile(file, field.max_length, field.allowed_type);

      if (!validation.isValid) {
        toast.error(validation.message);
        e.target.value = '';
        setFormData((prev) => ({ ...prev, [fieldName]: null }));
        return;
      }

      setFormData((prev) => ({ ...prev, [fieldName]: file }));
      toast.success(`${field.label} uploaded successfully (${formatFileSize(file.size)})`, {
        icon: '📎',
      });
    }
  };

  // Handle drag and drop
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent, fieldName: string, field: FormField) => {
    e.preventDefault();
    e.stopPropagation();

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      const validation = validateFile(file, field.max_length, field.allowed_type);

      if (!validation.isValid) {
        toast.error(validation.message);
        return;
      }

      setFormData((prev) => ({ ...prev, [fieldName]: file }));
      toast.success(`${field.label} uploaded successfully (${formatFileSize(file.size)})`, {
        icon: '📎',
      });
    }
  };

  // Validate field
  const validateField = (field: FormField, value: any): string => {
    if (field.required === 1 && (!value || (typeof value === 'string' && !value.trim()))) {
      return `${field.label} is required`;
    }

    if (value && typeof value === 'string' && field.validation) {
      switch (field.validation) {
        case 'email':
          const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
          if (!emailRegex.test(value)) {
            return 'Please enter a valid email address';
          }
          break;
        case 'mobile':
          const mobileRegex = /^[0-9]{10}$/;
          if (!mobileRegex.test(value.replace(/\D/g, ''))) {
            return 'Please enter a valid 10-digit mobile number';
          }
          break;
        case 'number':
          if (isNaN(Number(value))) {
            return `${field.label} must be a number`;
          }
          break;
      }
    }

    if ((field.type === 'file' || field.type === 'file_button') && field.required === 1 && !value) {
      return `${field.label} is required`;
    }

    return '';
  };

  // Validate entire form
  const validateForm = (): boolean => {
    const errors: Record<string, string> = {};
    let isValid = true;

    if (jobDetails?.result && Array.isArray(jobDetails.result)) {
      jobDetails.result.forEach((section: FormSection) => {
        section.children?.forEach((field: FormField) => {
          const error = validateField(field, formData[field.name]);
          if (error) {
            errors[field.name] = error;
            isValid = false;
          }
        });
      });
    } else {
      // Validate default fields
      const defaultFields = [
        { name: 'name', label: 'Name', required: true, type: 'text', validation: 'text' },
        { name: 'email', label: 'Email', required: true, type: 'email', validation: 'email' },
        { name: 'mobile', label: 'Mobile', required: true, type: 'tel', validation: 'mobile' },
        { name: 'resume', label: 'Resume', required: true, type: 'file' },
      ];

      defaultFields.forEach((field) => {
        const value = formData[field.name];
        if (field.required && !value) {
          errors[field.name] = `${field.label} is required`;
          isValid = false;
        } else if (field.validation === 'email' && value) {
          const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
          if (!emailRegex.test(value)) {
            errors[field.name] = 'Please enter a valid email address';
            isValid = false;
          }
        } else if (field.validation === 'mobile' && value) {
          const mobileRegex = /^[0-9]{10}$/;
          if (!mobileRegex.test(value.replace(/\D/g, ''))) {
            errors[field.name] = 'Please enter a valid 10-digit mobile number';
            isValid = false;
          }
        }
      });
    }

    setFormErrors(errors);
    return isValid;
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!jobDetails) {
      toast.error('Job information is not available. Please try again.');
      return;
    }

    if (!validateForm()) {
      toast.error('Please fix the errors in the form');
      return;
    }

    setIsSubmitting(true);

    try {
      const formDataToSend = new FormData();
      formDataToSend.append('academic_id', jobDetails.academic_id.toString());
      formDataToSend.append('job_id', jobId || '');

      Object.keys(formData).forEach((key) => {
        const value = formData[key];
        if (value instanceof File) {
          formDataToSend.append('document', value);
        } else if (value !== null && value !== undefined && value !== '') {
          formDataToSend.append(`candidate_details[${key}]`, value.toString());
        }
      });

      const response = await axios.post<{
        status: boolean;
        message: string;
        application_id?: number;
        reference_id?: string;
      }>(`${apiUrl}/PublicCareer/add-career-application`, formDataToSend, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Accept: 'application/json',
        },
      });

      if (response.data?.status === true) {
        // Reset form
        const resetFormData: Record<string, any> = {};
        if (jobDetails.result && Array.isArray(jobDetails.result)) {
          jobDetails.result.forEach((section: FormSection) => {
            section.children?.forEach((field: FormField) => {
              if (field.type === 'file' || field.type === 'file_button') {
                resetFormData[field.name] = null;
                if (fileInputRefs.current[field.name]) {
                  fileInputRefs.current[field.name]!.value = '';
                }
              } else {
                resetFormData[field.name] = field.value || '';
              }
            });
          });
        }
        setFormData(resetFormData);
        setFormErrors({});

        // Show success popup
        setShowSuccessPopup(true);

        toast.success(response.data.message || 'Application submitted successfully!');
      } else {
        toast.error(response.data?.message || 'Failed to submit application');
      }
    } catch (error: any) {
      console.error('Submission error:', error);
      toast.error(
        error.response?.data?.message ||
          'There was an error submitting your application. Please try again.',
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  // Render form field
  const renderFormField = (field: FormField) => {
    const error = formErrors[field.name];
    const value = formData[field.name] || '';

    switch (field.type) {
      case 'text':
      case 'email':
      case 'tel':
      case 'number':
        return (
          <div key={field.name} className="mb-4">
            <label className="block text-sm font-semibold text-slate-900 mb-2">
              {field.label} {field.required === 1 && <span className="text-red-500">*</span>}
            </label>
            <input
              type={field.type === 'tel' ? 'tel' : field.type}
              name={field.name}
              value={value}
              onChange={handleInputChange}
              className={`w-full px-4 py-3.5 border rounded-2xl focus:ring-1 focus:border-theme-color transition-all text-sm placeholder-slate-500 ${
                error
                  ? 'border-red-300 focus:ring-red-500/20'
                  : 'border-slate-300 focus:ring-theme-color/20'
              }`}
              placeholder={field.placeholder}
              required={field.required === 1}
            />
            {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
          </div>
        );

      case 'textarea':
        return (
          <div key={field.name} className="mb-4">
            <label className="block text-sm font-semibold text-slate-900 mb-2">
              {field.label} {field.required === 1 && <span className="text-red-500">*</span>}
            </label>
            <textarea
              name={field.name}
              value={value}
              onChange={handleInputChange}
              rows={4}
              className={`w-full px-4 py-3.5 border rounded-2xl focus:ring-1 focus:border-theme-color transition-all text-sm placeholder-slate-500 resize-none ${
                error
                  ? 'border-red-300 focus:ring-red-500/20'
                  : 'border-slate-300 focus:ring-theme-color/20'
              }`}
              placeholder={field.placeholder}
              required={field.required === 1}
            />
            {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
          </div>
        );

      case 'select':
      case 'dropdown':
        return (
          <div key={field.name} className="mb-4">
            <label className="block text-sm font-semibold text-slate-900 mb-2">
              {field.label} {field.required === 1 && <span className="text-red-500">*</span>}
            </label>
            <select
              name={field.name}
              value={value}
              onChange={handleInputChange}
              className={`w-full px-4 py-3.5 border rounded-2xl focus:ring-1 focus:border-theme-color transition-all text-sm bg-white ${
                error
                  ? 'border-red-300 focus:ring-red-500/20'
                  : 'border-slate-300 focus:ring-theme-color/20'
              }`}
              required={field.required === 1}
            >
              <option value="">Select {field.label}</option>
              {field.options?.map((option, index) => (
                <option key={index} value={option}>
                  {option}
                </option>
              ))}
            </select>
            {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
          </div>
        );

      case 'file':
      case 'file_button':
        return (
          <div key={field.name} className="mb-4">
            <label className="block text-sm font-semibold text-slate-900 mb-2">
              {field.label} {field.required === 1 && <span className="text-red-500">*</span>}
            </label>
            <div
              className="relative"
              onDragOver={handleDragOver}
              onDrop={(e) => handleDrop(e, field.name, field)}
            >
              <input
                ref={(el) => (fileInputRefs.current[field.name] = el)}
                type="file"
                accept={field.allowed_type
                  ?.split(',')
                  .map((t) => `.${t.trim().toLowerCase()}`)
                  .join(',')}
                onChange={(e) => handleFileChange(e, field.name, field)}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                required={field.required === 1}
              />
              <div
                className={`flex items-center justify-between px-6 py-5 border-2 rounded-2xl cursor-pointer transition-all ${
                  value
                    ? 'theme-border bg-theme-50'
                    : error
                      ? 'border-red-300 bg-red-50'
                      : 'border-dashed border-slate-300 bg-slate-50 hover:bg-theme-50'
                }`}
              >
                <div className="flex items-center gap-4">
                  <div
                    className={`p-3 rounded-xl ${
                      value ? 'theme-bg bg-opacity-10' : 'bg-slate-100'
                    }`}
                  >
                    <svg
                      className={`w-5 h-5 ${value ? 'theme-text' : 'text-slate-500'}`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                      />
                    </svg>
                  </div>
                  <div>
                    <p className="font-semibold text-slate-900 text-sm">
                      {value instanceof File ? value.name : field.placeholder || 'Choose File'}
                    </p>
                    <p className="text-xs text-slate-500 mt-1">
                      {value instanceof File
                        ? `Uploaded ${formatFileSize(value.size)}`
                        : 'No file chosen'}
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-medium rounded-lg transition-colors"
                  onClick={() => fileInputRefs.current[field.name]?.click()}
                >
                  Browse
                </button>
              </div>
            </div>
            <p className="text-xs text-slate-500 mt-2">
              {field.allowed_type ? `Allowed: ${field.allowed_type}` : 'All file types'}
              {field.max_length
                ? ` (Max ${field.max_length}MB)`
                : jobDetails?.resume_size
                  ? ` (Max ${jobDetails.resume_size}MB)`
                  : ''}
            </p>
            {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
          </div>
        );

      case 'checkbox':
        return (
          <div key={field.name} className="flex items-start gap-3 mb-4">
            <input
              type="checkbox"
              name={field.name}
              id={field.name}
              checked={!!value}
              onChange={handleInputChange}
              className="mt-1 w-4 h-4 theme-text bg-white border-slate-300 rounded focus:ring-theme-color"
              required={field.required === 1}
            />
            <label htmlFor={field.name} className="text-sm text-slate-700">
              {field.label} {field.required === 1 && <span className="text-red-500">*</span>}
            </label>
            {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
          </div>
        );

      default:
        return (
          <div key={field.name} className="mb-4">
            <label className="block text-sm font-semibold text-slate-900 mb-2">
              {field.label} {field.required === 1 && <span className="text-red-500">*</span>}
            </label>
            <input
              type="text"
              name={field.name}
              value={value}
              onChange={handleInputChange}
              className={`w-full px-4 py-3.5 border rounded-2xl focus:ring-1 focus:border-theme-color transition-all text-sm placeholder-slate-500 ${
                error
                  ? 'border-red-300 focus:ring-red-500/20'
                  : 'border-slate-300 focus:ring-theme-color/20'
              }`}
              placeholder={field.placeholder}
              required={field.required === 1}
            />
            {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
          </div>
        );
    }
  };

  // Render dynamic form
  const renderDynamicForm = () => {
    if (
      !jobDetails?.result ||
      !Array.isArray(jobDetails.result) ||
      jobDetails.result.length === 0
    ) {
      // Default form
      return (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-slate-900 mb-2">
                Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="name"
                value={formData.name || ''}
                onChange={handleInputChange}
                className={`w-full px-4 py-3.5 border rounded-2xl focus:ring-1 focus:border-theme-color transition-all text-sm placeholder-slate-500 ${
                  formErrors.name
                    ? 'border-red-300 focus:ring-red-500/20'
                    : 'border-slate-300 focus:ring-theme-color/20'
                }`}
                placeholder="Your full name"
                required
              />
              {formErrors.name && <p className="mt-1 text-sm text-red-600">{formErrors.name}</p>}
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-900 mb-2">
                Email <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                name="email"
                value={formData.email || ''}
                onChange={handleInputChange}
                className={`w-full px-4 py-3.5 border rounded-2xl focus:ring-1 focus:border-theme-color transition-all text-sm placeholder-slate-500 ${
                  formErrors.email
                    ? 'border-red-300 focus:ring-red-500/20'
                    : 'border-slate-300 focus:ring-theme-color/20'
                }`}
                placeholder="your.email@example.com"
                required
              />
              {formErrors.email && <p className="mt-1 text-sm text-red-600">{formErrors.email}</p>}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-slate-900 mb-2">
                Mobile <span className="text-red-500">*</span>
              </label>
              <input
                type="tel"
                name="mobile"
                value={formData.mobile || ''}
                onChange={handleInputChange}
                className={`w-full px-4 py-3.5 border rounded-2xl focus:ring-1 focus:border-theme-color transition-all text-sm placeholder-slate-500 ${
                  formErrors.mobile
                    ? 'border-red-300 focus:ring-red-500/20'
                    : 'border-slate-300 focus:ring-theme-color/20'
                }`}
                placeholder="Your phone number"
                required
              />
              {formErrors.mobile && (
                <p className="mt-1 text-sm text-red-600">{formErrors.mobile}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-900 mb-2">Experience</label>
              <input
                type="text"
                name="experience"
                value={formData.experience || ''}
                onChange={handleInputChange}
                className="w-full px-4 py-3.5 border border-slate-300 rounded-2xl focus:ring-1 focus:ring-theme-color/20 focus:border-theme-color transition-all text-sm placeholder-slate-500"
                placeholder="e.g., 2 years"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-900 mb-2">Address</label>
            <textarea
              name="address"
              value={formData.address || ''}
              onChange={handleInputChange}
              rows={2}
              className="w-full px-4 py-3.5 border border-slate-300 rounded-2xl focus:ring-1 focus:ring-theme-color/20 focus:border-theme-color transition-all text-sm placeholder-slate-500 resize-none"
              placeholder="Your address"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-900 mb-2">
              Upload Resume <span className="text-red-500">*</span>
            </label>
            <div className="relative" onDragOver={handleDragOver}>
              <input
                ref={(el) => (fileInputRefs.current['resume'] = el)}
                type="file"
                name="resume"
                accept=".pdf,.doc,.docx"
                onChange={(e) => {
                  const field: FormField = {
                    type: 'file',
                    name: 'resume',
                    label: 'Resume',
                    placeholder: '',
                    required: 1,
                    validation: null,
                    value: null,
                    allowed_type: 'PDF,DOC,DOCX',
                    max_length: jobDetails?.resume_size ? Number(jobDetails.resume_size) : 5,
                  };
                  handleFileChange(e, 'resume', field);
                }}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                required
              />
              <div
                className={`flex items-center justify-between px-6 py-5 border-2 rounded-2xl cursor-pointer transition-all ${
                  formData['resume']
                    ? 'theme-border bg-theme-50'
                    : formErrors['resume']
                      ? 'border-red-300 bg-red-50'
                      : 'border-dashed border-slate-300 bg-slate-50 hover:bg-theme-50'
                }`}
              >
                <div className="flex items-center gap-4">
                  <div
                    className={`p-3 rounded-xl ${
                      formData['resume'] ? 'theme-bg bg-opacity-10' : 'bg-slate-100'
                    }`}
                  >
                    <svg
                      className={`w-5 h-5 ${formData['resume'] ? 'theme-text' : 'text-slate-500'}`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                      />
                    </svg>
                  </div>
                  <div>
                    <p className="font-semibold text-slate-900 text-sm">
                      {formData['resume'] instanceof File
                        ? formData['resume'].name
                        : 'Choose Resume'}
                    </p>
                    <p className="text-xs text-slate-500 mt-1">
                      {formData['resume'] instanceof File
                        ? `Uploaded ${formatFileSize(formData['resume'].size)}`
                        : 'No file chosen'}
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-medium rounded-lg transition-colors"
                  onClick={() => fileInputRefs.current['resume']?.click()}
                >
                  Browse
                </button>
              </div>
            </div>
            <p className="text-xs text-slate-500 mt-2">
              PDF, DOC, DOCX (Max {jobDetails?.resume_size || 5}MB)
            </p>
            {formErrors['resume'] && (
              <p className="mt-1 text-sm text-red-600">{formErrors['resume']}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-900 mb-2">Cover Letter</label>
            <textarea
              name="cover_letter"
              value={formData.cover_letter || ''}
              onChange={handleInputChange}
              rows={4}
              className="w-full px-4 py-3.5 border border-slate-300 rounded-2xl focus:ring-1 focus:ring-theme-color/20 focus:border-theme-color transition-all text-sm placeholder-slate-500 resize-none"
              placeholder="Tell us about your experience, skills, and why you're interested in this role..."
            />
          </div>
        </div>
      );
    }

    return (
      <div className="space-y-8">
        {jobDetails.result.map((section: FormSection, sectionIndex: number) => (
          <div
            key={sectionIndex}
            className={`grid grid-cols-1 ${
              section.width === '100%' ? 'lg:grid-cols-1' : 'lg:grid-cols-2'
            } gap-${section.gap || 4}`}
            style={{ justifyContent: section.justify || 'start' }}
          >
            {section.children.map((field: FormField) => (
              <div key={field.name} className={section.width === '100%' ? 'col-span-full' : ''}>
                {renderFormField(field)}
              </div>
            ))}
          </div>
        ))}
      </div>
    );
  };

  // Handle success popup close
  const handleSuccessPopupClose = () => {
    setShowSuccessPopup(false);
    navigate(-1);
  };

  // Get institute data
  const getInstituteLogo = () => institute?.header?.academic_logo || '';
  const getInstituteName = () =>
    institute?.header?.academic_name || jobDetails?.academic_name || '';
  const getInstituteAddress = () => institute?.footer?.academic_address || '';
  const getHRContactEmail = () => institute?.footer?.academic_email || 'careers@example.com';

  // Get job location
  const getJobLocation = () => jobDetails?.job_meta_names?.Location || '';

  // Get job type
  const getJobType = () => jobDetails?.job_meta_names?.['Job Type'] || '';

  // Get experience
  const getExperience = () => jobDetails?.job_meta_names?.Experience || '';

  if (loading) {
    return <Loader />;
  }

  if (error || !jobDetails) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="text-center p-8">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg
              className="w-8 h-8 text-red-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <h3 className="text-xl font-bold text-slate-900 mb-2">Page Not Found</h3>
          <p className="text-slate-600 mb-6">
            {error || 'The job you are looking for does not exist.'}
          </p>
          <button
            onClick={() => navigate(-1)}
            className="px-6 py-2 theme-bg text-white rounded-lg hover:opacity-90 transition-opacity"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      {/* Header */}
      <Header
        logo={getInstituteLogo()}
        address={getInstituteAddress()}
        instituteName={getInstituteName()}
        baseUrl={jobDetails?.baseUrl}
        institute_id={instituteId}
        primaryWebsiteUrl={institute?.academic_website}
        themeColor={jobDetails?.theme_colour}
      />

      {/* Main Content */}
      <main className="flex-1 bg-gradient-to-br from-slate-50 via-white to-slate-100 py-8 px-4 sm:py-12 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Left Column - Job Description */}
            <div className="lg:w-7/12">
              <div className="bg-white rounded-3xl shadow-xl border border-slate-200 p-6 sm:p-8 h-full">
                <div className="mb-8">
                  <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-3 theme-text">
                    {jobDetails.job_title}
                  </h1>
                  <div className="flex items-center flex-wrap gap-3 text-slate-700 mb-2">
                    <span className="font-semibold text-lg">{jobDetails.company_name}</span>
                    <span className="text-slate-400">•</span>
                    <span className="flex items-center gap-1">
                      <svg
                        className="w-5 h-5 text-slate-500"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                        />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                        />
                      </svg>
                      {getJobLocation() || 'Remote'}
                    </span>
                  </div>

                  {/* Job Metadata */}
                  <div className="grid grid-cols-2 gap-4 mb-8">
                    {getJobType() && (
                      <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                        <p className="text-xs text-slate-500 mb-1">Job Type</p>
                        <p className="font-semibold text-slate-900">{getJobType()}</p>
                      </div>
                    )}
                    {getExperience() && (
                      <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                        <p className="text-xs text-slate-500 mb-1">Experience</p>
                        <p className="font-semibold text-slate-900">{getExperience()}</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Job Description */}
                <div className="mb-8">
                  <h2 className="text-xl font-bold text-slate-900 mb-4 pb-3 border-b border-slate-300">
                    Job Description
                  </h2>
                  <div
                    className="prose prose-slate max-w-none font-[Poppins] 
    [&_*]:!font-[Poppins]
    [&_ul]:list-disc [&_ul]:!ml-6 [&_ul]:mb-4 
    [&_ol]:list-decimal [&_ol]:!ml-6 [&_ol]:mb-4 
    [&_li]:mb-2 [&_p]:mb-4"
                    dangerouslySetInnerHTML={{ __html: jobDetails.description }}
                  />
                </div>

                {/* Requirements */}
                {jobDetails.requirements && jobDetails.requirements.length > 0 && (
                  <div className="mt-6">
                    <h3 className="text-lg font-bold text-slate-900 mb-3">Requirements:</h3>
                    <ul className="space-y-2">
                      {jobDetails.requirements.map((req, index) => (
                        <li key={index} className="flex items-start gap-2">
                          <svg
                            className="w-5 h-5 text-emerald-500 flex-shrink-0 mt-0.5"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                            />
                          </svg>
                          <span className="text-slate-700">{req}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Contact Information */}
                <div className="bg-gradient-to-r from-theme-50 to-slate-50 border border-theme-100 rounded-2xl p-6 mt-8">
                  <h4 className="font-bold text-slate-900 mb-2">📧 Need Help?</h4>
                  <p className="text-sm text-slate-600 mb-3">
                    Have questions about this role? Contact our HR team
                  </p>
                  <a
                    href={`mailto:${getHRContactEmail()}`}
                    className="inline-flex items-center gap-2 theme-text font-semibold hover:opacity-80"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                      />
                    </svg>
                    {getHRContactEmail()}
                  </a>
                </div>
              </div>
            </div>

            {/* Right Column - Application Form */}
            <div className="lg:w-5/12">
              <div className="bg-white rounded-3xl shadow-xl border border-slate-200 p-6 sm:p-8 sticky top-6">
                {/* Form Header */}
                <div className="border-b border-slate-200 pb-4 mb-6">
                  <h3 className="text-xl font-bold text-slate-900">Apply Now</h3>
                  <p className="text-sm text-slate-600 mt-1">
                    Fill out the form below to apply for this position
                  </p>
                </div>

                {/* Dynamic Form */}
                <form onSubmit={handleSubmit} className="space-y-6">
                  {renderDynamicForm()}

                  {/* Terms and Conditions */}
                  {jobDetails.terms_consent_text && (
                    <div className="flex items-start gap-2 p-3 bg-slate-50 rounded-xl border border-slate-200">
                      <input
                        type="checkbox"
                        id="terms"
                        required
                        className="mt-1 w-4 h-4 theme-text bg-white border-slate-300 rounded focus:ring-theme-color flex-shrink-0"
                      />

                      <div className="text-sm text-slate-700">
                        <label htmlFor="terms" className="cursor-pointer">
                          <div
                            className="terms-consent-text"
                            dangerouslySetInnerHTML={{ __html: jobDetails.terms_consent_text }}
                          />
                        </label>
                      </div>
                    </div>
                  )}

                  {/* Submit button */}
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className={`w-full theme-bg hover:opacity-90 text-white font-bold py-4 px-8 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 flex items-center justify-center gap-3 border border-theme-color/30 ${
                      isSubmitting ? 'opacity-75 cursor-not-allowed' : ''
                    }`}
                  >
                    {isSubmitting ? (
                      <>
                        <svg
                          className="animate-spin w-5 h-5 text-white"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          />
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          />
                        </svg>
                        Submitting...
                      </>
                    ) : (
                      <>SUBMIT APPLICATION</>
                    )}
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <Footer
        baseUrl={jobDetails?.baseUrl}
        instituteName={getInstituteName()}
        institute={institute}
        footerData={institute?.footer}
        developedBy={jobDetails?.developed_by}
        themeColor={jobDetails?.theme_colour}
        fontFamily={jobDetails?.font_family}
      />

      {/* Success Popup */}
      <SuccessPopup
        isOpen={showSuccessPopup}
        onClose={handleSuccessPopupClose}
        message={successMessage}
        jobTitle={jobDetails.job_title}
        companyName={jobDetails.company_name}
      />
    </div>
  );
};

export default ApplyJobPage;

// import { useState, useRef, useEffect } from 'react';
// import { useSearchParams, useNavigate, useLocation, useParams } from 'react-router';
// import axios from 'axios';
// import toast from 'react-hot-toast';
// import Header from './Header';
// import Footer from './Footer';
// import Loader from 'src/Frontend/Common/Loader';

// const apiUrl =  import.meta.env.VITE_API_URL;
// const assetUrl = import.meta.env.VITE_ASSET_URL;

// // Configuration for file uploads
// const FILE_UPLOAD_CONFIG = {
//   maxSize: 5,
//   allowedTypes: ['pdf', 'doc', 'docx'],
//   maxSizeInBytes: 5 * 1024 * 1024,
//   allowedMimeTypes: [
//     'application/pdf',
//     'application/msword',
//     'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
//   ],
// };

// type FormField = {
//   type: string;
//   name: string;
//   label: string;
//   placeholder: string;
//   required: number;
//   validation: string | null;
//   value: string | null;
//   options?: string[];
//   fileConfig?: {
//     maxSize?: number;
//     allowedTypes?: string[];
//   };
// };

// type FormSection = {
//   width?: string;
//   gap?: number;
//   justify?: string;
//   children: FormField[];
// };

// type JobDetails = {
//   developed_by: any;
//   terms_consent_text: string;
//   resume_size(arg0: string, resume_size: any): unknown;
//   success_message: string;
//   job_id: number;
//   job_title: string;
//   company_name: string;
//   description: string;
//   requirements?: string[];
//   responsibilities?: string[];
//   academic_id: number;
//   academic_name: string;
//   location?: string;
//   job_type?: string;
//   experience?: string;
//   salary?: string;
//   deadline?: string;
//   apply_url?: string;
//   created_at?: string;
//   status?: string;
//   job_meta?: {
//     first?: number;
//     second?: number;
//     third?: number;
//   };
//   result?: FormSection[];
// };

// type InstituteData = {
//   status: boolean;
//   academic_id: number;
//   unique_code: string;
//   header: {
//     academic_name: string;
//     academic_logo: string;
//   };
//   banner?: {
//     title?: string;
//     long_description?: string;
//     banner_image?: string;
//   };
//   jobs?: {
//     id: number;
//     job_title: string;
//     company_name: string;
//     description: string;
//     location: string;
//     job_type: string;
//     experience: string;
//     job_meta?: {
//       [key: string]: number;
//     };
//     job_meta_names?: {
//       [key: string]: string;
//     };
//     created_at: string;
//   }[];
//   footer?: {
//     academic_name?: string;
//     academic_email?: string;
//     academic_address?: string;
//   };
//   website?: string;
//   contact_email?: string;
//   hr_email?: string;
// };

// // Success Popup Component
// const SuccessPopup: React.FC<{
//   isOpen: boolean;
//   onClose: () => void;
//   message: string;
// }> = ({ isOpen, onClose, message }) => {
//   if (!isOpen) return null;

//   return (
//     <div className="fixed inset-0 z-50 overflow-y-auto">
//       {/* Backdrop */}
//       <div className="fixed inset-0 bg-transparent bg-opacity-50 transition-opacity"></div>

//       <div className="flex min-h-screen items-center justify-center p-4">
//         <div className="relative transform overflow-hidden rounded-3xl bg-white shadow-2xl transition-all w-full max-w-md">
//           {/* Close button */}
//           <button
//             onClick={onClose}
//             className="absolute right-4 top-4 text-slate-400 hover:text-slate-600"
//           >
//             <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//               <path
//                 strokeLinecap="round"
//                 strokeLinejoin="round"
//                 strokeWidth={2}
//                 d="M6 18L18 6M6 6l12 12"
//               />
//             </svg>
//           </button>

//           {/* Popup Content */}
//           <div className="p-8 text-center">
//             {/* Success Icon */}
//             <div className="mx-auto flex items-center justify-center h-24 w-24 rounded-full bg-emerald-100 mb-6">
//               <svg
//                 className="h-12 w-12 text-emerald-600"
//                 fill="none"
//                 stroke="currentColor"
//                 viewBox="0 0 24 24"
//               >
//                 <path
//                   strokeLinecap="round"
//                   strokeLinejoin="round"
//                   strokeWidth={2}
//                   d="M5 13l4 4L19 7"
//                 />
//               </svg>
//             </div>

//             {/* Title */}
//             <h3 className="text-2xl font-bold text-slate-900 mb-2">Application Submitted! 🎉</h3>

//             {/* Message */}
//             <p className="text-slate-600 mb-6">
//               {message || 'Your application has been submitted successfully.'}
//             </p>

//             {/* Action Buttons */}
//             <div className="flex flex-col gap-3">
//               <button
//                 onClick={onClose}
//                 className="w-full bg-gradient-to-r from-emerald-600 to-emerald-700 text-white font-semibold py-3 px-6 rounded-2xl hover:from-emerald-700 hover:to-emerald-800 transition-all"
//               >
//                  Close
//               </button>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export const ApplyJobPage: React.FC = () => {
//   const navigate = useNavigate();
//   const location = useLocation();
//   const { instituteId, jobId, baseUrl } = useParams();
//   const [jobDetails, setJobDetails] = useState<JobDetails | null>(null);
//   const [institute, setInstitute] = useState<InstituteData | null>(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);
//   const [instituteLoading, setInstituteLoading] = useState(false);

//   // Dynamic form data state
//   const [formData, setFormData] = useState<Record<string, any>>({});
//   const [formErrors, setFormErrors] = useState<Record<string, string>>({});
//   const [isSubmitting, setIsSubmitting] = useState(false);
//   const fileInputRefs = useRef<Record<string, HTMLInputElement | null>>({});

//   // Success popup state
//   const [showSuccessPopup, setShowSuccessPopup] = useState(false);
//   const [referenceId, setReferenceId] = useState<string>('');
//   const [applicationResponse, setApplicationResponse] = useState<{
//     application_id?: number;
//     reference_id?: string;
//     message?: string;
//   } | null>(null);

//   // Configuration state
//   const [uploadConfig, setUploadConfig] = useState(FILE_UPLOAD_CONFIG);

//   useEffect(() => {
//     if (institute) {
//       document.title = `${jobId}`;

//       const setFavicon = (faviconUrl: string) => {
//         const existingLinks = document.querySelectorAll('link[rel*="icon"]');
//         existingLinks.forEach((link) => link.remove());

//         const link = document.createElement('link');
//         link.rel = 'icon';
//         link.type = 'image/x-icon';
//         link.href = faviconUrl;
//         document.head.appendChild(link);
//       };

//       const faviconUrl = institute.header?.favicon ? `${assetUrl}/${institute.header.favicon}` : '';

//       setFavicon(faviconUrl);
//     }
//   }, [institute]);

//   // Fetch job details from API
//   useEffect(() => {
//     const fetchJobDetails = async () => {
//       try {
//         if (!jobId) {
//           setError('Job ID not found');
//           toast.error('Job ID not found');
//           setLoading(false);
//           return;
//         }

//         setLoading(true);

//         const response = await axios.post<{
//           status: boolean;
//           data: JobDetails;
//           message?: string;
//         }>(
//           `${apiUrl}/PublicCareer/get-job-details`,
//           {
//             slug: jobId,
//           },
//           {
//             headers: {
//               'Content-Type': 'application/json',
//             },
//           },
//         );

//         console.log('Job Details API Response:', response.data);

//         if (response.data && response.data.status === true) {
//           const jobData = response.data;
//           setJobDetails(jobData.data);
//           setInstitute(jobData.institude);

//           // Initialize form data
//           const initialFormData: Record<string, any> = {};
//           if (jobData.result && Array.isArray(jobData.result)) {
//             jobData.result.forEach((section: FormSection) => {
//               if (section.children && Array.isArray(section.children)) {
//                 section.children.forEach((field: FormField) => {
//                   switch (field.type) {
//                     case 'text':
//                     case 'email':
//                     case 'tel':
//                     case 'number':
//                     case 'textarea':
//                       initialFormData[field.name] = field.value || '';
//                       break;
//                     case 'select':
//                     case 'dropdown':
//                       initialFormData[field.name] = field.value || '';
//                       break;
//                     case 'checkbox':
//                     case 'radio':
//                       initialFormData[field.name] = field.value || false;
//                       break;
//                     case 'file':
//                     case 'file_button':
//                       initialFormData[field.name] = null;
//                       break;
//                     default:
//                       initialFormData[field.name] = field.value || '';
//                   }
//                 });
//               }
//             });
//           } else {
//             // Initialize with default fields if no dynamic fields
//             initialFormData['name'] = '';
//             initialFormData['email'] = '';
//             initialFormData['mobile'] = '';
//             initialFormData['experience'] = '';
//             initialFormData['address'] = '';
//             initialFormData['resume'] = null;
//             initialFormData['cover_letter'] = '';
//           }

//           setFormData(initialFormData);
//         } else {
//           setError(response.data?.message || 'Job details not found');
//         }
//       } catch (err: any) {
//         console.error('Error fetching job details:', err);
//       } finally {
//         setLoading(false);
//       }
//     };

//     if (jobId) {
//       fetchJobDetails();
//     }
//   }, [jobId]);

//   // Handle dynamic form input changes
//   const handleInputChange = (
//     e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>,
//   ) => {
//     const { name, value, type } = e.target;

//     if (type === 'checkbox') {
//       const checked = (e.target as HTMLInputElement).checked;
//       setFormData((prev) => ({ ...prev, [name]: checked }));
//     } else {
//       setFormData((prev) => ({ ...prev, [name]: value }));
//     }

//     if (formErrors[name]) {
//       setFormErrors((prev) => ({ ...prev, [name]: '' }));
//     }
//   };

//   console.log('resume size  ::::', jobDetails?.resume_size);

//   // File validation function with resume size check
// const validateFile = (file: File, max_size?: number, allowed_types?: string) => {
//   let isValid = true;
//   let message = '';

//   // Use max_length from field config (not max_size)
//   const maxSizeMB = max_size || 5;
//   const maxSizeBytes = maxSizeMB * 1024 * 1024;

//   // Check file size
//   if (file.size > maxSizeBytes) {
//     isValid = false;
//     message = `File size exceeds maximum limit of ${maxSizeMB}MB. Please upload a smaller file.`;
//     return { isValid, message };
//   }

//   // Get file extension
//   const fileExtension = '.' + file.name.split('.').pop()?.toLowerCase();

//   // Check if allowed_types is provided
//   if (allowed_types) {
//     // Split and prepare allowed extensions
//     const allowedExtensions = allowed_types
//       .split(',')
//       .map((t) => `.${t.trim().toLowerCase()}`);

//     console.log('Allowed extensions:', allowedExtensions);
//     console.log('File extension:', fileExtension);
//     console.log('File type:', file.type);

//     // Check if file extension matches allowed extensions
//     const hasValidExtension = allowedExtensions.some(ext =>
//       fileExtension === ext.toLowerCase()
//     );

//     // Also check MIME types for common formats
//     const mimeTypeMap: Record<string, string[]> = {
//       '.pdf': ['application/pdf'],
//       '.doc': ['application/msword'],
//       '.docx': ['application/vnd.openxmlformats-officedocument.wordprocessingml.document'],
//       '.txt': ['text/plain'],
//     };

//     // Get allowed MIME types for the allowed extensions
//     const allowedMimeTypes = allowedExtensions.flatMap(ext =>
//       mimeTypeMap[ext.toLowerCase()] || []
//     );

//     // Check if file is valid by either extension or MIME type
//     const hasValidMimeType = allowedMimeTypes.includes(file.type.toLowerCase());

//     if (!hasValidExtension && !hasValidMimeType) {
//       isValid = false;
//       message = `Invalid file type. Allowed types: ${allowed_types}.`;
//       return { isValid, message };
//     }
//   }

//   // If no allowed_types specified, accept all files (as long as size is valid)
//   return { isValid, message };
// };

//   // Handle file input changes with resume size validation
// const handleFileChange = (
//   e: React.ChangeEvent<HTMLInputElement>,
//   fieldName: string,
//   max_size?: number,
//   allowed_types?: string,
// ) => {
//   if (e.target.files && e.target.files[0]) {
//     const file = e.target.files[0];

//     // Use max_size (which comes from field.max_length)
//     const validation = validateFile(file, max_size, allowed_types);

//     if (!validation.isValid) {
//       toast.error(validation.message);
//       e.target.value = ''; // Clear the file input
//       // Also clear from formData
//       setFormData((prev) => ({ ...prev, [fieldName]: null }));
//       return;
//     }

//     setFormData((prev) => ({ ...prev, [fieldName]: file }));
//     toast.success(
//       `${field.label || fieldName.replace(/_/g, ' ')} uploaded successfully (${(
//         file.size /
//         (1024 * 1024)
//       ).toFixed(2)}MB)`,
//     );
//   }
// };

//   // Handle drag and drop for files with resume size validation
//   const handleDragOver = (e: React.DragEvent, fieldName: string) => {
//     e.preventDefault();
//     e.stopPropagation();
//   };

// const handleDrop = (
//   e: React.DragEvent,
//   fieldName: string,
//   fieldConfig?: FormField['fileConfig'],
// ) => {
//   e.preventDefault();
//   e.stopPropagation();

//   if (e.dataTransfer.files && e.dataTransfer.files[0]) {
//     const file = e.dataTransfer.files[0];
//     const currentField = fields.find(f => f.name === fieldName);

//     const validation = validateFile(
//       file,
//       currentField?.max_length,
//       currentField?.allowed_type
//     );

//     if (!validation.isValid) {
//       toast.error(validation.message);
//       return;
//     }

//     setFormData((prev) => ({ ...prev, [fieldName]: file }));
//     toast.success(
//       `${currentField?.label || fieldName.replace(/_/g, ' ')} uploaded successfully (${(
//         file.size /
//         (1024 * 1024)
//       ).toFixed(2)}MB)`,
//     );
//   }
// };

//   // Validate form field based on validation rules
//   const validateField = (field: FormField, value: any): string => {
//     if (field.required === 1 && (!value || (typeof value === 'string' && !value.trim()))) {
//       return `${field.label} is required`;
//     }

//     if (value && typeof value === 'string' && field.validation) {
//       switch (field.validation) {
//         case 'email':
//           const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
//           if (!emailRegex.test(value)) {
//             return 'Please enter a valid email address';
//           }
//           break;
//         case 'mobile':
//           const mobileRegex = /^[0-9]{10}$/;
//           if (!mobileRegex.test(value.replace(/\D/g, ''))) {
//             return 'Please enter a valid 10-digit mobile number';
//           }
//           break;
//         case 'number':
//           if (isNaN(Number(value))) {
//             return `${field.label} must be a number`;
//           }
//           break;
//       }
//     }

//     if ((field.type === 'file' || field.type === 'file_button') && field.required === 1 && !value) {
//       return `${field.label} is required`;
//     }

//     return '';
//   };

//   // Validate entire form
//   const validateForm = (): boolean => {
//     const errors: Record<string, string> = {};
//     let isValid = true;

//     if (jobDetails?.result && Array.isArray(jobDetails.result)) {
//       jobDetails.result.forEach((section: FormSection) => {
//         if (section.children && Array.isArray(section.children)) {
//           section.children.forEach((field: FormField) => {
//             const error = validateField(field, formData[field.name]);
//             if (error) {
//               errors[field.name] = error;
//               isValid = false;
//             }
//           });
//         }
//       });
//     } else {
//       // Validate default fields
//       const defaultFields = [
//         { name: 'name', label: 'Name', required: true, type: 'text' },
//         { name: 'email', label: 'Email', required: true, type: 'email', validation: 'email' },
//         { name: 'mobile', label: 'Mobile', required: true, type: 'tel', validation: 'mobile' },
//         { name: 'resume', label: 'Resume', required: true, type: 'file' },
//       ];

//       defaultFields.forEach((field) => {
//         const value = formData[field.name];
//         if (field.required && !value) {
//           errors[field.name] = `${field.label} is required`;
//           isValid = false;
//         } else if (field.validation === 'email' && value) {
//           const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
//           if (!emailRegex.test(value)) {
//             errors[field.name] = 'Please enter a valid email address';
//             isValid = false;
//           }
//         } else if (field.validation === 'mobile' && value) {
//           const mobileRegex = /^[0-9]{10}$/;
//           if (!mobileRegex.test(value.replace(/\D/g, ''))) {
//             errors[field.name] = 'Please enter a valid 10-digit mobile number';
//             isValid = false;
//           }
//         }
//       });
//     }

//     setFormErrors(errors);
//     return isValid;
//   };

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();

//     if (!jobDetails) {
//       toast.error('Job information is not available. Please try again.');
//       return;
//     }

//     if (!validateForm()) {
//       toast.error('Please fix the errors in the form');
//       return;
//     }

//     setIsSubmitting(true);

//     try {
//       const formDataToSend = new FormData();

//       formDataToSend.append('academic_id', jobDetails.academic_id.toString());
//       formDataToSend.append('job_id', jobId || '');

//       Object.keys(formData).forEach((key) => {
//         const value = formData[key];

//         if (value instanceof File) {
//           formDataToSend.append('document', value);
//         } else if (value !== null && value !== undefined && value !== '') {
//           formDataToSend.append(`candidate_details[${key}]`, value.toString());
//         }
//       });

//       const response = await axios.post<{
//         status: boolean;
//         message: string;
//         application_id?: number;
//         reference_id?: string;
//         job_id?: number;
//       }>(`${apiUrl}/PublicCareer/add-career-application`, formDataToSend, {
//         headers: {
//           'Content-Type': 'multipart/form-data',
//           Accept: 'application/json',
//         },
//       });

//       console.log('Submit Application Response:', response.data);

//       if (response.data && response.data.status === true) {
//         setApplicationResponse(response.data);
//         setReferenceId(response.data.reference_id || '');

//         setShowSuccessPopup(true);

//         // Reset form
//         const resetFormData: Record<string, any> = {};
//         if (jobDetails.result && Array.isArray(jobDetails.result)) {
//           jobDetails.result.forEach((section: FormSection) => {
//             if (section.children && Array.isArray(section.children)) {
//               section.children.forEach((field: FormField) => {
//                 switch (field.type) {
//                   case 'file':
//                   case 'file_button':
//                     resetFormData[field.name] = null;
//                     if (fileInputRefs.current[field.name]) {
//                       fileInputRefs.current[field.name]!.value = '';
//                     }
//                     break;
//                   default:
//                     resetFormData[field.name] = field.value || '';
//                 }
//               });
//             }
//           });
//         } else {
//           // Reset default fields
//           resetFormData['name'] = '';
//           resetFormData['email'] = '';
//           resetFormData['mobile'] = '';
//           resetFormData['experience'] = '';
//           resetFormData['address'] = '';
//           resetFormData['resume'] = null;
//           resetFormData['cover_letter'] = '';
//         }
//         setFormData(resetFormData);
//         setFormErrors({});
//       } else {
//         toast.error(response.data?.message || 'Failed to submit application');
//       }
//     } catch (error: any) {
//       console.error('Submission error:', error);
//       toast.error(
//         error.response?.data?.message ||
//           error.response?.data?.error ||
//           'There was an error submitting your application. Please try again.',
//       );
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   // Handle success popup close
//   const handleSuccessPopupClose = () => {
//     setShowSuccessPopup(false);
//     navigate(-1);
//   };

//   const formatFileSize = (bytes: number) => {
//   if (bytes === 0) return '0 Bytes';

//   const k = 1024;
//   const sizes = ['Bytes', 'KB', 'MB', 'GB'];
//   const i = Math.floor(Math.log(bytes) / Math.log(k));

//   return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
// };

//   // Render dynamic form fields
//   const renderFormField = (field: FormField) => {
//     const error = formErrors[field.name];

//     switch (field.type) {
//       case 'text':
//       case 'email':
//       case 'tel':
//       case 'number':
//         return (
//           <div key={field.name}>
//             <label className="block text-sm font-semibold text-slate-900 mb-2">
//               {field.label} {field.required === 1 ? <span className="text-red-500">*</span> : ''}
//             </label>
//             <input
//               type={field.type === 'tel' ? 'tel' : field.type}
//               name={field.name}
//               required={field.required === 1}
//               value={formData[field.name] || ''}
//               onChange={handleInputChange}
//               className={`w-full px-4 py-3.5 border ${
//                 error ? 'border-red-300' : 'border-slate-300'
//               } rounded-2xl focus:ring-3 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all text-sm placeholder-slate-500 hover:border-slate-400`}
//               placeholder={field.placeholder}
//             />
//             {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
//           </div>
//         );

//       case 'textarea':
//         return (
//           <div key={field.name}>
//             <label className="block text-sm font-semibold text-slate-900 mb-2">
//               {field.label} {field.required === 1 ? <span className="text-red-500">*</span> : ''}
//             </label>
//             <textarea
//               name={field.name}
//               required={field.required === 1}
//               value={formData[field.name] || ''}
//               onChange={handleInputChange}
//               rows={4}
//               className={`w-full px-4 py-3.5 border ${
//                 error ? 'border-red-300' : 'border-slate-300'
//               } rounded-2xl focus:ring-3 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all text-sm placeholder-slate-500 hover:border-slate-400 resize-none`}
//               placeholder={field.placeholder}
//             />
//             {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
//           </div>
//         );

//       case 'select':
//       case 'dropdown':
//         return (
//           <div key={field.name}>
//             <label className="block text-sm font-semibold text-slate-900 mb-2">
//               {field.label} {field.required === 1 ? <span className="text-red-500">*</span> : ''}
//             </label>
//             <select
//               name={field.name}
//               required={field.required === 1}
//               value={formData[field.name] || ''}
//               onChange={handleInputChange}
//               className={`w-full px-4 py-3.5 border ${
//                 error ? 'border-red-300' : 'border-slate-300'
//               } rounded-2xl focus:ring-3 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all text-sm placeholder-slate-500 hover:border-slate-400 bg-white`}
//             >
//               <option value="">Select {field.label}</option>
//               {field.options?.map((option, index) => (
//                 <option key={index} value={option}>
//                   {option}
//                 </option>
//               ))}
//             </select>
//             {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
//           </div>
//         );

//         case 'file':
// case 'file_button':
//   return (
//     <div key={field.name}>
//       <label className="block text-sm font-semibold text-slate-900 mb-2">
//         {field.label} {field.required === 1 ? <span className="text-red-500">*</span> : ''}
//       </label>
//       <div
//         className="relative"
//         onDragOver={(e) => handleDragOver(e, field.name)}
//         onDrop={(e) => handleDrop(e, field.name, field.fileConfig)}
//       >
//         <input
//           ref={(el) => (fileInputRefs.current[field.name] = el)}
//           type="file"
//           name={field.name}
//           accept={field.allowed_type
//             ?.split(',')
//             .map((t) => `.${t.trim().toLowerCase()}`)
//             .join(',')}
//           required={field.required === 1}
//           onChange={(e) => handleFileChange(
//             e,
//             field.name,
//             field.max_length, // This is 5 in your case
//             field.allowed_type // This is "DOC,DOCX" in your case
//           )}
//           className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
//         />
//         <div
//           className={`flex items-center justify-between px-6 py-5 border-2 ${
//             formData[field.name]
//               ? 'border-emerald-500 bg-emerald-50'
//               : error
//                 ? 'border-red-300 bg-red-50'
//                 : 'border-dashed border-slate-300'
//           } rounded-2xl hover:border-emerald-400 transition-all cursor-pointer bg-slate-50 hover:bg-emerald-50`}
//         >
//           <div className="flex items-center gap-4">
//             <div
//               className={`p-3 rounded-xl ${
//                 formData[field.name]
//                   ? 'bg-emerald-100'
//                   : error
//                     ? 'bg-red-100'
//                     : 'bg-slate-100'
//               }`}
//             >
//               <svg
//                 className={`w-5 h-5 ${
//                   formData[field.name]
//                     ? 'text-emerald-600'
//                     : error
//                       ? 'text-red-600'
//                       : 'text-slate-500'
//                 }`}
//                 fill="none"
//                 stroke="currentColor"
//                 viewBox="0 0 24 24"
//               >
//                 <path
//                   strokeLinecap="round"
//                   strokeLinejoin="round"
//                   strokeWidth={2}
//                   d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
//                 />
//               </svg>
//             </div>
//             <div>
//               <p className="font-semibold text-slate-900 text-sm">
//                 {formData[field.name] instanceof File
//                   ? formData[field.name].name
//                   : field.placeholder || 'Choose File'}
//               </p>
//               <p className="text-xs text-slate-500 mt-1">
//                 {formData[field.name] instanceof File
//                   ? `Uploaded ${formatFileSize(formData[field.name].size)}`
//                   : 'No file chosen'}
//               </p>
//             </div>
//           </div>
//           <button
//             type="button"
//             className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-medium rounded-lg transition-colors"
//             onClick={() => fileInputRefs.current[field.name]?.click()}
//           >
//             Browse
//           </button>
//         </div>
//       </div>
//       <p className="text-xs text-slate-500 mt-2">
//         {field.allowed_type ? `Allowed types: ${field.allowed_type}` : 'All file types'}
//         {field.max_length ? ` (Max ${field.max_length}MB)` : ''}
//       </p>
//       {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
//     </div>
//   );

//       case 'checkbox':
//         return (
//           <div key={field.name} className="flex items-start gap-3">
//             <input
//               type="checkbox"
//               name={field.name}
//               id={field.name}
//               checked={!!formData[field.name]}
//               onChange={handleInputChange}
//               className="mt-1 w-4 h-4 text-emerald-600 bg-white border-slate-300 rounded focus:ring-emerald-500"
//             />
//             <label htmlFor={field.name} className="text-sm text-slate-700">
//               {field.label} {field.required === 1 ? <span className="text-red-500">*</span> : ''}
//             </label>
//             {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
//           </div>
//         );

//       default:
//         return (
//           <div key={field.name}>
//             <label className="block text-sm font-semibold text-slate-900 mb-2">
//               {field.label} {field.required === 1 ? <span className="text-red-500">*</span> : ''}
//             </label>
//             <input
//               type="text"
//               name={field.name}
//               required={field.required === 1}
//               value={formData[field.name] || ''}
//               onChange={handleInputChange}
//               className={`w-full px-4 py-3.5 border ${
//                 error ? 'border-red-300' : 'border-slate-300'
//               } rounded-2xl focus:ring-3 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all text-sm placeholder-slate-500 hover:border-slate-400`}
//               placeholder={field.placeholder}
//             />
//             {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
//           </div>
//         );
//     }
//   };

//   // Render dynamic form sections
//   const renderDynamicForm = () => {
//     if (
//       !jobDetails?.result ||
//       !Array.isArray(jobDetails.result) ||
//       jobDetails.result.length === 0
//     ) {
//       // Fallback to default form
//       return (
//         <div className="space-y-6">
//           <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
//             <div>
//               <label className="block text-sm font-semibold text-slate-900 mb-2">
//                 Name <span className="text-red-500">*</span>
//               </label>
//               <input
//                 type="text"
//                 name="name"
//                 required
//                 value={formData.name || ''}
//                 onChange={handleInputChange}
//                 className={`w-full px-4 py-3.5 border ${
//                   formErrors.name ? 'border-red-300' : 'border-slate-300'
//                 } rounded-2xl focus:ring-3 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all text-sm placeholder-slate-500 hover:border-slate-400`}
//                 placeholder="Your full name"
//               />
//               {formErrors.name && <p className="mt-1 text-sm text-red-600">{formErrors.name}</p>}
//             </div>

//             <div>
//               <label className="block text-sm font-semibold text-slate-900 mb-2">
//                 Email <span className="text-red-500">*</span>
//               </label>
//               <input
//                 type="email"
//                 name="email"
//                 required
//                 value={formData.email || ''}
//                 onChange={handleInputChange}
//                 className={`w-full px-4 py-3.5 border ${
//                   formErrors.email ? 'border-red-300' : 'border-slate-300'
//                 } rounded-2xl focus:ring-3 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all text-sm placeholder-slate-500 hover:border-slate-400`}
//                 placeholder="your.email@example.com"
//               />
//               {formErrors.email && <p className="mt-1 text-sm text-red-600">{formErrors.email}</p>}
//             </div>
//           </div>

//           <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
//             <div>
//               <label className="block text-sm font-semibold text-slate-900 mb-2">
//                 Mobile <span className="text-red-500">*</span>
//               </label>
//               <input
//                 type="tel"
//                 name="mobile"
//                 required
//                 value={formData.mobile || ''}
//                 onChange={handleInputChange}
//                 className={`w-full px-4 py-3.5 border ${
//                   formErrors.mobile ? 'border-red-300' : 'border-slate-300'
//                 } rounded-2xl focus:ring-3 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all text-sm placeholder-slate-500 hover:border-slate-400`}
//                 placeholder="Your phone number"
//               />
//               {formErrors.mobile && (
//                 <p className="mt-1 text-sm text-red-600">{formErrors.mobile}</p>
//               )}
//             </div>

//             <div>
//               <label className="block text-sm font-semibold text-slate-900 mb-2">Experience</label>
//               <input
//                 type="text"
//                 name="experience"
//                 value={formData.experience || ''}
//                 onChange={handleInputChange}
//                 className="w-full px-4 py-3.5 border border-slate-300 rounded-2xl focus:ring-3 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all text-sm placeholder-slate-500 hover:border-slate-400"
//                 placeholder="e.g., 2 years"
//               />
//             </div>
//           </div>

//           <div>
//             <label className="block text-sm font-semibold text-slate-900 mb-2">Address</label>
//             <textarea
//               name="address"
//               value={formData.address || ''}
//               onChange={handleInputChange}
//               rows={2}
//               className="w-full px-4 py-3.5 border border-slate-300 rounded-2xl focus:ring-3 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all text-sm placeholder-slate-500 hover:border-slate-400 resize-none"
//               placeholder="Your address"
//             />
//           </div>

//           <div>
//             <label className="block text-sm font-semibold text-slate-900 mb-2">
//               Upload Resume <span className="text-red-500">*</span>
//             </label>
//             <div
//               className="relative"
//               onDragOver={(e) => handleDragOver(e, 'resume')}
//               onDrop={(e) => handleDrop(e, 'resume')}
//             >
//               <input
//                 ref={(el) => (fileInputRefs.current['resume'] = el)}
//                 type="file"
//                 name="resume"
//                 accept={uploadConfig.allowedTypes.map((t) => `.${t.toLowerCase()}`).join(',')}
//                 required
//                 onChange={(e) => handleFileChange(e, 'resume')}
//                 className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
//               />
//               <div
//                 className={`flex items-center justify-between px-6 py-5 border-2 ${
//                   formData['resume']
//                     ? 'border-emerald-500 bg-emerald-50'
//                     : formErrors['resume']
//                       ? 'border-red-300 bg-red-50'
//                       : 'border-dashed border-slate-300'
//                 } rounded-2xl hover:border-emerald-400 transition-all cursor-pointer bg-slate-50 hover:bg-emerald-50`}
//               >
//                 <div className="flex items-center gap-4">
//                   <div
//                     className={`p-3 rounded-xl ${
//                       formData['resume']
//                         ? 'bg-emerald-100'
//                         : formErrors['resume']
//                           ? 'bg-red-100'
//                           : 'bg-slate-100'
//                     }`}
//                   >
//                     <svg
//                       className={`w-5 h-5 ${
//                         formData['resume']
//                           ? 'text-emerald-600'
//                           : formErrors['resume']
//                             ? 'text-red-600'
//                             : 'text-slate-500'
//                       }`}
//                       fill="none"
//                       stroke="currentColor"
//                       viewBox="0 0 24 24"
//                     >
//                       <path
//                         strokeLinecap="round"
//                         strokeLinejoin="round"
//                         strokeWidth={2}
//                         d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
//                       />
//                     </svg>
//                   </div>
//                   <div>
//                     <p className="font-semibold text-slate-900 text-sm">
//                       {formData['resume'] instanceof File
//                         ? formData['resume'].name
//                         : 'Choose Resume'}
//                     </p>
//                     <p className="text-xs text-slate-500 mt-1">
//                       {formData['resume'] instanceof File
//                         ? `Uploaded (${(formData['resume'].size / 1024 / 1024).toFixed(2)} MB)`
//                         : 'No file chosen'}
//                     </p>
//                   </div>
//                 </div>
//                 <button
//                   type="button"
//                   className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-medium rounded-lg transition-colors"
//                   onClick={() => fileInputRefs.current['resume']?.click()}
//                 >
//                   Browse
//                 </button>
//               </div>
//             </div>
//             <p className="text-xs text-slate-500 mt-2">
//               {uploadConfig.allowedTypes.map((t) => t.toUpperCase()).join(', ')} (Max{' '}
//               {uploadConfig.maxSize}MB)
//             </p>
//             {formErrors['resume'] && (
//               <p className="mt-1 text-sm text-red-600">{formErrors['resume']}</p>
//             )}
//           </div>

//           <div>
//             <label className="block text-sm font-semibold text-slate-900 mb-2">Cover Letter</label>
//             <textarea
//               name="cover_letter"
//               value={formData.cover_letter || ''}
//               onChange={handleInputChange}
//               rows={4}
//               className="w-full px-4 py-3.5 border border-slate-300 rounded-2xl focus:ring-3 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all text-sm placeholder-slate-500 hover:border-slate-400 resize-none"
//               placeholder="Tell us about your experience, skills, and why you're interested in this role..."
//             />
//           </div>
//         </div>
//       );
//     }

//     return (
//       <div className="space-y-8">
//         {jobDetails.result.map((section: FormSection, sectionIndex: number) => {
//           if (!section.children || !Array.isArray(section.children)) {
//             return null;
//           }

//           return (
//             <div
//               key={sectionIndex}
//               className={`grid grid-cols-1 ${
//                 section.width === '100%' ? 'lg:grid-cols-1' : 'lg:grid-cols-2'
//               } gap-${section.gap || 4}`}
//               style={{
//                 justifyContent: section.justify || 'start',
//               }}
//             >
//               {section.children.map((field: FormField) => (
//                 <div
//                   key={field.name}
//                   className={section.width === '100%' ? 'col-span-full mb-2' : 'mb-2'}
//                 >
//                   {renderFormField(field)}
//                 </div>
//               ))}
//             </div>
//           );
//         })}
//       </div>
//     );
//   };

//   // Get institute data safely
//   const getInstituteLogo = () => {
//     if (!institute?.header?.academic_logo) return '';
//     return institute.header.academic_logo;
//   };

//   const getInstituteAddress = () => {
//     return institute?.footer?.academic_address || '';
//   };

//   const getInstituteName = () => {
//     if (institute?.header?.academic_name) {
//       return institute.header.academic_name;
//     }
//     return jobDetails?.academic_name || '';
//   };

//   const getHRContactEmail = () => {
//     if (institute?.hr_email) {
//       return institute.hr_email;
//     }
//     if (institute?.contact_email) {
//       return institute.contact_email;
//     }
//     if (institute?.footer?.academic_email) {
//       return institute.footer.academic_email;
//     }

//     const companyName = jobDetails?.company_name || '';
//     if (companyName) {
//       const domain = companyName
//         .toLowerCase()
//         .replace(/[^\w\s]/g, '')
//         .replace(/\s+/g, '');
//       return `careers@${domain}.com`;
//     }

//     return 'careers@example.com';
//   };

//   // Get job location from institute data
//   const getJobLocation = () => {
//     // if (!institute?.jobs || !jobId) return jobDetails?.location || '';

//     // const currentJob = institute.jobs.find(job => job.id === parseInt(jobId));

//     if (jobDetails?.job_meta_names?.Location) {
//       return jobDetails.job_meta_names.Location;
//     }

//     return jobDetails?.location || jobDetails?.location || '';
//   };

//   // Render job requirements if available
//   const renderJobRequirements = () => {
//     if (!jobDetails?.requirements || jobDetails.requirements.length === 0) {
//       return null;
//     }

//     return (
//       <div className="mt-6">
//         <h3 className="text-lg font-bold text-slate-900 mb-3">Requirements:</h3>
//         <ul className="space-y-2">
//           {jobDetails.requirements.map((req, index) => (
//             <li key={index} className="flex items-start gap-2">
//               <svg
//                 className="w-5 h-5 text-emerald-500 flex-shrink-0 mt-0.5"
//                 fill="none"
//                 stroke="currentColor"
//                 viewBox="0 0 24 24"
//               >
//                 <path
//                   strokeLinecap="round"
//                   strokeLinejoin="round"
//                   strokeWidth={2}
//                   d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
//                 />
//               </svg>
//               <span className="text-slate-700">{req}</span>
//             </li>
//           ))}
//         </ul>
//       </div>
//     );
//   };

//   // Render job responsibilities if available
//   const renderJobResponsibilities = () => {
//     if (!jobDetails?.responsibilities || jobDetails.responsibilities.length === 0) {
//       return null;
//     }

//     return (
//       <div className="mt-6">
//         <h3 className="text-lg font-bold text-slate-900 mb-3">Responsibilities:</h3>
//         <ul className="space-y-2">
//           {jobDetails.responsibilities.map((resp, index) => (
//             <li key={index} className="flex items-start gap-2">
//               <svg
//                 className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5"
//                 fill="none"
//                 stroke="currentColor"
//                 viewBox="0 0 24 24"
//               >
//                 <path
//                   strokeLinecap="round"
//                   strokeLinejoin="round"
//                   strokeWidth={2}
//                   d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
//                 />
//               </svg>
//               <span className="text-slate-700">{resp}</span>
//             </li>
//           ))}
//         </ul>
//       </div>
//     );
//   };

//   // Render job metadata if available
//   const renderJobMetadata = () => {
//     const metadata = [];

//     const jobLocation = getJobLocation();
//     if (jobLocation) {
//       metadata.push({
//         label: 'Location',
//         value: jobLocation,
//         icon: (
//           <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//             <path
//               strokeLinecap="round"
//               strokeLinejoin="round"
//               strokeWidth={2}
//               d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
//             />
//             <path
//               strokeLinecap="round"
//               strokeLinejoin="round"
//               strokeWidth={2}
//               d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
//             />
//           </svg>
//         ),
//       });
//     }

//     // Get job type from institute data if available
//     const currentJob = institute?.jobs?.find((job) => job.id === parseInt(jobId || '0'));
//     const jobType = currentJob?.job_meta_names?.['Job Type'] || jobDetails?.job_type;
//     if (jobType) {
//       metadata.push({
//         label: 'Job Type',
//         value: jobType,
//         icon: (
//           <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//             <path
//               strokeLinecap="round"
//               strokeLinejoin="round"
//               strokeWidth={2}
//               d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
//             />
//           </svg>
//         ),
//       });
//     }

//     // Get experience from institute data if available
//     const experience = currentJob?.job_meta_names?.Experience || jobDetails?.experience;
//     if (experience) {
//       metadata.push({
//         label: 'Experience',
//         value: experience,
//         icon: (
//           <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//             <path
//               strokeLinecap="round"
//               strokeLinejoin="round"
//               strokeWidth={2}
//               d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
//             />
//           </svg>
//         ),
//       });
//     }

//     if (jobDetails?.salary) {
//       metadata.push({
//         label: 'Salary',
//         value: jobDetails.salary,
//         icon: (
//           <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//             <path
//               strokeLinecap="round"
//               strokeLinejoin="round"
//               strokeWidth={2}
//               d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
//             />
//           </svg>
//         ),
//       });
//     }

//     if (jobDetails?.deadline) {
//       metadata.push({
//         label: 'Deadline',
//         value: new Date(jobDetails.deadline).toLocaleDateString('en-IN'),
//         icon: (
//           <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//             <path
//               strokeLinecap="round"
//               strokeLinejoin="round"
//               strokeWidth={2}
//               d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
//             />
//           </svg>
//         ),
//       });
//     }

//     if (metadata.length === 0) return null;

//     return (
//       <div className="mt-6">
//         <h3 className="text-lg font-bold text-slate-900 mb-3">Job Details</h3>
//         <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
//           {metadata.map((item, index) => (
//             <div
//               key={index}
//               className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl border border-slate-200"
//             >
//               <div className="text-slate-500">{item.icon}</div>
//               <div>
//                 <p className="text-xs text-slate-500">{item.label}</p>
//                 <p className="font-semibold text-slate-900">{item.value}</p>
//               </div>
//             </div>
//           ))}
//         </div>
//       </div>
//     );
//   };

//   const isLoading = loading || instituteLoading;

//   if (isLoading) {
//     return (
//       <Loader />
//     );
//   }

//   if (error || !jobDetails) {
//     return (
//       <div className="min-h-screen flex items-center justify-center bg-slate-50">
//         <div className="text-center p-8">
//           <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
//             <svg
//               className="w-8 h-8 text-red-600"
//               fill="none"
//               stroke="currentColor"
//               viewBox="0 0 24 24"
//             >
//               <path
//                 strokeLinecap="round"
//                 strokeLinejoin="round"
//                 strokeWidth={2}
//                 d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
//               />
//             </svg>
//           </div>
//           <h3 className="text-xl font-bold text-slate-900 mb-2">Page Not Found</h3>
//           <p className="text-slate-600 mb-6">
//             {error || 'The job you are looking for does not exist.'}
//           </p>
//           <button
//             onClick={() => navigate(-1)}
//             className="px-6 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
//           >
//             Go Back
//           </button>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen flex flex-col bg-slate-50">
//       {/* Dynamic Header */}
//       <Header
//         logo={getInstituteLogo()}
//         address={getInstituteAddress()}
//         instituteName={getInstituteName()}
//         baseUrl={jobDetails?.baseUrl}
//         institute_id={instituteId}
//         primaryWebsiteUrl={institute?.academic_website}
//       />
//       {/* Main Content */}
//       <main className="flex-1 bg-gradient-to-br from-slate-50 via-white to-slate-100 py-8 px-4 sm:py-12 sm:px-6 lg:px-8">
//         <div className="max-w-7xl mx-auto">
//           {/* 50-50 Split Layout */}
//           <div className="flex flex-col lg:flex-row gap-1">
//             {/* Left Column - Job Description (50%) */}
//             <div className="lg:w-7/12">
//               <div className="bg-white rounded-3xl shadow-xl border border-slate-200 p-6 sm:p-8 h-full">
//                 <div className="">
//                   <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-3">
//                     {jobDetails.job_title}
//                   </h1>
//                   <div className="flex items-center flex-wrap gap-3 text-slate-700 mb-2">
//                     <span className="font-semibold text-lg">{jobDetails.company_name}</span>
//                     <span className="text-slate-400">•</span>
//                     <span className="flex items-center gap-1">
//                       <svg
//                         className="w-5 h-5 text-slate-500"
//                         fill="none"
//                         stroke="currentColor"
//                         viewBox="0 0 24 24"
//                       >
//                         <path
//                           strokeLinecap="round"
//                           strokeLinejoin="round"
//                           strokeWidth={2}
//                           d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
//                         />
//                         <path
//                           strokeLinecap="round"
//                           strokeLinejoin="round"
//                           strokeWidth={2}
//                           d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
//                         />
//                       </svg>
//                       {getJobLocation() || 'Remote'}
//                     </span>
//                   </div>

//                   {/* Job Metadata */}
//                   <div className="grid grid-cols-2 gap-4 mb-8">
//                     {(() => {
//                       const currentJob = institute?.jobs?.find(
//                         (job) => job.id === parseInt(jobId || '0'),
//                       );
//                       const jobType =
//                         currentJob?.job_meta_names?.['Job Type'] || jobDetails.job_type;
//                       const experience =
//                         currentJob?.job_meta_names?.Experience || jobDetails.experience;

//                       return (
//                         <>
//                           {jobType && (
//                             <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
//                               <p className="text-xs text-slate-500 mb-1">Job Type</p>
//                               <p className="font-semibold text-slate-900">{jobType}</p>
//                             </div>
//                           )}
//                           {experience && (
//                             <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
//                               <p className="text-xs text-slate-500 mb-1">Experience</p>
//                               <p className="font-semibold text-slate-900">{experience}</p>
//                             </div>
//                           )}
//                           {jobDetails.salary && (
//                             <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
//                               <p className="text-xs text-slate-500 mb-1">Salary</p>
//                               <p className="font-semibold text-slate-900">{jobDetails.salary}</p>
//                             </div>
//                           )}
//                           {jobDetails.deadline && (
//                             <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
//                               <p className="text-xs text-slate-500 mb-1">Deadline</p>
//                               <p className="font-semibold text-slate-900">
//                                 {new Date(jobDetails.deadline).toLocaleDateString('en-IN')}
//                               </p>
//                             </div>
//                           )}
//                         </>
//                       );
//                     })()}
//                   </div>
//                 </div>

//                 {/* Job Description */}
//                 <div className="">
//                   <h2 className="text-xl font-bold text-slate-900 mb-4 pb-3 border-b border-slate-300">
//                     Job Description
//                   </h2>
//                   {jobDetails.description ? (
//                     <div
//                       className="prose prose-slate max-w-none
//              [&_ul]:list-disc [&_ul]:!ml-6 [&_ul]:mb-4
//              [&_ol]:list-decimal [&_ol]:!ml-6 [&_ol]:mb-4
//              [&_li]:mb-2 [&_p]:mb-4"
//                       dangerouslySetInnerHTML={{ __html: jobDetails.description }}
//                     />
//                   ) : (
//                     <p className="text-slate-700 mb-6">
//                       We are looking for an experienced professional with strong expertise in
//                       development.
//                     </p>
//                   )}
//                 </div>

//                 {/* Requirements */}
//                 {renderJobRequirements()}

//                 {/* Responsibilities */}
//                 {renderJobResponsibilities()}

//                 {/* Render Job Metadata */}
//                 {renderJobMetadata()}

//                 {/* Contact Information */}
//                 <div className="bg-gradient-to-r from-emerald-50 to-slate-50 border border-emerald-100 rounded-2xl p-6 mt-8">
//                   <h4 className="font-bold text-slate-900 mb-2">📧 Need Help?</h4>
//                   <p className="text-sm text-slate-600 mb-3">
//                     Have questions about this role? Contact our HR team
//                   </p>
//                   <a
//                     href={`mailto:${getHRContactEmail()}`}
//                     className="inline-flex items-center gap-2 text-emerald-600 font-semibold hover:text-emerald-700"
//                   >
//                     <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                       <path
//                         strokeLinecap="round"
//                         strokeLinejoin="round"
//                         strokeWidth={2}
//                         d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
//                       />
//                     </svg>
//                     {getHRContactEmail()}
//                   </a>
//                 </div>
//               </div>
//             </div>

//             {/* Right Column - Application Form (50%) */}
//             <div className="lg:w-5/12">
//               <div className="bg-white rounded-3xl shadow-xl border border-slate-200 p-6 sm:p-8 sticky top-6">
//                 {/* Form Header */}
//                 <div className="text-center">
//                 </div>

//                 {/* Application Form Title */}
//                 <div className="border-b border-slate-200 pb-4 mb-6">
//                   <h3 className="text-xl font-bold text-slate-900">Apply Now</h3>
//                 </div>

//                 {/* Dynamic Form */}
//                 <form onSubmit={handleSubmit} className="space-y-6">
//                   {renderDynamicForm()}

//                   {/* Terms and Conditions */}
//                   <div className="flex items-start gap-3 p-4 bg-slate-50 rounded-xl border border-slate-200">
//                     <input
//                       type="checkbox"
//                       id="terms"
//                       required
//                       className="mt-1 w-4 h-4 text-emerald-600 bg-white border-slate-300 rounded focus:ring-emerald-500"
//                     />
//                     <div dangerouslySetInnerHTML={{ __html: jobDetails.terms_consent_text || 'Please accept terms and conditions'   }} />
//                   </div>

//                   {/* Submit button */}
//                   <button
//                     type="submit"
//                     disabled={isSubmitting}
//                     className={`w-full bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 text-white font-bold py-4 px-8 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 flex items-center justify-center gap-3 border border-emerald-500/30 ${
//                       isSubmitting ? 'opacity-75 cursor-not-allowed' : ''
//                     }`}
//                   >
//                     {isSubmitting ? (
//                       <>
//                         <svg
//                           className="animate-spin w-5 h-5 text-white"
//                           fill="none"
//                           viewBox="0 0 24 24"
//                         >
//                           <circle
//                             className="opacity-25"
//                             cx="12"
//                             cy="12"
//                             r="10"
//                             stroke="currentColor"
//                             strokeWidth="4"
//                           ></circle>
//                           <path
//                             className="opacity-75"
//                             fill="currentColor"
//                             d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
//                           ></path>
//                         </svg>
//                         Submitting...
//                       </>
//                     ) : (
//                       <>SUBMIT APPLICATION</>
//                     )}
//                   </button>
//                 </form>
//               </div>
//             </div>
//           </div>
//         </div>
//       </main>

//       {/* Dynamic Footer */}
//       <Footer
//         baseUrl={jobDetails?.baseUrl}
//         instituteName={getInstituteName()}
//         institute={institute}
//         footerData={institute?.footer}
//         developedBy={jobDetails?.developed_by}
//       />

//       {/* Success Popup Modal */}
//       <SuccessPopup
//         isOpen={showSuccessPopup}
//         onClose={handleSuccessPopupClose}
//         referenceId={referenceId}
//         jobTitle={jobDetails.job_title}
//         companyName={jobDetails.company_name}
//         message={jobDetails.success_message}
//       />
//     </div>
//   );
// };

// export default ApplyJobPage;
