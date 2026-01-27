import React, { useState, useEffect, useRef } from 'react';
import { Modal, ModalHeader, ModalBody, ModalFooter, Button, Label, TextInput, FileInput, ToggleSwitch } from 'flowbite-react';
import axios from 'axios';
import { useAuth } from 'src/hook/useAuth';
import toast from 'react-hot-toast';
//import AcademicDropdown from 'src/Frontend/Common/AcademicDropdown';
import { ChromePicker } from 'react-color';
import AllAcademicsDropdown from 'src/Frontend/Common/AllAcademicsDropdown';

interface BannerFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  banner: any | null;
}

interface FormData {
  academic_id: string;
  color_code: string;
  redirect_url: string;
  is_active: boolean;
  banner_image: File | null;
  banner_image_preview: string;
}

const BannerFormModal: React.FC<BannerFormModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  banner,
}) => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    academic_id: '',
    color_code: '#3B82F6',
    redirect_url: '',
    is_active: true,
    banner_image: null,
    banner_image_preview: '',
  });
  const [showColorPicker, setShowColorPicker] = useState(false);
  const colorPickerRef = useRef<HTMLDivElement>(null);

  const apiUrl = import.meta.env.VITE_API_URL;

  // Handle click outside to close color picker
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (colorPickerRef.current && !colorPickerRef.current.contains(event.target as Node)) {
        setShowColorPicker(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (isOpen) {
      if (banner) {
        setFormData({
          academic_id: banner.academic_id.toString(),
          color_code: banner.color_code || '#3B82F6',
          redirect_url: banner.redirect_url || '',
          is_active: banner.is_active || true,
          banner_image: null,
          banner_image_preview: banner.banner_image ? 
            `${apiUrl.replace('/public/api', '')}${banner.banner_image}` : '',
        });
      } else {
        setFormData({
          academic_id: user?.role === 'CustomerAdmin' ? user.academic_id?.toString() || '' : '',
          color_code: '#3B82F6',
          redirect_url: '',
          is_active: true,
          banner_image: null,
          banner_image_preview: '',
        });
      }
    }
  }, [isOpen, banner, user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if ((user?.role === 'SuperAdmin' || user?.role === 'SupportAdmin') && !formData.academic_id) {
      toast.error('Please select an academic');
      return;
    }
    
    if (!formData.banner_image && !formData.banner_image_preview) {
      toast.error('Please upload a banner image');
      return;
    }

    if (!formData.redirect_url) {
      toast.error('Please enter a redirect URL');
      return;
    }

    setLoading(true);

    try {
      const formDataObj = new FormData();
      formDataObj.append('academic_id', formData.academic_id);
      formDataObj.append('color_code', formData.color_code);
      formDataObj.append('redirect_url', formData.redirect_url);
      formDataObj.append('is_active', formData.is_active ? '1' : '0');
      formDataObj.append('s_id', user?.id?.toString() || '');
      
      if (formData.banner_image) {
        formDataObj.append('banner_image', formData.banner_image);
      }

      if (banner) {
        formDataObj.append('id', banner.id.toString());
        await axios.post(
          `${apiUrl}/${user?.role}/academic-banners/update`,
          formDataObj,
          {
            headers: {
              Authorization: `Bearer ${user?.token}`,
              'Content-Type': 'multipart/form-data',
            },
          }
        );
      } else {
        await axios.post(
          `${apiUrl}/${user?.role}/academic-banners/add`,
          formDataObj,
          {
            headers: {
              Authorization: `Bearer ${user?.token}`,
              'Content-Type': 'multipart/form-data',
            },
          }
        );
      }

      onSuccess();
    } catch (error: any) {
      console.error('Error saving banner:', error);
      toast.error(error.response?.data?.message || 'Failed to save banner');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: keyof FormData, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleAcademicChange = (academicId: string) => {
    setFormData(prev => ({
      ...prev,
      academic_id: academicId,
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        toast.error('File size should be less than 5MB');
        return;
      }
      
      if (!file.type.startsWith('image/')) {
        toast.error('Please upload an image file');
        return;
      }

      setFormData(prev => ({
        ...prev,
        banner_image: file,
        banner_image_preview: URL.createObjectURL(file),
      }));
    }
  };

  const handleClose = () => {
    setFormData({
      academic_id: '',
      color_code: '#3B82F6',
      redirect_url: '',
      is_active: true,
      banner_image: null,
      banner_image_preview: '',
    });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <Modal 
      show={isOpen} 
      onClose={handleClose} 
      size="4xl"
    >
      <ModalHeader>
        {banner ? 'Edit Academic Banner' : 'Add New Academic Banner'}
      </ModalHeader>

      <form onSubmit={handleSubmit}>
        <ModalBody className="overflow-visible">
          <div className="space-y-6 max-h-[80vh] overflow-y-auto pr-2">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Academic Dropdown (only for SuperAdmin/SupportAdmin) */}
              {(user?.role === 'SuperAdmin' || user?.role === 'SupportAdmin') && (
                <div>
                  <Label className="block mb-2">
                    Select Academic <span className="text-red-500">*</span>
                  </Label>
                  {/* <AllAcademicsDropdown
               name="academic"
                value={filters.academic_id}
                onChange={handleAcademicChange}
                includeAllOption
                label=""
                className="min-w-[250px] text-sm"
              /> */}
              <AllAcademicsDropdown
              value={formData.academic_id}
                onChange={handleAcademicChange}
                  includeAllOption={false}
                label=""
                className="min-w-[250px] text-sm"
              />
                </div>
              )}

              {/* Status Toggle */}
              <div>
                <Label className="block mb-2">Status</Label>
                <div className="flex items-center gap-3">
                  <ToggleSwitch
                    checked={formData.is_active}
                    onChange={(checked) => handleInputChange('is_active', checked)}
                    disabled={loading}
                  />
                  <span className={`text-sm font-medium ${formData.is_active ? 'text-green-600' : 'text-red-600'}`}>
                    {formData.is_active ? 'Active' : 'Inactive'}
                  </span>
                </div>
              </div>

              {/* Banner Image Upload */}
              <div className="md:col-span-2">
                <Label className="block mb-2">
                  Banner Image <span className="text-red-500">*</span>
                </Label>
                <div className="flex flex-col sm:flex-row gap-6">
                  <div className="flex-1">
                    <FileInput
                      id="banner_image"
                      accept="image/*"
                      onChange={handleFileChange}
                      disabled={loading}
                      helperText="Upload banner image (Max 5MB, JPG/PNG/JPEG)"
                    />
                  </div>
                  {(formData.banner_image_preview || (banner && banner.banner_image)) && (
                    <div className="flex-shrink-0">
                      <div className="relative w-48 h-32 border border-gray-300 rounded-lg overflow-hidden">
                        <img
                          src={formData.banner_image_preview}
                          alt="Banner Preview"
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute top-2 right-2 bg-black bg-opacity-50 text-white text-xs px-2 py-1 rounded">
                          Preview
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Color Picker */}
              <div className="md:col-span-2" ref={colorPickerRef}>
                <Label className="block mb-2">
                  Banner Background Color
                </Label>
                <div className="relative">
                  <div className="flex items-center gap-3">
                    <div
                      className="w-10 h-10 rounded-lg border border-gray-300 cursor-pointer shadow-sm"
                      style={{ backgroundColor: formData.color_code }}
                      onClick={() => setShowColorPicker(!showColorPicker)}
                      title="Click to pick color"
                    />
                    <div className="flex-1">
                      <TextInput
                        id="color_code"
                        type="text"
                        value={formData.color_code}
                        onChange={(e) => handleInputChange('color_code', e.target.value)}
                        placeholder="#3B82F6"
                        disabled={loading}
                      />
                    </div>
                  </div>
                  
                  {showColorPicker && (
                    <div className="absolute z-50 mt-2">
                      <ChromePicker
                        color={formData.color_code}
                        onChange={(color) => handleInputChange('color_code', color.hex)}
                      />
                    </div>
                  )}
                </div>
                <p className="mt-2 text-xs text-gray-500">
                  Click on the color box to pick a color or enter hex code manually
                </p>
              </div>

              {/* Redirect URL */}
              <div className="md:col-span-2">
                <Label className="block mb-2">
                  Redirect URL <span className="text-red-500">*</span>
                </Label>
                <TextInput
                  id="redirect_url"
                  type="url"
                  value={formData.redirect_url}
                  onChange={(e) => handleInputChange('redirect_url', e.target.value)}
                  placeholder="https://example.com"
                  required
                  disabled={loading}
                  helperText="Enter the URL where users will be redirected when clicking the banner"
                />
              </div>
            </div>
          </div>
        </ModalBody>

        <ModalFooter className="flex justify-end gap-3">
          <Button color="alternative" onClick={handleClose} disabled={loading}>
            Cancel
          </Button>
          <Button type="submit" color="blue" disabled={loading}>
            {loading ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                <span className="ml-2">Processing...</span>
              </>
            ) : (
              banner ? 'Update Banner' : 'Add Banner'
            )}
          </Button>
        </ModalFooter>
      </form>
    </Modal>
  );
};

export default BannerFormModal;