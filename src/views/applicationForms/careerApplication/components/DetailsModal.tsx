import React, { useState } from 'react';
import { Button } from 'flowbite-react';
import { MdClose, MdDownload } from 'react-icons/md';
import { CareerApplication } from './CareerManagementTable';
import { TbLoader2 } from 'react-icons/tb';
import toast from 'react-hot-toast';
import { set } from 'lodash';

interface DetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  application: CareerApplication | null;
}

const DetailsModal: React.FC<DetailsModalProps> = ({ isOpen, onClose, application }) => {
  if (!isOpen || !application) return null;
  const [downloadLoading, setDownloadLoading] = useState(false);

    const handleDownloadResume = async (application: CareerApplication) => {
      const resumeUrl = application.candidate_details?.document || application.resume;
      if (!resumeUrl) {
        toast.error('No resume available for download');
        return;
      }
  
      try { 
        setDownloadLoading(true); 
        const fullUrl = `${resumeUrl}`;
        const response = await fetch(fullUrl);
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        const filename = resumeUrl.split('/').pop() || 'resume.pdf';
        link.download = filename;
        document.body.appendChild(link);
        link.click();
        link.remove();
        window.URL.revokeObjectURL(url);
  
        toast.success('Resume downloaded successfully');
      } catch (error) {
        console.error('Error downloading resume:', error);
        toast.error('Failed to download resume');
      } finally {
        setDownloadLoading(false);
      }
    };

  return (
    <div className="fixed inset-0 backdrop-blur-md bg-white/10 bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b">
          <div>
            <h3 className="text-xl font-semibold text-gray-900">
              Application Details
            </h3>
            <p className="text-sm text-gray-500 mt-1">
              Reference ID: {application.refference_id}
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 p-2 rounded-full hover:bg-gray-100"
          >
            <MdClose className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Basic Information */}
            <div className="space-y-4">
              <div>
                <h4 className="text-lg font-medium text-gray-900 mb-4">Basic Information</h4>
                <div className="space-y-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-500">Full Name</label>
                    <p className="mt-1 text-sm text-gray-900">{application.name}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-500">Email Address</label>
                    <p className="mt-1 text-sm text-gray-900">{application.email}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-500">Mobile Number</label>
                    <p className="mt-1 text-sm text-gray-900">{application.mobile}</p>
                  </div>
                </div>
              </div>

              {/* Job Information */}
              <div>
                <h4 className="text-lg font-medium text-gray-900 mb-4">Job Information</h4>
                <div className="space-y-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-500">Job Title</label>
                    <p className="mt-1 text-sm text-gray-900">{application.job_title || 'N/A'}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Additional Information */}
            <div className="space-y-4">
              {/* Status Information */}
              <div>
                <h4 className="text-lg font-medium text-gray-900 mb-4">Status Information</h4>
                <div className="space-y-3">
                  {/* <div>
                    <label className="block text-sm font-medium text-gray-500">Application Status</label>
                    <div className="mt-1">
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                        {application.status === 1 ? 'Applied' : 
                         application.status === 2 ? 'Shortlisted' :
                         application.status === 3 ? 'Interview' :
                         application.status === 4 ? 'Offer' :
                         application.status === 5 ? 'Hired' :
                         application.status === 6 ? 'Rejected' : 'Unknown'}
                      </span>
                    </div>
                  </div>*/}
                  <div> 
                    <label className="block text-sm font-medium text-gray-500">Reference ID</label>
                    <p className="mt-1 text-sm text-gray-900">{application.refference_id}</p>
                  </div>
                  {application.created_at && (
                    <div>
                      <label className="block text-sm font-medium text-gray-500">Applied Date</label>
                      <p className="mt-1 text-sm text-gray-900">
                        {new Date(application.created_at).toLocaleDateString()}
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Documents Information */}
              <div>
                <h4 className="text-lg font-medium text-gray-900 mb-4">Documents</h4>
                <div className="space-y-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-500">Resume</label>
                    {application.resume || application.candidate_details?.document ? (
                      // <div className="mt-1 min-w-5">
                      //   <span className="text-sm max-w-full text-blue-600 hover:text-blue-800 cursor-pointer">
                      //     {application.resume}
                      //   </span>
                      // </div>
                      <Button
                                      onClick={() => handleDownloadResume(application)}
                                      className="flex items-center mt-2 bg-blue-600 hover:bg-blue-700 text-white"
                                      disabled={downloadLoading}
                                    >
                                      {downloadLoading ? (
                                        <>
                                          <TbLoader2 className="w-4 h-4 mr-2 animate-spin" />
                                          Downloading...
                                        </>
                                      ) : (
                                        <>
                                          <MdDownload className="w-4 h-4" />
                                          <span>Download</span>
                                        </>
                                      )}
                                    </Button>
                    ) : (
                      <p className="mt-1 text-sm text-gray-500">No document uploaded</p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 flex justify-end space-x-3">
          <Button
            onClick={onClose}
            color="gray"
            className="bg-gray-100 hover:bg-gray-200 text-gray-700"
          >
            Close
          </Button>
        </div>
      </div>
    </div>
  );
};

export default DetailsModal;