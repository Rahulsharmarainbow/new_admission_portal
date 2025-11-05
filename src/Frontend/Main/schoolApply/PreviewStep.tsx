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

  console.log('xxxxxxxxx:', dynamicBoxes);
  const formatPrice = (amount: number) => {
    return `₹ ${amount.toLocaleString('en-IN')}`;
  };

const shouldDisplayField = (child: any) => {
  // Skip buttons in preview
  if (child.type === 'button') return false;
  
  // Skip conditional fields that don't meet conditions
  if (child.v_target) {
    const targetValue = formData[`s_${child.h_target}`];
    if (!child.v_target.split(",").includes(targetValue)) {
      return false;
    }
  }
  
  return true;
};

// Complete renderFieldValue function with all types
const renderFieldValue = (child: any) => {
  switch (child.type) {
    case 'heading':
      return (
        <div className="text-start w-full">
          <h4 className="text-lg font-bold text-[#dc2626] inline-flex items-center">
            <Icon icon={child.icon || 'solar:document-line-duotone'} className="w-4 h-4 mr-2" />
            {child.content}
          </h4>
        </div>
      );

    case 'heading2':
      return (
        <div className="w-full">
          <p className="text-base font-semibold text-gray-800 mb-0">
            <b>{child.content}</b>
          </p>
        </div>
      );

    case 'checkbox':
      const isChecked = formData[child.name] === 1;
      return (
        <div className="flex items-center space-x-2">
          <div className={`w-4 h-4 rounded border-2 flex items-center justify-center ${
            isChecked 
              ? 'bg-blue-600 border-blue-600' 
              : 'bg-white border-gray-300'
          }`}>
            {isChecked && (
              <Icon icon="solar:check-line-duotone" className="w-3 h-3 text-white" />
            )}
          </div>
          <span className="text-gray-800">{isChecked ? 'Yes' : 'No'}</span>
        </div>
      );

    case 'select':
      const displayValue = formData[`s_${child.name}`] || formData[child.name];
      let displayText = 'N/A';
      
      if (displayValue) {
        // Extract text from value$text format
        if (typeof displayValue === 'string' && displayValue.includes('$')) {
          displayText = displayValue.split('$')[1] || displayValue;
        } else {
          displayText = displayValue;
        }
      }
      
      return <div className="text-gray-800" style={{width: displayValue.width}}>{displayText}</div>;

    case 'text':
    case 'number':
    case 'email':
    case 'tel':
      return <div className="text-gray-800">{formData[child.name] || 'N/A'}</div>;

    case 'textarea':
      return <div className="text-gray-800 whitespace-pre-wrap">{formData[child.name] || 'N/A'}</div>;

    case 'date':
      const dateValue = formData[child.name];
      if (dateValue) {
        try {
          const formattedDate = new Date(dateValue).toLocaleDateString('en-IN');
          return <div className="text-gray-800">{formattedDate}</div>;
        } catch {
          return <div className="text-gray-800">{dateValue}</div>;
        }
      }
      return <div className="text-gray-800">N/A</div>;

    case 'para':
      return (
        <div className="w-full">
          <p className="text-gray-600 text-sm leading-relaxed">{child.content}</p>
        </div>
      );

    case 'file_button':
      if (fileData[child.name]) {
        return (
          <div className="flex flex-col items-center space-y-2">
            <img
              src={fileData[child.name].previewUrl || fileData[child.name]}
              alt={child.label}
              className="w-24 h-24 object-cover rounded-lg border-2 border-gray-200"
            />
            <span className="text-xs text-green-600 font-medium">Uploaded</span>
          </div>
        );
      } else {
        return (
          <div className="flex flex-col items-center space-y-2 text-gray-400">
            <Icon icon="solar:upload-line-duotone" className="w-8 h-8" />
            <span className="text-xs">Not Uploaded</span>
          </div>
        );
      }

    // case 'image':
    //   const imageSrc = fileData[child.name]?.previewUrl || formData[child.name] || child.src;
    //   if (imageSrc) {
    //     return (
    //       <div className="flex flex-col items-center space-y-2">
    //         <img
    //           src={imageSrc}
    //           alt={child.alt || child.label}
    //           className="max-w-full h-auto max-h-32 object-contain rounded-lg border-2 border-gray-200"
    //         />
    //         <span className="text-xs text-gray-600">Image</span>
    //       </div>
    //     );
    //   } else {
    //     return (
    //       <div className="text-gray-400 text-sm">N/A</div>
    //     );
    //   }

    case 'adhar':
      let aadhaarNumber = '';
      for (let i = 0; i < 12; i++) {
        const digit = formData[`${child.name}_${i}`];
        aadhaarNumber += digit || '';
      }
      
      if (aadhaarNumber.length === 12) {
        // Format as XXXX XXXX XXXX
        const formattedAadhaar = aadhaarNumber.replace(/(\d{4})(\d{4})(\d{4})/, '$1 $2 $3');
        return <div className="text-gray-800 font-mono">{formattedAadhaar}</div>;
      } else {
        return <div className="text-gray-800">N/A</div>;
      }

    case 'radio':
      const radioValue = formData[child.name];
      let radioDisplayText = 'N/A';
      
      if (radioValue && child.options) {
        const selectedOption = child.options.find((opt: any) => opt.value === radioValue);
        radioDisplayText = selectedOption ? selectedOption.text : radioValue;
      }
      
      return <div className="text-gray-800">{radioDisplayText}</div>;

    default:
      console.warn(`Unknown field type in preview: ${child.type}`);
      return <div className="text-gray-800">{formData[child.name] || 'N/A'}</div>;
  }
};
  // const shouldDisplayField = (child: any) => {
  //   return !['heading', 'heading2', 'para', 'button'].includes(child.type);
  // };

  return (
    <div className="preview_form space-y-6">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-2xl font-bold text-blue-600 mb-2">Application Preview</h2>
        <p className="text-gray-600">Please review your application details before proceeding</p>
      </div>

      {/* Form Data Preview */}
      <div className="grid grid-cols-1 xs:grid-cols-2 md:grid-cols-12 gap-4 md:gap-6 w-full auto-rows-min">
  {dynamicBoxes.map((box, boxIndex) => {
    const boxWidth = parseInt(box.width || '100%');
    const columnSpan = Math.max(1, Math.min(12, Math.round((boxWidth / 100) * 12)));

    const getColClass = (span: number) => {
      const baseClass = 'col-span-1';

      if (span <= 3) {
        return `${baseClass} xs:col-span-1 md:col-span-${span}`;
      } else if (span <= 6) {
        return `${baseClass} xs:col-span-2 md:col-span-${span}`;
      } else if (span <= 9) {
        return `${baseClass} xs:col-span-2 md:col-span-6 lg:col-span-${span}`;
      } else {
        return `${baseClass} xs:col-span-2 md:col-span-12 lg:col-span-${span}`;
      }
    };

    const colClass = getColClass(columnSpan);

    return (
      <div
        key={boxIndex}
        className={`${colClass} bg-white rounded-xl shadow-sm border border-gray-200 p-4 md:p-6 transition-all duration-300 group`}
      >
        {/* Box Header with optional icon */}
        {box.title && (
          <div className="flex items-center gap-3 mb-4 pb-3 border-b border-gray-100">
            {box.icon && (
              <div className="p-2 bg-blue-100 rounded-lg text-blue-600">
                <Icon icon={box.icon} className="w-5 h-5" />
              </div>
            )}
            <div>
              <h3 className="text-lg font-semibold text-gray-800">
                {box.title}
              </h3>
              {box.description && (
                <p className="text-sm text-gray-600 mt-1">{box.description}</p>
              )}
            </div>
          </div>
        )}

        {/* Box Content with same grid system as FormStep */}
        <div className="w-full">
          <div
            className="grid gap-3 md:gap-4 auto-rows-min"
            style={{
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
              justifyContent: box.justify || 'stretch',
              alignItems: box.align || 'start',
            }}
          >
            {box.children
              .filter(shouldDisplayField)
              .map((child: any, childIndex: number) => {
                const childWidth = child.width || '100%';
                const childWidthValue = parseInt(childWidth);

                // Smart grid column span calculation (same as FormStep)
                const getColumnSpan = () => {
                  if (child.type === 'heading' || child.type === 'heading2' || child.type === 'para') {
                    return 'full';
                  }
                  if (childWidthValue >= 95) return 'full';
                  if (childWidthValue >= 80) return 'wide';
                  if (childWidthValue >= 60) return 'medium';
                  return 'normal';
                };

                const spanClass = {
                  'full': 'col-span-full',
                  'wide': 'col-span-full md:col-span-2',
                  'medium': 'col-span-full sm:col-span-1 md:col-span-2',
                  'normal': 'col-span-full sm:col-span-1'
                }[getColumnSpan()];

                return (
                  <div
                    key={childIndex}
                    className={`${spanClass} transition-all duration-200`}
                    style={{
                      minWidth: child.minWidth || '180px',
                      // Ensure proper width for different content types
                      ...(child.type === 'heading' || child.type === 'heading2' ? {
                        width: '100%',
                        gridColumn: '1 / -1'
                      } : {})
                    }}
                  >
                    {/* Don't show label for heading types */}
                    {(child.type !== 'heading' && child.type !== 'heading2' && child.type !== 'para') && (
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        {child.label}
                        {child.required && <span className="text-red-500 ml-1">*</span>}
                      </label>
                    )}
                    
                    {/* Field Value Display */}
                    <div className={`${
                      child.type === 'heading' || child.type === 'heading2' || child.type === 'para' 
                        ? '' 
                        : 'min-h-12 p-3 border border-gray-200 rounded-lg bg-gray-50 flex items-center'
                    }`}>
                      {renderFieldValue(child)}
                    </div>
                  </div>
                );
              })}
          </div>
        </div>
      </div>
    );
  })}
</div>

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