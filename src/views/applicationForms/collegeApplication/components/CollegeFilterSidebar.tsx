import React, { useState, useEffect } from 'react';
import { Button, TextInput, Label } from 'flowbite-react';
import { BsX } from 'react-icons/bs';
import Select from 'react-select';
import axios from 'axios';
import { useAuth } from 'src/hook/useAuth';
import AcademicDropdown from 'src/Frontend/Common/AcademicDropdown';
import { useStates } from 'src/hook/useStates';
import { useCaste } from 'src/hook/useCaste';

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
}

interface CollegeFilterSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  filters: Filters;
  onFilterChange: (filters: Partial<Filters>) => void;
  onClearFilters: () => void;
}

interface FilterOptions {
  blood_group: Array<{ id: number; name: string }>;
  local_area: Array<{ id: number; name: string }>;
  year: Array<{ id: number; name: string }>;
  gender: Array<{ id: number; name: string }>;
  income: Array<{ id: number; name: string }>;
  caste: Array<{ id: number; name: string }>;
  boards: Array<{ id: number; name: string }>;
  special_category: Array<{ id: number; name: string }>;
  degreeList: Array<{ id: number; name: string }>;
  paymentList: Array<{ id: number; name: string }>;
  amountList: Array<{ id: number; name: string }>;
}

const CollegeFilterSidebar: React.FC<CollegeFilterSidebarProps> = ({
  isOpen,
  onClose,
  filters,
  onFilterChange,
  onClearFilters,
}) => {
  const { user } = useAuth();
  const { states: statelist, loading: statesLoading } = useStates();
  const { caste: castelist, loading: casteLoading } = useCaste();
  const [filterOptions, setFilterOptions] = useState<FilterOptions | null>(null);
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

  // Caste options
  const casteOptions = castelist.map(caste => ({
    value: caste.id?.toString(),
    label: caste.name,
  }));

  // Fetch filter options when academic_id changes
  useEffect(() => {
    if (filters.academic_id) {
      fetchFilterOptions();
    } else {
      setFilterOptions(null);
    }
  }, [filters.academic_id]);

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
      }
    } catch (error) {
      console.error('Error fetching filter options:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: keyof Filters, value: string) => {
    onFilterChange({ [field]: value });
  };

  const handleSelectChange = (field: keyof Filters, selectedOption: any) => {
    onFilterChange({ [field]: selectedOption?.value || '' });
  };

  const handleMultiSelectChange = (field: keyof Filters, selectedOptions: any) => {
    const values = selectedOptions ? selectedOptions.map((option: any) => option.value).join(',') : '';
    onFilterChange({ [field]: values });
  };

  const handleApplyFilters = () => {
    onClose();
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

          {/* State Dropdown */}
          <div>
            <Label htmlFor="state" className="block mb-2 text-sm font-medium text-gray-700">
              State
            </Label>
            <Select
              id="state"
              isMulti
              options={stateOptions}
              value={stateOptions.filter(option => filters.state.split(',').includes(option.value))}
              onChange={(options) => handleMultiSelectChange('state', options)}
              styles={customStyles}
              placeholder="Select states..."
              isSearchable
              isClearable
              className="react-select-container"
              classNamePrefix="react-select"
              noOptionsMessage={({ inputValue }) =>
                inputValue ? `No states found for "${inputValue}"` : 'No states available'
              }
            />
            {filters.state && (
              <div className="mt-2">
                <span className="text-sm text-blue-600 font-medium">
                  Selected: {filters.state.split(',').length} state(s)
                </span>
              </div>
            )}
          </div>

         
          

          {/* Caste Dropdown */}
          <div>
            <Label htmlFor="caste" className="block mb-2 text-sm font-medium text-gray-700">
              Caste
            </Label>
            <Select
              id="caste"
              isMulti
              options={casteOptions}
              value={casteOptions.filter(option => filters.caste.split(',').includes(option.value))}
              onChange={(options) => handleMultiSelectChange('caste', options)}
              styles={customStyles}
              placeholder="Select castes..."
              isSearchable
              isClearable
              className="react-select-container"
              classNamePrefix="react-select"
              noOptionsMessage={({ inputValue }) =>
                inputValue ? `No castes found for "${inputValue}"` : 'No castes available'
              }
            />
            {filters.caste && (
              <div className="mt-2">
                <span className="text-sm text-blue-600 font-medium">
                  Selected: {filters.caste.split(',').length} caste(s)
                </span>
              </div>
            )}
          </div>

          {/* Academic-specific filters (only show when academic is selected) */}
          {filterOptions && filters.academic_id && (
            <>
              {/* Degree/Stream */}
              {filterOptions.degreeList && filterOptions.degreeList.length > 0 && (
                <div>
                  <Label htmlFor="degree" className="block mb-2 text-sm font-medium text-gray-700">
                    Stream Applied
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

              {/* Gender */}
              {filterOptions.gender && filterOptions.gender.length > 0 && (
                <div>
                  <Label htmlFor="gender" className="block mb-2 text-sm font-medium text-gray-700">
                    Gender
                  </Label>
                  <Select
                    options={filterOptions.gender.map(gender => ({
                      value: gender.id?.toString(),
                      label: gender.name,
                    }))}
                    value={filterOptions.gender
                      .map(gender => ({ value: gender.id?.toString(), label: gender.name }))
                      .find(option => option.value === filters.gender)}
                    onChange={(option) => handleSelectChange('gender', option)}
                    placeholder="Select gender..."
                    isClearable
                    className="react-select-container"
                    classNamePrefix="react-select"
                  />
                </div>
              )}

              {/* Annual Income */}
              {filterOptions.income && filterOptions.income.length > 0 && (
                <div>
                  <Label htmlFor="annual" className="block mb-2 text-sm font-medium text-gray-700">
                    Annual Income
                  </Label>
                  <Select
                    options={filterOptions.income.map(income => ({
                      value: income.id?.toString(),
                      label: income.name,
                    }))}
                    value={filterOptions.income
                      .map(income => ({ value: income.id?.toString(), label: income.name }))
                      .find(option => option.value === filters.annual)}
                    onChange={(option) => handleSelectChange('annual', option)}
                    placeholder="Select annual income..."
                    isClearable
                    className="react-select-container"
                    classNamePrefix="react-select"
                  />
                </div>
              )}

              {/* Special Category */}
              {filterOptions.special_category && filterOptions.special_category.length > 0 && (
                <div>
                  <Label htmlFor="special" className="block mb-2 text-sm font-medium text-gray-700">
                    Special Category
                  </Label>
                  <Select
                    options={filterOptions.special_category.map(special => ({
                      value: special.id?.toString(),
                      label: special.name,
                    }))}
                    value={filterOptions.special_category
                      .map(special => ({ value: special.id?.toString(), label: special.name }))
                      .find(option => option.value === filters.special)}
                    onChange={(option) => handleSelectChange('special', option)}
                    placeholder="Select special category..."
                    isClearable
                    className="react-select-container"
                    classNamePrefix="react-select"
                  />
                </div>
              )}

              {/* Local Area */}
              {filterOptions.local_area && filterOptions.local_area.length > 0 && (
                <div>
                  <Label htmlFor="localarea" className="block mb-2 text-sm font-medium text-gray-700">
                    Local Area
                  </Label>
                  <Select
                    options={filterOptions.local_area.map(area => ({
                      value: area.id?.toString(),
                      label: area.name,
                    }))}
                    value={filterOptions.local_area
                      .map(area => ({ value: area.id?.toString(), label: area.name }))
                      .find(option => option.value === filters.localarea)}
                    onChange={(option) => handleSelectChange('localarea', option)}
                    placeholder="Select local area..."
                    isClearable
                    className="react-select-container"
                    classNamePrefix="react-select"
                  />
                </div>
              )}
            </>
          )}

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
              onClick={onClearFilters}
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