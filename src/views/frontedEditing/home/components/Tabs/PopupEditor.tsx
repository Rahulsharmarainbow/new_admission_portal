import React, { useState, useEffect } from 'react';
import { Card, Label, TextInput, Button, Spinner, Textarea, ToggleSwitch, Modal, ModalFooter, ModalBody, ModalHeader } from 'flowbite-react';
import { toast } from 'react-hot-toast';
import { useAuth } from 'src/hook/useAuth';
import axios from 'axios';
import AcademicDropdown from 'src/Frontend/Common/AcademicDropdown';
import Loader from 'src/Frontend/Common/Loader';

interface PopupData {
  image: string;
  id?: number;
  title: string;
  description: string;
  popup_image: string;
  visible: boolean;
}

    const PopupEditor: React.FC<PopupData> = ({
      selectedAcademic,
      user,
      apiUrl,
    }) => {

        const assetUrl = import.meta.env.VITE_ASSET_URL;

  
  const [formVisible, setFormVisible] = useState(true);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [previewOpen, setPreviewOpen] = useState(false);
  
  // Form fields
  const [popupTitle, setPopupTitle] = useState('');
  const [id, setId] = useState('');
  const [popupDescription, setPopupDescription] = useState('');
  const [popupImage, setPopupImage] = useState<File | null>(null);
  const [popupImagePreview, setPopupImagePreview] = useState('');
  const [isVisible, setIsVisible] = useState(true);
  const [existingImage, setExistingImage] = useState('');

  
  useEffect(() => {
      if (selectedAcademic) getPopupData(selectedAcademic);
    }, [selectedAcademic]);
  

  // Demo API call to get popup data
  const getPopupData = async (academicId: string) => {
    setLoading(true);
    try {
      // Demo API call - replace with actual endpoint
      const response = await axios.post(
        `${apiUrl}/${user?.role}/FrontendEditing/get-apply-modal`,
        {
          academic_id: parseInt(academicId),
        },
        {
          headers: {
            Authorization: `Bearer ${user?.token}`,
            'Content-Type': 'application/json',
          },
        },
      );

      if (response.data.success) {
        const popupData: PopupData = response.data.data;
        setFormFields(popupData);
      } else {
        toast.error('Failed to fetch popup data');
        resetForm();
      }
    } catch (error: any) {
      console.error('Error fetching popup data:', error);
      if (error.response?.status === 404) {
        // If no data found, show empty form
        resetForm();
      } else {
        toast.error(error.response?.data?.message || 'An error occurred while fetching popup data');
      }
    } finally {
      setLoading(false);
    }
  };

  const setFormFields = (data: PopupData) => {
    setId(data.id?.toString() || ''); 
    setPopupTitle(data.title || '');
    setPopupDescription(data.description || '');
    setIsVisible(data.visible === 1 ? true : false);
    setExistingImage(data.image || '');
    setPopupImagePreview(data.image ? `${assetUrl}/${data.image}` : '');
  };

  const resetForm = () => {
    setPopupTitle('');
    setPopupDescription('');
    setPopupImage(null);
    setPopupImagePreview('');
    setExistingImage('');
    setIsVisible(true);
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Check file type
      if (!file.type.startsWith('image/')) {
        toast.error('Please select an image file');
        return;
      }

      // Check file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast.error('Image size should be less than 5MB');
        return;
      }

      setPopupImage(file);
      
      // Create preview URL
      const previewUrl = URL.createObjectURL(file);
      setPopupImagePreview(previewUrl);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      // Validate required fields
      if (!popupTitle || !popupDescription) {
        toast.error('Please fill all required fields');
        return;
      }

      const formData = new FormData();
      formData.append('academic_id', selectedAcademic);
      formData.append('s_id', user?.id || '');
      formData.append('id', id || '');
      formData.append('title', popupTitle);
      formData.append('description', popupDescription);
      formData.append('visible', isVisible ? '1' : '0');
      
      if (popupImage) {
        formData.append('popup_image', popupImage);
      }

      await updatePopupData(formData);
    } catch (error) {
      console.error('Error in handleSubmit:', error);
    } finally {
      setSaving(false);
    }
  };

  // Demo API call to update popup data
  const updatePopupData = async (formData: FormData) => {
    try {
      const response = await axios.post(
        `${apiUrl}/${user?.role}/FrontendEditing/update-apply-modal`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${user?.token}`,
            'Content-Type': 'multipart/form-data',
          },
        }
      );

      if (response.data.success) {
        toast.success('Popup data updated successfully!');
        // Refresh the data after update
        getPopupData(selectedAcademic);
      } else {
        toast.error(response.data.message || 'Failed to update popup data');
      }
    } catch (error: any) {
      console.error('Error updating popup data:', error);
      toast.error(error.response?.data?.message || 'An error occurred while updating popup data');
    }
  };

  const handlePreview = () => {
    if (!popupTitle || !popupDescription) {
      toast.error('Please fill title and description to preview');
      return;
    }
    setPreviewOpen(true);
  };

  const handleInputChange =
    (setStateFunction: React.Dispatch<React.SetStateAction<string>>) =>
    (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setStateFunction(event.target.value);
    };

  if (loading) {
    return <Loader />;
  }

  return (
    <div>
     

      {/* Popup Form */}
      {formVisible && (
        <Card>
          <div className="p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold">Popup Content Editing</h2>
              <Button 
                onClick={handlePreview}
                color="indigo"
                disabled={!popupTitle || !popupDescription}
              >
                Preview Popup
              </Button>
            </div>
            
            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 gap-6">
                
                {/* Popup Title */}
                <div>
                  <Label htmlFor="popupTitle" className="block mb-2">
                    Popup Title *
                  </Label>
                  <TextInput
                    id="popupTitle"
                    type="text"
                    value={popupTitle}
                    onChange={handleInputChange(setPopupTitle)}
                    placeholder="Enter popup title"
                    required
                  />
                </div>

                {/* Popup Description */}
                <div>
                  <Label htmlFor="popupDescription" className="block mb-2">
                    Popup Description *
                  </Label>
                  <Textarea
                    id="popupDescription"
                    value={popupDescription}
                    onChange={handleInputChange(setPopupDescription)}
                    placeholder="Enter popup description"
                    required
                    rows={6}
                    className="resize-vertical"
                  />
                </div>

                {/* Popup Image Upload */}
                <div>
                  <Label htmlFor="popupImage" className="block mb-2">
                    Popup Image
                  </Label>
                  <div className="flex items-center gap-4">
                    <div className="flex-1">
                      <input
                        id="popupImage"
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                        className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                      />
                      <p className="text-sm text-gray-500 mt-1">
                        Recommended: 800x600px, max 5MB
                      </p>
                    </div>
                    
                    {/* Image Preview */}
                    {(popupImagePreview || existingImage) && (
                      <div className="w-20 h-20 border rounded-lg overflow-hidden">
                        <img 
                          src={popupImagePreview || `${apiUrl}/storage/${existingImage}`} 
                          alt="Popup preview" 
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}
                  </div>
                </div>

                {/* Visibility Toggle */}
                <div className="flex items-center gap-3">
                  <ToggleSwitch
                    checked={isVisible}
                    label="Popup Visible"
                    onChange={setIsVisible}
                  />
                  <span className={`text-sm font-medium ${isVisible ? 'text-green-600' : 'text-red-600'}`}>
                    {isVisible ? 'Popup is visible to users' : 'Popup is hidden from users'}
                  </span>
                </div>

                {/* Submit Button */}
                <div className="flex justify-end pt-4 border-t">
                  <Button 
                    type="submit" 
                    className="min-w-[120px]" 
                    disabled={saving}
                    color="primary"
                  >
                    {saving ? (
                      <>
                        <Spinner size="sm" className="mr-2" />
                        Saving...
                      </>
                    ) : (
                      'Save Changes'
                    )}
                  </Button>
                </div>
              </div>
            </form>
          </div>
        </Card>
      )}

      {/* Preview Modal */}
      <Modal show={previewOpen} onClose={() => setPreviewOpen(false)} size="2xl" className='overflow-visible'>
        <ModalHeader>
          <div className="flex justify-between items-center w-full">
            <h2 className="text-xl font-semibold text-gray-800 dark:text-white">
              Popup Preview
            </h2>
          </div>
        </ModalHeader>

        <ModalBody className="relative overflow-visible z-[100]">
          <div className="space-y-6 max-h-[50vh] overflow-y-auto pr-2">
            {/* Popup Title */}
            <div className="text-center">
              <h3 className="text-2xl font-bold text-gray-800 mb-4">
                {popupTitle}
              </h3>
            </div>

            {/* Popup Image */}
            {(popupImagePreview || existingImage) && (
              <div className="flex justify-center">
                <div className="w-full max-w-sm h-50 border rounded-lg overflow-hidden">
                  <img 
                    src={popupImagePreview || `${apiUrl}/storage/${existingImage}`} 
                    alt="Popup" 
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            )}

            {/* Popup Description */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-gray-700 whitespace-pre-line">
                {popupDescription}
              </p>
            </div>
          </div>
        </ModalBody>

        <ModalFooter className="flex justify-end gap-3">
          <Button color="alternative" onClick={() => setPreviewOpen(false)}>
            Close Preview
          </Button>
          <Button 
            color="blue" 
            onClick={() => {
              setPreviewOpen(false);
              // Scroll to form
              document.querySelector('form')?.scrollIntoView({ behavior: 'smooth' });
            }}
          >
            Edit Popup
          </Button>
        </ModalFooter>
      </Modal>
    </div>
  );
};

export default PopupEditor;