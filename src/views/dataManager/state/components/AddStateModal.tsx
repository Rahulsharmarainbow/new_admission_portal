// import React, { useState, useEffect } from 'react';
// import { Button, Modal, ModalBody, ModalFooter, ModalHeader, TextInput } from 'flowbite-react';
// import axios from 'axios';
// import { useAuth } from 'src/hook/useAuth';
// import toast from 'react-hot-toast';

// interface StateItem {
//   id: number;
//   state_title: string;
// }

// interface StateModalProps {
//   isOpen: boolean;
//   onClose: () => void;
//   onSuccess: () => void;
//   selectedItem: StateItem | null;
//   type: 'add' | 'edit';
// }

// const StateModal: React.FC<StateModalProps> = ({
//   isOpen,
//   onClose,
//   onSuccess,
//   selectedItem,
//   type
// }) => {
//   const { user } = useAuth();
//   const [name, setName] = useState('');
//   const [loading, setLoading] = useState(false);

//   const apiUrl = import.meta.env.VITE_API_URL;

//   // Reset form when modal opens/closes or selectedItem changes
//   useEffect(() => {
//     if (isOpen) {
//       if (type === 'edit' && selectedItem) {
//         setName(selectedItem.state_title || '');
//       } else {
//         setName('');
//       }
//     }
//   }, [isOpen, selectedItem, type]);

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
    
//     if (!name.trim()) {
//       toast.error('Please enter state name');
//       return;
//     }

//     setLoading(true);
//     try {
//       const headers = {
//         'accept': '*/*',
//         'accept-language': 'en-IN,en-GB;q=0.9,en-US;q=0.8,en;q=0.7,hi;q=0.6',
//         'Authorization': `Bearer ${user?.token}`,
//         'Content-Type': 'application/json'
//       };

//       let requestBody;
//       let url;

//       if (type === 'add') {
//         url = `${apiUrl}/${user?.role}/StateDistrict/Add-StateDistrict`;
//         requestBody = {
//           type: 1,
//           name: name.trim(),
//           s_id: user?.id
//         };
//       } else {
//         if (!selectedItem) {
//           toast.error('No state selected for editing');
//           return;
//         }
//         url = `${apiUrl}/${user?.role}/StateDistrict/Update-StateDistrict`;
//         requestBody = {
//           type: 1,
//           id: selectedItem.id,
//           name: name.trim(),
//           s_id: user?.id
//         };
//       }

//       const response = await axios.post(url, requestBody, { headers });

//       if (response.data?.status) {
//         toast.success(`State ${type === 'add' ? 'added' : 'updated'} successfully!`);
//         onSuccess();
//       } else {
//         toast.error(response.data?.message || `Failed to ${type} state`);
//       }
//     } catch (error: any) {
//       console.error(`Error ${type}ing state:`, error);
//       toast.error(error.response?.data?.message || `Failed to ${type} state. Please try again.`);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleClose = () => {
//     setName('');
//     onClose();
//   };

//   return (
//     <Modal show={isOpen} onClose={handleClose} size="md">
//       <ModalHeader>
//         {type === 'add' ? 'Add State' : 'Edit State'}
//       </ModalHeader>
      
//       <form onSubmit={handleSubmit}>
//         <ModalBody>
//           <div className="space-y-4">
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-2">
//                 State Name *
//               </label>
//               <TextInput
//                 type="text"
//                 value={name}
//                 onChange={(e) => setName(e.target.value)}
//                 placeholder="Enter state name"
//                 required
//                 disabled={loading}
//               />
//             </div>
//             {type === 'edit' && selectedItem && (
//               <p className="text-sm text-gray-500">
//                 Editing: <span className="font-medium">{selectedItem.state_title}</span>
//               </p>
//             )}
//           </div>
//         </ModalBody>
        
//         <ModalFooter className="flex justify-end space-x-3">
//           <Button 
//             color="gray" 
//             onClick={handleClose}
//             disabled={loading}
//           >
//             Cancel
//           </Button>
//           <Button 
//             type="submit"
//             color="blue"
//             disabled={loading}
//           >
//             {loading 
//               ? (type === 'add' ? 'Adding...' : 'Updating...') 
//               : (type === 'add' ? 'Add State' : 'Update State')
//             }
//           </Button>
//         </ModalFooter>
//       </form>
//     </Modal>
//   );
// };

// export default StateModal;












// import React, { useState, useEffect, useCallback } from 'react';
// import { Button, Modal, ModalBody, ModalFooter, ModalHeader, TextInput, Select } from 'flowbite-react';
// import axios from 'axios';
// import { useAuth } from 'src/hook/useAuth';
// import toast from 'react-hot-toast';
// import { HiSearch } from 'react-icons/hi';
// import { useDebounce } from 'src/hook/useDebounce';

// interface CountryItem {
//   id: number;
//   name: string;
// }

// interface StateItem {
//   id: number;
//   state_title: string;
//   country_id?: number;
//   country_name?: string;
// }

// interface StateModalProps {
//   isOpen: boolean;
//   onClose: () => void;
//   onSuccess: () => void;
//   selectedItem: StateItem | null;
//   type: 'add' | 'edit';
// }

// const StateModal: React.FC<StateModalProps> = ({
//   isOpen,
//   onClose,
//   onSuccess,
//   selectedItem,
//   type
// }) => {
//   const { user } = useAuth();
//   const [name, setName] = useState('');
//   const [countryId, setCountryId] = useState<number | ''>('');
//   const [loading, setLoading] = useState(false);
//   const [countries, setCountries] = useState<CountryItem[]>([]);
//   const [countriesLoading, setCountriesLoading] = useState(false);
//   const [countrySearch, setCountrySearch] = useState('');
//   const debouncedCountrySearch = useDebounce(countrySearch, 300);

//   const apiUrl = import.meta.env.VITE_API_URL;

//   // Fetch countries with search
//   const fetchCountries = useCallback(async (search = '') => {
//     setCountriesLoading(true);
//     try {
//       const headers = {
//         'accept': '*/*',
//         'accept-language': 'en-IN,en-GB;q=0.9,en-US;q=0.8,en;q=0.7,hi;q=0.6',
//         'Authorization': `Bearer ${user?.token}`,
//         'Content-Type': 'application/json'
//       };

//       const requestBody = {
//         state_id: "", // You mentioned this API requires state_id param
//         search: search // Added search parameter
//       };

//       const response = await axios.post(
//         `${apiUrl}/Public/Counties`,
//         requestBody,
//         { headers }
//       );

//       if (response.data?.status) {
//         setCountries(response.data.states || []);
//       } else {
//         setCountries([]);
//       }
//     } catch (error: any) {
//       console.error('Error fetching countries:', error);
//       toast.error('Failed to load countries');
//       setCountries([]);
//     } finally {
//       setCountriesLoading(false);
//     }
//   }, [apiUrl, user?.token]);

//   // Load countries when modal opens
//   useEffect(() => {
//     if (isOpen) {
//       fetchCountries();
//     }
//   }, [isOpen, fetchCountries]);

//   // Handle country search
//   useEffect(() => {
//     if (isOpen && debouncedCountrySearch !== undefined) {
//       fetchCountries(debouncedCountrySearch);
//     }
//   }, [debouncedCountrySearch, isOpen, fetchCountries]);

//   // Reset form when modal opens/closes or selectedItem changes
//   useEffect(() => {
//     if (isOpen) {
//       if (type === 'edit' && selectedItem) {
//         setName(selectedItem.state_title || '');
//         setCountryId(selectedItem.country_id || '');
        
//         // If we have country_id but countries list is empty, fetch countries first
//         if (selectedItem.country_id && countries.length === 0) {
//           fetchCountries();
//         }
//       } else {
//         setName('');
//         setCountryId('');
//         setCountrySearch('');
//       }
//     }
//   }, [isOpen, selectedItem, type, countries.length, fetchCountries]);

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
    
//     if (!name.trim()) {
//       toast.error('Please enter state name');
//       return;
//     }

//     if (!countryId) {
//       toast.error('Please select a country');
//       return;
//     }

//     setLoading(true);
//     try {
//       const headers = {
//         'accept': '*/*',
//         'accept-language': 'en-IN,en-GB;q=0.9,en-US;q=0.8,en;q=0.7,hi;q=0.6',
//         'Authorization': `Bearer ${user?.token}`,
//         'Content-Type': 'application/json'
//       };

//       let requestBody;
//       let url;

//       if (type === 'add') {
//         url = `${apiUrl}/${user?.role}/StateDistrict/Add-StateDistrict`;
//         requestBody = {
//           type: 1,
//           name: name.trim(),
//           s_id: user?.id,
//           country_id: countryId  // Added country_id
//         };
//       } else {
//         if (!selectedItem) {
//           toast.error('No state selected for editing');
//           return;
//         }
//         url = `${apiUrl}/${user?.role}/StateDistrict/Update-StateDistrict`;
//         requestBody = {
//           type: 1,
//           id: selectedItem.id,
//           name: name.trim(),
//           s_id: user?.id,
//           country_id: countryId  // Added country_id
//         };
//       }

//       const response = await axios.post(url, requestBody, { headers });

//       if (response.data?.status) {
//         toast.success(`State ${type === 'add' ? 'added' : 'updated'} successfully!`);
//         onSuccess();
//       } else {
//         toast.error(response.data?.message || `Failed to ${type} state`);
//       }
//     } catch (error: any) {
//       console.error(`Error ${type}ing state:`, error);
//       toast.error(error.response?.data?.message || `Failed to ${type} state. Please try again.`);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleClose = () => {
//     setName('');
//     setCountryId('');
//     setCountrySearch('');
//     onClose();
//   };

//   // Get selected country name for display
//   const getSelectedCountryName = () => {
//     if (!countryId) return '';
//     const country = countries.find(c => c.id === countryId);
//     return country ? country.name : '';
//   };

//   return (
//     <Modal show={isOpen} onClose={handleClose} size="md">
//       <ModalHeader>
//         {type === 'add' ? 'Add State' : 'Edit State'}
//       </ModalHeader>
      
//       <form onSubmit={handleSubmit}>
//         <ModalBody>
//           <div className="space-y-6">
//             {/* Country Dropdown */}
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-2">
//                 Country *
//               </label>
//               <div className="relative">
//                 <div className="flex items-center">
//                   <TextInput
//                     type="text"
//                     value={countrySearch}
//                     onChange={(e) => setCountrySearch(e.target.value)}
//                     placeholder="Search countries..."
//                     icon={HiSearch}
//                     className="w-full"
//                     disabled={countriesLoading || loading}
//                   />
//                 </div>
                
//                 {/* Countries dropdown list */}
//                 {countrySearch && (
//                   <div className="absolute z-10 mt-1 w-full bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
//                     {countriesLoading ? (
//                       <div className="px-4 py-2 text-sm text-gray-500">Loading...</div>
//                     ) : countries.length === 0 ? (
//                       <div className="px-4 py-2 text-sm text-gray-500">No countries found</div>
//                     ) : (
//                       countries.map(country => (
//                         <button
//                           key={country.id}
//                           type="button"
//                           className="w-full text-left px-4 py-2 hover:bg-gray-100 focus:bg-gray-100 focus:outline-none"
//                           onClick={() => {
//                             setCountryId(country.id);
//                             setCountrySearch(country.name);
//                           }}
//                         >
//                           <div className="flex items-center justify-between">
//                             <span>{country.name}</span>
//                             {countryId === country.id && (
//                               <span className="text-blue-600">✓</span>
//                             )}
//                           </div>
//                         </button>
//                       ))
//                     )}
//                   </div>
//                 )}
                
//                 {/* Selected country display */}
//                 {!countrySearch && countryId && (
//                   <div className="mt-2 p-3 bg-gray-50 rounded-lg border border-gray-200">
//                     <div className="flex justify-between items-center">
//                       <span className="font-medium text-gray-800">
//                         {getSelectedCountryName()}
//                       </span>
//                       <button
//                         type="button"
//                         onClick={() => {
//                           setCountryId('');
//                           setCountrySearch('');
//                         }}
//                         className="text-sm text-red-600 hover:text-red-800"
//                       >
//                         Change
//                       </button>
//                     </div>
//                   </div>
//                 )}
                
//                 {/* Manual select dropdown as fallback */}
//                 {!countrySearch && !countryId && (
//                   <select
//                     value={countryId}
//                     onChange={(e) => setCountryId(Number(e.target.value))}
//                     className="mt-2 w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                     disabled={countriesLoading || loading}
//                     required
//                   >
//                     <option value="">Select a country</option>
//                     {countries.map(country => (
//                       <option key={country.id} value={country.id}>
//                         {country.name}
//                       </option>
//                     ))}
//                   </select>
//                 )}
//               </div>
//               {countriesLoading && (
//                 <p className="mt-1 text-sm text-gray-500">Loading countries...</p>
//               )}
//             </div>

//             {/* State Name Input */}
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-2">
//                 State Name *
//               </label>
//               <TextInput
//                 type="text"
//                 value={name}
//                 onChange={(e) => setName(e.target.value)}
//                 placeholder="Enter state name"
//                 required
//                 disabled={loading}
//               />
//             </div>

//             {/* Edit mode info */}
//             {type === 'edit' && selectedItem && (
//               <div className="p-3 bg-blue-50 rounded-lg">
//                 <p className="text-sm text-gray-600">
//                   <span className="font-medium">Editing State:</span> {selectedItem.state_title}
//                 </p>
//                 {selectedItem.country_name && (
//                   <p className="text-sm text-gray-600 mt-1">
//                     <span className="font-medium">Current Country:</span> {selectedItem.country_name}
//                   </p>
//                 )}
//               </div>
//             )}
//           </div>
//         </ModalBody>
        
//         <ModalFooter className="flex justify-end space-x-3">
//           <Button 
//             color="gray" 
//             onClick={handleClose}
//             disabled={loading}
//           >
//             Cancel
//           </Button>
//           <Button 
//             type="submit"
//             color="blue"
//             disabled={loading || !countryId}
//           >
//             {loading 
//               ? (type === 'add' ? 'Adding...' : 'Updating...') 
//               : (type === 'add' ? 'Add State' : 'Update State')
//             }
//           </Button>
//         </ModalFooter>
//       </form>
//     </Modal>
//   );
// };

// export default StateModal;








import React, { useState, useEffect } from 'react';
import { Button, Modal, TextInput, Label, ModalHeader, ModalBody, ModalFooter } from 'flowbite-react';
import Select from 'react-select';
import axios from 'axios';
import { useAuth } from 'src/hook/useAuth';
import toast from 'react-hot-toast';

interface CountryItem {
  id: number;
  name: string;
}

interface StateItem {
  id: number;
  state_title: string;
  country_id?: number;
}

interface StateModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  selectedItem: StateItem | null;
  type: 'add' | 'edit';
}

interface SelectOption {
  value: number;
  label: string;
}

const StateModal: React.FC<StateModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  selectedItem,
  type
}) => {
  const { user } = useAuth();
  const [name, setName] = useState('');
  const [selectedCountry, setSelectedCountry] = useState<SelectOption | null>(null);
  const [countries, setCountries] = useState<CountryItem[]>([]);
  const [countryOptions, setCountryOptions] = useState<SelectOption[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingCountries, setLoadingCountries] = useState(false);

  const apiUrl = import.meta.env.VITE_API_URL;

  // Convert countries to react-select options
  useEffect(() => {
    const options = countries.map(country => ({
      value: country.id,
      label: country.name
    }));
    setCountryOptions(options);
  }, [countries]);

  // Reset form and fetch countries when modal opens
  useEffect(() => {
    if (isOpen) {
      fetchCountries();
      if (type === 'edit' && selectedItem) {
        setName(selectedItem.state_title || '');
        // Note: selectedItem.country_id will be set after countries are loaded
      } else {
        setName('');
        setSelectedCountry(null);
      }
    }
  }, [isOpen, selectedItem, type]);

  // Set selected country when countries are loaded (for edit mode)
  useEffect(() => {
    if (type === 'edit' && selectedItem && selectedItem.country_id && countryOptions.length > 0) {
      const countryOption = countryOptions.find(option => 
        option.value === selectedItem.country_id
      );
      setSelectedCountry(countryOption || null);
    }
  }, [countryOptions, selectedItem, type]);

  const fetchCountries = async () => {
    setLoadingCountries(true);
    try {
      const headers = {
        'accept': '*/*',
        'accept-language': 'en-IN,en-GB;q=0.9,en-US;q=0.8,en;q=0.7,hi;q=0.6',
        'Authorization': `Bearer ${user?.token}`,
        'Content-Type': 'application/json'
      };

      const requestBody = {
        state_id: "" // According to your API documentation
      };

      const response = await axios.post(
        `${apiUrl}/Public/Counties`,
        requestBody,
        { headers }
      );

      if (response.data?.status) {
        setCountries(response.data.states || []);
      } else {
        console.error('Failed to fetch countries');
        toast.error('Failed to load countries');
      }
    } catch (error) {
      console.error('Error fetching countries:', error);
      toast.error('Failed to load countries');
    } finally {
      setLoadingCountries(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name.trim()) {
      toast.error('Please enter state name');
      return;
    }

    if (!selectedCountry) {
      toast.error('Please select a country');
      return;
    }

    setLoading(true);
    try {
      const headers = {
        'accept': '*/*',
        'accept-language': 'en-IN,en-GB;q=0.9,en-US;q=0.8,en;q=0.7,hi;q=0.6',
        'Authorization': `Bearer ${user?.token}`,
        'Content-Type': 'application/json'
      };

      let requestBody;
      let url;

      if (type === 'add') {
        url = `${apiUrl}/${user?.role}/StateDistrict/Add-StateDistrict`;
        requestBody = {
          type: 1,
          name: name.trim(),
          country_id: selectedCountry.value,  // Send country_id
          s_id: user?.id
        };
      } else {
        if (!selectedItem) {
          toast.error('No state selected for editing');
          return;
        }
        url = `${apiUrl}/${user?.role}/StateDistrict/Update-StateDistrict`;
        requestBody = {
          type: 1,
          id: selectedItem.id,
          name: name.trim(),
          country_id: selectedCountry.value,  // Send country_id
          s_id: user?.id
        };
      }

      const response = await axios.post(url, requestBody, { headers });

      if (response.data?.status) {
        toast.success(`State ${type === 'add' ? 'added' : 'updated'} successfully!`);
        onSuccess();
      } else {
        toast.error(response.data?.message || `Failed to ${type} state`);
      }
    } catch (error: any) {
      console.error(`Error ${type}ing state:`, error);
      toast.error(error.response?.data?.message || `Failed to ${type} state. Please try again.`);
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setName('');
    setSelectedCountry(null);
    onClose();
  };

  // Custom styles to match Flowbite design (same as CasteModal)
  const customStyles = {
    control: (base: any, state: any) => ({
      ...base,
      minHeight: '42px',
      border: '1px solid #d1d5db',
      borderRadius: '8px',
      backgroundColor: state.isDisabled ? '#f9fafb' : '#fff',
      '&:hover': {
        borderColor: '#9ca3af'
      },
      borderColor: state.isFocused ? '#3b82f6' : '#d1d5db',
      boxShadow: state.isFocused ? '0 0 0 2px rgba(59, 130, 246, 0.2)' : 'none',
      transition: 'all 0.2s ease'
    }),
    menu: (base: any) => ({
      ...base,
      borderRadius: '8px',
      border: '1px solid #e5e7eb',
      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
      zIndex: 9999,
      
    }),
    menuList: (base: any) => ({
      ...base,
      padding: '4px',
      maxHeight: '200px'
    }),
    option: (base: any, state: any) => ({
      ...base,
      backgroundColor: state.isSelected ? '#3b82f6' : state.isFocused ? '#eff6ff' : 'white',
      color: state.isSelected ? 'white' : '#374151',
      borderRadius: '6px',
      margin: '2px 0',
      padding: '8px 12px',
      fontSize: '14px',
      '&:active': {
        backgroundColor: '#3b82f6',
        color: 'white'
      }
    }),
    placeholder: (base: any) => ({
      ...base,
      color: '#9ca3af',
      fontSize: '14px'
    }),
    singleValue: (base: any) => ({
      ...base,
      color: '#374151',
      fontSize: '14px'
    }),
    input: (base: any) => ({
      ...base,
      color: '#374151',
      fontSize: '14px'
    }),
    dropdownIndicator: (base: any, state: any) => ({
      ...base,
      color: '#6b7280',
      padding: '8px',
      transition: 'transform 0.2s ease',
      transform: state.selectProps.menuIsOpen ? 'rotate(180deg)' : 'rotate(0deg)',
      '&:hover': {
        color: '#374151'
      }
    }),
    clearIndicator: (base: any) => ({
      ...base,
      color: '#6b7280',
      padding: '8px',
      '&:hover': {
        color: '#374151'
      }
    }),
    loadingIndicator: (base: any) => ({
      ...base,
      color: '#3b82f6'
    })
  };

  return (
    <Modal show={isOpen} onClose={handleClose} size="md">
      <ModalHeader>
        {type === 'add' ? 'Add State' : 'Edit State'}
      </ModalHeader>
      
      <form onSubmit={handleSubmit}>
        <ModalBody>
          <div className="space-y-4">
            {/* Country Dropdown - Exactly like CasteModal */}
            <div>
              <Label htmlFor="country" className="mb-2 block text-sm font-medium text-gray-700">
                Select Country <span className="text-red-500">*</span>
              </Label>
              <Select
                id="country"
                value={selectedCountry}
                onChange={setSelectedCountry}
                options={countryOptions}
                placeholder="Search or select a country..."
                isSearchable
                isClearable
                isLoading={loadingCountries}
                required
                isDisabled={loading || loadingCountries}
                styles={customStyles}
                noOptionsMessage={({ inputValue }) =>
                  inputValue ? "No countries found" : "No countries available"
                }
                loadingMessage={() => "Loading countries..."}
                className="react-select-container"
                classNamePrefix="react-select"
                
              />
            </div>

            {/* State Name Input */}
            <div>
              <Label htmlFor="stateName" className="mb-2 block text-sm font-medium text-gray-700">
                State Name <span className="text-red-500">*</span>
              </Label>
              <TextInput
                id="stateName"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter state name"
                required
                disabled={loading}
              />
            </div>

            {/* Edit mode info */}
            {type === 'edit' && selectedItem && (
              <div className="p-3 bg-blue-50 rounded-lg">
                <p className="text-sm text-gray-600">
                  <span className="font-medium">Editing State:</span> {selectedItem.state_title}
                </p>
                {selectedCountry && (
                  <p className="text-sm text-gray-600 mt-1">
                    <span className="font-medium">Current Country:</span> {selectedCountry.label}
                  </p>
                )}
              </div>
            )}
          </div>
        </ModalBody>
        
        <ModalFooter className="flex justify-end space-x-3">
          <Button 
            color="gray" 
            onClick={handleClose}
            disabled={loading}
            className="px-4 py-2"
          >
            Cancel
          </Button>
          <Button 
            type="submit"
            color="blue"
            disabled={loading || !selectedCountry || !name.trim()}
            className="px-4 py-2"
          >
            {loading 
              ? (type === 'add' ? 'Adding...' : 'Updating...') 
              : (type === 'add' ? 'Add State' : 'Update State')
            }
          </Button>
        </ModalFooter>
      </form>
    </Modal>
  );
};

export default StateModal;