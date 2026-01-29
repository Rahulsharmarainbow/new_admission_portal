import React from 'react';
import { Icon } from '@iconify/react';
import toast from 'react-hot-toast';
import * as pdfjsLib from 'pdfjs-dist';
pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.js`;

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
  type: string;
  onMultiDataChange: (name: string, value: any, fieldConfig?: any) => void;
  onRemoveMultiDataEntry: (name: string, value: any, fieldConfig?: any) => void;
  onAddMultiDataEntry: (name: string, value: any, fieldConfig?: any) => void;
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
  type,
  onMultiDataChange,
  onRemoveMultiDataEntry,
  onAddMultiDataEntry
}) => {
  // ... (sab existing functions same rahenge - handleFileUpload, handleAadhaarVisibility, getPreviewBoxStyle, openDesktopCamera, handleCameraCapture)
  const handleFileUpload = (
    event: React.ChangeEvent<HTMLInputElement>,
    fieldName: string,
    fieldConfig: any,
  ) => {
    const file = event.target.files?.[0];
    console.log('fileeeeee', event.target.files?.[0]);
    if (!file) return;

    const isImage = file.type.startsWith('image/');
    const isPDF = file.type === 'application/pdf';

    if (!isPDF && !isImage) {
      toast.error('Only PDF or Image files allowed.');
      return;
    }

    onFileChange(fieldName, file, fieldConfig);
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

  // Handler functions for multi_data


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

        
     case 'multi_data':
      const maxEntries = child.max_rows || 10;
      const currentEntries = Array.isArray(formData[child.name]) ? formData[child.name] : [{}];
      
      return (
        <div className="space-y-4">
        
          {/* Table container */}
          <div className="border border-gray-200 rounded-xl overflow-hidden bg-white">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 border border-gray-200 multi_data">
                {/* Table header - column labels */}
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="p-2 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider w-12">
                      #
                    </th>
                    {child.columns.map((column: any) => (
                      <th 
                        key={column.name} 
                        scope="col" 
                        className="p-2 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider"
                      >
                        <div className="flex items-center gap-1">
                          {column.label}
                          {column.required == 1 && <span className="text-red-500">*</span>}
                        </div>
                      </th>
                    ))}
                    <th scope="col" className="p-2 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider w-20">
                      Actions
                    </th>
                  </tr>
                </thead>
                
                {/* Table body - entries */}
                <tbody className="bg-white divide-y divide-gray-200">
                  {currentEntries.length > 0 ? (
                    currentEntries.map((entry: any, index: number) => (
                      <tr 
                        key={index} 
                        className={`hover:bg-gray-50 ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'}`}
                      >
                        {/* Row number */}
                        <td className="pl-2">
                          <div className="flex items-center">
                            <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center">
                              <span className="text-xs font-semibold text-blue-600">{index + 1}</span>
                            </div>
                          </div>
                        </td>
                        
                        {/* Data columns */}
                        {child.columns.map((column: any) => {
                          const fieldName = `${child.name}[${index}][${column.name}]`;
                          const fieldValue = entry?.[column.name] || '';
                          
                          // Common input props
                          const fieldCommonProps = {
                            id: fieldName,
                            name: fieldName,
                            value: fieldValue,
                            disabled: fieldConfig?.disabled || false,
                            onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => 
                              onMultiDataChange(child.name, index, column.name, e.target.value),
                            className: `w-full px-3 py-1.5   focus:outline-none focus:ring-1 focus:ring-blue-500 transition-all duration-200 ${
                              errors[fieldName] ? 'border-red-500' : 'border-gray-300'
                            }`
                          };
                          
                          return (
                            <td key={column.name} className="">
                              {(() => {
                                switch (column.type) {
                                  case 'text':
                                  case 'email':
                                  case 'number':
                                    return (
                                      <input
                                        {...fieldCommonProps}
                                        type={column.type}
                                        // placeholder={column.placeholder || column.label}
                                        className={`${fieldCommonProps.className} text-sm ${
                                          errors[fieldName] ? 'validation_errorI' : ''
                                        }`}
                                                                            
                                      />
                                    );
                                    
                                  case 'select':
                                    const selectOptions = column.options || [];
                                    return (
                                      <div className="relative">
                                        <select
                                          {...fieldCommonProps}
                                          className={`${fieldCommonProps.className} text-sm appearance-none bg-white`}
                                        >
                                          <option value="">Select</option>
                                          {selectOptions.map((option: any) => (
                                            <option key={option.value} value={option.value}>
                                              {option.text}
                                            </option>
                                          ))}
                                        </select>
                                        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                          </svg>
                                        </div>
                                      </div>
                                    );
                                    
                                  case 'date':
                                    // Calculate max/min dates if specified
                                    const getMaxDate = () => {
                                      if (column.max_date) {
                                        const today = new Date();
                                        const maxDate = new Date(
                                          today.getFullYear() - column.max_date,
                                          today.getMonth(),
                                          today.getDate(),
                                        );
                                        return maxDate.toISOString().split('T')[0];
                                      }
                                      return undefined;
                                    };
                                    
                                    const getMinDate = () => {
                                      if (column.min_date) {
                                        const today = new Date();
                                        const minDate = new Date(
                                          today.getFullYear() - column.min_date,
                                          today.getMonth(),
                                          today.getDate(),
                                        );
                                        return minDate.toISOString().split('T')[0];
                                      }
                                      return undefined;
                                    };
                                    
                                    return (
                                      <input
                                        {...fieldCommonProps}
                                        type="date"
                                        max={getMaxDate()}
                                        min={getMinDate()}
                                        
                                        className={`${fieldCommonProps.className} text-sm ${
                                          errors[fieldName] ? 'validation_errorI' : ''
                                        }`}
                   
                                      />
                                    );
                                    
                                  case 'textarea':
                                    return (
                                      <textarea
                                        {...fieldCommonProps}
                                        placeholder={column.placeholder || column.label}
                                        rows={2}
                                        // className={`${fieldCommonProps.className} text-sm resize-none`}

                                      className={`${fieldCommonProps.className} text-sm ${
                                          errors[fieldName] ? 'validation_errorI' : ''
                                        }`}
                   
                                      />
                                    );
                                    
                                  default:
                                    return (
                                      <input
                                        {...fieldCommonProps}
                                        type="text"
                                        placeholder={column.placeholder || column.label}
                                        className={`${fieldCommonProps.className} text-sm`}
                                      />
                                    );
                                }
                              })()}
                              
                              {/* Error message */}
                              {/* {errors[fieldName] && (
                                <p className="text-red-500 text-xs mt-1 absolute">{errors[fieldName]}</p>
                              )} */}
                            </td>
                          );
                        })}
                        
                        {/* Actions column */}
                      <td className="pl-2">
                        <div className="flex items-center gap-1">
                          {/* Remove button - circular with trash icon */}
                          {currentEntries.length > 1 && (
                            <button
                              type="button"
                              onClick={() => onRemoveMultiDataEntry(child.name, index)}
                              className="p-1.5 rounded-full text-red-500 hover:text-red-700 hover:bg-red-50 transition-all"
                              title="Delete this row"
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                              </svg>
                              <span className="sr-only">Remove row</span>
                            </button>
                          )}
                          
                          {/* Add button - show only on last row OR if only 1 record */}
                          {(index === currentEntries.length - 1 || currentEntries.length === 1) && (
                            <button
                              type="button"
                              onClick={() => onAddMultiDataEntry(child.name, child.columns)}
                              disabled={currentEntries.length >= maxEntries}
                              className={`relative p-1.5 rounded-full transition-all ${
                                currentEntries.length >= maxEntries
                                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                  : 'bg-green-100 text-green-600 hover:bg-green-200 hover:shadow-sm'
                              }`}
                              title="Add new row after this"
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                              </svg>
                              <span className="sr-only">Add row</span>
                            </button>
                          )}
                        </div>
                      </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={child.columns.length + 2} className="px-4 py-6 text-center">
                        <div className="flex flex-col items-center justify-center text-gray-500">
                          <svg className="w-12 h-12 mb-2 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                          </svg>
                          <p className="text-sm italic">No entries yet. Click "Add Row" to start.</p>
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
            
            {/* Footer with summary */}
            {currentEntries.length > 0 && (
              <div className="bg-gray-50 px-4 py-3 border-t border-gray-200">
                <div className="flex justify-between items-center text-xs text-gray-600">
                  <div className="flex items-center gap-2">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                    </svg>
                    <span>Showing {currentEntries.length} row{currentEntries.length !== 1 ? 's' : ''}</span>
                  </div>
                  {currentEntries.length >= maxEntries && (
                    <span className="text-red-500 font-medium">
                      Maximum limit reached ({maxEntries} rows)
                    </span>
                  )}
                </div>
              </div>
            )}
          </div>
          
          {/* Field-level error */}
          {errors[child.name] && (
            <p className="text-red-500 text-xs mt-1">{errors[child.name]}</p>
          )}
        </div>
      );
      case 'checkbox':
        return (
          <div className="flex flex-col space-y-2 position-relative">
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
          <div className="space-y-2 position-relative">
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
              <p className="text-red-500 text-xs mt-1 validation_message">{errors[child.name]}</p>
            )}
          </div>
        );

      case 'text':
        return (
          <div className="space-y-2 position-relative">
            <label className="block text-sm font-semibold text-gray-700">
              {child.label}
              {child?.required == 1 && <span className="text-red-500 ml-1">*</span>}
            </label>
            <input
              {...commonProps}
              type="text"
              placeholder={child.placeholder}
              onChange={(e) => onInputChange(child.name, e.target.value, fieldConfig,child.unique_validation)}
              className={`w-full px-3 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200 ${
                errors[child.name] ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            {errors[child.name] && (
              <p className="text-red-500 text-xs mt-1 validation_message">{errors[child.name]}</p>
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
          <div className="space-y-2 field-container position-relative">
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
              <p className="text-red-500 text-xs mt-1 validation_message">{errors[child.name]}</p>
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

        const openDesktopCamera = (): Promise<File> => {
          return new Promise(async (resolve, reject) => {
            try {
              const stream = await navigator.mediaDevices.getUserMedia({ video: true });

              const video = document.createElement('video');
              video.srcObject = stream;
              video.autoplay = true;

              const modal = document.createElement('div');
              modal.style.position = 'fixed';
              modal.style.top = '0';
              modal.style.left = '0';
              modal.style.width = '100%';
              modal.style.height = '100%';
              modal.style.background = 'rgba(0,0,0,0.7)';
              modal.style.display = 'flex';
              modal.style.justifyContent = 'center';
              modal.style.alignItems = 'center';
              modal.style.zIndex = '99999';

              const captureBtn = document.createElement('button');
              captureBtn.innerText = 'Capture Photo';
              captureBtn.style.padding = '12px 20px';
              captureBtn.style.background = '#0d6efd';
              captureBtn.style.color = '#fff';
              captureBtn.style.borderRadius = '6px';

              const cancelBtn = document.createElement('button');
              cancelBtn.innerText = 'Cancel';
              cancelBtn.style.padding = '12px 20px';
              cancelBtn.style.background = '#dc2626';
              cancelBtn.style.color = '#fff';
              cancelBtn.style.borderRadius = '6px';

              const wrapper = document.createElement('div');
              wrapper.style.textAlign = 'center';

              const btnContainer = document.createElement('div');
              btnContainer.style.marginTop = '10px';
              btnContainer.style.display = 'flex';
              btnContainer.style.justifyContent = 'center';
              btnContainer.style.gap = '10px';

              btnContainer.appendChild(captureBtn);
              btnContainer.appendChild(cancelBtn);

              wrapper.appendChild(video);
              wrapper.appendChild(btnContainer);

              modal.appendChild(wrapper);
              document.body.appendChild(modal);

              // Capture
              captureBtn.onclick = () => {
                const canvas = document.createElement('canvas');
                canvas.width = video.videoWidth;
                canvas.height = video.videoHeight;
                const ctx = canvas.getContext('2d')!;
                ctx.drawImage(video, 0, 0);

                canvas.toBlob((blob) => {
                  stream.getTracks().forEach((t) => t.stop());
                  document.body.removeChild(modal);
                  resolve(new File([blob!], 'camera_photo.jpg', { type: 'image/jpeg' }));
                });
              };

              // Cancel
              cancelBtn.onclick = () => {
                stream.getTracks().forEach((t) => t.stop());
                document.body.removeChild(modal);
                reject('Camera cancelled');
              };
            } catch (e) {
              reject(e);
            }
          });
        };

        const handleCameraCapture = async (fieldName: string, fieldConfig: any) => {
          let file: File | null = null;

          // Mobile
          if (/Mobi|Android/i.test(navigator.userAgent)) {
            const input = document.createElement('input');
            input.type = 'file';
            input.accept = 'image/*';
            input.capture = 'environment';

            input.onchange = (e: any) => {
              const file = e.target.files?.[0];
              if (file) {
                onFileChange(fieldName, file, fieldConfig);
              }
            };

            input.click();
            return;
          }

          // Desktop camera
          file = await openDesktopCamera();

          if (file) {
            const fileInput = document.getElementById(child.name) as HTMLInputElement;

            if (fileInput) {
              const dataTransfer = new DataTransfer();
              dataTransfer.items.add(file);
              fileInput.files = dataTransfer.files;
            }

            onFileChange(fieldName, file, fieldConfig);
          }
        };

        return (
          <div className="text-center space-y-3 field-container position-relative">
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

              <p className="text-xs text-gray-600 mb-2">{child.content}{child.required == 1 && <span className="text-red-500 ml-1">*</span>}</p>
              {child.resolution && type === 'collage' && (
                <p className="text-xs text-gray-600 mb-2">{child.resolution}</p>
              )}

              {/* Buttons */}
              <div className="flex justify-center gap-2 file-upload-buttons">
                {/* CAMERA BUTTON */}
                <button
                  type="button"
                  onClick={() => handleCameraCapture(child.name, fieldConfig)}
                  className="flex items-center gap-1 bg-green-600 text-white px-3 py-1 rounded-lg text-xs font-semibold hover:shadow-lg transition-all duration-200 file-upload-button mobile-full"
                >
                  <Icon icon="solar:camera-line-duotone" className="w-4 h-4" />
                  Camera
                </button>
                {/* FILE UPLOAD BUTTON */}
                <label
                  htmlFor={child.name}
                  className="flex items-center gap-1 bg-blue-600 text-white px-3 py-1 rounded-lg text-xs font-semibold hover:shadow-lg transition-all duration-200 cursor-pointer file-upload-button mobile-full"
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
          <div className="space-y-3 field-container">
            <label className="flex text-sm font-semibold text-gray-700">
              {child.label}
              {child.required == 1 && <span className="text-red-500 ml-1">*</span>}
            </label>

            {/* Aadhaar Input Container */}
            <div className="flex flex-col space-y-3">
              {/* Aadhaar Digits Grid */}
              <div className="flex flex-wrap gap-1 sm:gap-2 md:gap-2">
                {Array.from({ length: 12 }, (_, index) => (
                  <input
                    key={index}
                    type={'text'}
                    maxLength={1}
                    value={formData[`${child.name}_${index}`] || ''}
                    onChange={(e) => {
                      const value = e.target.value.replace(/\D/g, '');
                      onAadhaarChange(index, value, child.name, fieldConfig);

                      // Auto-focus next input
                      if (value && index < 11) {
                        const nextInput = document.querySelector(
                          `input[name="${child.name}_${index + 1}"]`,
                        ) as HTMLInputElement;
                        nextInput?.focus();
                      }
                    }}
                    onKeyDown={(e) => {
                      if (
                        e.key === 'Backspace' &&
                        !formData[`${child.name}_${index}`] &&
                        index > 0
                      ) {
                        const prevInput = document.querySelector(
                          `input[name="${child.name}_${index - 1}"]`,
                        ) as HTMLInputElement;
                        prevInput?.focus();
                      }
                    }}
                    onFocus={(e) => e.target.select()}
                    name={`${child.name}_${index}`}
                    placeholder="X"
                    className="aadhaar-digit w-8 h-8 xs:w-9 xs:h-9 sm:w-10 sm:h-10 text-center border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-base sm:text-lg font-semibold transition-all duration-200 bg-white shadow-sm"
                  />
                ))}
                {/* <button
                  type="button"
                  onClick={() => handleAadhaarVisibility(child.name)}
                  className="flex items-center gap-2 px-3 py-2 text-gray-600 hover:text-blue-600 transition-colors rounded-lg hover:border-blue-300 bg-white shadow-sm"
                >
                  <Icon
                    icon={
                      formData[`${child.name}_visible`]
                        ? 'solar:eye-line-duotone'
                        : 'solar:eye-closed-line-duotone'
                    }
                    className="w-4 h-4 sm:w-5 sm:h-5"
                  />
                </button> */}
              </div>

              {/* Visibility Toggle and Spacing */}
              <div className="flex justify-center items-center gap-4"></div>
            </div>

            {errors[child.name] && (
              <p className="text-red-500 text-xs mt-2 text-center sm:text-left">
                {errors[child.name]}
              </p>
            )}
          </div>
        );

      case 'radio':
        return (
          <div className="space-y-2 position-relative">
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

  // 🔥 NEW: Perfect 5%-100% width mapping
 const getPreciseColumnSpan = (widthPercent: number) => {
  if (widthPercent >= 95) return 'col-span-20';

  if (widthPercent >= 85) return 'col-span-20 lg:col-span-18 xl:col-span-17';
  if (widthPercent >= 75) return 'col-span-20 lg:col-span-16 xl:col-span-15';
  if (widthPercent >= 65) return 'col-span-20 lg:col-span-14 xl:col-span-13';
  if (widthPercent >= 55) return 'col-span-20 lg:col-span-12 xl:col-span-11';

  if (widthPercent >= 50) return 'col-span-20 sm:col-span-10 xl:col-span-10';
  if (widthPercent >= 45) return 'col-span-20 sm:col-span-10 xl:col-span-9';
  if (widthPercent >= 40) return 'col-span-20 sm:col-span-10 xl:col-span-8';

  if (widthPercent >= 35) return 'col-span-20 sm:col-span-10 xl:col-span-7';
  if (widthPercent >= 30) return 'col-span-20 sm:col-span-10 xl:col-span-6';

  // ⭐ EXACT REQUIREMENT
  if (widthPercent >= 25) return 'col-span-20 sm:col-span-10 xl:col-span-5'; // 4 items
  if (widthPercent >= 20) return 'col-span-20 sm:col-span-10 xl:col-span-4'; // 5 items

  if (widthPercent >= 15) return 'col-span-20 sm:col-span-5 xl:col-span-3';
  if (widthPercent >= 10) return 'col-span-20 sm:col-span-4 xl:col-span-2';

  return 'col-span-20 sm:col-span-2 xl:col-span-1';
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
            className={`col-span-12 ${getGridCols()} bg-white rounded-xl shadow-sm border border-gray-200 p-4 md:p-6 transition-all duration-300 hover:shadow-lg hover:border-blue-300 group mobile-padding`}
          >
            {/* Box Header - same */}
            {box.title && (
              <div className="flex items-center gap-3 mb-4 pb-3 border-b border-gray-100 mobile-stack">
                {box.icon && (
                  <div className="p-2 bg-blue-100 rounded-lg text-blue-600">
                    <Icon icon={box.icon} className="w-5 h-5" />
                  </div>
                )}
                <div className="mobile-full mobile-text-center">
                  <h3 className="text-lg font-semibold text-gray-800 group-hover:text-blue-700 transition-colors">
                    {box.title}
                  </h3>
                  {box.description && (
                    <p className="text-sm text-gray-600 mt-1">{box.description}</p>
                  )}
                </div>
              </div>
            )}

            {/* 🔥 PERFECT DYNAMIC GRID - 12 columns max */}
            <div className="w-full">
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 xl:grid-cols-20 gap-3 md:gap-4 lg:gap-3">
                {box?.children?.map((child: any, childIndex: number) => {
                  if (child.v_target) {
                    const targetValue = formData[`s_${child.h_target}`];
                    if (!child.v_target.split(',').includes(targetValue)) {
                      return null;
                    }
                  }

                  const childWidth = child.width || '100%';
                  const childWidthValue = parseInt(childWidth);

                  const spanClass = getPreciseColumnSpan(childWidthValue);

                  return (
                    <div
                      key={childIndex}
                      className={`${spanClass} field-container transition-all duration-200 flex flex-col`}
                     
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










// import React from 'react';
// import { Icon } from '@iconify/react';
// import toast from 'react-hot-toast';
// import * as pdfjsLib from 'pdfjs-dist';
// pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.js`;

// interface FormStepProps {
//   dynamicBoxes: any[];
//   formData: { [key: string]: any };
//   fileData: { [key: string]: any };
//   errors: { [key: string]: string };
//   formOptions: { [key: string]: any[] };
//   onInputChange: (name: string, value: any, fieldConfig?: any) => void;
//   onSelectChange: (name: string, value: any, fieldConfig?: any) => void;
//   onCheckboxChange: (name: string, value: boolean, fieldConfig?: any) => void;
//   onDateChange: (name: string, date: any, fieldConfig?: any) => void;
//   onAadhaarChange: (index: number, value: string, name: string, fieldConfig?: any) => void;
//   onFileChange: (name: string, file: File, previewUrl: string, fieldConfig?: any) => void;
//   formRefs: React.MutableRefObject<{ [key: string]: any }>;
//   type: string;
// }

// const FormStep: React.FC<FormStepProps> = ({
//   dynamicBoxes,
//   formData,
//   fileData,
//   errors,
//   formOptions,
//   onInputChange,
//   onSelectChange,
//   onCheckboxChange,
//   onDateChange,
//   onAadhaarChange,
//   onFileChange,
//   formRefs,
//   type,
// }) => {
//   // console.log('Form data:', formData);
//   // console.log('File data:', fileData);

//   // console.log('erorrr', errors);
//   const handleFileUpload = (
//     event: React.ChangeEvent<HTMLInputElement>,
//     fieldName: string,
//     fieldConfig: any,
//   ) => {
//     const file = event.target.files?.[0];
//     console.log('fileeeeee', event.target.files?.[0]);
//     if (!file) return;

//     const isImage = file.type.startsWith('image/');
//     const isPDF = file.type === 'application/pdf';

//     if (!isPDF && !isImage) {
//       toast.error('Only PDF or Image files allowed.');
//       return;
//     }

//     onFileChange(fieldName, file, fieldConfig);
//   };

//   const handleAadhaarVisibility = (name: string) => {
//     const isVisible = !formData[`${name}_visible`];
//     onInputChange(`${name}_visible`, isVisible);

//     // Toggle input types
//     const inputs = document.querySelectorAll(`input[name^="${name}_"]`);
//     inputs.forEach((input: any) => {
//       input.type = isVisible ? 'text' : 'password';
//     });
//   };

//   // Resolution parse & dynamic styles
//   const getPreviewBoxStyle = (resolution?: string) => {
//     if (!resolution) return null;

//     const [w, h] = resolution.split('x').map(Number);
//     if (!w || !h) return null;

//     // Apply only if width is much greater than height (signature like)
//     if (w > h * 2) {
//       return {
//         width: `${w}px`,
//         height: `${h}px`,
//       };
//     }

//     return null;
//   };

//   const renderField = (child: any, boxIndex: number, childIndex: number) => {
//     const commonProps = {
//       key: `${boxIndex}-${childIndex}`,
//       value: formData[child.name] || '',
//       ref: (el: any) => {
//         if (el) formRefs.current[child.name] = el;
//       },
//     };

//     // Skip rendering if v_target condition doesn't meet
//     if (child.v_target) {
//       const targetValue = formData[`s_${child.h_target}`];
//       if (!child.v_target.split(',').includes(targetValue)) {
//         return null;
//       }
//     }

//     const fieldConfig = {
//       type: child.type,
//       validation: child.validation,
//       validation_message: child.validation_message,
//       required: child.required,
//       apiurl: child.apiurl,
//       target: child.target,
//       h_target: child.h_target,
//       resolution: child.resolution,
//       max_date: child.max_date,
//     };

//     // if (child.type === 'file_button') console.log(fieldConfig);

//     switch (child.type) {
//       case 'heading':
//         return (
//           <div className="text-start mb-6 w-full">
//             <h4 className="text-lg font-bold text-[#dc2626] inline-flex items-center">
//               <Icon icon={child.icon || 'solar:document-line-duotone'} className="w-4 h-4 mr-2" />
//               {child.content}
//             </h4>
//           </div>
//         );

//       case 'heading2':
//         return (
//           <div className="mb-4 w-full">
//             <p className="text-base font-semibold text-gray-800 mb-0">
//               <b>{child.content}</b>
//             </p>
//           </div>
//         );

//       case 'checkbox':
//         return (
//           <div className="flex flex-col space-y-2">
//             <div className="flex items-start space-x-3">
//               <input
//                 type="checkbox"
//                 id={child.name}
//                 checked={formData[child.name] === 1}
//                 onChange={(e) => onCheckboxChange(child.name, e.target.checked, fieldConfig)}
//                 className={`w-4 h-4 mt-1 text-blue-600 border-gray-300 rounded focus:ring-blue-500 focus:ring-2 ${
//                   errors[child.name] ? 'border-red-500' : 'border-gray-300'
//                 }`}
//               />
//               <label
//                 htmlFor={child.name}
//                 className={`text-sm leading-tight ${
//                   errors[child.name] ? 'text-red-600' : 'text-gray-700'
//                 }`}
//               >
//                 {child.content}
//                 {child.required == 1 && <span className="text-red-500 ml-1">*</span>}
//               </label>
//             </div>
//             {errors[child.name] && (
//               <p className="text-red-500 text-xs mt-1 ml-7">{errors[child.name]}</p>
//             )}
//           </div>
//         );

//       case 'select':
//         const selectOptions = formOptions[child.name] || child.options || [];
//         return (
//           <div className="space-y-2">
//             <label className="block text-sm font-semibold text-gray-700">
//               {child.label}
//               {child.required == 1 && <span className="text-red-500 ml-1">*</span>}
//             </label>
//             <select
//               {...commonProps}
//               onChange={(e) => onSelectChange(child.name, e.target.value, fieldConfig)}
//               className={`w-full px-3 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200 appearance-none bg-white ${
//                 errors[child.name] ? 'border-red-500' : 'border-gray-300'
//               }`}
//             >
//               <option value="">Select {child.label}</option>
//               {selectOptions.map((option: any) => (
//                 <option key={option.value} value={`${option.value}$${option.text}`}>
//                   {option.text}
//                 </option>
//               ))}
//             </select>
//             {errors[child.name] && (
//               <p className="text-red-500 text-xs mt-1 position-absolute">{errors[child.name]}</p>
//             )}
//           </div>
//         );

//       case 'text':
//         return (
//           <div className="space-y-2">
//             <label className="block text-sm font-semibold text-gray-700">
//               {child.label}
//               {child?.required == 1 && <span className="text-red-500 ml-1">*</span>}
//             </label>
//             <input
//               {...commonProps}
//               type="text"
//               placeholder={child.placeholder}
//               onChange={(e) => onInputChange(child.name, e.target.value, fieldConfig)}
//               className={`w-full px-3 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200 ${
//                 errors[child.name] ? 'border-red-500' : 'border-gray-300'
//               }`}
//             />
//             {errors[child.name] && (
//               <p className="text-red-500 text-xs mt-1 position-absolute">{errors[child.name]}</p>
//             )}
//           </div>
//         );

//       case 'date':
//         // Calculate max date based on max_date configuration (maximum age)
//         const getMaxDate = () => {
//           if (child.max_date) {
//             const today = new Date();
//             const maxDate = new Date(
//               today.getFullYear() - child.max_date,
//               today.getMonth(),
//               today.getDate(),
//             );
//             return maxDate.toISOString().split('T')[0];
//           }
//           return undefined;
//         };

//         // Calculate min date (optional, you can set this if needed)
//         const getMinDate = () => {
//           if (child.min_date) {
//             const today = new Date();
//             const minDate = new Date(
//               today.getFullYear() - child.min_date,
//               today.getMonth(),
//               today.getDate(),
//             );
//             return minDate.toISOString().split('T')[0];
//           }
//           return undefined;
//         };

//         return (
//           <div className="space-y-2 field-container">
//             <label className="block text-sm font-semibold text-gray-700">
//               {child.label}
//               {child.required == 1 && <span className="text-red-500 ml-1">*</span>}
//             </label>
//             <input
//               {...commonProps}
//               type="date"
//               onChange={(e) => onDateChange(child.name, e.target.value, fieldConfig)}
//               max={getMaxDate()} // This will restrict dates - hides recent years based on max_date
//               min={getMinDate()} // Optional: for minimum age restriction
//               className={`w-full px-3 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200 ${
//                 errors[child.name] ? 'border-red-500' : 'border-gray-300'
//               }`}
//             />
//             {errors[child.name] && (
//               <p className="text-red-500 text-xs mt-1 position-absolute">{errors[child.name]}</p>
//             )}
//           </div>
//         );

//       case 'para':
//         return (
//           <div className="w-full">
//             <p className="text-gray-600 text-sm leading-relaxed">{child.content}</p>
//           </div>
//         );

//       case 'button':
//         return (
//           <button
//             type="button"
//             className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-4 py-2 rounded-lg font-semibold hover:shadow-lg transform hover:scale-105 transition-all duration-200"
//           >
//             {child.content}
//           </button>
//         );

//       case 'file_button':
//         const previewStyle = getPreviewBoxStyle(child.resolution);

//         const openDesktopCamera = (): Promise<File> => {
//           return new Promise(async (resolve, reject) => {
//             try {
//               const stream = await navigator.mediaDevices.getUserMedia({ video: true });

//               const video = document.createElement('video');
//               video.srcObject = stream;
//               video.autoplay = true;

//               const modal = document.createElement('div');
//               modal.style.position = 'fixed';
//               modal.style.top = '0';
//               modal.style.left = '0';
//               modal.style.width = '100%';
//               modal.style.height = '100%';
//               modal.style.background = 'rgba(0,0,0,0.7)';
//               modal.style.display = 'flex';
//               modal.style.justifyContent = 'center';
//               modal.style.alignItems = 'center';
//               modal.style.zIndex = '99999';

//               const captureBtn = document.createElement('button');
//               captureBtn.innerText = 'Capture Photo';
//               captureBtn.style.padding = '12px 20px';
//               captureBtn.style.background = '#0d6efd';
//               captureBtn.style.color = '#fff';
//               captureBtn.style.borderRadius = '6px';

//               const cancelBtn = document.createElement('button');
//               cancelBtn.innerText = 'Cancel';
//               cancelBtn.style.padding = '12px 20px';
//               cancelBtn.style.background = '#dc2626';
//               cancelBtn.style.color = '#fff';
//               cancelBtn.style.borderRadius = '6px';

//               const wrapper = document.createElement('div');
//               wrapper.style.textAlign = 'center';

//               const btnContainer = document.createElement('div');
//               btnContainer.style.marginTop = '10px';
//               btnContainer.style.display = 'flex';
//               btnContainer.style.justifyContent = 'center';
//               btnContainer.style.gap = '10px';

//               btnContainer.appendChild(captureBtn);
//               btnContainer.appendChild(cancelBtn);

//               wrapper.appendChild(video);
//               wrapper.appendChild(btnContainer);

//               modal.appendChild(wrapper);
//               document.body.appendChild(modal);

//               // Capture
//               captureBtn.onclick = () => {
//                 const canvas = document.createElement('canvas');
//                 canvas.width = video.videoWidth;
//                 canvas.height = video.videoHeight;
//                 const ctx = canvas.getContext('2d')!;
//                 ctx.drawImage(video, 0, 0);

//                 canvas.toBlob((blob) => {
//                   stream.getTracks().forEach((t) => t.stop());
//                   document.body.removeChild(modal);
//                   resolve(new File([blob!], 'camera_photo.jpg', { type: 'image/jpeg' }));
//                 });
//               };

//               // Cancel
//               cancelBtn.onclick = () => {
//                 stream.getTracks().forEach((t) => t.stop());
//                 document.body.removeChild(modal);
//                 reject('Camera cancelled');
//               };
//             } catch (e) {
//               reject(e);
//             }
//           });
//         };

//         const handleCameraCapture = async (fieldName: string, fieldConfig: any) => {
//           let file: File | null = null;

//           // Mobile
//           if (/Mobi|Android/i.test(navigator.userAgent)) {
//             const input = document.createElement('input');
//             input.type = 'file';
//             input.accept = 'image/*';
//             input.capture = 'environment';

//             input.onchange = (e: any) => {
//               const file = e.target.files?.[0];
//               if (file) {
//                 onFileChange(fieldName, file, fieldConfig);
//               }
//             };

//             input.click();
//             return;
//           }

//           // Desktop camera
//           file = await openDesktopCamera();

//           if (file) {
//             const fileInput = document.getElementById(child.name) as HTMLInputElement;

//             if (fileInput) {
//               const dataTransfer = new DataTransfer();
//               dataTransfer.items.add(file);
//               fileInput.files = dataTransfer.files;
//             }

//             onFileChange(fieldName, file, fieldConfig);
//           }
//         };

//         return (
//           <div className="text-center space-y-3 field-container">
//             <input
//               type="file"
//               id={child.name}
//               className="hidden"
//               onChange={(e) => handleFileUpload(e, child.name, fieldConfig)}
//               accept="image/*;capture=camera"
//               capture="environment"
//             />

//             <div className="bg-gray-50 p-3 rounded-xl border-2 border-dashed border-gray-300 hover:border-blue-500 transition-colors duration-200">
//               <div
//                 className={`mx-auto bg-gray-100 rounded-lg flex items-center justify-center mb-2 overflow-hidden ${
//                   previewStyle ? '' : 'w-20 h-20'
//                 }`}
//                 style={previewStyle || {}}
//               >
//                 {fileData[child.name] ? (
//                   <img
//                     src={fileData[child.name]}
//                     alt={child.label}
//                     className="object-contain w-full h-full rounded-lg"
//                   />
//                 ) : (
//                   <Icon icon="solar:upload-line-duotone" className="w-8 h-8 text-gray-400" />
//                 )}
//               </div>

//               <p className="text-xs text-gray-600 mb-2">{child.content}{child.required == 1 && <span className="text-red-500 ml-1">*</span>}</p>
//               {child.resolution && type === 'collage' && (
//                 <p className="text-xs text-gray-600 mb-2">{child.resolution}</p>
//               )}

//               {/* Buttons */}
//               <div className="flex justify-center gap-2 file-upload-buttons">
//                 {/* CAMERA BUTTON */}
//                 <button
//                   type="button"
//                   onClick={() => handleCameraCapture(child.name, fieldConfig)}
//                   className="flex items-center gap-1 bg-green-600 text-white px-3 py-1 rounded-lg text-xs font-semibold hover:shadow-lg transition-all duration-200 file-upload-button mobile-full"
//                 >
//                   <Icon icon="solar:camera-line-duotone" className="w-4 h-4" />
//                   Camera
//                 </button>
//                 {/* FILE UPLOAD BUTTON */}
//                 <label
//                   htmlFor={child.name}
//                   className="flex items-center gap-1 bg-blue-600 text-white px-3 py-1 rounded-lg text-xs font-semibold hover:shadow-lg transition-all duration-200 cursor-pointer file-upload-button mobile-full"
//                 >
//                   <Icon icon="solar:upload-line-duotone" className="w-4 h-4" />
//                   Upload
//                 </label>
//               </div>
//             </div>

//             {errors[child.name] && <p className="text-red-500 text-xs">{errors[child.name]}</p>}
//           </div>
//         );

//       case 'image':
//         return (
//           <div className="text-center">
//             {/* <img
//               src={
//                 fileData[child.name]?.previewUrl ||
//                 formData[child.name] ||
//                 // child.src ||
//                 'https://via.placeholder.com/150'
//               }
//               width={fileData[child.name]?.width || child.width || 150}
//               height={fileData[child.name]?.height || child.height || 150}
//               alt={child.alt || child.label}
//               className="mx-auto rounded-lg border border-gray-200"
//             /> */}
//           </div>
//         );

//       case 'adhar':
//         return (
//           <div className="space-y-3 field-container">
//             <label className="flex text-sm font-semibold text-gray-700">
//               {child.label}
//               {child.required == 1 && <span className="text-red-500 ml-1">*</span>}
//             </label>

//             {/* Aadhaar Input Container */}
//             <div className="flex flex-col space-y-3">
//               {/* Aadhaar Digits Grid */}
//               <div className="flex flex-wrap gap-1 sm:gap-2 md:gap-2">
//                 {Array.from({ length: 12 }, (_, index) => (
//                   <input
//                     key={index}
//                     type={'text'}
//                     maxLength={1}
//                     value={formData[`${child.name}_${index}`] || ''}
//                     onChange={(e) => {
//                       const value = e.target.value.replace(/\D/g, '');
//                       onAadhaarChange(index, value, child.name, fieldConfig);

//                       // Auto-focus next input
//                       if (value && index < 11) {
//                         const nextInput = document.querySelector(
//                           `input[name="${child.name}_${index + 1}"]`,
//                         ) as HTMLInputElement;
//                         nextInput?.focus();
//                       }
//                     }}
//                     onKeyDown={(e) => {
//                       if (
//                         e.key === 'Backspace' &&
//                         !formData[`${child.name}_${index}`] &&
//                         index > 0
//                       ) {
//                         const prevInput = document.querySelector(
//                           `input[name="${child.name}_${index - 1}"]`,
//                         ) as HTMLInputElement;
//                         prevInput?.focus();
//                       }
//                     }}
//                     onFocus={(e) => e.target.select()}
//                     name={`${child.name}_${index}`}
//                     placeholder="X"
//                     className="aadhaar-digit w-8 h-8 xs:w-9 xs:h-9 sm:w-10 sm:h-10 text-center border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-base sm:text-lg font-semibold transition-all duration-200 bg-white shadow-sm"
//                   />
//                 ))}
//                 {/* <button
//                   type="button"
//                   onClick={() => handleAadhaarVisibility(child.name)}
//                   className="flex items-center gap-2 px-3 py-2 text-gray-600 hover:text-blue-600 transition-colors rounded-lg hover:border-blue-300 bg-white shadow-sm"
//                 >
//                   <Icon
//                     icon={
//                       formData[`${child.name}_visible`]
//                         ? 'solar:eye-line-duotone'
//                         : 'solar:eye-closed-line-duotone'
//                     }
//                     className="w-4 h-4 sm:w-5 sm:h-5"
//                   />
//                 </button> */}
//               </div>

//               {/* Visibility Toggle and Spacing */}
//               <div className="flex justify-center items-center gap-4"></div>
//             </div>

//             {errors[child.name] && (
//               <p className="text-red-500 text-xs mt-2 text-center sm:text-left">
//                 {errors[child.name]}
//               </p>
//             )}
//           </div>
//         );

//       case 'radio':
//         return (
//           <div className="space-y-2">
//             <label className="block text-sm font-semibold text-gray-700">
//               {child.label}
//               {child.required == 1 && <span className="text-red-500 ml-1">*</span>}
//             </label>
//             <div className="space-y-2">
//               {child.options?.map((option: any) => (
//                 <label key={option.value} className="flex items-center space-x-3">
//                   <input
//                     type="radio"
//                     name={child.name}
//                     value={option.value}
//                     checked={formData[child.name] === option.value}
//                     onChange={(e) => onInputChange(child.name, e.target.value, fieldConfig)}
//                     className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
//                   />
//                   <span className="text-sm text-gray-700">{option.text}</span>
//                 </label>
//               ))}
//             </div>
//             {errors[child.name] && (
//               <p className="text-red-500 text-xs mt-1">{errors[child.name]}</p>
//             )}
//           </div>
//         );

//       case 'textarea':
//         return (
//           <div className="space-y-2">
//             <label className="block text-sm font-semibold text-gray-700">
//               {child.label}
//               {child.required == 1 && <span className="text-red-500 ml-1">*</span>}
//             </label>
//             <textarea
//               {...commonProps}
//               placeholder={child.placeholder}
//               rows={child.rows || 4}
//               onChange={(e) => onInputChange(child.name, e.target.value, fieldConfig)}
//               className={`w-full px-3 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200 resize-none ${
//                 errors[child.name] ? 'border-red-500' : 'border-gray-300'
//               }`}
//             />
//             {errors[child.name] && (
//               <p className="text-red-500 text-xs mt-1">{errors[child.name]}</p>
//             )}
//           </div>
//         );

//       case 'number':
//         return (
//           <div className="space-y-2">
//             <label className="block text-sm font-semibold text-gray-700">
//               {child.label}
//               {child.required == 1 && <span className="text-red-500 ml-1">*</span>}
//             </label>
//             <input
//               {...commonProps}
//               type="number"
//               placeholder={child.placeholder}
//               min={child.min}
//               max={child.max}
//               step={child.step}
//               onChange={(e) => onInputChange(child.name, e.target.value, fieldConfig)}
//               className={`w-full px-3 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200 ${
//                 errors[child.name] ? 'border-red-500' : 'border-gray-300'
//               }`}
//             />
//             {errors[child.name] && (
//               <p className="text-red-500 text-xs mt-1">{errors[child.name]}</p>
//             )}
//           </div>
//         );

//       case 'email':
//         return (
//           <div className="space-y-2">
//             <label className="block text-sm font-semibold text-gray-700">
//               {child.label}
//               {child.required == 1 && <span className="text-red-500 ml-1">*</span>}
//             </label>
//             <input
//               {...commonProps}
//               type="email"
//               placeholder={child.placeholder}
//               onChange={(e) => onInputChange(child.name, e.target.value, fieldConfig)}
//               className={`w-full px-3 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200 ${
//                 errors[child.name] ? 'border-red-500' : 'border-gray-300'
//               }`}
//             />
//             {errors[child.name] && (
//               <p className="text-red-500 text-xs mt-1">{errors[child.name]}</p>
//             )}
//           </div>
//         );

//       case 'tel':
//         return (
//           <div className="space-y-2">
//             <label className="block text-sm font-semibold text-gray-700">
//               {child.label}
//               {child.required == 1 && <span className="text-red-500 ml-1">*</span>}
//             </label>
//             <input
//               {...commonProps}
//               type="tel"
//               placeholder={child.placeholder}
//               pattern="[0-9]{10}"
//               maxLength={10}
//               onInput={(e) => {
//                 // Only allow numbers
//                 e.currentTarget.value = e.currentTarget.value.replace(/[^0-9]/g, '');
//                 onInputChange(child.name, e.currentTarget.value, fieldConfig);
//               }}
//               className={`w-full px-3 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200 ${
//                 errors[child.name] ? 'border-red-500' : 'border-gray-300'
//               }`}
//             />
//             {errors[child.name] && (
//               <p className="text-red-500 text-xs mt-1">{errors[child.name]}</p>
//             )}
//           </div>
//         );

//       default:
//         // console.warn(`Unknown field type: ${child.type}`);
//         return null;
//     }
//   };

//   return (
//     <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 md:gap-6 w-full">
//       {dynamicBoxes?.map((box, boxIndex) => {
//         const boxWidth = box.width || '100%';
//         const boxWidthValue = parseInt(boxWidth);

//         const getGridCols = () => {
//           if (boxWidthValue >= 70 && boxWidthValue <= 80) return 'lg:col-span-9';
//           if (boxWidthValue >= 20 && boxWidthValue <= 30) return 'lg:col-span-3';
//           if (boxWidthValue >= 45 && boxWidthValue <= 55) return 'lg:col-span-6';
//           return 'lg:col-span-12';
//         };

//         return (
//           <div
//             key={boxIndex}
//             className={`col-span-12 ${getGridCols()} bg-white rounded-xl shadow-sm border border-gray-200 p-4 md:p-6 transition-all duration-300 hover:shadow-lg hover:border-blue-300 group mobile-padding`}
//           >
//             {/* Box Header */}
//             {box.title && (
//               <div className="flex items-center gap-3 mb-4 pb-3 border-b border-gray-100 mobile-stack">
//                 {box.icon && (
//                   <div className="p-2 bg-blue-100 rounded-lg text-blue-600">
//                     <Icon icon={box.icon} className="w-5 h-5" />
//                   </div>
//                 )}
//                 <div className="mobile-full mobile-text-center">
//                   <h3 className="text-lg font-semibold text-gray-800 group-hover:text-blue-700 transition-colors">
//                     {box.title}
//                   </h3>
//                   {box.description && (
//                     <p className="text-sm text-gray-600 mt-1">{box.description}</p>
//                   )}
//                 </div>
//               </div>
//             )}

//             {/* Box Content with improved responsive grid */}
//             <div className="w-full">
//               <div className="form-grid">
//                 {box?.children?.map((child: any, childIndex: number) => {
//                   if (child.v_target) {
//                     const targetValue = formData[`s_${child.h_target}`];
//                     if (!child.v_target.split(',').includes(targetValue)) {
//                       return null;
//                     }
//                   }

//                   const childWidth = child.width || '100%';
//                   const childWidthValue = parseInt(childWidth);

//                   // Improved responsive column span
//                   const getColumnSpan = () => {
//                     if (childWidthValue >= 80) return 'col-span-full';
//                     if (childWidthValue >= 60) return 'sm:col-span-2 lg:col-span-2';
//                     if (childWidthValue >= 40) return 'sm:col-span-2 lg:col-span-2';
//                     if (childWidthValue >= 30) return 'sm:col-span-1 lg:col-span-1';
//                     if (childWidthValue >= 20) return 'sm:col-span-1 lg:col-span-1';
//                     return 'sm:col-span-1 lg:col-span-1';
//                   };

//                   const spanClass = getColumnSpan();

//                   return (
//                     <div
//                       key={childIndex}
//                       className={`${spanClass} field-container transition-all duration-200`}
//                       style={{
//                         minWidth: '150px',
//                         ...(child.type === 'file_button'
//                           ? {
//                               display: 'flex',
//                               justifyContent: 'center',
//                               alignItems: 'center',
//                               flexDirection: 'column',
//                             }
//                           : {}),
//                       }}
//                     >
//                       {renderField(child, boxIndex, childIndex)}
//                     </div>
//                   );
//                 })}
//               </div>
//             </div>
//           </div>
//         );
//       })}
//     </div>
//   );
// };

// export default FormStep;
