import React, { useState, useEffect } from 'react';
import { Button, Modal, ModalBody, ModalFooter, ModalHeader, TextInput } from 'flowbite-react';
import axios from 'axios';
import { useAuth } from 'src/hook/useAuth';
import toast from 'react-hot-toast';

interface StateItem {
  id: number;
  state_title: string;
}

interface StateModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  selectedItem: StateItem | null;
  type: 'add' | 'edit';
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
  const [loading, setLoading] = useState(false);

  const apiUrl = import.meta.env.VITE_API_URL;

  // Reset form when modal opens/closes or selectedItem changes
  useEffect(() => {
    if (isOpen) {
      if (type === 'edit' && selectedItem) {
        setName(selectedItem.state_title || '');
      } else {
        setName('');
      }
    }
  }, [isOpen, selectedItem, type]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name.trim()) {
      toast.error('Please enter state name');
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
    onClose();
  };

  return (
    <Modal show={isOpen} onClose={handleClose} size="md">
      <ModalHeader>
        {type === 'add' ? 'Add State' : 'Edit State'}
      </ModalHeader>
      
      <form onSubmit={handleSubmit}>
        <ModalBody>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                State Name *
              </label>
              <TextInput
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter state name"
                required
                disabled={loading}
              />
            </div>
            {type === 'edit' && selectedItem && (
              <p className="text-sm text-gray-500">
                Editing: <span className="font-medium">{selectedItem.state_title}</span>
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
              : (type === 'add' ? 'Add State' : 'Update State')
            }
          </Button>
        </ModalFooter>
      </form>
    </Modal>
  );
};

export default StateModal;