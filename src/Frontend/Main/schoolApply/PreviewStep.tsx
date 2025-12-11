// components/FormSteps/PreviewStep.tsx
import React, { useEffect } from 'react';
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
  onPayment,
}) => {
  const formatPrice = (amount: number) => {
    return `₹ ${amount.toLocaleString('en-IN')}`;
  };

      useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  const shouldDisplayField = (child: any) => {
    // Skip buttons in preview
    if (child.type === 'button') return false;

    // Skip conditional fields that don't meet conditions
    if (child.v_target) {
      const targetValue = formData[`s_${child.h_target}`];
      if (!child.v_target.split(',').includes(targetValue)) {
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
            <input
              type="checkbox"
              checked={isChecked}
              disabled
              className="w-4 h-4 rounded border-2 cursor-not-allowed
          disabled:opacity-70 disabled:bg-gray-200"
            />
            <span className="text-gray-800">{child.content}</span>
          </div>
        );

      case 'select':
        const displayValue = formData[`s_${child.name}`] || formData[child.name];
        let displayText = 'Not provided';

        if (displayValue) {
          // Extract text from value$text format
          if (typeof displayValue === 'string' && displayValue.includes('$')) {
            displayText = displayValue.split('$')[1] || displayValue;
          } else {
            displayText = displayValue;
          }
        }

        return <span className="text-gray-800">{displayText}</span>;

      case 'text':
      case 'number':
      case 'email':
      case 'tel':
        return <span className="text-gray-800">{formData[child.name] || 'Not provided'}</span>;

      case 'textarea':
        return (
          <span className="text-gray-800 whitespace-pre-wrap">
            {formData[child.name] || 'Not provided'}
          </span>
        );

      case 'date':
        const dateValue = formData[child.name];
        if (dateValue) {
          try {
            const formattedDate = new Date(dateValue).toLocaleDateString('en-IN');
            return <span className="text-gray-800">{formattedDate}</span>;
          } catch {
            return <span className="text-gray-800">{dateValue}</span>;
          }
        }
        return <span className="text-gray-800">Not provided</span>;

      case 'para':
        return (
          <div className="w-full">
            <p className="text-gray-600 text-sm leading-relaxed">{child.content}</p>
          </div>
        );

      case 'file_button':
        if (fileData[child.name]) {
          return (
            <div className="text-center space-y-3">
              <div className="bg-gray-50 p-3 rounded-xl border-2 border-dashed border-green-500">
                <div className="mx-auto w-20 h-20 bg-gray-100 rounded-lg flex items-center justify-center mb-2 overflow-hidden">
                  <img
                    src={fileData[child.name]}
                    alt={child.label}
                    className="w-full h-full object-cover rounded-lg"
                  />
                </div>
                <p className="text-xs text-gray-600 mb-2">{child.content}</p>
                <div className="bg-gradient-to-r from-green-600 to-green-700 text-white px-3 py-1 rounded-lg text-xs font-semibold">
                  ✓ Uploaded
                </div>
              </div>
            </div>
          );
        } else {
          return (
            <div className="text-center space-y-3">
              <div className="bg-gray-50 p-3 rounded-xl border-2 border-dashed border-gray-300">
                <div className="mx-auto w-20 h-20 bg-gray-100 rounded-lg flex items-center justify-center mb-2">
                  <Icon icon="solar:upload-line-duotone" className="w-8 h-8 text-gray-400" />
                </div>
                <p className="text-xs text-gray-600 mb-2">{child.content}</p>
                <div className="bg-gradient-to-r from-gray-400 to-gray-500 text-white px-3 py-1 rounded-lg text-xs font-semibold">
                  Not Uploaded
                </div>
              </div>
            </div>
          );
        }

      case 'adhar':
        let aadhaarNumber = '';
        for (let i = 0; i < 12; i++) {
          const digit = formData[`${child.name}_${i}`];
          aadhaarNumber += digit || '';
        }

        if (aadhaarNumber.length === 12) {
          // Format as XXXX XXXX XXXX
          const formattedAadhaar = aadhaarNumber.replace(/(\d{4})(\d{4})(\d{4})/, '$1 $2 $3');
          return (
            <div className="flex gap-2 items-center">
              {Array.from({ length: 12 }, (_, index) => (
                <div
                  key={index}
                  className="w-10 h-10 text-center border border-gray-300 rounded-lg bg-white flex items-center justify-center text-lg font-semibold text-gray-800"
                >
                  {aadhaarNumber[index] || 'X'}
                </div>
              ))}
              {/* <button
                type="button"
                className="p-2 text-gray-400 hover:text-blue-600 transition-colors"
              >
                <Icon
                  icon={
                    formData[`${child.name}_visible`]
                      ? 'solar:eye-line-duotone'
                      : 'solar:eye-closed-line-duotone'
                  }
                  className="w-5 h-5"
                />
              </button> */}
            </div>
          );
        } else {
          return (
            <div className="flex gap-2 items-center">
              {Array.from({ length: 12 }, (_, index) => (
                <div
                  key={index}
                  className="w-10 h-10 text-center border border-gray-300 rounded-lg bg-gray-100 flex items-center justify-center text-lg font-semibold text-gray-400"
                >
                  X
                </div>
              ))}
              <div className="p-2 text-gray-400">
                <Icon icon="solar:eye-closed-line-duotone" className="w-5 h-5" />
              </div>
            </div>
          );
        }

      case 'radio':
        const radioValue = formData[child.name];
        let radioDisplayText = 'Not provided';

        if (radioValue && child.options) {
          const selectedOption = child.options.find((opt: any) => opt.value === radioValue);
          radioDisplayText = selectedOption ? selectedOption.text : radioValue;
        }

        return <span className="text-gray-800">{radioDisplayText}</span>;

      default:
        return <span className="text-gray-800">{formData[child.name] || 'Not provided'}</span>;
    }
  };

  console.log(dynamicBoxes);

  return (
    <div className="preview_form space-y-6">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-2xl font-bold text-blue-600 mb-2">Application Preview</h2>
        <p className="text-gray-600">Please review your application details before proceeding</p>
      </div>

      {/* Form Data Preview - Using EXACT same layout as FormStep */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 md:gap-6 w-full">
        {dynamicBoxes.map((box, boxIndex) => {
          const boxWidth = box.width || '100%';
          const boxWidthValue = parseInt(boxWidth);

          // Simple column span calculation - SAME AS FORM STEP
          const getGridCols = () => {
            if (boxWidthValue >= 70 && boxWidthValue <= 80) return 'lg:col-span-9';
            if (boxWidthValue >= 20 && boxWidthValue <= 30) return 'lg:col-span-3';
            if (boxWidthValue >= 45 && boxWidthValue <= 55) return 'lg:col-span-6';
            return 'lg:col-span-12';
          };

          return (
            <div
              key={boxIndex}
              className={`col-span-12 ${getGridCols()} bg-white rounded-xl shadow-sm border border-gray-200 p-4 md:p-6 transition-all duration-300 hover:shadow-lg hover:border-blue-300 group`}
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
                    <h3 className="text-lg font-semibold text-gray-800 group-hover:text-blue-700 transition-colors">
                      {box.title}
                    </h3>
                    {box.description && (
                      <p className="text-sm text-gray-600 mt-1">{box.description}</p>
                    )}
                  </div>
                </div>
              )}

              {/* Box Content with EXACT same grid system as FormStep */}
              <div className="w-full">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
                  {box.children.filter(shouldDisplayField).map((child: any, childIndex: number) => {
                    if (child.v_target) {
                      const targetValue = formData[`s_${child.h_target}`];
                      if (!child.v_target.split(',').includes(targetValue)) {
                        return null;
                      }
                    }

                    const childWidth = child.width || '100%';
                    const childWidthValue = parseInt(childWidth);

                    // Calculate column span based on width percentage - SAME LOGIC
                    const getColumnSpan = () => {
                      // Full width elements
                      // if (
                      //   child.type === 'heading' ||
                      //   child.type === 'heading2' ||
                      //   child.type === 'para' ||
                      //   child.type === 'adhar'
                      // ) {
                      //   return 'full';
                      // }

                      // Width-based spans
                      if (childWidthValue >= 80) return 'full';
                      if (childWidthValue >= 60) return 'span-2';
                      if (childWidthValue >= 40) return 'span-2';
                      if (childWidthValue >= 30) return 'span-1';
                      if (childWidthValue >= 20) return 'span-1';
                      return 'span-1';
                    };

                    const spanClass = {
                      full: 'col-span-full',
                      'span-2': 'col-span-2',
                      'span-1': 'col-span-1',
                    }[getColumnSpan()];

                    return (
                      <div
                        key={childIndex}
                        className={`${spanClass} transition-all duration-200`}
                        style={{
                          minWidth: '150px',
                          ...(child.type === 'file_button'
                            ? {
                                display: 'flex',
                                justifyContent: 'center',
                                alignItems: 'center',
                                flexDirection: 'column',
                              }
                            : {}),
                        }}
                      >
                        {/* Don't show label for heading types */}
                        {child.type !== 'heading' &&
                          child.type !== 'heading2' &&
                          child.type !== 'para' && (
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                              {child.label}
                              {/* {child.required && <span className="text-red-500 ml-1">*</span>} */}
                            </label>
                          )}

                        {/* Field Value Display */}
                        <div
                          className={`
                            ${
                              child.type === 'heading' ||
                              child.type === 'heading2' ||
                              child.type === 'para'
                                ? ''
                                : 'min-h-12 p-3 border border-gray-200 rounded-lg bg-gray-50 flex items-center hover:border-blue-300 hover:bg-blue-50 transition-all duration-200'
                            }
                            ${
                              child.type === 'file_button'
                                ? 'bg-transparent border-0 p-0 hover:bg-transparent'
                                : ''
                            }
                            ${
                              child.type === 'checkbox'
                                ? 'bg-transparent border-0 p-0 hover:bg-transparent'
                                : ''
                            }
                            ${child.type === 'adhar' ? 'min-h-20' : ''}
                          `}
                        >
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
            <h3 className="text-center text-xl font-bold text-green-600 mb-4">Payment Summary</h3>

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
