
import React, { useState, useEffect } from 'react';
import { Button, TextInput } from 'flowbite-react';
import axios from 'axios';
import { useAuth } from 'src/hook/useAuth';

interface DataItem {
  id: number;
  name: string;
  created_at: string;
}

interface EditDataModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  selectedItem: DataItem | null;
  selectedAcademic: string;
  selectedType: string;
}

const EditDataModal: React.FC<EditDataModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  selectedItem,
  selectedAcademic,
  selectedType
}) => {
  const { user } = useAuth();
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const apiUrl = import.meta.env.VITE_API_URL;

  // Auto-fill form when selectedItem changes
  useEffect(() => {
    if (selectedItem) {
      setName(selectedItem.name);
    }
  }, [selectedItem]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name.trim()) {
      setError('Name is required');
      return;
    }

    if (!selectedItem || !selectedAcademic || !selectedType) {
      setError('Missing required data');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const headers = {
        'accept': '*/*',
        'accept-language': 'en-IN,en-GB;q=0.9,en-US;q=0.8,en;q=0.7,hi;q=0.6',
        'origin': 'http://localhost:3010',
        'priority': 'u=1, i',
        'referer': 'http://localhost:3010/',
        'sec-ch-ua': '"Chromium";v="140", "Not=A?Brand";v="24", "Google Chrome";v="140"',
        'sec-ch-ua-mobile': '?0',
        'sec-ch-ua-platform': '"Windows"',
        'sec-fetch-dest': 'empty',
        'sec-fetch-mode': 'cors',
        'sec-fetch-site': 'cross-site',
        'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36',
        'Authorization': `Bearer ${user?.token}`,
        'Content-Type': 'application/json'
      };

      const requestBody = {
        id: selectedItem.id,
        type: selectedType,
        s_id: user?.id,
        academic_id: parseInt(selectedAcademic),
        name: name.trim()
      };

      const response = await axios.post(
        `${apiUrl}/${user?.role}/DataManager/Update-Data`,
        requestBody,
        { headers }
      );

      if (response.data?.status) {
        alert('Data updated successfully!');
        setName('');
        onSuccess();
      } else {
        setError(response.data?.message || 'Failed to update data');
      }
    } catch (error: any) {
      console.error('Error updating data:', error);
      setError(error.response?.data?.message || 'Failed to update data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setName('');
    setError('');
    onClose();
  };

  const formatTypeName = (type: string): string => {
    return type
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-xl font-semibold text-gray-900">Edit Data</h3>
        </div>
        
        <form onSubmit={handleSubmit}>
          {/* Body */}
          <div className="px-6 py-4 max-h-96 overflow-y-auto">
            <div className="space-y-4">
              {/* Name Input */}
              <div>
                <label htmlFor="name" className="block mb-2 text-sm font-medium text-gray-900">
                  Name *
                </label>
                <TextInput
                  id="name"
                  value={name}
                  onChange={(e) => {
                    setName(e.target.value);
                    setError('');
                  }}
                  placeholder="Enter name"
                  required
                  className="w-full"
                />
              </div>
            </div>
          </div>
          
          {/* Footer */}
          <div className="px-6 py-4 border-t border-gray-200">
            <div className="flex justify-end space-x-3">
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
                disabled={loading || !name.trim()}
              >
                {loading ? (
                  <>
                    <div className="mr-2">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    </div>
                    Updating...
                  </>
                ) : (
                  'Update Data'
                )}
              </Button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditDataModal;