// import React, { useState } from 'react';
// import { Button, TextInput } from 'flowbite-react';
// import axios from 'axios';
// import { useAuth } from 'src/hook/useAuth';

// interface AddDataModalProps {
//   isOpen: boolean;
//   onClose: () => void;
//   onSuccess: () => void;
//   selectedAcademic: string;
//   selectedType: string;
// }

// const AddDataModal: React.FC<AddDataModalProps> = ({
//   isOpen,
//   onClose,
//   onSuccess,
//   selectedAcademic,
//   selectedType
// }) => {
//   const { user } = useAuth();
//   const [name, setName] = useState('');
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState('');

//   const apiUrl = import.meta.env.VITE_API_URL;

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
    
//     if (!name.trim()) {
//       setError('Name is required');
//       return;
//     }

//     if (!selectedAcademic || !selectedType) {
//       setError('Please select Academic and Type first');
//       return;
//     }

//     setLoading(true);
//     setError('');

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
//         type: selectedType,
//         s_id: user?.id,
//         academic_id: parseInt(selectedAcademic),
//         name: name.trim()
//       };

//       const response = await axios.post(
//         `${apiUrl}/SuperAdmin/DataManager/Add-Data`,
//         requestBody,
//         { headers }
//       );

//       if (response.data?.status) {
//         alert('Data added successfully!');
//         setName('');
//         onSuccess();
//       } else {
//         setError(response.data?.message || 'Failed to add data');
//       }
//     } catch (error: any) {
//       console.error('Error adding data:', error);
//       setError(error.response?.data?.message || 'Failed to add data. Please try again.');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleClose = () => {
//     setName('');
//     setError('');
//     onClose();
//   };

//   const formatTypeName = (type: string): string => {
//     return type
//       .split('_')
//       .map(word => word.charAt(0).toUpperCase() + word.slice(1))
//       .join(' ');
//   };

//   if (!isOpen) return null;

//   return (
//     <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
//       <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
//         {/* Header */}
//         <div className="px-6 py-4 border-b border-gray-200">
//           <h3 className="text-xl font-semibold text-gray-900">Add New Data</h3>
//         </div>
        
//         <form onSubmit={handleSubmit}>
//           {/* Body */}
//           <div className="px-6 py-4 max-h-96 overflow-y-auto">
//             <div className="space-y-4">
//               {/* Type Display */}
//               <div>
//                 <label htmlFor="type" className="block mb-2 text-sm font-medium text-gray-900">
//                   Type
//                 </label>
//                 <TextInput
//                   id="type"
//                   value={formatTypeName(selectedType)}
//                   disabled
//                   className="w-full"
//                 />
//               </div>

//               {/* Academic Display */}
//               <div>
//                 <label htmlFor="academic" className="block mb-2 text-sm font-medium text-gray-900">
//                   Academic
//                 </label>
//                 <TextInput
//                   id="academic"
//                   value={selectedAcademic}
//                   disabled
//                   className="w-full"
//                 />
//               </div>

//               {/* Name Input */}
//               <div>
//                 <label htmlFor="name" className="block mb-2 text-sm font-medium text-gray-900">
//                   Name *
//                 </label>
//                 <TextInput
//                   id="name"
//                   value={name}
//                   onChange={(e) => {
//                     setName(e.target.value);
//                     setError('');
//                   }}
//                   placeholder="Enter name"
//                   required
//                   className="w-full"
//                 />
//               </div>

//               {error && (
//                 <div className="p-3 text-sm text-red-800 bg-red-50 rounded-lg">
//                   {error}
//                 </div>
//               )}
//             </div>
//           </div>
          
//           {/* Footer */}
//           <div className="px-6 py-4 border-t border-gray-200">
//             <div className="flex justify-end space-x-3">
//               <Button
//                 color="gray"
//                 onClick={handleClose}
//                 disabled={loading}
//               >
//                 Cancel
//               </Button>
//               <Button
//                 type="submit"
//                 color="blue"
//                 disabled={loading || !name.trim()}
//               >
//                 {loading ? (
//                   <>
//                     <div className="mr-2">
//                       <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
//                     </div>
//                     Adding...
//                   </>
//                 ) : (
//                   'Add Data'
//                 )}
//               </Button>
//             </div>
//           </div>
//         </form>
//       </div>
//     </div>
//   );
// };

// export default AddDataModal;



















import React, { useState } from 'react';
import { Button, TextInput } from 'flowbite-react';
import axios from 'axios';
import { useAuth } from 'src/hook/useAuth';
import { useAcademics } from 'src/hook/useAcademics';
import TypeOfConnection from './TypeOfConnection';
import Loader from 'src/Frontend/Common/Loader';
import AcademicDropdown from 'src/Frontend/Common/AcademicDropdown';

interface AddDataModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  selectedAcademic: string;
  selectedType: string;
}

const AddDataModal: React.FC<AddDataModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  selectedAcademic,
  selectedType
}) => {
  const { user } = useAuth();
  const { academics, loading: academicLoading } = useAcademics();
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [modalAcademic, setModalAcademic] = useState(selectedAcademic);
  const [modalType, setModalType] = useState(selectedType);

  const apiUrl = import.meta.env.VITE_API_URL;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name.trim()) {
      setError('Name is required');
      return;
    }

    if (!modalAcademic || !modalType) {
      setError('Please select Academic and Type');
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
        type: modalType,
        s_id: user?.id,
        academic_id: parseInt(modalAcademic),
        name: name.trim()
      };

      const response = await axios.post(
        `${apiUrl}/SuperAdmin/DataManager/Add-Data`,
        requestBody,
        { headers }
      );

      if (response.data?.status) {
        alert('Data added successfully!');
        setName('');
        onSuccess();
      } else {
        setError(response.data?.message || 'Failed to add data');
      }
    } catch (error: any) {
      console.error('Error adding data:', error);
      setError(error.response?.data?.message || 'Failed to add data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setName('');
    setError('');
    setModalAcademic(selectedAcademic);
    setModalType(selectedType);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-xl font-semibold text-gray-900">Add New Data</h3>
        </div>
        
        <form onSubmit={handleSubmit}>
          {/* Body */}
          <div className="px-6 py-4 max-h-96 overflow-y-auto">
            {academicLoading ? (
              <div className="flex justify-center py-8">
                <Loader />
              </div>
            ) : (
              <div className="space-y-4">
                {/* Academic Dropdown */}
                <div>
                  <label htmlFor="academic" className="block mb-2 text-sm font-medium text-gray-900">
                    Select Academic *
                  </label>
                  <div className="relative">
                    <AcademicDropdown
  value={modalAcademic}
  onChange={setModalAcademic}
  label="Select Academic *"
  isRequired
/>

                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                      </svg>
                    </div>
                  </div>
                </div>

                {/* Type Dropdown */}
                <div>
                  <label className="block mb-2 text-sm font-medium text-gray-900">
                    Select Type *
                  </label>
                  <TypeOfConnection 
                    selectedAcademic={modalAcademic}
                    onTypeChange={setModalType}
                  />
                </div>

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

                {error && (
                  <div className="p-3 text-sm text-red-800 bg-red-50 rounded-lg">
                    {error}
                  </div>
                )}
              </div>
            )}
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
                disabled={loading || !name.trim() || !modalAcademic || !modalType}
              >
                {loading ? (
                  <>
                    <div className="mr-2">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    </div>
                    Adding...
                  </>
                ) : (
                  'Add Data'
                )}
              </Button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddDataModal;