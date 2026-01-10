// import React, { useState, useEffect } from 'react';
// import { Button, Modal, TextInput, Label, ModalHeader, ModalBody, ModalFooter } from 'flowbite-react';
// import axios from 'axios';
// import { useAuth } from 'src/hook/useAuth';
// import toast from 'react-hot-toast';
// import AcademicDropdown from 'src/Frontend/Common/AcademicDropdown';

// interface TypeItem {
//   id: number;
//   academic_id: number;
//   type: string;
//   created_at: string;
//   updated_at: string;
// }

// interface TypeModalProps {
//   isOpen: boolean;
//   onClose: () => void;
//   onSuccess: () => void;
//   selectedItem: TypeItem | null;
//   type: 'add' | 'edit';
// }

// const TypeModal: React.FC<TypeModalProps> = ({
//   isOpen,
//   onClose,
//   onSuccess,
//   selectedItem,
//   type
// }) => {
//   const { user } = useAuth();
//   const [typeName, setTypeName] = useState('');
//   const [selectedAcademic, setSelectedAcademic] = useState<number>();
//   const [loading, setLoading] = useState(false);

//   const apiUrl = import.meta.env.VITE_API_URL;

//   // Reset form when modal opens
//   useEffect(() => {
//     if (isOpen) {
//       if (type === 'edit' && selectedItem) {
//         setTypeName(selectedItem.type || '');
//         setSelectedAcademic(selectedItem.academic_id || 0);
//       } else {
//         setTypeName('');
//         setSelectedAcademic(0);
//       }
//     }
//   }, [isOpen, selectedItem, type]);

//   // Handle academic change
//   const handleAcademicChange = (academicId: number) => {
//     setSelectedAcademic(academicId);
//   };

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
    
//     if (!typeName.trim()) {
//       toast.error('Please enter type name');
//       return;
//     }

//     if (!selectedAcademic) {
//       toast.error('Please select academic');
//       return;
//     }

//     setLoading(true);
//     try {
//       const headers = {
//         'accept': '*/*',
//         'Authorization': `Bearer ${user?.token}`,
//         'Content-Type': 'application/json'
//       };

//       let requestBody;
//       let url;

//       if (type === 'add') {
//         url = `${apiUrl}/${user?.role}/Type/add`;
//         requestBody = {
//           academic_id: selectedAcademic,
//           type: typeName.trim(),
//           s_id: user?.id
//         };
//       } else {
//         if (!selectedItem) {
//           toast.error('No type selected for editing');
//           return;
//         }
//         url = `${apiUrl}/${user?.role}/Type/update`;
//         requestBody = {
//           id: selectedItem.id,
//           academic_id: selectedAcademic,
//           type: typeName.trim(),
//           s_id: user?.id
//         };
//       }

//       const response = await axios.post(url, requestBody, { headers });

//       if (response.data?.status) {
//         toast.success(response.data?.message || `Type ${type === 'add' ? 'added' : 'updated'} successfully!`);
//         onSuccess();
//       } else {
//         toast.error(response.data?.message || `Failed to ${type} type`);
//       }
//     } catch (error: any) {
//       console.error(`Error ${type}ing type:`, error);
//       toast.error(error.response?.data?.message || `Failed to ${type} type. Please try again.`);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleClose = () => {
//     setTypeName('');
//     setSelectedAcademic(0);
//     onClose();
//   };

//   return (
//     <Modal show={isOpen} onClose={handleClose} size="md">
//       <ModalHeader>
//         {type === 'add' ? 'Add Type' : 'Edit Type'}
//       </ModalHeader>
      
//       <form onSubmit={handleSubmit}>
//         <ModalBody className="overflow-visible">
//           <div className="space-y-4">
//             {/* Academic Dropdown */}
//             <div>
//               <Label htmlFor="academic" className="mb-2 block text-sm font-medium text-gray-700">
//                 Select Academic <span className="text-red-500">*</span>
//               </Label>
//               <AcademicDropdown
//                 value={selectedAcademic}
//                 onChange={handleAcademicChange}
//                 label=""
//               />
//             </div>

//             <div>
//               <Label htmlFor="typeName" className="mb-2 block text-sm font-medium text-gray-700">
//                 Type Name <span className="text-red-500">*</span>
//               </Label>
//               <TextInput
//                 id="typeName"
//                 type="text"
//                 value={typeName}
//                 onChange={(e) => setTypeName(e.target.value)}
//                 placeholder="Enter type name"
//                 required
//                 disabled={loading}
//               />
//             </div>
//           </div>
//         </ModalBody>
        
//         <ModalFooter className="flex justify-end space-x-3">
//           <Button 
//             color="alternative" 
//             onClick={handleClose}
//             disabled={loading}
//             className="px-4 py-2"
//           >
//             Cancel
//           </Button>
//           <Button 
//             type="submit"
//             color="primary"
//             disabled={loading || !typeName.trim() || !selectedAcademic}
//             className="px-4 py-2"
//           >
//             {loading 
//               ? (type === 'add' ? 'Adding...' : 'Updating...') 
//               : (type === 'add' ? 'Add Type' : 'Update Type')
//             }
//           </Button>
//         </ModalFooter>
//       </form>
//     </Modal>
//   );
// };

// export default TypeModal;
























import React, { useState, useEffect } from 'react';
import { Button, Modal, TextInput, Label, ModalHeader, ModalBody, ModalFooter, ToggleSwitch } from 'flowbite-react';
import axios from 'axios';
import { useAuth } from 'src/hook/useAuth';
import toast from 'react-hot-toast';
// AcademicDropdown को AllAcademicsDropdown से replace करें
import AllAcademicsDropdown from 'src/Frontend/Common/AllAcademicsDropdown'; // यह line change करें

interface TypeItem {
  id: number;
  academic_id: number;
  type: string;
  created_at: string;
  updated_at: string;
  filter_status: boolean; 
}

interface TypeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  selectedItem: TypeItem | null;
  type: 'add' | 'edit';
}

const TypeModal: React.FC<TypeModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  selectedItem,
  type
}) => {
  const { user } = useAuth();
  const [typeName, setTypeName] = useState('');
  const [selectedAcademic, setSelectedAcademic] = useState<number>();
  const [loading, setLoading] = useState(false);
  const [filterStatus, setFilterStatus] = useState<boolean>(true);

  const apiUrl = import.meta.env.VITE_API_URL;

  // Reset form when modal opens
  useEffect(() => {
    if (isOpen) {
      if (type === 'edit' && selectedItem) {
        setTypeName(selectedItem.type || '');
        setSelectedAcademic(selectedItem.academic_id || 0);
        setFilterStatus(selectedItem.filter_status !== undefined ? selectedItem.filter_status : true); // नया line
      } else {
        setTypeName('');
        setSelectedAcademic(0);
        setFilterStatus(true); 
      }
    }
  }, [isOpen, selectedItem, type]);

  // Handle academic change
  const handleAcademicChange = (academicId: number) => {
    setSelectedAcademic(academicId);
  };

    const handleToggleChange = (checked: boolean) => {
    setFilterStatus(checked);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!typeName.trim()) {
      toast.error('Please enter type name');
      return;
    }

    if (!selectedAcademic && user?.role !== 'CustomerAdmin') {
      toast.error('Please select academic');
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
        url = `${apiUrl}/${user?.role}/Type/add`;
        requestBody = {
          academic_id: selectedAcademic,
          type: typeName.trim(),
          filter_status: filterStatus ? 1 : 0,
          s_id: user?.id
        };
      } else {
        if (!selectedItem) {
          toast.error('No type selected for editing');
          return;
        }
        url = `${apiUrl}/${user?.role}/Type/update`;
        requestBody = {
          id: selectedItem.id,
          academic_id: selectedAcademic,
          type: typeName.trim(),
          filter_status: filterStatus ? 1 : 0,
          s_id: user?.id
        };
      }

      const response = await axios.post(url, requestBody, { headers });

      if (response.data?.status) {
        toast.success(response.data?.message || `Type ${type === 'add' ? 'added' : 'updated'} successfully!`);
        onSuccess();
      } else {
        toast.error(response.data?.message || `Failed to ${type} type`);
      }
    } catch (error: any) {
      console.error(`Error ${type}ing type:`, error);
      toast.error(error.response?.data?.message || `Failed to ${type} type. Please try again.`);
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setTypeName('');
    setSelectedAcademic(0);
    onClose();
    setFilterStatus(true);
  };

  return (
    <Modal show={isOpen} onClose={handleClose} size="md">
      <ModalHeader>
        {type === 'add' ? 'Add Type' : 'Edit Type'}
      </ModalHeader>
      
      <form onSubmit={handleSubmit}>
        <ModalBody className="overflow-visible">
          <div className="space-y-4">
            {/* Academic Dropdown - AcademicDropdown को AllAcademicsDropdown से replace करें */}
            {(user?.role === 'SuperAdmin' || user?.role === 'SupportAdmin') &&  (<div>
              <Label htmlFor="academic" className="mb-2 block text-sm font-medium text-gray-700">
                Select Academic <span className="text-red-500">*</span>
              </Label>
              <AllAcademicsDropdown // यह line change करें
                value={selectedAcademic}
                onChange={handleAcademicChange}
                label=""
              />
            </div> )}

            <div>
              <Label htmlFor="typeName" className="mb-2 block text-sm font-medium text-gray-700">
                Type Name <span className="text-red-500">*</span>
              </Label>
              <TextInput
                id="typeName"
                type="text"
                value={typeName}
                onChange={(e) => setTypeName(e.target.value)}
                placeholder="Enter type name"
                required
                disabled={loading}
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="filterStatus" className="mb-2 block text-sm font-medium text-gray-700">
                  Filter Status
                </Label>
              </div>
              <ToggleSwitch
                checked={filterStatus}
                onChange={handleToggleChange}
                label=""
                disabled={loading}
              />
            </div>
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
            disabled={loading || !typeName.trim()}
            className="px-4 py-2"
          >
            {loading 
              ? (type === 'add' ? 'Adding...' : 'Updating...') 
              : (type === 'add' ? 'Add Type' : 'Update Type')
            }
          </Button>
        </ModalFooter>
      </form>
    </Modal>
  );
};

export default TypeModal;