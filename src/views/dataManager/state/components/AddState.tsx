import React, { useState } from 'react';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter, TextInput, Spinner } from 'flowbite-react';
import { toast } from 'react-hot-toast';
import { IconX } from '@tabler/icons-react';

// Mock getCookie function since external libraries are not guaranteed here.
// You should ensure 'cookies-next' is installed and working in your actual project.
const getCookie = (name: string): string | undefined => {
  console.warn(`MOCK: Accessing cookie for ${name}. Returning 'mockAdminId-123'.`);
  if (name === 'superadmin_id') {
    return 'mockAdminId-123'; 
  }
  return undefined;
};

// Define props for the component
interface AddStateProps {
  open: boolean;
  handleClose: () => void;
  setReload: React.Dispatch<React.SetStateAction<boolean>>;
}

const AddState: React.FC<AddStateProps> = ({ open, handleClose, setReload }) => {
  const [stateTitle, setStateTitle] = useState('');
  // Using a mock URL; replace with your actual process.env variable access in your environment
  const apiUrl = 'https://mock-api.example.com/'; 
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!stateTitle.trim()) {
        toast.error("State Title cannot be empty.");
        return;
    }
    
    setIsLoading(true);

    const data = {
      state_title: stateTitle,
      state_description: 'state of india', 
      status: 'active', 
      adminID: getCookie("superadmin_id"), 
    };

    try {
      // --- MOCK API CALL START: Replace this block with your actual fetch call ---
      console.log('MOCK: Submitting new state:', data);
      await new Promise(resolve => setTimeout(resolve, 1500)); // Simulate network delay
      
      // Simulate successful response
      const responseData = { status: true, message: 'State added successfully (MOCK)' };

      // REAL API CALL (if required)
      /*
      const response = await fetch(apiUrl + 'api/supportadmin/StateManager/add_State', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const responseData = await response.json();
      */

      if (responseData.status) {
        setReload((prev) => !prev);
        toast.success(responseData.message);
        handleClose();
        setStateTitle(''); 
      } else {
        toast.error(responseData.message);
      }

    } catch (error) {
      console.error('Error during API call:', error);
      toast.error('An error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleModalClose = () => {
    setStateTitle(''); // Clear input on close
    handleClose();
  };

  return (
    <Modal show={open} size="md" onClose={handleModalClose} dismissible>
      <ModalHeader className="border-b">
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
          Add New State
        </h3>
        {/* Close button with IconX from @tabler/icons-react */}
        <button 
          type="button" 
          className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center dark:hover:bg-gray-600 dark:hover:text-white"
          onClick={handleModalClose}
        >
          <IconX className="w-5 h-5" />
        </button>
      </ModalHeader>
      
      <form onSubmit={handleSubmit}>
        <ModalBody>
          <div className="space-y-6">
            {/* State Title Input */}
            <div>
              <label 
                htmlFor="stateTitle" 
                className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
              >
                State Title <span className="text-red-500">*</span>
              </label>
              <TextInput
                id="stateTitle"
                value={stateTitle}
                onChange={(e) => setStateTitle(e.target.value)}
                placeholder="Enter State Title"
                required
                disabled={isLoading}
              />
            </div>
          </div>
        </ModalBody>
        <ModalFooter>
          <Button 
            color="failure" 
            onClick={handleModalClose} 
            disabled={isLoading}
            className="focus:ring-0"
          >
            Close
          </Button>
          <Button 
            color="primary" 
            type="submit" 
            disabled={isLoading}
            className="focus:ring-0"
          >
            {isLoading ? (
              <div className="flex items-center">
                <Spinner size="sm" className="mr-2" />
                Submitting...
              </div>
            ) : (
              'Submit'
            )}
          </Button>
        </ModalFooter>
      </form>
    </Modal>
  );
};

export default AddState;
