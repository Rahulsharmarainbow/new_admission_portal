import React from 'react';
import { Modal, Button } from 'flowbite-react';
import { Application } from '../ApplicationManagementTable';

interface ApplicationDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  application: Application | null;
}

const ApplicationDetailModal: React.FC<ApplicationDetailModalProps> = ({
  isOpen,
  onClose,
  application,
}) => {
  if (!application) return null;

  const apiUrl = import.meta.env.VITE_API_URL;

  return (
    <Modal show={isOpen} onClose={onClose} size="4xl">
      {/* Modal Header */}
      <div className="flex items-center justify-between p-6 border-b rounded-t dark:border-gray-600">
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
          Application Details - {application.applicant_name}
        </h3>
        <button
          type="button"
          className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white"
          onClick={onClose}
        >
          <svg className="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
            <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"/>
          </svg>
          <span className="sr-only">Close modal</span>
        </button>
      </div>

      {/* Modal Body */}
      <div className="p-6 space-y-6 max-h-[70vh] overflow-y-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Personal Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">
              Personal Information
            </h3>
            
            <div className="flex items-center space-x-4">
              <div className="flex-shrink-0">
                {application.candidate_pic ? (
                  <img
                    src={`${apiUrl}/${application.candidate_pic}`}
                    alt="Candidate"
                    className="w-24 h-24 rounded-full object-cover border-2 border-blue-200"
                  />
                ) : (
                  <div className="w-24 h-24 rounded-full bg-gray-200 flex items-center justify-center border-2 border-blue-200">
                    <span className="text-sm text-gray-500">No Image</span>
                  </div>
                )}
              </div>
              <div>
                <h4 className="text-xl font-bold text-gray-900">
                  {application.applicant_name}
                </h4>
                <p className="text-gray-600">Roll No: {application.roll_no}</p>
                <p className="text-gray-600">Year: {application.year}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Gender</label>
                <p className="mt-1 text-sm text-gray-900">
                  {application.gender === '1' ? 'Male' : application.gender === '2' ? 'Female' : 'N/A'}
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Email</label>
                <p className="mt-1 text-sm text-gray-900">
                  {application.email || 'N/A'}
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Mobile</label>
                <p className="mt-1 text-sm text-gray-900">
                  {application.mobile_no || 'N/A'}
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Applied Date</label>
                <p className="mt-1 text-sm text-gray-900">
                  {new Date(application.created_at).toLocaleDateString()}
                </p>
              </div>
            </div>
          </div>

          {/* Academic Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">
              Academic Information
            </h3>
            
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-700">Academic Name</label>
                <p className="mt-1 text-sm text-gray-900">{application.academic_name}</p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700">Class</label>
                <p className="mt-1 text-sm text-gray-900">{application.class_name || 'N/A'}</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Payment Status</label>
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                  application.payment_status === '1' 
                    ? 'text-green-800 bg-green-100' 
                    : 'text-red-800 bg-red-100'
                }`}>
                  {application.payment_status === '1' ? 'Paid' : 'Unpaid'}
                </span>
              </div>
            </div>

            {/* Signature */}
            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Candidate Signature
              </label>
              {application.candidate_signature ? (
                <img
                  src={`${apiUrl}/${application.candidate_signature}`}
                  alt="Signature"
                  className="w-40 h-20 object-contain border rounded"
                />
              ) : (
                <div className="w-40 h-20 bg-gray-100 flex items-center justify-center border rounded">
                  <span className="text-sm text-gray-500">No Signature</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Additional details can be added here based on the API response */}
        <div className="mt-6 p-4 bg-gray-50 rounded-lg">
          <h3 className="text-lg font-semibold text-gray-900 mb-3">
            Additional Information
          </h3>
          <p className="text-sm text-gray-600">
            More detailed information about the application would be displayed here based on the API response.
          </p>
        </div>
      </div>

      {/* Modal Footer */}
      <div className="flex items-center p-6 border-t border-gray-200 rounded-b dark:border-gray-600">
        <Button onClick={onClose} color="alternative" className="mr-3">
          Close
        </Button>
        <Button color="blue">
          Edit Application
        </Button>
      </div>
    </Modal>
  );
};

export default ApplicationDetailModal;