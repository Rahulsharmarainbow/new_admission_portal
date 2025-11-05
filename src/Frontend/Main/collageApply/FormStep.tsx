import React from 'react';
import { Icon } from '@iconify/react';
import toast from 'react-hot-toast';

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

  console.log('Form data:', formData);
  console.log('File data:', fileData);

  console.log('erorrr', errors);
  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>, fieldName: string, fieldConfig: any) => {
    const file = event.target.files?.[0];
    if (file) {
      // Validate file type
      if (!file.type.match(/image\/(jpeg|png)/)) {
        toast.error("Please upload a valid JPEG or PNG image.");
        return;
      }

      // Validate file size (1MB limit)
      if (file.size > 1048576) {
        toast.error("File size should be less than 1 MB.");
        return;
      }

      const previewUrl = URL.createObjectURL(file);
      onFileChange(fieldName, file, previewUrl, fieldConfig);
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
      if (!child.v_target.split(",").includes(targetValue)) {
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
      resolution: child.resolution
    };

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
          <div className="flex items-start space-x-3">
            <input
              type="checkbox"
              id={child.name}
              checked={formData[child.name] === 1}
              onChange={(e) => onCheckboxChange(child.name, e.target.checked, fieldConfig)}
              className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
            />
            <label 
              htmlFor={child.name}
              className={`text-sm ${errors[child.name] ? 'text-red-600' : 'text-gray-700'}`}
            >
              {child.content}
              {child.required && <span className="text-red-500 ml-1">*</span>}
            </label>
            {errors[child.name] && (
              <p className="text-red-500 text-xs mt-1 w-full">{errors[child.name]}</p>
            )}
          </div>
        );

      case 'select':
        const selectOptions = formOptions[child.name] || child.options || [];
        return (
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-gray-700">
              {child.label}
              {child.required && <span className="text-red-500 ml-1">*</span>}
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
              {child.required && <span className="text-red-500 ml-1">*</span>}
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
        return (
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-gray-700">
              {child.label}
              {child.required && <span className="text-red-500 ml-1">*</span>}
            </label>
            <input
              {...commonProps}
              type="date"
              onChange={(e) => onDateChange(child.name, e.target.value, fieldConfig)}
              max={child.max_date ? new Date(new Date().getFullYear() - child.max_date, 0, 1).toISOString().split('T')[0] : undefined}
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
        return (
          <div className="text-center space-y-3">
            <input
              type="file"
              id={child.name}
              className="hidden"
              onChange={(e) => handleFileUpload(e, child.name, fieldConfig)}
              accept="image/*"
            />
            <label htmlFor={child.name} className="cursor-pointer">
              <div className="bg-gray-50 p-3 rounded-xl border-2 border-dashed border-gray-300 hover:border-blue-500 transition-colors duration-200">
                <div className="mx-auto w-20 h-20 bg-gray-100 rounded-lg flex items-center justify-center mb-2">
                  {fileData[child.name] ? (
                    <img
                      src={fileData[child.name].previewUrl}
                      alt={child.label}
                      className="w-full h-full object-cover rounded-lg"
                    />
                  ) : (
                    <Icon icon="solar:upload-line-duotone" className="w-8 h-8 text-gray-400" />
                  )}
                </div>
                <p className="text-xs text-gray-600 mb-2">{child.content}</p>
                <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-3 py-1 rounded-lg text-xs font-semibold hover:shadow-lg transition-all duration-200">
                  Upload {child.label}
                </div>
              </div>
            </label>
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
            <label className="block text-sm font-semibold text-gray-700">
              {child.label}
              {child.required && <span className="text-red-500 ml-1">*</span>}
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
                      const prevInput = document.querySelector(`input[name="${child.name}_${index - 1}"]`) as HTMLInputElement;
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
                  icon={formData[`${child.name}_visible`] ? "solar:eye-line-duotone" : "solar:eye-closed-line-duotone"} 
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
              {child.required && <span className="text-red-500 ml-1">*</span>}
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
              {child.required && <span className="text-red-500 ml-1">*</span>}
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
              {child.required && <span className="text-red-500 ml-1">*</span>}
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
              {child.required && <span className="text-red-500 ml-1">*</span>}
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
              {child.required && <span className="text-red-500 ml-1">*</span>}
            </label>
            <input
              {...commonProps}
              type="tel"
              placeholder={child.placeholder}
              pattern="[0-9]{10}"
              maxLength={10}
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

      default:
        // console.warn(`Unknown field type: ${child.type}`);
        return null;
    }
  };

  return (
    <div className="grid grid-cols-1 xs:grid-cols-2 md:grid-cols-12 gap-4 md:gap-6 w-full auto-rows-min">
      {dynamicBoxes?.map((box, boxIndex) => {
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
            className={`${colClass} bg-white rounded-xl shadow-sm border border-gray-200 p-4 md:p-6 transition-all duration-300 hover:shadow-lg hover:border-blue-300 group`}
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

            {/* Box Content */}
            <div
              className="flex flex-wrap w-full"
              style={{
                justifyContent: box.justify || 'flex-start',
                gap: `${box.gap || 0.5}rem`,
                alignItems: box.align || 'stretch',
              }}
            >
              {box?.children?.map((child: any, childIndex: number) => {
                const childWidth = child.width || '100%';
                const childWidthValue = parseInt(childWidth);

                const getChildWidthClass = () => {
                  if (childWidthValue >= 80) return 'w-full';
                  if (childWidthValue >= 50) return 'w-full xs:w-1/2';
                  if (childWidthValue >= 33) return 'w-full xs:w-1/2 md:w-1/3';
                  if (childWidthValue >= 25) return 'w-full xs:w-1/2 md:w-1/4';
                  return 'w-auto flex-1';
                };

                return (
                  <div
                    key={childIndex}
                    className={`${getChildWidthClass()} transition-all duration-200 hover:transform hover:scale-[1.01] min-w-0`}
                    style={{
                      minWidth: child.minWidth || '120px',
                      flex: child.flex || 'none',
                    }}
                  >
                    {renderField(child, boxIndex, childIndex)}
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default FormStep;