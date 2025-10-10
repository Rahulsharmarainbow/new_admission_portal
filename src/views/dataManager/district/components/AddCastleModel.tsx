// src/components/AddCasteModal.tsx
import React, { useState } from 'react';
import { Button } from 'flowbite-react';
import axios from 'axios';
import { useAuth } from 'src/hook/useAuth';

interface AddCasteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const AddCasteModal: React.FC<AddCasteModalProps> = ({
  isOpen,
  onClose,
  onSuccess
}) => {
  const { user } = useAuth();
  const [casteTitle, setCasteTitle] = useState('');
  const [loading, setLoading] = useState(false);

  const apiUrl = import.meta.env.VITE_API_URL;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!casteTitle.trim()) {
      alert('Please enter caste title');
      return;
    }

    setLoading(true);
    try {
      const headers = {
        'Authorization': `Bearer ${user?.token}`,
        'Content-Type': 'application/json'
      };

      const requestBody = {
        type: 2, // Caste ke liye type 2
        caste_title: casteTitle.trim(),
        s_id: user?.id,
        academic_id: 65
      };

      const response = await axios.post(
        `${apiUrl}/SuperAdmin/StateDistrict/add-data`,
        requestBody,
        { headers }
      );

      if (response.data?.status) {
        alert('Caste added successfully!');
        setCasteTitle('');
        onSuccess();
      } else {
        alert(response.data?.message || 'Failed to add caste');
      }
    } catch (error: any) {
      console.error('Error adding caste:', error);
      alert(error.response?.data?.message || 'Failed to add caste. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-900 bg-opacity-50 overflow-y-auto h-full w-full flex justify-center items-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md mx-4">
        {/* Header */}
        <div className="bg-gray-50 px-6 py-4 rounded-t-lg border-b">
          <h3 className="text-lg font-semibold text-gray-800">Add Caste</h3>
        </div>
        
        {/* Body */}
        <form onSubmit={handleSubmit}>
          <div className="px-6 py-4">
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Caste Title *
              </label>
              <input
                type="text"
                value={casteTitle}
                onChange={(e) => setCasteTitle(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter caste title"
                required
              />
            </div>
          </div>
          
          {/* Footer */}
          <div className="bg-gray-50 px-6 py-4 rounded-b-lg border-t flex justify-end space-x-3">
            <Button 
              color="light" 
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Cancel
            </Button>
            <Button 
              type="submit"
              color="blue"
              disabled={loading}
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              {loading ? 'Adding...' : 'Add Caste'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddCasteModal;