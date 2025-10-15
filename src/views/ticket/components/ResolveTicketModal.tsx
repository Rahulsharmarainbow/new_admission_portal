// src/components/Tickets/ResolveTicketModal.tsx
import React from 'react';
import { Modal, ModalHeader, ModalBody, ModalFooter, Button, Label, Textarea } from "flowbite-react";
import { MdClose } from "react-icons/md";

interface ResolveTicketForm {
  remark: string;
}

interface ResolveTicketModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (form: ResolveTicketForm) => void;
  loading: boolean;
}

const ResolveTicketModal: React.FC<ResolveTicketModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  loading
}) => {
  const [form, setForm] = React.useState<ResolveTicketForm>({ remark: '' });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(form);
  };

  const handleClose = () => {
    setForm({ remark: '' });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <Modal show={isOpen} onClose={handleClose} size="md" >
      <ModalHeader>
        <div className="flex justify-between items-center w-full">
          <h2 className="text-xl font-semibold text-gray-800">Resolve Ticket</h2>
          {/* <button
            type="button"
            onClick={handleClose}
            className="text-gray-400 hover:text-gray-600 transition-colors p-1 rounded-full hover:bg-gray-100"
          >
            <MdClose size={24} />
          </button> */}
        </div>
      </ModalHeader>

      <form onSubmit={handleSubmit}>
        <ModalBody>
          <div className="space-y-4">
            <div>
              <Label htmlFor="remark" value="Resolution Remark *" />
              <Textarea
                id="remark"
                value={form.remark}
                onChange={(e) => setForm({ remark: e.target.value })}
                placeholder="Enter resolution details..."
                rows={4}
                required
                disabled={loading}
              />
              <p className="text-sm text-gray-500 mt-1">
                Please provide details about how this ticket was resolved.
              </p>
            </div>
          </div>
        </ModalBody>

        <ModalFooter className="flex justify-end gap-3">
          <Button color="gray" onClick={handleClose} disabled={loading}>
            Cancel
          </Button>

          <Button
            type="submit"
            color="blue"
            disabled={loading || !form.remark.trim()}
          >
            {loading ? (
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Submitting...
              </div>
            ) : (
              "Resolve Ticket"
            )}
          </Button>
        </ModalFooter>
      </form>
    </Modal>
  );
};

export default ResolveTicketModal;