import React, { useState, useEffect } from 'react';
import { Button, Card, Textarea, Label, FileInput } from 'flowbite-react';
import axios from 'axios';
import AcademicDropdown from 'src/Frontend/Common/AcademicDropdown';
import DegreeDropdown from 'src/Frontend/Common/DegreeDropdown';
import TemplateDropdown from 'src/Frontend/Common/TemplateDropdown';
import { useAuth } from 'src/hook/useAuth';
import toast from 'react-hot-toast';
import RouteDropdown from 'src/Frontend/Common/RouteDropdown';
import AllAcademicsDropdown from 'src/Frontend/Common/AllAcademicsDropdown';

const apiUrl = import.meta.env.VITE_API_URL;

// Define types for form modes
type FormMode = 'default' | 'custom_template' | 'excel_upload';

// Define Template type
interface Template {
  id: number;
  name: string;
  whatsapp_content?: string;
  email_content?: string;
  sms_content?: string;
}

const CampaignForm: React.FC = () => {
  const { user } = useAuth();
  const [formMode, setFormMode] = useState<FormMode>('default');
  const [templateId, setTemplateId] = useState<string>("");
  const [academicId, setAcademicId] = useState<string>("");
  const [degreeId, setDegreeId] = useState<string>("");
  const [studentPerformance, setStudentPerformance] = useState<string>("");
  const [channels, setChannels] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [excelFile, setExcelFile] = useState<File | null>(null);
  const [templates, setTemplates] = useState<Template[]>([]);
  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(null);
  
  // Custom template form data
  const [customTemplateData, setCustomTemplateData] = useState({
    whatsapp_body: "Hello {#name#}, your Roll No is {#roll_no#}. Congrats!",
    email_body: "Dear {#name#},<br>Your roll number is {#roll_no#}.<br>Regards, Academic Dept.",
    sms_body: "Hi {#name#}, Roll No {#roll_no#} - Check your result online."
  });

  // Fetch templates on component mount
  useEffect(() => {
    fetchTemplates();
  }, []);


  const isFormValid = (): boolean => {
    // Always need at least one channel
    if (channels.length === 0) {
      return false;
    }

    // Check required fields based on form mode
    if (formMode === 'default') {
      // Default mode requires: template, academic, degree, performance
      if (!templateId || !academicId || !degreeId || !studentPerformance) {
        return false;
      }
      
      // Check if template has content for selected channels
      if (channels.includes('whatsapp') && !selectedTemplate?.wtsp_body?.trim()) {
        return false;
      }
      if (channels.includes('email') && !selectedTemplate?.email_body?.trim()) {
        return false;
      }
      if (channels.includes('sms') && !selectedTemplate?.sms_body?.trim()) {
        return false;
      }
      
      return true;
      
    } else if (formMode === 'custom_template') {
      // Custom template requires: academic, degree, performance
      if (!academicId || !degreeId || !studentPerformance) {
        return false;
      }
      
      // Check custom template content for selected channels
      if (channels.includes('whatsapp') && !customTemplateData.whatsapp_body.trim()) {
        return false;
      }
      if (channels.includes('email') && !customTemplateData.email_body.trim()) {
        return false;
      }
      if (channels.includes('sms') && !customTemplateData.sms_body.trim()) {
        return false;
      }
      
      return true;
      
    } else if (formMode === 'excel_upload') {
      // Excel upload requires: academic, excel file
      if (!academicId || !excelFile) {
        return false;
      }
      
      // Check if content exists for selected channels (from selectedTemplate)
      if (selectedTemplate) {
        if (channels.includes('whatsapp') && !selectedTemplate.wtsp_body?.trim()) {
          return false;
        }
        if (channels.includes('email') && !selectedTemplate.email_body?.trim()) {
          return false;
        }
        if (channels.includes('sms') && !selectedTemplate.sms_body?.trim()) {
          return false;
        }
      }
      
      return true;
    }
    
    return false;
  };



  // Fetch templates from API
  const fetchTemplates = async () => {
    try {
      const response = await axios.get(
        `${apiUrl}/${user?.role}/templates`, // Adjust this endpoint as needed
        {
          headers: {
            'Authorization': `Bearer ${user?.token}`,
          }
        }
      );
      
      if (response.data.status) {
        setTemplates(response.data.data || []);
      }
    } catch (error) {
      console.error('Error fetching templates:', error);
    }
  };

  // Fetch template details when templateId changes
  useEffect(() => {
    if (templateId && formMode !== 'custom_template') {
      fetchTemplateDetails(templateId);
    } else {
      setSelectedTemplate(null);
    }
  }, [templateId, formMode]);

  // Fetch specific template details
  const fetchTemplateDetails = async (id: string) => {
    try {
      const response = await axios.get(
        `${apiUrl}/${user?.role}/Campaign/templates/${id}`, // Adjust this endpoint as needed
        {
          headers: {
            'Authorization': `Bearer ${user?.token}`,
          }
        }
      );
      
      if (response.data.status) {
        setSelectedTemplate(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching template details:', error);
      setSelectedTemplate(null);
    }
  };

  // Student performance options
  const performanceOptions = [
    { value: "1", label: "Captured" },
    { value: "2", label: "Initialized" },
    { value: "3", label: "All records" }
  ];

  // Handle channel selection
  const handleChannelChange = (channel: string) => {
    setChannels(prev => 
      prev.includes(channel) 
        ? prev.filter(c => c !== channel)
        : [...prev, channel]
    );
  };

  // Handle template selection with custom template option
  const handleTemplateChange = (value: string) => {
    if (value == "custom") {
      setFormMode('custom_template');
      setTemplateId("");
      setSelectedTemplate(null);
    } else {
      console.log(value); 
      // setFormMode('default');
      setTemplateId(value);
    }
  };

  // Handle custom template input change
  const handleCustomTemplateChange = (field: keyof typeof customTemplateData, value: string) => {
    setCustomTemplateData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Handle file upload
  const handleFileUpload3 = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const validExtensions = ['.xlsx', '.xls', '.csv'];
      const fileExtension = file.name.substring(file.name.lastIndexOf('.')).toLowerCase();
      
      if (!validExtensions.includes(fileExtension)) {
        toast.error('Please upload a valid Excel file (.xlsx, .xls, .csv)');
        e.target.value = '';
        return;
      }
      
      setExcelFile(file);
      toast.success('File selected successfully');
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
  const file = e.target.files?.[0];
  console.log('File selected:', file); // Debug log
  
  if (file) {
    const validExtensions = ['.xlsx', '.xls', '.csv'];
    const fileExtension = file.name.substring(file.name.lastIndexOf('.')).toLowerCase();
    
    if (!validExtensions.includes(fileExtension)) {
      toast.error('Please upload a valid Excel file (.xlsx, .xls, .csv)');
      e.target.value = ''; // Reset input
      setExcelFile(null); // Clear state
      return;
    }
    
    setExcelFile(file);
    toast.success('File selected successfully');
  } else {
    setExcelFile(null); // Clear state if no file
  }
};

  // Handle send campaign - Simplified validation
  const handleSendCampaign = async () => {
    // Basic validation only
    if (channels.length === 0) {
      toast.error("Please select at least one channel");
      return;
    }
    
    if (formMode === 'excel_upload' && !excelFile) {
      toast.error("Please upload Excel file");
      return;
    }

    setLoading(true);
    
    try {
      if (formMode === 'excel_upload') {
        // For Excel upload, create FormData
        const formData = new FormData();
        formData.append('s_id', user?.id || '');
        formData.append('academic_id', academicId);
        formData.append('channels', JSON.stringify(channels));
        
        // Add degree_id and student_performance_group if available
        if (degreeId) {
          formData.append('degree_id', degreeId);
        }
        if (studentPerformance) {
          formData.append('student_performance_group', studentPerformance);
        }
        
        // Add Excel file
        formData.append('excel_file', excelFile!);

        // Prepare content based on form mode
        let content: any = {};
         if (selectedTemplate) {
          // Use selected template data
          content = {
            whatsapp: selectedTemplate.wtsp_body || '',
            email: selectedTemplate.email_body || '',
            sms: selectedTemplate.sms_body || ''
          };
        }
        
        // Remove empty content entries
        const filteredContent: any = {};
        if (content.whatsapp?.trim()) filteredContent.whatsapp = content.whatsapp;
        if (content.email?.trim()) filteredContent.email = content.email;
        if (content.sms?.trim()) filteredContent.sms = content.sms;
        
        // Validate that content exists for selected channels
        for (const channel of channels) {
          if (!filteredContent[channel]?.trim()) {
            toast.error(`Please provide ${channel} message content`);
            setLoading(false);
            return;
          }
        }
        
        formData.append('content', JSON.stringify(filteredContent));

        // Send FormData for Excel upload
        const response = await axios.post(
          `${apiUrl}/${user?.role}/Campaign/send-Campaign`,
          formData,
          {
            headers: {
              'accept': '/',
              'accept-language': 'en-IN,en-GB;q=0.9,en-US;q=0.8,en;q=0.7,hi;q=0.6',
              'Authorization': `Bearer ${user?.token}`,
              'Content-Type': 'multipart/form-data',
            }
          }
        );

        if (response.data.status) {
          toast.success("Campaign sent successfully from Excel!");
          // Reset form if needed
          if (formMode === 'excel_upload') {
            setExcelFile(null);
          }
            setDegreeId("");
            setStudentPerformance("");
            setSelectedTemplate(null);
            setAcademicId('');
            setTemplateId('');
            setChannels([]);
        } else {
          toast.error(response.data.message || "Failed to send campaign");
        }
      } else {
        // For non-excel modes, send JSON
        let requestData: any = {
          s_id: user?.id,
          academic_id: parseInt(academicId),
          degree_id: parseInt(degreeId),
          student_performance_group: studentPerformance,
          channels: channels,
        };

        if (formMode === 'custom_template') {
          // Prepare content for custom template
          const content: any = {};
          if (channels.includes('whatsapp')) {
            content.whatsapp = customTemplateData.whatsapp_body;
          }
          if (channels.includes('email')) {
            content.email = customTemplateData.email_body;
          }
          if (channels.includes('sms')) {
            content.sms = customTemplateData.sms_body;
          }
          
          requestData.content = content;
        } else { // default template mode
          // Use actual template content from selectedTemplate
          const content: any = {};
          if (channels.includes('whatsapp') && selectedTemplate?.wtsp_body) {
            content.whatsapp = selectedTemplate.wtsp_body;
          }
          if (channels.includes('email') && selectedTemplate?.email_body) {
            content.email = selectedTemplate.email_body;
          }
          if (channels.includes('sms') && selectedTemplate?.sms_body) {
            content.sms = selectedTemplate.sms_body;
          }
          
          requestData.content = content;
          requestData.template_id = parseInt(templateId);
        }

        const response = await axios.post(
          `${apiUrl}/${user?.role}/Campaign/send-Campaign`,
          requestData,
          {
            headers: {
              'accept': '/',
              'accept-language': 'en-IN,en-GB;q=0.9,en-US;q=0.8,en;q=0.7,hi;q=0.6',
              'Authorization': `Bearer ${user?.token}`,
              'Content-Type': 'application/json',
            }
          }
        );

        if (response.data.status) {
          toast.success("Campaign sent successfully!");
            setDegreeId("");
            setStudentPerformance("");
            setSelectedTemplate(null);
            setAcademicId('');
            setTemplateId('');
            setChannels([]);
        } else {
          toast.error(response.data.message || "Failed to send campaign");
        }
      }
    } catch (error: any) {
      console.error('Error sending campaign:', error);
      if (error.response?.data?.message) {
        toast.error(error.response.data.message);
      } else if (error.message) {
        toast.error(error.message);
      } else {
        toast.error('Failed to send campaign');
      }
    } finally {
      setLoading(false);
    }
  };

  // Reset form when mode changes
  useEffect(() => {
    console.log(formMode);
    if (formMode === 'excel_upload') {
      // setDegreeId("");
      // setStudentPerformance("");
      // setTemplateId("");
      // setSelectedTemplate(null);
    } else if (formMode === 'custom_template') {
      // setTemplateId("");
      // setSelectedTemplate(null);
      // setExcelFile(null);
    } else {
      // setExcelFile(null);
      // setCustomTemplateData({
      //   whatsapp_body: "Hello {#name#}, your Roll No is {#roll_no#}. Congrats!",
      //   email_body: "Dear {#name#},<br>Your roll number is {#roll_no#}.<br>Regards, Academic Dept.",
      //   sms_body: "Hi {#name#}, Roll No {#roll_no#} - Check your result online."
      // });
    }
  }, [formMode]);

  // Get template content for display
  const getTemplateContent = (channel: string) => {
    console.log(selectedTemplate);
    if (formMode !== 'custom_template' && selectedTemplate) {
      if (channel === 'whatsapp' && selectedTemplate.wtsp_body) {
        return selectedTemplate.wtsp_body;
      }
      if (channel === 'email' && selectedTemplate.email_body) {
        return selectedTemplate.email_body;
      }
      if (channel === 'sms' && selectedTemplate.sms_body) {
        return selectedTemplate.sms_body;
      }
      return `No ${channel} content available for this template`;
    } else if (formMode === 'excel_upload') {
      return customTemplateData[`${channel}_body` as keyof typeof customTemplateData];
    }
    return '';
  };

  // Channel display configuration
  const channelConfig = {
    whatsapp: {
      label: "WhatsApp",
      color: "bg-green-50 border-green-200",
      icon: "📱",
      titleColor: "text-green-800"
    },
    sms: {
      label: "SMS",
      color: "bg-blue-50 border-blue-200",
      icon: "💬",
      titleColor: "text-blue-800"
    },
    email: {
      label: "Email",
      color: "bg-purple-50 border-purple-200",
      icon: "📧",
      titleColor: "text-purple-800"
    }
  };

  // Function to check if field is required based on form mode
  const isFieldRequired = (field: string): boolean => {
    switch (field) {
      case 'template':
        return formMode === 'default';
      case 'academic':
        return true; // Always required
      case 'performance':
        return formMode !== 'excel_upload';
      case 'whatsapp_body':
        return formMode === 'custom_template' && channels.includes('whatsapp');
      case 'email_body':
        return formMode === 'custom_template' && channels.includes('email');
      case 'sms_body':
        return formMode === 'custom_template' && channels.includes('sms');
      case 'excel_file':
        return formMode === 'excel_upload';
      default:
        return false;
    }
  };

  return (
    <div className="p-4 bg-white rounded-lg shadow-md">
      {/* Form Mode Selection */}
      <div className="mb-6">
        <div className="flex flex-wrap gap-4">
          <Button
            color={formMode === 'default' ? 'blue' : 'gray'}
            onClick={() => setFormMode('default')}
            className="whitespace-nowrap"
          >
            Default Template
          </Button>
          <Button
            color={formMode === 'custom_template' ? 'blue' : 'gray'}
            onClick={() => setFormMode('custom_template')}
            className="whitespace-nowrap"
          >
            Custom Template
          </Button>
          <Button
            color={formMode === 'excel_upload' ? 'blue' : 'gray'}
            onClick={() => setFormMode('excel_upload')}
            className="whitespace-nowrap"
          >
            Excel Upload
          </Button>
        </div>
      </div>

      {/* Four Dropdowns in One Line - Conditionally rendered */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        {/* Template Dropdown - Only for default mode */}
        {formMode !== 'custom_template' && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Template {isFieldRequired('template') && <span className="text-red-500">*</span>}
            </label>
            <TemplateDropdown
              value={templateId}
              onChange={handleTemplateChange}
              placeholder="Select Template"
              includeAllOption={false}
              includeCustomOption={true}
            />
            {selectedTemplate && (
              <p className="text-xs text-gray-500 mt-1">
                Selected: {selectedTemplate.name}
              </p>
            )}
          </div>
        )}

        {/* Custom Template Indicator */}
        {formMode === 'custom_template' && (
          <div className="col-span-4">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-center">
                <span className="text-blue-500 mr-2">📝</span>
                <span className="text-blue-800 font-medium">Custom Template Mode</span>
              </div>
              <p className="text-sm text-blue-600 mt-1">
                You are creating a custom template. Fill in the message templates below.
              </p>
            </div>
          </div>
        )}

        {/* Excel Upload Mode Indicator */}
        {formMode === 'excel_upload' && (
          <div className="col-span-4">
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <div className="flex items-center">
                <span className="text-green-500 mr-2">📊</span>
                <span className="text-green-800 font-medium">Excel Upload Mode</span>
              </div>
              <p className="text-sm text-green-600 mt-1">
                Upload Excel file with student data. Degree and Performance filters are not required.
              </p>
            </div>
          </div>
        )}

        {/* Academic Dropdown - Always shown */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Academic <span className="text-red-500">*</span>
          </label>
          <AllAcademicsDropdown
            value={academicId}
            onChange={setAcademicId}
            placeholder="Select Academic"
          />
        </div>

        {/* Degree Dropdown - Hidden in Excel mode */}
        
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Routes {isFieldRequired('degree') && <span className="text-red-500">*</span>}
            </label>
            <RouteDropdown  
              academicId={academicId}
              value={degreeId}
              onChange={setDegreeId}
              className="min-w-[250px] text-sm"
              isRequired
              placeholder={academicId ? "Select form page..." : "Select academic first"}
              disabled={!academicId}
            />
          </div>
        

        {/* Student Performance Dropdown - Hidden in Excel mode */}
        {formMode !== 'excel_upload' && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Payment Status {isFieldRequired('performance') && <span className="text-red-500">*</span>}
            </label>
            <select
              value={studentPerformance}
              onChange={(e) => setStudentPerformance(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              disabled={formMode === 'excel_upload'}
            >
              <option value="">Select Payment Status</option>
              {performanceOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      {/* Excel File Upload - Only in Excel mode */}
      {formMode === 'excel_upload' && (
        <div className="mb-6">
          <div className="max-w-md">
            <Label htmlFor="excel-file" className="block mb-2 font-medium">
              Upload Excel File <span className="text-red-500">*</span>
            </Label>
            <FileInput
              id="excel-file"
              accept=".xlsx,.xls,.csv"
              onChange={handleFileUpload}
              helperText="Upload Excel file with student data (.xlsx, .xls, .csv)"
            />
            
            {/* Simple download link with timestamp */}
            <p className="text-xs text-gray-500 mt-2">
              Download sample format:{" "}
              <a 
                href={`${import.meta.env.VITE_ASSET_URL}/bulk_campaign_sample.csv?ver=${Date.now()}`}
                download="bulk_campaign_sample.csv"
                className="text-blue-600 hover:text-blue-800 hover:underline"
              >
                bulk_campaign_sample.csv
              </a>
            </p>
            
            {excelFile && (
              <div className="mt-2 p-2 bg-gray-50 rounded border border-gray-200">
                <p className="text-sm text-gray-700">
                  <span className="font-medium">Selected file:</span> {excelFile.name}
                </p>
                <p className="text-xs text-gray-500">
                  Size: {(excelFile.size / 1024).toFixed(2)} KB
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Custom Template Text Areas - Only in custom template mode */}
      {formMode === 'custom_template' && (
        <div className="mb-6 space-y-4">
          <h3 className="text-lg font-semibold text-gray-800">Custom Template Content</h3>
          
          {channels.includes('whatsapp') && (
            <div>
              <Label htmlFor="whatsapp-body" className="block mb-2 font-medium">
                WhatsApp Body {isFieldRequired('whatsapp_body') && <span className="text-red-500">*</span>}
              </Label>
              <Textarea
                id="whatsapp-body"
                value={customTemplateData.whatsapp_body}
                onChange={(e) => handleCustomTemplateChange('whatsapp_body', e.target.value)}
                placeholder="Enter WhatsApp message template. Use {#variable#} for dynamic content."
                required={isFieldRequired('whatsapp_body')}
                disabled={loading}
                rows={4}
                className="resize-vertical w-full"
              />
              <p className="text-sm text-gray-500 mt-1">
                Use variables like: {'{#name#}'}, {'{#roll_no#}'}, {'{#course#}'}, etc.
              </p>
            </div>
          )}

          {channels.includes('email') && (
            <div>
              <Label htmlFor="email-body" className="block mb-2 font-medium">
                Email Body {isFieldRequired('email_body') && <span className="text-red-500">*</span>}
              </Label>
              <Textarea
                id="email-body"
                value={customTemplateData.email_body}
                onChange={(e) => handleCustomTemplateChange('email_body', e.target.value)}
                placeholder="Enter email message template. Use {#variable#} for dynamic content."
                required={isFieldRequired('email_body')}
                disabled={loading}
                rows={4}
                className="resize-vertical w-full"
              />
              <p className="text-sm text-gray-500 mt-1">
                Use variables like: {'{#name#}'}, {'{#roll_no#}'}, {'{#course#}'}, etc.
              </p>
            </div>
          )}

          {channels.includes('sms') && (
            <div>
              <Label htmlFor="sms-body" className="block mb-2 font-medium">
                SMS Body {isFieldRequired('sms_body') && <span className="text-red-500">*</span>}
              </Label>
              <Textarea
                id="sms-body"
                value={customTemplateData.sms_body}
                onChange={(e) => handleCustomTemplateChange('sms_body', e.target.value)}
                placeholder="Enter SMS message template. Use {#variable#} for dynamic content."
                required={isFieldRequired('sms_body')}
                disabled={loading}
                rows={3}
                className="resize-vertical w-full"
              />
              <p className="text-sm text-gray-500 mt-1">
                Use variables like: {'{#name#}'}, {'{#roll_no#}'}, {'{#course#}'}, etc.
              </p>
            </div>
          )}
        </div>
      )}

      {/* Three Checkboxes in One Line */}
      <div className="flex gap-6 mb-6">
        {['whatsapp', 'sms', 'email'].map((channel) => (
          <label 
            key={channel}
            className={`flex items-center space-x-2 p-3 rounded-lg border-2 transition-all cursor-pointer ${
              channels.includes(channel) 
                ? 'bg-gray-100 border-blue-500 shadow-md' 
                : 'bg-gray-50 border-gray-200 hover:bg-gray-100'
            }`}
          >
            <input
              type="checkbox"
              checked={channels.includes(channel)}
              onChange={() => handleChannelChange(channel)}
              className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              disabled={loading}
            />
            <span className={`text-sm font-medium ${
              channels.includes(channel) ? 'text-blue-700' : 'text-gray-700'
            }`}>
              {channel === 'whatsapp' ? 'WhatsApp' : 
               channel === 'sms' ? 'SMS' : 'Email'}
            </span>
          </label>
        ))}
      </div>

      {/* Channel Data Boxes - Show actual template content in default mode */}
      {channels.length > 0 && formMode !== 'custom_template' && (
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            {formMode === 'default' && selectedTemplate 
              ? `Template: ${selectedTemplate.name}` 
              : 'Channel Content'}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {channels.map((channel) => {
              const content = getTemplateContent(channel);
              return (
                <Card 
                  key={channel}
                  className={`${channelConfig[channel as keyof typeof channelConfig].color} border-2`}
                >
                  <div className="flex items-center mb-3">
                    <span className="text-lg mr-2">
                      {channelConfig[channel as keyof typeof channelConfig].icon}
                    </span>
                    <h4 className={`font-semibold ${channelConfig[channel as keyof typeof channelConfig].titleColor}`}>
                      {channelConfig[channel as keyof typeof channelConfig].label} Content
                    </h4>
                  </div>
                  <div className="bg-white p-3 rounded border border-gray-200 min-h-[120px]">
                    {content ? (
                      <pre className="text-sm text-gray-700 whitespace-pre-wrap">
                        {content}
                      </pre>
                    ) : (
                      <p className="text-sm text-gray-500 italic">
                        No content available for this channel
                      </p>
                    )}
                  </div>
                  {content && (
                    <div className="mt-2 text-xs text-gray-500">
                      Variables detected: {extractVariables(content).join(', ') || 'None'}
                    </div>
                  )}
                </Card>
              );
            })}
          </div>
        </div>
      )}

      {/* Send Campaign Button */}
      <div className="flex justify-end">
        <Button
          onClick={handleSendCampaign}
           disabled={loading || !isFormValid()}
          gradientDuoTone="cyanToBlue"
          className="whitespace-nowrap"
        >
          {loading ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
              Sending Campaign...
            </>
          ) : (
            'Send Campaign'
          )}
        </Button>
      </div>
    </div>
  );
};

// Helper function to extract variables from content
const extractVariables = (content: string): string[] => {
  const variableRegex = /\{#([^#]+)#\}/g;
  const matches = content.match(variableRegex);
  return matches ? [...new Set(matches)] : [];
};

export default CampaignForm;