import React, { useState, useEffect } from 'react';
import { Button, TextInput, Label } from 'flowbite-react';
import { BsX } from 'react-icons/bs';
import Select from 'react-select';
import axios from 'axios';
import { useAuth } from 'src/hook/useAuth';
import AcademicDropdown from 'src/Frontend/Common/AcademicDropdown';
import { useStates } from 'src/hook/useStates';

interface Filters {
  page: number;
  rowsPerPage: number;
  order: 'asc' | 'desc';
  orderBy: string;
  search: string;
  academic_id: string;
  year: string;
  degree: string;
  paymentStatus: string;
  applicationNumber: string;
  transactions_id: string;
  amounts: string;
  gender: string;
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

interface CollegeFilterSidebarProps {
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
  degreeList: Array<{ id: number; name: string }>;
}

interface DynamicFilter {
  key: string;
  label: string;
  options: Array<{ value: string; label: string }>;
  isMulti: boolean;
}

const CollegeFilterSidebar: React.FC<CollegeFilterSidebarProps> = ({
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
  const [dynamicFilters, setDynamicFilters] = useState<DynamicFilter[]>([]);
  const [loading, setLoading] = useState(false);

  const apiUrl = import.meta.env.VITE_API_URL;

  // Year options
  const yearOptions = [
    { value: '2025', label: '2025' },
    { value: '2024', label: '2024' },
    { value: '2023', label: '2023' },
    { value: 'archive', label: 'Archive Data' },
  ];

  // Payment status options
  const paymentStatusOptions = [
    { value: 'initialized', label: 'Initialized' },
    { value: 'captured', label: 'Captured' },
    { value: 'all', label: 'All' },
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
        `${apiUrl}/${user?.role}/Applications/college-filter`,
        {
          academic_id: parseInt(filters.academic_id),
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
                isMulti: false, // Changed to single select
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
      year: 'Year',
      gender: 'Gender',
      income: 'Annual Income',
      caste: 'Caste',
      boards: 'Board',
      special_category: 'Special Category',
      relationships: 'Relationship',
      yesno: 'Yes/No',
      board: 'Board',
      type_of_plot: 'Type of Plot',
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
          <h3 className="text-lg font-semibold text-gray-900">College Filters</h3>
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
                Academic
              </Label>
              <AcademicDropdown
                value={filters.academic_id}
                onChange={(value) => handleInputChange('academic_id', value)}
                placeholder="Select academic..."
                includeAllOption={true}
                label=""
              />
            </div>
          )}

          {/* Year Dropdown */}
          <div>
            <Label htmlFor="year" className="block mb-2 text-sm font-medium text-gray-700">
              Year
            </Label>
            <Select
              options={yearOptions}
              value={yearOptions.find(option => option.value === filters.year)}
              onChange={(option) => handleSelectChange('year', option)}
              placeholder="Select year..."
              isClearable
              className="react-select-container"
              classNamePrefix="react-select"
            />
          </div>

          {/* Degree Dropdown from filter options */}
          {filterOptions?.degreeList && filterOptions.degreeList.length > 0 && (
            <div>
              <Label htmlFor="degree" className="block mb-2 text-sm font-medium text-gray-700">
                Degree/Stream
              </Label>
              <Select
                options={filterOptions.degreeList.map(degree => ({
                  value: degree.id?.toString(),
                  label: degree.name,
                }))}
                value={filterOptions.degreeList
                  .map(degree => ({ value: degree.id?.toString(), label: degree.name }))
                  .find(option => option.value === filters.degree)}
                onChange={(option) => handleSelectChange('degree', option)}
                placeholder="Select stream..."
                isClearable
                className="react-select-container"
                classNamePrefix="react-select"
              />
            </div>
          )}

          {/* Date Range */}
          <div className="grid grid-cols-2 gap-4">
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
          </div>

          {/* Contact */}
          <div>
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
          </div>

          {/* Email */}
          <div>
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
          </div>

          {/* Application Number */}
          <div>
            <Label htmlFor="applicationNumber" className="block mb-2 text-sm font-medium text-gray-700">
              Application Number
            </Label>
            <TextInput
              type="text"
              id="applicationNumber"
              value={filters.applicationNumber}
              onChange={(e) => handleInputChange('applicationNumber', e.target.value)}
              placeholder="Enter application number"
              className="w-full"
            />
          </div>

          {/* Payment Status */}
          <div>
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
          </div>

          {/* State Dropdown - Changed to single select */}
          <div>
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
          </div>

          {/* Dynamic Filters from API - All single select now */}
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

export default CollegeFilterSidebar;