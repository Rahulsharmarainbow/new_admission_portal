// import React, { useState, useEffect } from 'react';
// import { Button } from 'flowbite-react';
// import axios from 'axios';
// import { useAuth } from 'src/hook/useAuth';

// interface StateItem {
//   id: number;
//   state_title: string;
// }

// interface EditStateModalProps {
//   isOpen: boolean;
//   onClose: () => void;
//   onSuccess: () => void;
//   selectedItem: StateItem | null;
// }

// const EditStateModal: React.FC<EditStateModalProps> = ({
//   isOpen,
//   onClose,
//   onSuccess,
//   selectedItem
// }) => {
//   const { user } = useAuth();
//   const [stateTitle, setStateTitle] = useState('');
//   const [loading, setLoading] = useState(false);
//   const [fetching, setFetching] = useState(false);

//   const apiUrl = import.meta.env.VITE_API_URL;

//   // Fetch state details when modal opens with selected item
//   useEffect(() => {
//     if (isOpen && selectedItem) {
//       fetchStateDetails();
//     }
//   }, [isOpen, selectedItem]);

//   const fetchStateDetails = async () => {
//     if (!selectedItem) return;

//     setFetching(true);
//     try {
//       const headers = {
//         'accept': '*/*',
//         'accept-language': 'en-IN,en-GB;q=0.9,en-US;q=0.8,en;q=0.7,hi;q=0.6',
//         'origin': 'http://localhost:3010',
//         'priority': 'u=1, i',
//         'referer': 'http://localhost:3010/',
//         'sec-ch-ua': '"Chromium";v="140", "Not=A?Brand";v="24", "Google Chrome";v="140"',
//         'sec-ch-ua-mobile': '?0',
//         'sec-ch-ua-platform': '"Windows"',
//         'sec-fetch-dest': 'empty',
//         'sec-fetch-mode': 'cors',
//         'sec-fetch-site': 'cross-site',
//         'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36',
//         'Authorization': `Bearer ${user?.token}`,
//         'Content-Type': 'application/json'
//       };

//       const requestBody = {
//         type: 1,
//         id: selectedItem.id,
//         s_id: user?.id,
//         academic_id: 65
//       };

//       const response = await axios.post(
//         `${apiUrl}/SuperAdmin/StateDistrict/get-single`,
//         requestBody,
//         { headers }
//       );

//       if (response.data?.status && response.data.data) {
//         setStateTitle(response.data.data.state_title || '');
//       } else {
//         alert('Failed to fetch state details');
//         onClose();
//       }
//     } catch (error: any) {
//       console.error('Error fetching state details:', error);
//       alert('Failed to fetch state details. Please try again.');
//       onClose();
//     } finally {
//       setFetching(false);
//     }
//   };

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
    
//     if (!stateTitle.trim()) {
//       alert('Please enter state title');
//       return;
//     }

//     if (!selectedItem) {
//       alert('No state selected for editing');
//       return;
//     }

//     setLoading(true);
//     try {
//       const headers = {
//         'accept': '*/*',
//         'accept-language': 'en-IN,en-GB;q=0.9,en-US;q=0.8,en;q=0.7,hi;q=0.6',
//         'origin': 'http://localhost:3010',
//         'priority': 'u=1, i',
//         'referer': 'http://localhost:3010/',
//         'sec-ch-ua': '"Chromium";v="140", "Not=A?Brand";v="24", "Google Chrome";v="140"',
//         'sec-ch-ua-mobile': '?0',
//         'sec-ch-ua-platform': '"Windows"',
//         'sec-fetch-dest': 'empty',
//         'sec-fetch-mode': 'cors',
//         'sec-fetch-site': 'cross-site',
//         'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36',
//         'Authorization': `Bearer ${user?.token}`,
//         'Content-Type': 'application/json'
//       };

//       const requestBody = {
//         type: 1,
//         id: selectedItem.id,
//         state_title: stateTitle.trim(),
//         s_id: user?.id,
//         academic_id: 65
//       };

//       const response = await axios.post(
//         `${apiUrl}/SuperAdmin/StateDistrict/update-data`,
//         requestBody,
//         { headers }
//       );

//       if (response.data?.status) {
//         alert('State updated successfully!');
//         setStateTitle('');
//         onSuccess();
//       } else {
//         alert(response.data?.message || 'Failed to update state');
//       }
//     } catch (error: any) {
//       console.error('Error updating state:', error);
//       alert(error.response?.data?.message || 'Failed to update state. Please try again.');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleClose = () => {
//     setStateTitle('');
//     onClose();
//   };

//   if (!isOpen) return null;

//   return (
//     <div className="fixed inset-0 bg-gray-900 bg-opacity-50 overflow-y-auto h-full w-full flex justify-center items-center z-50">
//       <div className="bg-white rounded-lg shadow-xl w-full max-w-md mx-4">
//         {/* Header */}
//         <div className="bg-gray-50 px-6 py-4 rounded-t-lg border-b">
//           <h3 className="text-lg font-semibold text-gray-800">
//             Edit State
//           </h3>
//         </div>
        
//         {/* Body */}
//         <form onSubmit={handleSubmit}>
//           <div className="px-6 py-4">
//             {fetching ? (
//               <div className="flex justify-center items-center py-8">
//                 <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
//               </div>
//             ) : (
//               <div className="mb-4">
//                 <label className="block text-sm font-medium text-gray-700 mb-2">
//                   State Title *
//                 </label>
//                 <input
//                   type="text"
//                   value={stateTitle}
//                   onChange={(e) => setStateTitle(e.target.value)}
//                   className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                   placeholder="Enter state title"
//                   required
//                 />
//               </div>
//             )}
//           </div>
          
//           {/* Footer */}
//           <div className="bg-gray-50 px-6 py-4 rounded-b-lg border-t flex justify-end space-x-3">
//             <Button 
//               color="light" 
//               onClick={handleClose}
//               disabled={loading || fetching}
//               className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
//             >
//               Cancel
//             </Button>
//             <Button 
//               type="submit"
//               color="blue"
//               disabled={loading || fetching}
//               className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
//             >
//               {loading ? 'Updating...' : 'Update State'}
//             </Button>
//           </div>
//         </form>
//       </div>
//     </div>
//   );
// };

// export default EditStateModal;























import React, { useState, useEffect } from 'react';
import { Button } from 'flowbite-react';
import axios from 'axios';
import { useAuth } from 'src/hook/useAuth';

interface StateItem {
  id: number;
  state_title: string;
}

interface EditStateModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  selectedItem: StateItem | null;
}

const EditStateModal: React.FC<EditStateModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  selectedItem
}) => {
  const { user } = useAuth();
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(false);

  const apiUrl = import.meta.env.VITE_API_URL;

  // Auto-fill form when modal opens with selected item
  useEffect(() => {
    if (isOpen && selectedItem) {
      setName(selectedItem.state_title || '');
    }
  }, [isOpen, selectedItem]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name.trim()) {
      alert('Please enter state name');
      return;
    }

    if (!selectedItem) {
      alert('No state selected for editing');
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
        type: 1, // State type
        id: selectedItem.id,
        name: name.trim(),
        s_id: user?.id
      };

      const response = await axios.post(
        `${apiUrl}/SuperAdmin/StateDistrict/Update-StateDistrict`,
        requestBody,
        { headers }
      );

      if (response.data?.status) {
        alert('State updated successfully!');
        setName('');
        onSuccess();
      } else {
        alert(response.data?.message || 'Failed to update state');
      }
    } catch (error: any) {
      console.error('Error updating state:', error);
      alert(error.response?.data?.message || 'Failed to update state. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setName('');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-900 bg-opacity-50 overflow-y-auto h-full w-full flex justify-center items-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md mx-4">
        {/* Header */}
        <div className="bg-gray-50 px-6 py-4 rounded-t-lg border-b">
          <h3 className="text-lg font-semibold text-gray-800">
            Edit State
          </h3>
          {selectedItem && (
            <p className="text-sm text-gray-600 mt-1">
              Editing: {selectedItem.state_title}
            </p>
          )}
        </div>
        
        {/* Body */}
        <form onSubmit={handleSubmit}>
          <div className="px-6 py-4">
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                State Name *
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter state name"
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
              {loading ? 'Updating...' : 'Update State'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditStateModal;