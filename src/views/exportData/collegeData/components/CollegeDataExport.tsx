import React, { useState } from 'react';
import { Button, TextInput, Label } from 'flowbite-react';
import { BsDownload } from 'react-icons/bs';
import axios from 'axios';
import { useAuth } from 'src/hook/useAuth';
import toast from 'react-hot-toast';
import BreadcrumbHeader from 'src/Frontend/Common/BreadcrumbHeader';
import AcademicDropdown from 'src/Frontend/Common/AcademicDropdown';

const CollegeDataExport: React.FC = () => {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    academic_id: '', // "all" or specific academic ID
    startDate: '',
    endDate: ''
  });
  const [loading, setLoading] = useState(false);

  const apiUrl = import.meta.env.VITE_API_URL;

  // Handle academic dropdown change
  const handleAcademicChange = (academicId: string) => {
    setFormData(prev => ({
      ...prev,
      academic_id: academicId
    }));
  };

  // Handle date input changes
  const handleDateChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Handle export
  const handleExport = async () => {
    // Validation
    if (!formData.startDate || !formData.endDate) {
      toast.error('Please select both start date and end date');
      return;
    }

    if (new Date(formData.startDate) > new Date(formData.endDate)) {
      toast.error('Start date cannot be greater than end date');
      return;
    }

    setLoading(true);
    try {
      const payload = {
        id: formData.academic_id || "all", // Send "all" if no academic selected
        startDate: formData.startDate,
        endDate: formData.endDate,
        s_id: user?.id
      };

      const response = await axios.post(
        `${apiUrl}/${user?.role}/Applications/Export-college-data`,
        payload,
        {
          headers: {
            Authorization: `Bearer ${user?.token}`,
            accept: '/',
            'accept-language': 'en-IN,en-GB;q=0.9,en-US;q=0.8,en;q=0.7,hi;q=0.6',
            'Content-Type': 'application/json',
          },
          responseType: 'blob' // Important for file download
        }
      );

      // Create blob and download file
      const blob = new Blob([response.data]);
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      
      // Get filename from response headers or use default
      const contentDisposition = response.headers['content-disposition'];
      let filename = 'college_data_export.xlsx';
      
      if (contentDisposition) {
        const filenameMatch = contentDisposition.match(/filename="?(.+)"?/);
        if (filenameMatch && filenameMatch[1]) {
          filename = filenameMatch[1];
        }
      }
      
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      toast.success('College data exported successfully!');
      
      // Reset form after successful export
      setFormData(prev => ({
        ...prev,
        startDate: '',
        endDate: ''
      }));

    } catch (error: any) {
      console.error('Error exporting college data:', error);
      
      if (error.response?.status === 404) {
        toast.error('No data found for the selected criteria');
      } else if (error.response?.status === 500) {
        toast.error('Server error occurred while exporting data');
      } else {
        toast.error('Failed to export college data');
      }
    } finally {
      setLoading(false);
    }
  };

  // Get today's date for max date restriction
  const getTodayDate = () => {
    return new Date().toISOString().split('T')[0];
  };

  // Enhanced quick date range presets
  const quickDateRanges = [
    {
      label: 'Today',
      getDates: () => {
        const today = new Date();
        return {
          start: today.toISOString().split('T')[0],
          end: today.toISOString().split('T')[0]
        };
      }
    },
    {
      label: 'Yesterday',
      getDates: () => {
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        return {
          start: yesterday.toISOString().split('T')[0],
          end: yesterday.toISOString().split('T')[0]
        };
      }
    },
    {
      label: 'Last 7 Days',
      getDates: () => {
        const end = new Date();
        const start = new Date();
        start.setDate(start.getDate() - 6); // Last 7 days including today
        return {
          start: start.toISOString().split('T')[0],
          end: end.toISOString().split('T')[0]
        };
      }
    },
    {
      label: 'Last 30 Days',
      getDates: () => {
        const end = new Date();
        const start = new Date();
        start.setDate(start.getDate() - 29); // Last 30 days including today
        return {
          start: start.toISOString().split('T')[0],
          end: end.toISOString().split('T')[0]
        };
      }
    },
    {
      label: 'This Month',
      getDates: () => {
        const now = new Date();
        const start = new Date(now.getFullYear(), now.getMonth(), 1);
        const end = new Date();
        return {
          start: start.toISOString().split('T')[0],
          end: end.toISOString().split('T')[0]
        };
      }
    },
    {
      label: 'Last Month',
      getDates: () => {
        const now = new Date();
        const start = new Date(now.getFullYear(), now.getMonth() - 1, 1);
        const end = new Date(now.getFullYear(), now.getMonth(), 0);
        return {
          start: start.toISOString().split('T')[0],
          end: end.toISOString().split('T')[0]
        };
      }
    },
    {
      label: 'This Quarter',
      getDates: () => {
        const now = new Date();
        const quarter = Math.floor(now.getMonth() / 3);
        const start = new Date(now.getFullYear(), quarter * 3, 1);
        const end = new Date();
        return {
          start: start.toISOString().split('T')[0],
          end: end.toISOString().split('T')[0]
        };
      }
    },
    {
      label: 'Year to Date',
      getDates: () => {
        const start = new Date(new Date().getFullYear(), 0, 1);
        const end = new Date();
        return {
          start: start.toISOString().split('T')[0],
          end: end.toISOString().split('T')[0]
        };
      }
    },
    {
      label: 'Last Year',
      getDates: () => {
        const year = new Date().getFullYear() - 1;
        const start = new Date(year, 0, 1);
        const end = new Date(year, 11, 31);
        return {
          start: start.toISOString().split('T')[0],
          end: end.toISOString().split('T')[0]
        };
      }
    },
    {
      label: 'Custom Academic Year',
      getDates: () => {
        const currentYear = new Date().getFullYear();
        const start = `${currentYear}-07-01`; // Academic year typically starts July
        const end = `${currentYear + 1}-06-30`; // Ends June next year
        return { start, end };
      }
    }
  ];

  const applyDateRange = (getDates: () => { start: string; end: string }) => {
    const dates = getDates();
    setFormData(prev => ({
      ...prev,
      startDate: dates.start,
      endDate: dates.end
    }));
  };

  return (
    <>
      <BreadcrumbHeader 
        title="Export College Data" 
        paths={[
          { name: 'Dashboard', link: `/${user?.role}/dashboard` },
          { name: 'Export College Data', link: '#' }
        ]} 
      />
      
      <div className="p-4 bg-white rounded-lg shadow-md">
        

        {/* Export Form */}
        <div >
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-end">
            {/* Academic Dropdown */}
            <div className="lg:col-span-1">
              <Label htmlFor="academic" className="block mb-2 text-sm font-medium text-gray-700">
                Select Academic
              </Label>
              <AcademicDropdown
                value={formData.academic_id}
                onChange={handleAcademicChange}
                placeholder="Select academic or choose 'All'..."
                includeAllOption={true}
                label=""
              />
             
            </div>

            {/* Start Date */}
            <div className="lg:col-span-1">
              <Label htmlFor="startDate" className="block mb-2 text-sm font-medium text-gray-700">
                Start Date <span className="text-red-500">*</span>
              </Label>
              <TextInput
                id="startDate"
                type="date"
                value={formData.startDate}
                onChange={(e) => handleDateChange('startDate', e.target.value)}
                max={getTodayDate()}
                required
              />
            </div>

            {/* End Date */}
            <div className="lg:col-span-1">
              <Label htmlFor="endDate" className="block mb-2 text-sm font-medium text-gray-700">
                End Date <span className="text-red-500">*</span>
              </Label>
              <TextInput
                id="endDate"
                type="date"
                value={formData.endDate}
                onChange={(e) => handleDateChange('endDate', e.target.value)}
                max={getTodayDate()}
                min={formData.startDate}
                required
              />
            </div>

            {/* Export Button */}
            <div className="lg:col-span-1">
              <Button
                onClick={handleExport}
                disabled={loading || !formData.startDate || !formData.endDate}
                gradientDuoTone="greenToBlue"
                className="w-full lg:w-auto min-w-[140px]"
              >
                {loading ? (
                  <>
                    <div className="mr-2">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    </div>
                    Exporting...
                  </>
                ) : (
                  <>
                    <BsDownload className="mr-2 w-4 h-4" />
                    Export Now
                  </>
                )}
              </Button>
            </div>
          </div>

          
        </div>

        {/* Enhanced Quick Date Range Presets */}
        <div className="mt-6">
          <h3 className="text-lg font-semibold text-gray-700 mb-3">Quick Date Range Presets</h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2">
            {quickDateRanges.map((range, index) => (
              <Button
                key={index}
                size="xs"
                color="light"
                onClick={() => applyDateRange(range.getDates)}
                className="text-xs py-2"
              >
                {range.label}
              </Button>
            ))}
          </div>
        </div>

        {/* Selected Dates Summary */}
        {(formData.startDate || formData.endDate) && (
          <div className="mt-4 p-3 bg-green-50 rounded-lg border border-green-200">
            <div className="flex items-center text-sm text-green-800">
              <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span>
                Selected range: <strong>{formData.startDate}</strong> to <strong>{formData.endDate}</strong>
                {formData.academic_id && ` • Academic ID: ${formData.academic_id}`}
                {!formData.academic_id && ` • All Academic Institutions`}
              </span>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default CollegeDataExport;