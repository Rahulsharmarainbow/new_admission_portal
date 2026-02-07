// src/components/Tickets/AddTicketModal.tsx
import React from 'react';
import { MdClose } from 'react-icons/md';
import { Modal, ModalHeader, ModalBody, ModalFooter, Button, Label, TextInput, Textarea, Select } from "flowbite-react";

interface AddTicketForm {
  ticket_title: string;
  priority: 'low' | 'medium' | 'high' | '';
  ticket_description: string;
}

interface AddTicketModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (form: AddTicketForm) => void;
  loading: boolean;
}

const AddTicketModal: React.FC<AddTicketModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  loading
}) => {
  const [form, setForm] = React.useState<AddTicketForm>({
    ticket_title: '',
    priority: '',
    ticket_description: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(form);
  };

  const handleClose = () => {
    setForm({
      ticket_title: '',
      priority: '',
      ticket_description: ''
    });
    onClose();
  };

  const handleInputChange = (field: keyof AddTicketForm, value: string) => {
    setForm(prev => ({
      ...prev,
      [field]: value
    }));
  };

  if (!isOpen) return null;

  return (
     <Modal show={isOpen} onClose={handleClose} size="md" >
      <ModalHeader>
        <div className="flex justify-between items-center w-full">
          <h2 className="text-xl font-semibold text-gray-800">Add Ticket</h2>
        </div>
      </ModalHeader>

      <form onSubmit={handleSubmit}>
        <ModalBody>
          <div className="space-y-4">
            {/* Ticket Title */}
            <div>
              <Label htmlFor="ticket_title">
                Ticket Title *
              </Label>
              <TextInput
                id="ticket_title"
                type="text"
                value={form.ticket_title}
                onChange={(e) => handleInputChange("ticket_title", e.target.value)}
                placeholder="Enter ticket title"
                required
                disabled={loading}
              />
            </div>

            {/* Priority */}
            <div>
              <Label htmlFor="priority">
                Priority *
              </Label>
              <Select
                id="priority"
                value={form.priority}
                onChange={(e) => handleInputChange("priority", e.target.value)}
                required
                disabled={loading}
              >
                <option value="">Select priority</option>
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </Select>
            </div>

            {/* Description */}
            <div>
              <Label htmlFor="ticket_description">
                Ticket Description *
              </Label>
              <Textarea
                id="ticket_description"
                value={form.ticket_description}
                onChange={(e) => handleInputChange("ticket_description", e.target.value)}
                placeholder="Enter ticket description"
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

export default AddTicketModal;