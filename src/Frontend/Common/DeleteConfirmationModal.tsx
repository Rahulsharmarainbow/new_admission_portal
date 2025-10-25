// import React from 'react';
// import { Button } from 'flowbite-react';


// interface DeleteConfirmationModalProps {
//   isOpen: boolean;
//   onClose: () => void;
//   onConfirm: () => void;
//   title?: string;
//   message?: string;
//   confirmText?: string;
//   cancelText?: string;
// }

// const DeleteConfirmationModal: React.FC<DeleteConfirmationModalProps> = ({
//   isOpen,
//   onClose,
//   onConfirm,
//   title = "Confirm Deletion",
//   message = "Are you sure you want to delete this item?",
//   confirmText = "Delete",
//   cancelText = "Cancel"
// }) => {
//   if (!isOpen) return null;

//   return (
//    <div className="fixed inset-0 flex justify-center items-center z-50 backdrop-blur-md bg-white/10 animate-fadeIn">
//   <div className="bg-white/30 backdrop-blur-lg p-6 rounded-2xl shadow-2xl text-center max-w-sm mx-auto border border-white/20">
//     <h3 className="text-2xl font-semibold text-gray-900 mb-3 drop-shadow-sm">
//       {title}
//     </h3>
//     <p className="text-gray-700 mb-6 text-sm">{message}</p>
//     <div className="flex justify-center space-x-4">
//       <Button
//         color="failure"
//         onClick={onConfirm}
//         className="px-5 py-2 rounded-lg bg-red-500 hover:bg-red-600 text-white shadow-md transition"
//       >
//         {confirmText}
//       </Button>
//       <Button
//         color="light"
//         onClick={onClose}
//         className="px-5 py-2 rounded-lg bg-white/40 hover:bg-white/60 text-gray-800 shadow-md transition"
//       >
//         {cancelText}
//       </Button>
//     </div>
//   </div>
// </div>
//   );
// };

// export default DeleteConfirmationModal;









import React from 'react';
import { Button } from 'flowbite-react';

interface DeleteConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title?: string;
  message?: string;
  confirmText?: string;
  cancelText?: string;
  loading?: boolean; // ✅ Naya prop add kiya
}

const DeleteConfirmationModal: React.FC<DeleteConfirmationModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title = "Confirm Deletion",
  message = "Are you sure you want to delete this item?",
  confirmText = "Delete",
  cancelText = "Cancel",
  loading = false // ✅ Default value
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex justify-center items-center z-50 backdrop-blur-md bg-white/10 animate-fadeIn">
      <div className="bg-white/30 backdrop-blur-lg p-6 rounded-2xl shadow-2xl text-center max-w-sm mx-auto border border-white/20">
        <h3 className="text-2xl font-semibold text-gray-900 mb-3 drop-shadow-sm">
          {title}
        </h3>
        <p className="text-gray-700 mb-6 text-sm">{message}</p>
        <div className="flex justify-center space-x-4">
          <Button
            color="failure"
            onClick={onConfirm}
            disabled={loading} // ✅ Loading ke time disable
            className="px-5 py-2 rounded-lg bg-red-500 hover:bg-red-600 text-white shadow-md transition flex items-center justify-center min-w-20"
          >
            {loading ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                Deleting...
              </>
            ) : (
              confirmText
            )}
          </Button>
          <Button
            color="light"
            onClick={onClose}
            disabled={loading} // ✅ Loading ke time disable
            className="px-5 py-2 rounded-lg bg-white/40 hover:bg-white/60 text-gray-800 shadow-md transition"
          >
            {cancelText}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default DeleteConfirmationModal;