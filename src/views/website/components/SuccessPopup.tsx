// src/components/SuccessPopup.tsx
import React from 'react';

interface SuccessPopupProps {
  isOpen: boolean;
  onClose: () => void;
  message: string;
  jobTitle?: string;
  companyName?: string;
  referenceId?: string;
}

const SuccessPopup: React.FC<SuccessPopupProps> = ({
  isOpen,
  onClose,
  message,
  jobTitle,
  companyName,
  referenceId,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-transparent bg-opacity-50 transition-opacity"
        onClick={onClose}
      />

      <div className="flex min-h-screen items-center justify-center p-4">
        <div className="relative transform overflow-hidden rounded-3xl bg-white shadow-2xl transition-all w-full max-w-md">
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute right-4 top-4 text-slate-400 hover:text-slate-600 z-10"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          {/* Popup Content */}
          <div className="p-8 text-center">
            {/* Success Icon */}
            <div className="mx-auto flex items-center justify-center h-24 w-24 rounded-full bg-emerald-100 mb-6">
              <svg className="h-12 w-12 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M5 13l4 4L19 7" />
              </svg>
            </div>

            {/* Title */}
            <h3 className="text-2xl font-bold text-slate-900 mb-2">
              Application Submitted! 🎉
            </h3>

            {/* Job Details */}
            {(jobTitle || companyName) && (
              <div className="mb-4 p-3 bg-slate-50 rounded-lg">
                {jobTitle && (
                  <p className="font-semibold text-slate-900">{jobTitle}</p>
                )}
                {companyName && (
                  <p className="text-sm text-slate-600">{companyName}</p>
                )}
              </div>
            )}

            {/* Message */}
            <div 
              className="text-slate-600 mb-6"
              dangerouslySetInnerHTML={{ __html: message }}
            />

            {/* Reference ID if available */}
            {referenceId && (
              <div className="mb-6 p-3 bg-blue-50 rounded-lg">
                <p className="text-sm text-blue-800 font-medium">Reference ID</p>
                <p className="text-lg font-bold text-blue-900">{referenceId}</p>
                <p className="text-xs text-blue-700 mt-1">Keep this for future reference</p>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex flex-col gap-3">
              <button
                onClick={onClose}
                className="w-full theme-bg text-white font-semibold py-3 px-6 rounded-2xl hover:from-emerald-700 hover:to-emerald-800 transition-all"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SuccessPopup;