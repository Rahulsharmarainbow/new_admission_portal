// components/FormSteps/SuccessStep.tsx
import React, { useState } from 'react';
import { Icon } from '@iconify/react';

interface SuccessStepProps {
  applicationId: string;
  transactionId?: string;
  amount?: number;
  onDownloadReceipt: (applicationId: string) => Promise<void>;
  onNewApplication?: () => void;
}

const SuccessStep: React.FC<SuccessStepProps> = ({
  applicationId,
  transactionId,
  amount,
  onDownloadReceipt,
  onNewApplication
}) => {
  const [downloading, setDownloading] = useState(false);

  const handleDownload = async () => {
    setDownloading(true);
    try {
      await onDownloadReceipt(applicationId);
    } catch (error) {
      console.error('Download failed:', error);
    } finally {
      setDownloading(false);
      onNewApplication && onNewApplication();
    }
  };

  const formatPrice = (amount: number) => {
    return `₹ ${amount?.toLocaleString('en-IN')}`;
  };

  return (
    <div className="text-center space-y-8">
      {/* Success Icon */}
      <div className="mb-6">
        <div className="relative inline-flex">
          <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center">
            <Icon 
              icon="solar:check-circle-line-duotone" 
              className="w-16 h-16 text-green-500" 
            />
          </div>
          <div className="absolute inset-0 animate-ping bg-green-200 rounded-full opacity-75"></div>
        </div>
      </div>

      {/* Success Message */}
      <div>
        <h1 className="text-3xl font-bold text-green-600 mb-4">
          Registration Successful!
        </h1>
        
        <p className="text-gray-600 text-lg max-w-2xl mx-auto leading-relaxed">
          Thank you for registering with us. Your application has been successfully submitted. 
          Our team is currently reviewing your information and will reach out to you shortly 
          with further details. We appreciate your patience and look forward to assisting you soon.
        </p>
      </div>

      {/* Application Details Card */}
      <div className="max-w-md mx-auto bg-white rounded-2xl shadow-lg border-2 border-green-200 overflow-hidden">
        <div className="p-6">
          <h3 className="text-xl font-bold text-gray-800 mb-4">
            Application Details
          </h3>
          
          <div className="space-y-4 text-left">
            <div className="flex justify-between items-center">
              <span className="text-gray-600 font-medium">Application ID:</span>
              <span className="font-semibold text-blue-600">
                {applicationId || 'N/A'}
              </span>
            </div>
            
            {transactionId && (
              <div className="flex justify-between items-center">
                <span className="text-gray-600 font-medium">Transaction ID:</span>
                <span className="font-semibold text-gray-800">
                  {transactionId}
                </span>
              </div>
            )}
            
            {amount && (
              <div className="flex justify-between items-center">
                <span className="text-gray-600 font-medium">Amount Paid:</span>
                <span className="font-semibold text-green-600">
                  {formatPrice(amount)}
                </span>
              </div>
            )}
            
            <div className="flex justify-between items-center">
              <span className="text-gray-600 font-medium">Status:</span>
              <span className="font-semibold text-green-600 flex items-center gap-2">
                <Icon icon="solar:check-circle-line-duotone" className="w-4 h-4" />
                Completed
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Success Alert */}
      <div className="max-w-2xl mx-auto p-4 bg-green-50 border border-green-200 rounded-lg">
        <div className="flex items-center justify-center text-green-700">
          <Icon icon="solar:check-circle-line-duotone" className="w-5 h-5 mr-2" />
          <span className="font-medium">
            Your application has been processed successfully. You will receive a confirmation email shortly.
          </span>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex justify-center gap-4 flex-wrap">
        <button
          onClick={handleDownload}
          disabled={downloading}
          className={`flex items-center gap-2 px-6 py-3 rounded-lg font-semibold text-white transition-all duration-200 ${
            downloading
              ? 'bg-gray-400 cursor-not-allowed'
              : 'bg-blue-600 hover:bg-blue-700 hover:shadow-lg transform hover:scale-105'
          }`}
        >
          {downloading ? (
            <>
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              Downloading...
            </>
          ) : (
            <>
              <Icon icon="solar:download-line-duotone" className="w-5 h-5" />
              Download Receipt
            </>
          )}
        </button>

        {onNewApplication && (
          <button
            onClick={onNewApplication}
            className="flex items-center gap-2 px-6 py-3 border-2 border-green-600 text-green-600 rounded-lg font-semibold hover:bg-green-50 hover:shadow-md transition-all duration-200"
          >
            <Icon icon="solar:document-add-line-duotone" className="w-5 h-5" />
            New Application
          </button>
        )}
      </div>
    </div>
  );
};

export default SuccessStep;