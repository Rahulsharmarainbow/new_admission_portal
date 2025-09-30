import React from 'react';
import { Button, Modal } from 'flowbite-react';
import { HiOutlineExclamationCircle } from 'react-icons/hi'; 

// Define the expected props for the reusable confirmation dialog
interface DeleteConfirmationDialogProps {
  open: boolean;
  title: string;
  content: string;
  onClose: () => void;
  onConfirm: () => void;
}

/**
 * Reusable component for displaying a confirmation dialog for deletion or other critical actions.
 * Simplified structure to resolve Modal.Header and Modal.Body errors by using direct children 
 * when the 'popup' prop is true.
 */
const DeleteConfirmationDialog: React.FC<DeleteConfirmationDialogProps> = ({
  open,
  title,
  content,
  onClose,
  onConfirm,
}) => {
  return (
    // Flowbite Modal Component
    // When using 'popup', Flowbite is often designed to handle the body structure directly.
    <Modal show={open} size="md" onClose={onClose} popup>
      
      {/* We are directly adding the content wrapper here, 
          letting the 'popup' prop handle the structural roles of Header/Body. 
      */}
      <div className="p-6 text-center">
        <div className="absolute top-4 right-4">
          <Button color="gray" onClick={onClose} size="sm" pill>
            <span className="sr-only">Close Modal</span>
            {/* Using a standard close icon, if needed, otherwise Flowbite provides one */}
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd"></path></svg>
          </Button>
        </div>

        {/* Using a red icon for a deletion warning */}
        <HiOutlineExclamationCircle className="mx-auto mb-4 h-14 w-14 text-red-500 dark:text-red-400" />
        
        {/* Use the title prop as the main, bold heading */}
        <h2 className="mb-3 text-xl font-bold text-gray-900 dark:text-white">
          {title}
        </h2>

        {/* Use the content prop for the descriptive text */}
        <p className="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400">
          {content}
        </p>
        
        <div className="flex justify-center gap-4">
          <Button color="failure" onClick={onConfirm}>
            {"Yes, I'm sure"}
          </Button>
          <Button color="gray" onClick={onClose}>
            No, cancel
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default DeleteConfirmationDialog;
