import React, { useState, useEffect } from 'react';
import { Button } from 'flowbite-react';
import axios from 'axios';
import { useAuth } from 'src/hook/useAuth';

interface CasteItem {
  id: number;
  district_title: string;
  state_id?: number;
}

interface StateItem {
  id: number;
  state_title: string;
}

interface EditCasteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  selectedItem: CasteItem | null;
}

const EditCasteModal: React.FC<EditCasteModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  selectedItem
}) => {
  const { user } = useAuth();
  const [name, setName] = useState('');
  const [selectedState, setSelectedState] = useState('');
  const [states, setStates] = useState<StateItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingStates, setLoadingStates] = useState(false);

  const apiUrl = import.meta.env.VITE_API_URL;

  // Fetch states for dropdown and auto-fill form when modal opens
  useEffect(() => {
    if (isOpen) {
      fetchStates();
      if (selectedItem) {
        setName(selectedItem.district_title || '');
        // If the caste item has state_id, set it; otherwise leave empty for user to select
        if (selectedItem.state_id) {
          setSelectedState(selectedItem.state_id.toString());
        }
      }
    }
  }, [isOpen, selectedItem]);

  const fetchStates = async () => {
    setLoadingStates(true);
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
        type: 1, // State type
        s_id: user?.id,
        academic_id: 65,
        page: 0,
        rowsPerPage: 1000, // Get all states
        order: 'asc',
        orderBy: 'state_title',
        search: ''
      };

      const response = await axios.post(
        `${apiUrl}/${user?.role}/StateDistrict/get-list`,
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
    } finally {
      setLoadingStates(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name.trim()) {
      alert('Please enter district name');
      return;
    }

    if (!selectedState) {
      alert('Please select a state');
      return;
    }

    if (!selectedItem) {
      alert('No district selected for editing');
      return;
    }

    setLoading(true);
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
        type: 2, // District type
        id: selectedItem.id,
        name: name.trim(),
        state_id: parseInt(selectedState),
        s_id: user?.id
      };

      const response = await axios.post(
        `${apiUrl}/${user?.role}/StateDistrict/Update-StateDistrict`,
        requestBody,
        { headers }
      );

      if (response.data?.status) {
        alert('District updated successfully!');
        setName('');
        setSelectedState('');
        onSuccess();
      } else {
        alert(response.data?.message || 'Failed to update district');
      }
    } catch (error: any) {
      console.error('Error updating district:', error);
      alert(error.response?.data?.message || 'Failed to update district. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setName('');
    setSelectedState('');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-900 bg-opacity-50 overflow-y-auto h-full w-full flex justify-center items-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md mx-4">
        {/* Header */}
        <div className="bg-gray-50 px-6 py-4 rounded-t-lg border-b">
          <h3 className="text-lg font-semibold text-gray-800">
            Edit District
          </h3>
          {selectedItem && (
            <p className="text-sm text-gray-600 mt-1">
              Editing: {selectedItem.district_title}
            </p>
          )}
        </div>
        
        {/* Body */}
        <form onSubmit={handleSubmit}>
          <div className="px-6 py-4">
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Select State *
              </label>
              <select
                value={selectedState}
                onChange={(e) => setSelectedState(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              >
                <option value="">Select a state</option>
                {loadingStates ? (
                  <option value="" disabled>Loading states...</option>
                ) : (
                  states.map((state) => (
                    <option key={state.id} value={state.id}>
                      {state.state_title}
                    </option>
                  ))
                )}
              </select>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                District Name *
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter district name"
                required
              />
            </div>
          </div>
          
          {/* Footer */}
          <div className="bg-gray-50 px-6 py-4 rounded-b-lg border-t flex justify-end space-x-3">
            <Button 
              color="light" 
              onClick={handleClose}
              disabled={loading}
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
              {loading ? 'Updating...' : 'Update District'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditCasteModal;