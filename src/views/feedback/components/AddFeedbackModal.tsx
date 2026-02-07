import React from 'react';
import { Modal, ModalHeader, ModalBody, ModalFooter, Button, Label, TextInput, Textarea } from "flowbite-react";

interface AddFeedbackForm {
  ticket_title: string;
  ticket_description: string;
}

interface AddFeedbackModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (form: AddFeedbackForm) => void;
  loading: boolean;
}

const AddFeedbackModal: React.FC<AddFeedbackModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  loading
}) => {
  const [form, setForm] = React.useState<AddFeedbackForm>({
    ticket_title: '',
    ticket_description: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(form);
  };

  const handleClose = () => {
    setForm({
      ticket_title: '',
      ticket_description: ''
    });
    onClose();
  };

  const handleInputChange = (field: keyof AddFeedbackForm, value: string) => {
    setForm(prev => ({
      ...prev,
      [field]: value
    }));
  };

  if (!isOpen) return null;

  return (
    <Modal show={isOpen} onClose={handleClose} size="md">
      <ModalHeader>
        <div className="flex justify-between items-center w-full">
          <h2 className="text-xl font-semibold text-gray-800">Add Feedback</h2>
        </div>
      </ModalHeader>

      <form onSubmit={handleSubmit}>
        <ModalBody>
          <div className="space-y-4">
            {/* Feedback Title */}
            <div>
              <Label htmlFor="ticket_title">
                Feedback Title *
              </Label>
              <TextInput
                id="ticket_title"
                type="text"
                value={form.ticket_title}
                onChange={(e) => handleInputChange("ticket_title", e.target.value)}
                placeholder="Enter feedback title"
                required
                disabled={loading}
              />
            </div>

            {/* Description */}
            <div>
              <Label htmlFor="ticket_description" >
                Feedback Description *
              </Label>
              <Textarea
                id="ticket_description"
                value={form.ticket_description}
                onChange={(e) => handleInputChange("ticket_description", e.target.value)}
                placeholder="Enter feedback description"
                rows={4}
                required
                disabled={loading}
              />
            </div>
          </div>
        </ModalBody>

        <ModalFooter className="flex justify-end gap-3">
          <Button color="gray" onClick={handleClose} disabled={loading}>
            Cancel
          </Button>
          <Button type="submit" color="blue" disabled={loading}>
            {loading ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                <span className="ml-2">Adding...</span>
              </>
            ) : (
              "Submit"
            )}
          </Button>
        </ModalFooter>
      </form>
    </Modal>
  );
};

export default AddFeedbackModal;









// import React from 'react';
// import { Modal, ModalHeader, ModalBody, ModalFooter, Button, Label, TextInput, Textarea } from "flowbite-react";

// interface AddFeedbackForm {
//   feedback_title: string;
//   feedback_description: string;
// }

// interface AddFeedbackModalProps {
//   isOpen: boolean;
//   onClose: () => void;
//   onSubmit: (form: AddFeedbackForm) => void;
//   loading: boolean;
// }

// const AddFeedbackModal: React.FC<AddFeedbackModalProps> = ({
//   isOpen,
//   onClose,
//   onSubmit,
//   loading
// }) => {
//   const [form, setForm] = React.useState<AddFeedbackForm>({
//     feedback_title: '',
//     feedback_description: ''
//   });

//   const handleSubmit = (e: React.FormEvent) => {
//     e.preventDefault();
//     onSubmit(form);
//   };

//   const handleClose = () => {
//     setForm({
//       feedback_title: '',
//       feedback_description: ''
//     });
//     onClose();
//   };

//   const handleInputChange = (field: keyof AddFeedbackForm, value: string) => {
//     setForm(prev => ({
//       ...prev,
//       [field]: value
//     }));
//   };

//   if (!isOpen) return null;

//   return (
//      <Modal show={isOpen} onClose={handleClose} size="md" >
//       <ModalHeader>
//         <div className="flex justify-between items-center w-full">
//           <h2 className="text-xl font-semibold text-gray-800">Add Feedback</h2>
//         </div>
//       </ModalHeader>

//       <form onSubmit={handleSubmit}>
//         <ModalBody>
//           <div className="space-y-4">
//             {/* Feedback Title */}
//             <div>
//               <Label htmlFor="feedback_title" value="Feedback Title *" />
//               <TextInput
//                 id="feedback_title"
//                 type="text"
//                 value={form.feedback_title}
//                 onChange={(e) => handleInputChange("feedback_title", e.target.value)}
//                 placeholder="Enter feedback title"
//                 required
//                 disabled={loading}
//               />
//             </div>

//             {/* Description */}
//             <div>
//               <Label htmlFor="feedback_description" value="Feedback Description *" />
//               <Textarea
//                 id="feedback_description"
//                 value={form.feedback_description}
//                 onChange={(e) => handleInputChange("feedback_description", e.target.value)}
//                 placeholder="Enter feedback description"
//                 rows={4}
//                 required
//                 disabled={loading}
//               />
//             </div>
//           </div>
//         </ModalBody>

//         <ModalFooter className="flex justify-end gap-3">
//           <Button color="gray" onClick={handleClose} disabled={loading}>
//             Cancel
//           </Button>
//           <Button type="submit" color="blue" disabled={loading}>
//             {loading ? (
//               <>
//                 <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
//                 <span className="ml-2">Adding...</span>
//               </>
//             ) : (
//               "Submit"
//             )}
//           </Button>
//         </ModalFooter>
//       </form>
//     </Modal>
//   );
// };

// export default AddFeedbackModal;