import React, { useState, useEffect } from 'react';
import { Button, TextInput, Modal, Label, ModalHeader, ModalFooter, ModalBody } from 'flowbite-react';
import axios from 'axios';
import { useAuth } from 'src/hook/useAuth';
import AcademicDropdown from 'src/Frontend/Common/AcademicDropdown';
import toast from 'react-hot-toast';

interface DataModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  selectedAcademic: string;
  selectedType: string;
  type: 'add' | 'edit';
  selectedItem?: any;
}

const DataModal: React.FC<DataModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  selectedAcademic,
  selectedType,
  type,
  selectedItem
}) => {
  const { user } = useAuth();
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [modalAcademic, setModalAcademic] = useState(selectedAcademic);

  const apiUrl = import.meta.env.VITE_API_URL;

  useEffect(() => {
    if (type === 'edit' && selectedItem) {
      setName(selectedItem.name || '');
    } else {
      setName('');
    }
    setModalAcademic(selectedAcademic);
    setError('');
  }, [isOpen, type, selectedItem, selectedAcademic]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim()) {
      setError('Name is required');
      return;
    }

    if (!modalAcademic || !selectedType) {
      setError('Please select Academic and Type');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const headers = {
        accept: '*/*',
        'accept-language': 'en-IN,en-GB;q=0.9,en-US;q=0.8,en;q=0.7,hi;q=0.6',
        origin: 'http://localhost:3010',
        priority: 'u=1, i',
        referer: 'http://localhost:3010/',
        'sec-ch-ua': '"Chromium";v="140", "Not=A?Brand";v="24", "Google Chrome";v="140"',
        'sec-ch-ua-mobile': '?0',
        'sec-ch-ua-platform': '"Windows"',
        'sec-fetch-dest': 'empty',
        'sec-fetch-mode': 'cors',
        'sec-fetch-site': 'cross-site',
        'user-agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36',
        Authorization: `Bearer ${user?.token}`,
        'Content-Type': 'application/json',
      };

      if (type === 'add') {
        const requestBody = {
          type: selectedType,
          s_id: user?.id,
          academic_id: parseInt(modalAcademic),
          name: name.trim(),
        };

        const response = await axios.post(
          `${apiUrl}/${user?.role}/DataManager/Add-Data`, 
          requestBody, 
          { headers }
        );

        if (response.data?.status) {
          toast.success( response.data?.message || 'Data added successfully!');
          onSuccess();
        } else {
          toast.error(response.data?.message || 'Failed to add data');
        }
      } else {
        // Edit API call
        const requestBody = {
          id: selectedItem?.id,
          type: selectedType,
          s_id: user?.id,
          academic_id: parseInt(modalAcademic),
          name: name.trim(),
        };

        const response = await axios.post(
          `${apiUrl}/${user?.role}/DataManager/Update-Data`,
          requestBody,
          { headers }
        );

        if (response.data?.status) {
          toast.success(response.data?.message || 'Data updated successfully!');
          onSuccess();
        } else {
          toast.error(response.data?.message || 'Failed to update data');
        }
      }
    } catch (error: any) {
      console.error(`Error ${type === 'add' ? 'adding' : 'updating'} data:`, error);
      setError(error.response?.data?.message || `Failed to ${type === 'add' ? 'add' : 'update'} data. Please try again.`);
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setName('');
    setError('');
    setModalAcademic(selectedAcademic);
    onClose();
  };

  return (
    <Modal show={isOpen} onClose={handleClose} size="md">
      <ModalHeader>
        {type === 'add' ? 'Add Data' : 'Edit Data'}
      </ModalHeader>  
      
      <form onSubmit={handleSubmit}>
        <ModalBody>
          <div className="">
            {/* Academic Dropdown */}
            {/* <div>
              <Label htmlFor="academic" className="mb-2 block text-sm font-medium text-gray-700">
                Select Academic <span className="text-red-500">*</span>
              </Label>
              <AcademicDropdown
                value={modalAcademic}
                onChange={(academic) => setModalAcademic(academic)}
                label=""
              />
            </div> */}

            {/* Name Input */}
            <div>
              <Label htmlFor="name" className="mb-2 block text-sm font-medium text-gray-700">
                Name <span className="text-red-500">*</span>
              </Label>
              <TextInput
                id="name"
                type="text"
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                  setError('');
                }}
                placeholder="Enter name"
                required
                disabled={loading}
              />
            </div>

            {/* Error Message */}
            {error && (
              <div className="p-3 text-sm text-red-800 bg-red-50 rounded-lg">
                {error}
              </div>
            )}
          </div>
        </ModalBody>
        
        <ModalFooter className="flex justify-end space-x-3">
          <Button 
            color="alternative" 
            onClick={handleClose}
            disabled={loading}
            className="px-4 py-2"
          >
            Cancel
          </Button>
          <Button 
            type="submit"
            color="primary"
            disabled={loading || !name.trim() || !modalAcademic}
            className="px-4 py-2"
          >
            {loading 
              ? (type === 'add' ? 'Adding...' : 'Updating...') 
              : (type === 'add' ? 'Add Data' : 'Update Data')
            }
          </Button>
        </ModalFooter>
      </form>
    </Modal>
  );
};

export default DataModal;