import React, { useState, useEffect } from 'react';
import { Button, Modal, TextInput, Label, ModalHeader, ModalBody, ModalFooter } from 'flowbite-react';
import Select from 'react-select';
import axios from 'axios';
import { useAuth } from 'src/hook/useAuth';
import toast from 'react-hot-toast';

interface StateItem {
  id: number;
  state_title: string;
}

interface CasteItem {
  state_id: any;
  id: number;
  district_title: string;
}

interface CasteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  selectedItem: CasteItem | null;
  type: 'add' | 'edit';
}

interface SelectOption {
  value: number;
  label: string;
}

const CasteModal: React.FC<CasteModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  selectedItem,
  type
}) => {
  const { user } = useAuth();
  const [name, setName] = useState('');
  const [selectedState, setSelectedState] = useState<SelectOption | null>(null);
  const [states, setStates] = useState<StateItem[]>([]);
  const [stateOptions, setStateOptions] = useState<SelectOption[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingStates, setLoadingStates] = useState(false);

  const apiUrl = import.meta.env.VITE_API_URL;

  // Convert states to react-select options
  useEffect(() => {
    const options = states.map(state => ({
      value: state.id,
      label: state.state_title
    }));
    setStateOptions(options);
  }, [states]);

  // Reset form and fetch states when modal opens
  useEffect(() => {
    if (isOpen) {
      fetchStates();
      if (type === 'edit' && selectedItem) {
        setName(selectedItem.district_title || '');
        // Set selected state after options are loaded
        const timer = setTimeout(() => {
          const stateOption = stateOptions.find(option => 
            option.value === selectedItem.state_id
          );
          setSelectedState(stateOption || null);
        }, 100);
        return () => clearTimeout(timer);
      } else {
        setName('');
        setSelectedState(null);
      }
    }
  }, [isOpen, selectedItem, type, stateOptions]);

  const fetchStates = async () => {
    setLoadingStates(true);
    try {
      const headers = {
        'accept': '*/*',
        'Authorization': `Bearer ${user?.token}`,
        'Content-Type': 'application/json'
      };

      const requestBody = {
        type: 1,
        s_id: user?.id,
        academic_id: 65,
        page: 0,
        rowsPerPage: 1000,
        order: 'asc',
        orderBy: 'state_title',
        search: ''
      };

      const response = await axios.post(
        `${apiUrl}/SuperAdmin/StateDistrict/get-list`,
        requestBody,
        { headers }
      );

      if (response.data?.status) {
        setStates(response.data.rows || []);
      } else {
        console.error('Failed to fetch states');
      }
    } catch (error) {
      console.error('Error fetching states:', error);
      toast.error('Failed to load states');
    } finally {
      setLoadingStates(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name.trim()) {
      toast.error('Please enter district name');
      return;
    }

    if (!selectedState) {
      toast.error('Please select a state');
      return;
    }

    setLoading(true);
    try {
      const headers = {
        'accept': '*/*',
        'Authorization': `Bearer ${user?.token}`,
        'Content-Type': 'application/json'
      };

      let requestBody;
      let url;

      if (type === 'add') {
        url = `${apiUrl}/SuperAdmin/StateDistrict/Add-StateDistrict`;
        requestBody = {
          type: 2,
          name: name.trim(),
          state_id: selectedState.value,
          s_id: user?.id
        };
      } else {
        if (!selectedItem) {
          toast.error('No district selected for editing');
          return;
        }
        url = `${apiUrl}/SuperAdmin/StateDistrict/Update-StateDistrict`;
        requestBody = {
          type: 2,
          id: selectedItem.id,
          name: name.trim(),
          state_id: selectedState.value,
          s_id: user?.id
        };
      }

      const response = await axios.post(url, requestBody, { headers });

      if (response.data?.status) {
        toast.success(response.data?.message || `District ${type === 'add' ? 'added' : 'updated'} successfully!`);
        onSuccess();
      } else {
        toast.error(response.data?.message || `Failed to ${type} district`);
      }
    } catch (error: any) {
      console.error(`Error ${type}ing district:`, error);
      toast.error(error.response?.data?.message || `Failed to ${type} district. Please try again.`);
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setName('');
    setSelectedState(null);
    onClose();
  };

  // Enhanced custom styles to match Flowbite design
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
      zIndex: 9999
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
        {type === 'add' ? 'Add District' : 'Edit District'}
      </ModalHeader>
      
      <form onSubmit={handleSubmit}>
        <ModalBody>
          <div className="space-y-4">
            <div>
              <Label htmlFor="state" className="mb-2 block text-sm font-medium text-gray-700">
                Select State <span className="text-red-500">*</span>
              </Label>
              <Select
                id="state"
                value={selectedState}
                onChange={setSelectedState}
                options={stateOptions}
                placeholder="Search or select a state..."
                isSearchable
                isClearable
                isLoading={loadingStates}
                required
                isDisabled={loading || loadingStates}
                styles={customStyles}
                noOptionsMessage={({ inputValue }) =>
                  inputValue ? "No states found" : "No states available"
                }
                loadingMessage={() => "Loading states..."}
                className="react-select-container"
                classNamePrefix="react-select"
              />
            </div>

            <div>
              <Label htmlFor="districtName" className="mb-2 block text-sm font-medium text-gray-700">
                District Name <span className="text-red-500">*</span>
              </Label>
              <TextInput
                id="districtName"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter district name"
                required
                disabled={loading}
              />
            </div>
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
            disabled={loading || !selectedState || !name.trim()}
            className="px-4 py-2"
          >
            {loading 
              ? (type === 'add' ? 'Adding...' : 'Updating...') 
              : (type === 'add' ? 'Add District' : 'Update District')
            }
          </Button>
        </ModalFooter>
      </form>
    </Modal>
  );
};

export default CasteModal;