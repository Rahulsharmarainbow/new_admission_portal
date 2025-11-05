// components/FormSteps/PreviewStep.tsx
import React from 'react';
import { Icon } from '@iconify/react';

interface PreviewStepProps {
  dynamicBoxes: any[];
  formData: { [key: string]: any };
  fileData: { [key: string]: any };
  payableAmount?: number;
  onEdit?: () => void;
  onPayment?: () => void;
}

const PreviewStep: React.FC<PreviewStepProps> = ({
  dynamicBoxes,
  formData,
  fileData,
  payableAmount = 0,
  onEdit,
  onPayment
}) => {
  const formatPrice = (amount: number) => {
    return `₹ ${amount.toLocaleString('en-IN')}`;
  };

  const renderFieldValue = (child: any) => {
    if (child.type === 'select') {
      return formData[`s_${child.name}`] || formData[child.name] || 'N/A';
    } else if (child.type === 'file_button') {
      return fileData[child.name] ? (
        <img
          src={fileData[child.name].previewUrl}
          alt={child.label}
          className="w-24 h-24 object-cover rounded-lg border-2 border-gray-200"
        />
      ) : (
        <div className="text-gray-400 text-sm">Not Uploaded</div>
      );
    } else if (child.type === 'image') {
      return formData[child.name] ? (
        <img
          src={formData[child.name]}
          alt={child.label}
          className="w-24 h-24 object-cover rounded-lg border-2 border-gray-200"
        />
      ) : (
        <div className="text-gray-400 text-sm">N/A</div>
      );
    } else if (child.type === 'heading' || child.type === 'heading2' || child.type === 'para') {
      return null;
    } else {
      return <div className="text-gray-800">{formData[child.name] || 'N/A'}</div>;
    }
  };

  const shouldDisplayField = (child: any) => {
    return !['heading', 'heading2', 'para', 'button'].includes(child.type);
  };

  return (
    <div className="preview_form space-y-6">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-2xl font-bold text-blue-600 mb-2">Application Preview</h2>
        <p className="text-gray-600">Please review your application details before proceeding</p>
      </div>

      {/* Form Data Preview */}
      {dynamicBoxes.map((box, boxIndex) => (
        <div key={boxIndex} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {box.children
                .filter(shouldDisplayField)
                .map((child: any, childIndex: number) => (
                <div key={childIndex} className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-700">
                    {child.label}
                  </label>
                  <div className="min-h-12 p-3 border border-gray-200 rounded-lg bg-gray-50 flex items-center">
                    {renderFieldValue(child)}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      ))}

      {/* Payment Summary */}
      {payableAmount > 0 && (
        <div className="bg-white rounded-xl shadow-md border-2 border-blue-200 overflow-hidden">
          <div className="p-6">
            <h3 className="text-center text-xl font-bold text-green-600 mb-4">
              Payment Summary
            </h3>
            
            <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
              <table className="w-full">
                <thead>
                  <tr className="bg-blue-50">
                    <th className="text-left p-4 font-bold text-gray-700 border-b border-gray-200">
                      Description
                    </th>
                    <th className="text-right p-4 font-bold text-gray-700 border-b border-gray-200">
                      Amount
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="p-4 font-medium text-gray-800 border-b border-gray-100">
                      Total Payable Fee
                    </td>
                    <td className="p-4 text-right font-bold text-green-600 border-b border-gray-100">
                      {formatPrice(payableAmount)}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <div className="flex items-center justify-center text-yellow-700">
                <Icon icon="solar:info-circle-line-duotone" className="w-5 h-5 mr-2" />
                <span className="text-sm font-medium">
                  Please review all information carefully before proceeding to payment.
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex justify-center gap-4 mt-8">
        {onEdit && (
          <button
            onClick={onEdit}
            className="flex items-center gap-2 px-6 py-3 border-2 border-blue-600 text-blue-600 rounded-lg font-semibold hover:bg-blue-50 hover:shadow-md transition-all duration-200"
          >
            <Icon icon="solar:edit-line-duotone" className="w-5 h-5" />
            Edit Application
          </button>
        )}
        
        {onPayment && payableAmount > 0 && (
          <button
            onClick={onPayment}
            className="flex items-center gap-2 px-6 py-3 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 hover:shadow-lg transform hover:scale-105 transition-all duration-200"
          >
            <Icon icon="solar:card-line-duotone" className="w-5 h-5" />
            Proceed to Pay {formatPrice(payableAmount)}
          </button>
        )}
      </div>
    </div>
  );
};

export default PreviewStep;