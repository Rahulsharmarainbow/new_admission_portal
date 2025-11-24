import React from 'react';
import { Icon } from '@iconify/react';
import toast from 'react-hot-toast';
import { max } from 'lodash';

interface FormStepProps {
  dynamicBoxes: any[];
  formData: { [key: string]: any };
  fileData: { [key: string]: any };
  errors: { [key: string]: string };
  formOptions: { [key: string]: any[] };
  onInputChange: (name: string, value: any, fieldConfig?: any) => void;
  onSelectChange: (name: string, value: any, fieldConfig?: any) => void;
  onCheckboxChange: (name: string, value: boolean, fieldConfig?: any) => void;
  onDateChange: (name: string, date: any, fieldConfig?: any) => void;
  onAadhaarChange: (index: number, value: string, name: string, fieldConfig?: any) => void;
  onFileChange: (name: string, file: File, previewUrl: string, fieldConfig?: any) => void;
  formRefs: React.MutableRefObject<{ [key: string]: any }>;
}

const FormStep: React.FC<FormStepProps> = ({
  dynamicBoxes,
  formData,
  fileData,
  errors,
  formOptions,
  onInputChange,
  onSelectChange,
  onCheckboxChange,
  onDateChange,
  onAadhaarChange,
  onFileChange,
  formRefs,
}) => {
  // console.log('Form data:', formData);
  // console.log('File data:', fileData);

  // console.log('erorrr', errors);
  const handleFileUpload = (
    event: React.ChangeEvent<HTMLInputElement>,
    fieldName: string,
    fieldConfig: any,
  ) => {
    const file = event.target.files?.[0];
    if (file) {
      // Validate file type
      if (!file.type.match(/image\/(jpeg|png)/)) {
        toast.error('Please upload a valid JPEG or PNG image.');
        return;
      }

      // Validate file size (1MB limit)
      if (file.size > 1048576) {
        toast.error('File size should be less than 1 MB.');
        return;
      }

      const previewUrl = URL.createObjectURL(file);
      onFileChange(fieldName, file, fieldConfig);
    }
  };

  const handleAadhaarVisibility = (name: string) => {
    const isVisible = !formData[`${name}_visible`];
    onInputChange(`${name}_visible`, isVisible);

    // Toggle input types
    const inputs = document.querySelectorAll(`input[name^="${name}_"]`);
    inputs.forEach((input: any) => {
      input.type = isVisible ? 'text' : 'password';
    });
  };

  // Resolution parse & dynamic styles
  const getPreviewBoxStyle = (resolution?: string) => {
    if (!resolution) return null;

    const [w, h] = resolution.split('x').map(Number);
    if (!w || !h) return null;

    // Apply only if width is much greater than height (signature like)
    if (w > h * 2) {
      return {
        width: `${w}px`,
        height: `${h}px`,
      };
    }

    return null;
  };

  const renderField = (child: any, boxIndex: number, childIndex: number) => {
    const commonProps = {
      key: `${boxIndex}-${childIndex}`,
      value: formData[child.name] || '',
      ref: (el: any) => {
        if (el) formRefs.current[child.name] = el;
      },
    };

    // Skip rendering if v_target condition doesn't meet
    if (child.v_target) {
      const targetValue = formData[`s_${child.h_target}`];
      if (!child.v_target.split(',').includes(targetValue)) {
        return null;
      }
    }

    const fieldConfig = {
      type: child.type,
      validation: child.validation,
      validation_message: child.validation_message,
      required: child.required,
      apiurl: child.apiurl,
      target: child.target,
      h_target: child.h_target,
      resolution: child.resolution,
      max_date: child.max_date,
    };

    // if (child.type === 'file_button') console.log(fieldConfig);

    switch (child.type) {
      case 'heading':
        return (
          <div className="text-start mb-6 w-full">
            <h4 className="text-lg font-bold text-[#dc2626] inline-flex items-center">
              <Icon icon={child.icon || 'solar:document-line-duotone'} className="w-4 h-4 mr-2" />
              {child.content}
            </h4>
          </div>
        );

      case 'heading2':
        return (
          <div className="mb-4 w-full">
            <p className="text-base font-semibold text-gray-800 mb-0">
              <b>{child.content}</b>
            </p>
          </div>
        );

      case 'checkbox':
        return (
          <div className="flex flex-col space-y-2">
            <div className="flex items-start space-x-3">
              <input
                type="checkbox"
                id={child.name}
                checked={formData[child.name] === 1}
                onChange={(e) => onCheckboxChange(child.name, e.target.checked, fieldConfig)}
                className={`w-4 h-4 mt-1 text-blue-600 border-gray-300 rounded focus:ring-blue-500 focus:ring-2 ${
                  errors[child.name] ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              <label
                htmlFor={child.name}
                className={`text-sm leading-tight ${
                  errors[child.name] ? 'text-red-600' : 'text-gray-700'
                }`}
              >
                {child.content}
                {child.required == 1 && <span className="text-red-500 ml-1">*</span>}
              </label>
            </div>
            {errors[child.name] && (
              <p className="text-red-500 text-xs mt-1 ml-7">{errors[child.name]}</p>
            )}
          </div>
        );

      case 'select':
        const selectOptions = formOptions[child.name] || child.options || [];
        return (
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-gray-700">
              {child.label}
              {child.required == 1 && <span className="text-red-500 ml-1">*</span>}
            </label>
            <select
              {...commonProps}
              onChange={(e) => onSelectChange(child.name, e.target.value, fieldConfig)}
              className={`w-full px-3 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200 appearance-none bg-white ${
                errors[child.name] ? 'border-red-500' : 'border-gray-300'
              }`}
            >
              <option value="">Select {child.label}</option>
              {selectOptions.map((option: any) => (
                <option key={option.value} value={`${option.value}$${option.text}`}>
                  {option.text}
                </option>
              ))}
            </select>
            {errors[child.name] && (
              <p className="text-red-500 text-xs mt-1">{errors[child.name]}</p>
            )}
          </div>
        );

      case 'text':
        return (
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-gray-700">
              {child.label}
              {child?.required == 1 && <span className="text-red-500 ml-1">*</span>}
            </label>
            <input
              {...commonProps}
              type="text"
              placeholder={child.placeholder}
              onChange={(e) => onInputChange(child.name, e.target.value, fieldConfig)}
              className={`w-full px-3 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200 ${
                errors[child.name] ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            {errors[child.name] && (
              <p className="text-red-500 text-xs mt-1">{errors[child.name]}</p>
            )}
          </div>
        );

      case 'date':
        // Calculate max date based on max_date configuration (maximum age)
        const getMaxDate = () => {
          if (child.max_date) {
            const today = new Date();
            const maxDate = new Date(
              today.getFullYear() - child.max_date,
              today.getMonth(),
              today.getDate(),
            );
            return maxDate.toISOString().split('T')[0];
          }
          return undefined;
        };

        // Calculate min date (optional, you can set this if needed)
        const getMinDate = () => {
          if (child.min_date) {
            const today = new Date();
            const minDate = new Date(
              today.getFullYear() - child.min_date,
              today.getMonth(),
              today.getDate(),
            );
            return minDate.toISOString().split('T')[0];
          }
          return undefined;
        };

        return (
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-gray-700">
              {child.label}
              {child.required == 1 && <span className="text-red-500 ml-1">*</span>}
            </label>
            <input
              {...commonProps}
              type="date"
              onChange={(e) => onDateChange(child.name, e.target.value, fieldConfig)}
              max={getMaxDate()} // This will restrict dates - hides recent years based on max_date
              min={getMinDate()} // Optional: for minimum age restriction
              className={`w-full px-3 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200 ${
                errors[child.name] ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            {errors[child.name] && (
              <p className="text-red-500 text-xs mt-1">{errors[child.name]}</p>
            )}
          </div>
        );

      case 'para':
        return (
          <div className="w-full">
            <p className="text-gray-600 text-sm leading-relaxed">{child.content}</p>
          </div>
        );

      case 'button':
        return (
          <button
            type="button"
            className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-4 py-2 rounded-lg font-semibold hover:shadow-lg transform hover:scale-105 transition-all duration-200"
          >
            {child.content}
          </button>
        );

      case 'file_button':
        const previewStyle = getPreviewBoxStyle(child.resolution);

        const handleCameraCapture = async (fieldName: string, fieldConfig: any) => {
          const input = document.createElement('input');
          input.type = 'file';
          input.accept = 'image/*';
          input.capture = 'environment'; // back camera
          input.onchange = (e: any) => {
            const file = e.target.files?.[0];
            if (!file) return;

            const previewUrl = URL.createObjectURL(file);
            // 👇 Camera photo ke liye resolution check SKIP
            onFileChange(fieldName, file, previewUrl, { ...fieldConfig, skipResolution: true });
          };
          input.click();
        };

        return (
          <div className="text-center space-y-3">
            <input
              type="file"
              id={child.name}
              className="hidden"
              onChange={(e) => handleFileUpload(e, child.name, fieldConfig)}
              accept="image/*;capture=camera"
              capture="environment"
            />

            <div className="bg-gray-50 p-3 rounded-xl border-2 border-dashed border-gray-300 hover:border-blue-500 transition-colors duration-200">
              <div
                className={`mx-auto bg-gray-100 rounded-lg flex items-center justify-center mb-2 overflow-hidden ${
                  previewStyle ? '' : 'w-20 h-20'
                }`}
                style={previewStyle || {}}
              >
                {fileData[child.name] ? (
                  <img
                    src={fileData[child.name]}
                    alt={child.label}
                    className="object-contain w-full h-full rounded-lg"
                  />
                ) : (
                  <Icon icon="solar:upload-line-duotone" className="w-8 h-8 text-gray-400" />
                )}
              </div>

              <p className="text-xs text-gray-600 mb-2">{child.content}</p>
              {child.resolution && <p className="text-xs text-gray-600 mb-2">{child.resolution}</p>}

              {/* Buttons */}
              <div className="flex justify-center gap-2">
                {/* CAMERA BUTTON */}
                <button
                  type="button"
                  onClick={() => handleCameraCapture(child.name, fieldConfig)}
                  className="flex items-center gap-1 bg-green-600 text-white px-3 py-1 rounded-lg text-xs font-semibold hover:shadow-lg transition-all duration-200"
                >
                  <Icon icon="solar:camera-line-duotone" className="w-4 h-4" />
                  Camera
                </button>

                {/* FILE UPLOAD BUTTON */}
                <label
                  htmlFor={child.name}
                  className="flex items-center gap-1 bg-blue-600 text-white px-3 py-1 rounded-lg text-xs font-semibold hover:shadow-lg transition-all duration-200 cursor-pointer"
                >
                  <Icon icon="solar:upload-line-duotone" className="w-4 h-4" />
                  Upload
                </label>
              </div>
            </div>

            {errors[child.name] && <p className="text-red-500 text-xs">{errors[child.name]}</p>}
          </div>
        );

      case 'image':
        return (
          <div className="text-center">
            {/* <img
              src={
                fileData[child.name]?.previewUrl ||
                formData[child.name] ||
                // child.src ||
                'https://via.placeholder.com/150'
              }
              width={fileData[child.name]?.width || child.width || 150}
              height={fileData[child.name]?.height || child.height || 150}
              alt={child.alt || child.label}
              className="mx-auto rounded-lg border border-gray-200"
            /> */}
          </div>
        );

      case 'adhar':
        return (
          <div className="space-y-2">
            <label className="flex text-sm font-semibold text-gray-700">
              {child.label}
              {child.required == 1 && <span className="text-red-500 ml-1">*</span>}
            </label>
            <div className="flex gap-2 items-center">
              {Array.from({ length: 12 }, (_, index) => (
                <input
                  key={index}
                  type={formData[`${child.name}_visible`] ? 'text' : 'password'}
                  maxLength={1}
                  value={formData[`${child.name}_${index}`] || ''}
                  onChange={(e) => {
                    const value = e.target.value.replace(/\D/g, '');
                    onAadhaarChange(index, value, child.name, fieldConfig);
                  }}
                  onKeyDown={(e) => {
                    if (e.key === 'Backspace' && !formData[`${child.name}_${index}`] && index > 0) {
                      const prevInput = document.querySelector(
                        `input[name="${child.name}_${index - 1}"]`,
                      ) as HTMLInputElement;
                      prevInput?.focus();
                    }
                  }}
                  name={`${child.name}_${index}`}
                  placeholder="X"
                  className="w-10 h-10 text-center border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg font-semibold"
                />
              ))}
              <button
                type="button"
                onClick={() => handleAadhaarVisibility(child.name)}
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
              </button>
            </div>
            {errors[child.name] && (
              <p className="text-red-500 text-xs mt-1">{errors[child.name]}</p>
            )}
          </div>
        );

      case 'radio':
        return (
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-gray-700">
              {child.label}
              {child.required == 1 && <span className="text-red-500 ml-1">*</span>}
            </label>
            <div className="space-y-2">
              {child.options?.map((option: any) => (
                <label key={option.value} className="flex items-center space-x-3">
                  <input
                    type="radio"
                    name={child.name}
                    value={option.value}
                    checked={formData[child.name] === option.value}
                    onChange={(e) => onInputChange(child.name, e.target.value, fieldConfig)}
                    className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                  />
                  <span className="text-sm text-gray-700">{option.text}</span>
                </label>
              ))}
            </div>
            {errors[child.name] && (
              <p className="text-red-500 text-xs mt-1">{errors[child.name]}</p>
            )}
          </div>
        );

      case 'textarea':
        return (
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-gray-700">
              {child.label}
              {child.required == 1 && <span className="text-red-500 ml-1">*</span>}
            </label>
            <textarea
              {...commonProps}
              placeholder={child.placeholder}
              rows={child.rows || 4}
              onChange={(e) => onInputChange(child.name, e.target.value, fieldConfig)}
              className={`w-full px-3 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200 resize-none ${
                errors[child.name] ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            {errors[child.name] && (
              <p className="text-red-500 text-xs mt-1">{errors[child.name]}</p>
            )}
          </div>
        );

      case 'number':
        return (
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-gray-700">
              {child.label}
              {child.required == 1 && <span className="text-red-500 ml-1">*</span>}
            </label>
            <input
              {...commonProps}
              type="number"
              placeholder={child.placeholder}
              min={child.min}
              max={child.max}
              step={child.step}
              onChange={(e) => onInputChange(child.name, e.target.value, fieldConfig)}
              className={`w-full px-3 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200 ${
                errors[child.name] ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            {errors[child.name] && (
              <p className="text-red-500 text-xs mt-1">{errors[child.name]}</p>
            )}
          </div>
        );

      case 'email':
        return (
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-gray-700">
              {child.label}
              {child.required == 1 && <span className="text-red-500 ml-1">*</span>}
            </label>
            <input
              {...commonProps}
              type="email"
              placeholder={child.placeholder}
              onChange={(e) => onInputChange(child.name, e.target.value, fieldConfig)}
              className={`w-full px-3 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200 ${
                errors[child.name] ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            {errors[child.name] && (
              <p className="text-red-500 text-xs mt-1">{errors[child.name]}</p>
            )}
          </div>
        );

      case 'tel':
        return (
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-gray-700">
              {child.label}
              {child.required == 1 && <span className="text-red-500 ml-1">*</span>}
            </label>
            <input
              {...commonProps}
              type="tel"
              placeholder={child.placeholder}
              pattern="[0-9]{10}"
              maxLength={10}
              onInput={(e) => {
                // Only allow numbers
                e.currentTarget.value = e.currentTarget.value.replace(/[^0-9]/g, '');
                onInputChange(child.name, e.currentTarget.value, fieldConfig);
              }}
              className={`w-full px-3 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200 ${
                errors[child.name] ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            {errors[child.name] && (
              <p className="text-red-500 text-xs mt-1">{errors[child.name]}</p>
            )}
          </div>
        );

      default:
        // console.warn(`Unknown field type: ${child.type}`);
        return null;
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 md:gap-6 w-full">
      {dynamicBoxes?.map((box, boxIndex) => {
        const boxWidth = box.width || '100%';
        const boxWidthValue = parseInt(boxWidth);

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
            {/* Box Header */}
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

            {/* Box Content with dynamic grid columns */}
            <div className="w-full">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
                {box?.children?.map((child: any, childIndex: number) => {
                  if (child.v_target) {
                    const targetValue = formData[`s_${child.h_target}`];
                    if (!child.v_target.split(',').includes(targetValue)) {
                      return null;
                    }
                  }

                  const childWidth = child.width || '100%';
                  const childWidthValue = parseInt(childWidth);

                  // Calculate column span based on width percentage
                  const getColumnSpan = () => {
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
                      {renderField(child, boxIndex, childIndex)}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default FormStep;
