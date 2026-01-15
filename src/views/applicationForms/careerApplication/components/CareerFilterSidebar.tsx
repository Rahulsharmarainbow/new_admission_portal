import React, { useState, useEffect } from 'react';
import { Button, TextInput, Label } from 'flowbite-react';
import { BsX } from 'react-icons/bs';
import Select from 'react-select';
import axios from 'axios';
import { useAuth } from 'src/hook/useAuth';
import AcademicDropdown from 'src/Frontend/Common/AcademicDropdown';
import ClassDropdown from 'src/Frontend/Common/ClassDropdown';
import { useStates } from 'src/hook/useStates';
import SchoolDropdown from 'src/Frontend/Common/SchoolDropdown';
import CareerDropdown from 'src/Frontend/Common/CareerDropdown';

interface Filters {
  page: number;
  rowsPerPage: number;
  order: 'asc' | 'desc';
  orderBy: string;
  search: string;
  academic_id: string;
  year: string;
  classAppliedFor: string;
  gender: string;
  paymentStatus: string;
  refference_id: string;
  transactions_id: string;
  amounts: string;
  special: string;
  annual: string;
  state: string;
  district: string;
  localarea: string;
  caste: string;
  contact: string;
  fromDate: string;
  toDate: string;
  email: string;
}

interface CdFilters {
  [key: string]: string[];
}

interface SchoolFilterSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  filters: Filters;
  cdFilters: CdFilters;
  onFilterChange: (filters: Partial<Filters>, cdFilters?: CdFilters) => void;
  onClearFilters: () => void;
}

interface FilterOptions {
  filters: {
    [key: string]: Array<{ id: number; name: string }>;
  };
  classList: Array<{ id: number; name: string }>;
}

interface DynamicFilter {
  key: string;
  label: string;
  options: Array<{ value: string; label: string }>;
  isMulti: boolean;
}

// 🔥 Dynamic Year Options Generator (same as Dashboard and ApplicationManagementTable)
const getYearOptions = (yearsBack: number = 5): { value: string; label: string }[] => {
  const currentYear = new Date().getFullYear();
  const years: { value: string; label: string }[] = [];

  // Add "Archive Data" option
  years.push({ value: 'archive', label: 'Archive Data' });

  // Add last X years
  for (let y = currentYear; y >= currentYear - yearsBack; y--) {
    years.push({ value: String(y), label: String(y) });
  }

  return years;
};

const CareerFilterSidebar: React.FC<SchoolFilterSidebarProps> = ({
  isOpen,
  onClose,
  filters,
  cdFilters,
  onFilterChange,
  onClearFilters,
}) => {
  const { user } = useAuth();
  const { states: statelist, loading: statesLoading } = useStates();
  const [filterOptions, setFilterOptions] = useState<FilterOptions | null>(null);
  const [jobListOptions, setJobListOptions] = useState<FilterOptions | null>(null);
  const [dynamicFilters, setDynamicFilters] = useState<DynamicFilter[]>([]);
  const [loading, setLoading] = useState(false);

  const apiUrl = import.meta.env.VITE_API_URL;

  // 🔥 Dynamic Year Options (auto updates every year)
  const yearOptions = getYearOptions(5);

  // Payment status options
  const paymentStatusOptions = [
    { value: '2', label: 'Initialized' },
    { value: '1', label: 'Captured' },
    { value: '', label: 'All' },
  ];

  // Gender options
  const genderOptions = [
    { value: '1', label: 'Male' },
    { value: '2', label: 'Female' },
  ];

  // State options
  const stateOptions = statelist.map(state => ({
    value: state.state_id?.toString(),
    label: state.state_title,
  }));

  // Set academic_id for CustomerAdmin
  useEffect(() => {
    if (user?.role === 'CustomerAdmin' && !filters.academic_id) {
      handleInputChange('academic_id', user?.academic_id?.toString() || '');
    }
  }, [user]);

  // Fetch filter options when academic_id changes
  useEffect(() => {
    if (filters.academic_id && isOpen) {
      fetchFilterOptions();
    } else {
      setFilterOptions(null);
      setDynamicFilters([]);
    }
  }, [filters.academic_id, isOpen]);

  const fetchFilterOptions = async () => {
    if (!filters.academic_id) return;
    
    setLoading(true);
    try {
      const response = await axios.post(
        `${apiUrl}/${user?.role}/CareerApplication/get-filter-application`,
        {
          academic_id: parseInt(filters.academic_id),
        //   type : 2
        },
        {
          headers: {
            Authorization: `Bearer ${user?.token}`,
            'Content-Type': 'application/json',
          },
        }
      );

      if (response.data) {
        setFilterOptions(response.data);
        const jobListoption = response.data.jobList.map((job: any) => ({
          value: job.id?.toString(),
          label: job.name
        }))
        setJobListOptions(jobListoption);
        // Convert filters to dynamic filter format
        const dynamicFiltersList: DynamicFilter[] = [];
        
        if (response.data.filters) {
          Object.keys(response.data.filters).forEach(filterKey => {
            const filterItems = response.data.filters[filterKey];
            if (filterItems && filterItems.length > 0) {
              dynamicFiltersList.push({
                key: filterKey,
                label: formatFilterLabel(filterKey),
                options: filterItems.map(item => ({
                  value: item.id?.toString(),
                  label: item.name,
                })),
                isMulti: false, // Single select
              });
            }
          });
        }
        
        setDynamicFilters(dynamicFiltersList);
      }
    } catch (error) {
      console.error('Error fetching filter options:', error);
    } finally {
      setLoading(false);
    }
  };

  // Format filter key to readable label
  const formatFilterLabel = (key: string): string => {
    const labelMap: { [key: string]: string } = {
      blood_group: 'Blood Group',
      local_area: 'Local Area',
      jobs: 'jobs',
      gender: 'Gender',
      income: 'Annual Income',
      caste: 'Caste',
      boards: 'Board',
      special_category: 'Special Category',
      relationships: 'Relationship',
      yesno: 'Yes/No',
      board: 'Board',
      type_of_plot: 'Type of Plot',
      medium: 'Medium',
      category: 'Category',
      religion: 'Religion',
    };
    
    return labelMap[key] || key.split('_').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
  };

  const handleInputChange = (field: keyof Filters, value: string) => {
    onFilterChange({ [field]: value });
  };

  const handleSelectChange = (field: keyof Filters, selectedOption: any) => {
    onFilterChange({ [field]: selectedOption?.value || '' });
  };

  // Handle dynamic filter changes - single select
  const handleDynamicFilterChange = (filterKey: string, selectedOption: any) => {
    const value = selectedOption ? [selectedOption.value] : [];
    const newCdFilters = { ...cdFilters };
    
    if (value.length > 0) {
      newCdFilters[filterKey] = value;
    } else {
      delete newCdFilters[filterKey];
    }
    
    onFilterChange({}, newCdFilters);
  };

  const handleApplyFilters = () => {
    onClose();
  };

  const handleClearAllFilters = () => {
    onClearFilters();
    setDynamicFilters([]);
  };

  const customStyles = {
    control: (provided: any) => ({
      ...provided,
      border: '1px solid #d1d5db',
      borderRadius: '0.5rem',
      minHeight: '42px',
      '&:hover': {
        borderColor: '#9ca3af',
      },
    }),
  };

  return (
    <div className={`fixed inset-0 z-50 transform transition-transform duration-300 ease-in-out ${
      isOpen ? 'translate-x-0' : 'translate-x-full'
    }`}>
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-transparent bg-opacity-50"
        onClick={onClose}
      />
      
      {/* Sidebar Panel */}
      <div className="absolute top-0 right-0 h-full w-96 bg-white shadow-xl border-l border-gray-200 transform transition-transform duration-300 ease-in-out overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b bg-white sticky top-0 z-10">
          <h3 className="text-lg font-semibold text-gray-900">Career Filters</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors p-1 rounded-lg hover:bg-gray-100"
          >
            <BsX className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Academic Dropdown */}
          {(user?.role === 'SuperAdmin' || user?.role === 'SupportAdmin') && (
            <div>
              <Label htmlFor="academic" className="block mb-2 text-sm font-medium text-gray-700">
               Select Career
              </Label>
              <CareerDropdown
                value={filters.academic_id}
                onChange={(value) => handleInputChange('academic_id', value)}
                placeholder="Select academic..."
                includeAllOption={true}
                label=""
              />
            </div>
          )}

          {/* jobs Dropdown - Dynamic */}
          <div>
            <Label htmlFor="jobs" className="block mb-2 text-sm font-medium text-gray-700">
              Jobs
            </Label>
            <Select
              options={jobListOptions}
              value={jobListOptions?.find(option => option.value === filters.jobs)}
              onChange={(option) => handleSelectChange('jobs', option)}
              placeholder="Select job..."
              isClearable
              className="react-select-container"
              classNamePrefix="react-select"
            />
          </div>

          {/* Class Dropdown */}
          {/* <div>
            <Label htmlFor="classAppliedFor" className="block mb-2 text-sm font-medium text-gray-700">
              Class
            </Label>
            <ClassDropdown
              value={filters?.classAppliedFor?.value?.toString() || ''}
              onChange={(value) => handleInputChange('classAppliedFor', value)}
              academicId={filters.academic_id}
              placeholder={filters.academic_id ? "Select class..." : "Select academic first"}
              disabled={!filters.academic_id}
            />
          </div> */}

          {/* Date Range */}
          {/* <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="fromDate" className="block mb-2 text-sm font-medium text-gray-700">
                From Date
              </Label>
              <TextInput
                type="date"
                id="fromDate"
                value={filters.fromDate}
                onChange={(e) => handleInputChange('fromDate', e.target.value)}
                className="w-full"
              />
            </div>
            <div>
              <Label htmlFor="toDate" className="block mb-2 text-sm font-medium text-gray-700">
                To Date
              </Label>
              <TextInput
                type="date"
                id="toDate"
                value={filters.toDate}
                onChange={(e) => handleInputChange('toDate', e.target.value)}
                className="w-full"
              />
            </div>
          </div> */}

          {/* Contact */}
          {/* <div>
            <Label htmlFor="contact" className="block mb-2 text-sm font-medium text-gray-700">
              Contact
            </Label>
            <TextInput
              type="text"
              id="contact"
              value={filters.contact}
              onChange={(e) => handleInputChange('contact', e.target.value)}
              placeholder="Enter contact number"
              className="w-full"
            />
          </div> */}

          {/* Email */}
          {/* <div>
            <Label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-700">
              Email
            </Label>
            <TextInput
              type="email"
              id="email"
              value={filters.email}
              onChange={(e) => handleInputChange('email', e.target.value)}
              placeholder="Enter email"
              className="w-full"
            />
          </div> */}

          {/* Application Number */}
          <div>
            <Label htmlFor="refference_id" className="block mb-2 text-sm font-medium text-gray-700">
              Refference Id
            </Label>
            <TextInput
              type="text"
              id="refference_id"
              value={filters.refference_id}
              onChange={(e) => handleInputChange('refference_id', e.target.value)}
              placeholder="Enter refference id number"
              className="w-full"
            />
          </div>

          {/* Gender */}
          {/* <div>
            <Label htmlFor="gender" className="block mb-2 text-sm font-medium text-gray-700">
              Gender
            </Label>
            <Select
              options={genderOptions}
              value={genderOptions.find(option => option.value === filters.gender)}
              onChange={(option) => handleSelectChange('gender', option)}
              placeholder="Select gender..."
              isClearable
              className="react-select-container"
              classNamePrefix="react-select"
            />
          </div> */}

          {/* Payment Status */}
          {/* <div>
            <Label htmlFor="paymentStatus" className="block mb-2 text-sm font-medium text-gray-700">
              Payment Status
            </Label>
            <Select
              options={paymentStatusOptions}
              value={paymentStatusOptions.find(option => option.value === filters.paymentStatus)}
              onChange={(option) => handleSelectChange('paymentStatus', option)}
              placeholder="Select payment status..."
              isClearable
              className="react-select-container"
              classNamePrefix="react-select"
            />
          </div> */}

          {/* State Dropdown */}
          {/* <div>
            <Label htmlFor="state" className="block mb-2 text-sm font-medium text-gray-700">
              State
            </Label>
            <Select
              id="state"
              options={stateOptions}
              value={stateOptions.find(option => option.value === filters.state)}
              onChange={(option) => handleSelectChange('state', option)}
              styles={customStyles}
              placeholder="Select state..."
              isSearchable
              isClearable
              className="react-select-container"
              classNamePrefix="react-select"
              noOptionsMessage={({ inputValue }) =>
                inputValue ? `No states found for "${inputValue}"` : 'No states available'
              }
            />
          </div> */}

          {/* Dynamic Filters from API */}
          {dynamicFilters.map((filter) => (
            <div key={filter.key}>
              <Label htmlFor={filter.key} className="block mb-2 text-sm font-medium text-gray-700">
                {filter.label}
              </Label>
              <Select
                id={filter.key}
                options={filter.options}
                value={filter.options.find(option => 
                  cdFilters[filter.key]?.[0] === option.value
                )}
                onChange={(option) => handleDynamicFilterChange(filter.key, option)}
                styles={customStyles}
                placeholder={`Select ${filter.label.toLowerCase()}...`}
                isSearchable
                isClearable
                className="react-select-container"
                classNamePrefix="react-select"
                noOptionsMessage={({ inputValue }) =>
                  inputValue ? `No ${filter.label.toLowerCase()} found for "${inputValue}"` : `No ${filter.label.toLowerCase()} available`
                }
              />
            </div>
          ))}

          {loading && (
            <div className="text-center py-4">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
              <p className="text-sm text-gray-500 mt-2">Loading filters...</p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 left-0 right-0 p-6 border-t bg-white">
          <div className="flex gap-3">
            <Button
              onClick={handleClearAllFilters}
              color="alternative"
              className="flex-1"
            >
              Clear All
            </Button>
            <Button
              onClick={handleApplyFilters}
              className="flex-1 bg-blue-600 hover:bg-blue-700"
            >
              Apply Filters
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CareerFilterSidebar;
