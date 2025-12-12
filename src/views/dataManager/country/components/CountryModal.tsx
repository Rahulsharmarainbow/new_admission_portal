import React, { useState, useEffect } from 'react';
import { Button, Modal, ModalBody, ModalFooter, ModalHeader, TextInput } from 'flowbite-react';
import axios from 'axios';
import { useAuth } from 'src/hook/useAuth';
import toast from 'react-hot-toast';

interface CountryItem {
  id: number;
  name: string;
}

interface CountryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  selectedItem: CountryItem | null;
  type: 'add' | 'edit';
}

const CountryModal: React.FC<CountryModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  selectedItem,
  type
}) => {
  const { user } = useAuth();
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);

  const apiUrl = import.meta.env.VITE_API_URL;

  // Reset form when modal opens/closes or selectedItem changes
  useEffect(() => {
    if (isOpen) {
      if (type === 'edit' && selectedItem) {
        setName(selectedItem.name || '');
      } else {
        setName('');
      }
    }
  }, [isOpen, selectedItem, type]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name.trim()) {
      toast.error('Please enter country name');
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
        url = `${apiUrl}/${user?.role}/Countries/Add-Countries`;
        requestBody = {
          name: name.trim(),
          s_id: user?.id
        };
      } else {
        if (!selectedItem) {
          toast.error('No country selected for editing');
          return;
        }
        url = `${apiUrl}/${user?.role}/Countries/Update-Countries`;
        requestBody = {
          id: selectedItem.id,
          name: name.trim(),
          s_id: user?.id
        };
      }

      const response = await axios.post(url, requestBody, { headers });

      if (response.data?.status) {
        toast.success(`Country ${type === 'add' ? 'added' : 'updated'} successfully!`);
        onSuccess();
      } else {
        toast.error(response.data?.message || `Failed to ${type} country`);
      }
    } catch (error: any) {
      console.error(`Error ${type}ing country:`, error);
      toast.error(error.response?.data?.message || `Failed to ${type} country. Please try again.`);
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setName('');
    onClose();
  };

  return (
    <Modal show={isOpen} onClose={handleClose} size="md">
      <ModalHeader>
        {type === 'add' ? 'Add Country' : 'Edit Country'}
      </ModalHeader>
      
      <form onSubmit={handleSubmit}>
        <ModalBody>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Country Name *
              </label>
              <TextInput
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter country name"
                required
                disabled={loading}
              />
            </div>
            {type === 'edit' && selectedItem && (
              <p className="text-sm text-gray-500">
                Editing: <span className="font-medium">{selectedItem.name}</span>
              </p>
            )}
          </div>
        </ModalBody>
        
        <ModalFooter className="flex justify-end space-x-3">
          <Button 
            color="gray" 
            onClick={handleClose}
            disabled={loading}
          >
            Cancel
          </Button>
          <Button 
            type="submit"
            color="blue"
            disabled={loading}
          >
            {loading 
              ? (type === 'add' ? 'Adding...' : 'Updating...') 
              : (type === 'add' ? 'Add Country' : 'Update Country')
            }
          </Button>
        </ModalFooter>
      </form>
    </Modal>
  );
};

export default CountryModal;