// src/components/Tickets/TicketDetailsModal.tsx
import React from 'react';
import { MdClose } from 'react-icons/md';
import Loader from 'src/Frontend/Common/Loader';
import { Modal, ModalHeader, ModalBody, ModalFooter, Button, Label } from 'flowbite-react';

interface TicketDetails {
  ticket_id: number;
  ticket_title: string;
  ticket_description: string;
  status: string;
  priority: string;
  created_by: string;
  accepted_by: string;
  resolve_by: string;
  accepted_at: string | null;
  resolve_at: string | null;
  resolve_remark: string;
  created_at: string;
}

interface TicketDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  ticketDetails: TicketDetails | null;
  loading: boolean;
}

const TicketDetailsModal: React.FC<TicketDetailsModalProps> = ({
  isOpen,
  onClose,
  ticketDetails,
  loading,
}) => {
  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (!isOpen) return null;

  return (
    <Modal show={isOpen} onClose={onClose} size="2xl">
      <ModalHeader>
        <div className="flex items-center justify-between w-full">
          <h2 className="text-xl font-semibold text-gray-800">Ticket Details</h2>
          {/* <button
            onClick={onClose}
            type="button"
            className="text-gray-400 hover:text-gray-600 transition-colors p-1 rounded-full hover:bg-gray-100"
          >
            <MdClose size={24} />
          </button> */}
        </div>
      </ModalHeader>

      <ModalBody className="max-h-[75vh] overflow-y-auto">
        {loading ? (
          <div className="flex justify-center items-center py-8">
            <Loader />
          </div>
        ) : ticketDetails ? (
          <div className="space-y-6">
            {/* Status and Priority */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label >
                    Status : 
                </Label>
                <span
                  className={`inline-flex items-center px-3 py-1 ml-2 rounded-full text-xs font-medium mt-1 ${
                    ticketDetails.status === 'open'
                      ? 'bg-yellow-100 text-yellow-800'
                      : ticketDetails.status === 'accepted'
                      ? 'bg-blue-100 text-blue-800'
                      : 'bg-green-100 text-green-800'
                  }`}
                >
                  {ticketDetails.status.charAt(0).toUpperCase() + ticketDetails.status.slice(1)}
                </span>
              </div>
              <div>
                <Label>
                    Priority :
                </Label>
                <span
                  className={`inline-flex items-center px-3 py-1 ml-2  rounded-full text-xs font-medium mt-1 ${
                    ticketDetails.priority === 'high'
                      ? 'bg-red-100 text-red-800'
                      : ticketDetails.priority === 'medium'
                      ? 'bg-yellow-100 text-yellow-800'
                      : 'bg-green-100 text-green-800'
                  }`}
                >
                  {ticketDetails.priority.charAt(0).toUpperCase() + ticketDetails.priority.slice(1)}
                </span>
              </div>
            </div>

            {/* Title */}
            <div>
              <Label>
                    Ticket Title :
                </Label>
              <p className="text-gray-900 font-medium text-lg mt-1">{ticketDetails.ticket_title}</p>
            </div>

            {/* Description */}
            <div>
              <Label>
                    Description :
                </Label>
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 mt-1">
                <p className="text-gray-900 whitespace-pre-wrap">
                  {ticketDetails.ticket_description}
                </p>
              </div>
            </div>

            {/* Created Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label>
                    Raised By :
                </Label>
                <p className="text-gray-900 font-medium mt-1">{ticketDetails.created_by}</p>
              </div>
              <div>
                <Label>
                    Created At :
                </Label>
                <p className="text-gray-900 mt-1">{formatDate(ticketDetails.created_at)}</p>
              </div>
            </div>

            {/* Accepted Info - Conditional */}
            {ticketDetails.accepted_by && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label>
                    Accepted By :
                </Label>
                  <p className="text-gray-900 font-medium mt-1">{ticketDetails.accepted_by}</p>
                </div>
                <div>
                  <Label>
                    Accepted At :
                </Label>
                  <p className="text-gray-900 mt-1">{formatDate(ticketDetails.accepted_at)}</p>
                </div>
              </div>
            )}

            {/* Resolved Info - Conditional */}
            {ticketDetails.resolve_by && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label>
                    Resolved By :
                </Label>
                  <p className="text-gray-900 font-medium mt-1">{ticketDetails.resolve_by}</p>
                </div>
                <div>
                  <Label>
                    Resolved At :
                </Label>
                  <p className="text-gray-900 mt-1">{formatDate(ticketDetails.resolve_at)}</p>
                </div>
              </div>
            )}

            {/* Resolution Remark */}
            {ticketDetails.resolve_remark && (
              <div>
                <Label>
                    Resolution Remark :
                </Label>
                <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 mt-1">
                  <p className="text-gray-900 whitespace-pre-wrap">
                    {ticketDetails.resolve_remark}
                  </p>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500">
            <p>Unable to load ticket details</p>
          </div>
        )}
      </ModalBody>

      <ModalFooter className="flex justify-end">
        <Button color="gray" onClick={onClose}>
          Close
        </Button>
      </ModalFooter>
    </Modal>
  );
};

export default TicketDetailsModal;
