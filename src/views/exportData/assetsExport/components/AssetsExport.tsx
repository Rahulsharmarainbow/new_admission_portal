import React, { useState } from 'react';
import { Button, TextInput, Label, Checkbox } from 'flowbite-react';
import { BsDownload } from 'react-icons/bs';
import axios from 'axios';
import { useAuth } from 'src/hook/useAuth';
import toast from 'react-hot-toast';
import BreadcrumbHeader from 'src/Frontend/Common/BreadcrumbHeader';
import AllAcademicsDropdown from 'src/Frontend/Common/AllAcademicsDropdown';
import RouteDropdown from 'src/Frontend/Common/RouteDropdown';

const AssetsExport: React.FC = () => {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    academic_id: '',
    page_route: '',
    startDate: '',
    endDate: '',
    include_documents: false,
    include_pdf: false
  });
  const [loading, setLoading] = useState(false);

  const apiUrl = import.meta.env.VITE_API_URL;

  // Handle academic dropdown change
  const handleAcademicChange = (academicId: string) => {
    setFormData(prev => ({
      ...prev,
      academic_id: academicId,
      page_route: '' // Reset route when academic changes
    }));
  };

  // Handle route dropdown change
  const handleRouteChange = (routeId: string) => {
    setFormData(prev => ({
      ...prev,
      page_route: routeId
    }));
  };

  // Handle date input changes
  const handleDateChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Handle checkbox changes
  const handleCheckboxChange = (field: string, checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      [field]: checked
    }));
  };

  // Handle export
  const handleExport = async () => {
    // Validation
    if (!formData.startDate || !formData.endDate) {
      toast.error("Please select both start and end dates");
      return;
    }

    if (new Date(formData.startDate) > new Date(formData.endDate)) {
      toast.error("Start date cannot be greater than end date");
      return;
    }

    setLoading(true);

    try {
      const payload = {
        academic_id: formData.academic_id || null,
        page_route: formData.page_route || null,
        start_date: formData.startDate,
        end_date: formData.endDate,
        include_documents: formData.include_documents,
        include_pdf: formData.include_pdf,
        exported_by: user?.id,
        exported_by_role: user?.role
      };

      console.log('Export payload:', payload);

      // Actual API call - adjust endpoint as needed
      const response = await axios.post(
        `${apiUrl}/${user?.role}/Applications/Export-assets-data`,
        payload,
       {
        headers: {
          Authorization: `Bearer ${user?.token}`,
          'Content-Type': 'application/json',
        },
      }
      );

    
      
       if (response.data.success) {
      // Create download link from base64
      const link = document.createElement('a');
      link.href = `data:${response.data.filetype};base64,${response.data.file}`;
      link.download = response.data.filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      toast.success(response.data.message || 'Documents exported successfully!');
      
      // Show summary
      console.log(`Exported ${response.data.total_files} files from ${response.data.total_students} students`);
    } else {
      console.log(response.data.error || 'Failed to export documents');
    }

      // toast.success("College data exported successfully!");

      // Reset form
      // setFormData(prev => ({
      //   ...prev,
      //   startDate: "",
      //   endDate: "",
      //   page_route: "",
      //   include_documents: false,
      //   include_pdf: false
      // }));

    } catch (error: any) {
      console.error('Error exporting data:', error);
      
      // Handle error response
      if (error.response?.status === 404) {
        toast.error("Export endpoint not found. Please check the API URL.");
      } else if (error.response?.status === 403) {
        toast.error("You don't have permission to export data.");
      } else if (error.response?.status === 400) {
        toast.error("Invalid export parameters.");
      } else if (error.response?.data?.error) {
        toast.error(error.response.data.error);
      } else {
        toast.error("Failed to export data. Please try again.");
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
        title="Assets Export" 
        paths={[
          { name: 'Dashboard', link: `/${user?.role}/dashboard` },
          { name: 'Assets Export', link: '#' }
        ]} 
      />
      
      <div className="p-4 bg-white rounded-lg shadow-md">
        {/* Export Form */}
        <div>
          {/* First Row: All Dropdowns and Date Fields */}
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 mb-6">
            {/* Academic Dropdown - Only for SuperAdmin/SupportAdmin */}
            {(user?.role === 'SuperAdmin' || user?.role === 'SupportAdmin') && (
              <div>
                <Label htmlFor="academic" className="block mb-2 text-sm font-medium text-gray-700">
                  Select Academic
                </Label>
                <AllAcademicsDropdown
                  value={formData.academic_id}
                  onChange={handleAcademicChange}
                  placeholder="Select academic or choose 'All Academics'..."
                  includeAllOption={true}
                  label=""
                />
              </div>
            )}

            {/* Route Dropdown */}
            <div>
              <Label htmlFor="route" className="block mb-2 text-sm font-medium text-gray-700">
                Select Route
              </Label>
              <RouteDropdown
                academicId={formData.academic_id}
                value={formData.page_route}
                onChange={handleRouteChange}
                placeholder={formData.academic_id ? "Select route..." : "Please select an academic first"}
                disabled={!formData.academic_id}
              />
            </div>

            {/* Start Date */}
            <div>
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
                className="w-full"
              />
            </div>

            {/* End Date */}
            <div>
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
                className="w-full"
              />
            </div>
          </div>

          {/* Second Row: Checkboxes and Export Button */}
          <div className="flex flex-wrap items-center justify-between gap-4 mt-4 pt-4 border-t border-gray-200">
            {/* Checkboxes */}
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2">
                <Checkbox
                  id="include_documents"
                  checked={formData.include_documents}
                  onChange={(e) => handleCheckboxChange('include_documents', e.target.checked)}
                  className="h-5 w-5"
                />
                <Label htmlFor="include_documents" className="cursor-pointer text-sm font-medium text-gray-700">
                  Include Documents
                </Label>
              </div>
              
              <div className="flex items-center gap-2">
                <Checkbox
                  id="include_pdf"
                  checked={formData.include_pdf}
                  onChange={(e) => handleCheckboxChange('include_pdf', e.target.checked)}
                  className="h-5 w-5"
                />
                <Label htmlFor="include_pdf" className="cursor-pointer text-sm font-medium text-gray-700">
                  Include PDF
                </Label>
              </div>
            </div>

            {/* Export Button */}
            <div>
              <Button
                onClick={handleExport}
                disabled={loading || !formData.startDate || !formData.endDate}
                gradientDuoTone="greenToBlue"
                className="min-w-[140px]"
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
                {formData.page_route && ` • Route ID: ${formData.page_route}`}
                {formData.include_documents && ` • With Documents`}
                {formData.include_pdf && ` • With PDF`}
              </span>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default AssetsExport;