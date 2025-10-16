

import React, { useState } from 'react';
import { Button, Card } from 'flowbite-react';
import axios from 'axios';
import AcademicDropdown from 'src/Frontend/Common/AcademicDropdown';
import DegreeDropdown from 'src/Frontend/Common/DegreeDropdown';
import TemplateDropdown from 'src/Frontend/Common/TemplateDropdown';
import { useAuth } from 'src/hook/useAuth';
import toast from 'react-hot-toast';

const CampaignForm: React.FC = () => {
  const { user } = useAuth();
  const [templateId, setTemplateId] = useState<string>("");
  const [academicId, setAcademicId] = useState<string>("");
  const [degreeId, setDegreeId] = useState<string>("");
  const [studentPerformance, setStudentPerformance] = useState<string>("");
  const [channels, setChannels] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  
  // Channel data state
  const [channelData, setChannelData] = useState({
    whatsapp: "Hello {#name#}, your Roll No is {#roll_no#}. Congrats!",
    sms: "Hi {#name#}, Roll No {#roll_no#} - Check your result online.",
    email: "Dear {#name#},<br>Your roll number is {#roll_no#}.<br>Regards, Academic Dept."
  });

  // Student performance options
  const performanceOptions = [
    { value: "1", label: "Pass Student" },
    { value: "2", label: "Fail Student" },
    { value: "3", label: "All Students" }
  ];

  // Handle channel selection with blue highlight
  const handleChannelChange = (channel: string) => {
    setChannels(prev => 
      prev.includes(channel) 
        ? prev.filter(c => c !== channel)
        : [...prev, channel]
    );
  };

  // Handle send campaign using axios
  const handleSendCampaign = async () => {
    if (!templateId || !academicId || !degreeId || !studentPerformance || channels.length === 0) {
      toast.error("Please fill all fields and select at least one channel");
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post(
        'https://rainbowsolutionandtechnology.com/NewAdmissionPortal/public/api/SuperAdmin/Campaign/send-Campaign',
        {
          s_id: user?.id,
          template_id: parseInt(templateId),
          academic_id: parseInt(academicId),
          degree_id: parseInt(degreeId),
          student_performance_group: studentPerformance,
          channels: channels,
          content: channelData
        },
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
      } else {
        toast.error(response.data.message || "Failed to send campaign");
      }
    } catch (error: any) {
      console.error('Error sending campaign:', error);
      if (error.response?.data?.message) {
        toast.error(error.response.data.message);
      } else {
        toast.error('Failed to send campaign');
      }
    } finally {
      setLoading(false);
    }
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

  return (
    <div className="p-4 bg-white rounded-lg shadow-md">
      {/* Four Dropdowns in One Line */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        {/* Template Dropdown */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Template</label>
          <TemplateDropdown
            value={templateId}
            onChange={(value) => {
              console.log("Selected Template ID:", value);
              setTemplateId(value);
            }}
            placeholder="Select Template"
            includeAllOption={false}
          />
        </div>

        {/* Academic Dropdown */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Academic</label>
          <AcademicDropdown
            value={academicId}
            onChange={setAcademicId}
            placeholder="Select Academic"
          />
        </div>

        {/* Degree Dropdown */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Degree</label>
          <DegreeDropdown
            value={degreeId}
            onChange={setDegreeId}
            academicId={academicId}
            placeholder="Select Degree"
            disabled={!academicId}
          />
        </div>

        {/* Student Performance Dropdown */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Student Performance</label>
          <select
            value={studentPerformance}
            onChange={(e) => setStudentPerformance(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Select Performance</option>
            {performanceOptions.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Three Checkboxes in One Line with Blue Highlight */}
      <div className="flex gap-6 mb-6">
        {['whatsapp', 'sms', 'email'].map((channel) => (
          <label 
            key={channel}
            className={`flex items-center space-x-2 p-3 rounded-lg border-2 transition-all cursor-pointer ${
              channels.includes(channel) 
                ? 'bg-blue-100 border-blue-500 shadow-md' 
                : 'bg-gray-50 border-gray-200 hover:bg-gray-100'
            }`}
          >
            <input
              type="checkbox"
              checked={channels.includes(channel)}
              onChange={() => handleChannelChange(channel)}
              className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
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

      {/* Channel Data Boxes - Only show selected channels */}
      {channels.length > 0 && (
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Channel Content</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {channels.map((channel) => (
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
                <div className="bg-white p-3 rounded border border-gray-200">
                  <pre className="text-sm text-gray-700 whitespace-pre-wrap">
                    {channelData[channel as keyof typeof channelData]}
                  </pre>
                </div>
                <div className="mt-2 text-xs text-gray-500">
                  Variables: {'{#name#}'}, {'{#roll_no#}'}
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Selected Data Summary */}
      {(templateId || academicId || degreeId || studentPerformance) && (
        <Card className="mb-6 bg-gray-50 border-gray-200">
          <h3 className="text-sm font-medium text-gray-700 mb-2">Selected Criteria:</h3>
          <div className="text-sm text-gray-600 space-y-1">
            <p><span className="font-medium">Template ID:</span> {templateId || 'Not selected'}</p>
            <p><span className="font-medium">Academic ID:</span> {academicId || 'Not selected'}</p>
            <p><span className="font-medium">Degree ID:</span> {degreeId || 'Not selected'}</p>
            <p><span className="font-medium">Student Performance:</span> {studentPerformance ? performanceOptions.find(opt => opt.value === studentPerformance)?.label : 'Not selected'}</p>
            <p><span className="font-medium">Selected Channels:</span> {channels.length > 0 ? channels.map(ch => channelConfig[ch as keyof typeof channelConfig].label).join(', ') : 'None'}</p>
          </div>
        </Card>
      )}

      {/* Send Campaign Button */}
      <div className="flex justify-end">
        <Button
          onClick={handleSendCampaign}
          disabled={loading || channels.length === 0}
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

export default CampaignForm;