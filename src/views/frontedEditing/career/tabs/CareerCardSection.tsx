import React, { useEffect, useState, useRef, useMemo, useCallback } from 'react';
import { 
  Card, 
  Label, 
  TextInput, 
  Button, 
  Spinner, 
  Modal
} from 'flowbite-react';
import { toast } from 'react-hot-toast';
import axios from 'axios';
import Loader from 'src/Frontend/Common/Loader';
import JoditEditor from 'jodit-react';

interface CareerHeaderFooterData {
  id?: number;
  academic_id?: number;
  title?: string;
  long_description?: string;
  banner_image?: string;
  created_at?: string;
  updated_at?: string;
}

interface CareerCardSectionProps {
  selectedAcademic: string;
  user: any;
  apiUrl: string;
}

const assetUrl = import.meta.env.VITE_ASSET_URL;

const CareerCardSection: React.FC<CareerCardSectionProps> = ({
  selectedAcademic,
  user,
  apiUrl,
}) => {
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  
  // Form fields
  const [title, setTitle] = useState('');
  const [longDescription, setLongDescription] = useState('');
  const [bannerImage, setBannerImage] = useState<File | string | null>(null);
  const [bannerPreview, setBannerPreview] = useState('');
  const [isVideo, setIsVideo] = useState(false);

  // Preview modal
  const [showPreviewModal, setShowPreviewModal] = useState(false);

  const editorRef = useRef(null);

  const editorConfig = useMemo(
    () => ({
      readonly: false,
      height: 400,
      toolbarSticky: false,
      toolbarAdaptive: false,
      buttons: [
        'source',
        '|',
        'bold',
        'italic',
        'underline',
        'strikethrough',
        '|',
        'ul',
        'ol',
        '|',
        'font',
        'fontsize',
        'brush',
        'paragraph',
        '|',
        'image',
        'video',
        'table',
        'link',
        '|',
        'left',
        'center',
        'right',
        'justify',
        '|',
        'undo',
        'redo',
        '|',
        'hr',
        'eraser',
        'copyformat',
        'fullsize',
      ],
      showXPathInStatusbar: false,
      showCharsCounter: false,
      showWordsCounter: false,
      uploader: { insertImageAsBase64URI: true },
      placeholder: 'Enter career page description here...',
      theme: 'default',
    }),
    [],
  );

  const handleEditorBlur = useCallback((newContent: string) => {
    setLongDescription(newContent);
  }, []);

  useEffect(() => {
    if (selectedAcademic) getCareerHeaderFooter();
  }, [selectedAcademic]);

  const getCareerHeaderFooter = async () => {
    if (!selectedAcademic) return;
    setLoading(true);
    try {
      const response = await axios.post(
        `${apiUrl}/${user?.role}/Career/get-card-content`,
        { academic_id: parseInt(selectedAcademic) },
        {
          headers: {
            Authorization: `Bearer ${user?.token}`,
            'Content-Type': 'application/json',
          },
        },
      );

      if (response.data?.status) {
        setFormFields(response.data.data);
      } else {
        toast.error(response.data?.message || 'Failed to fetch career Card data');
        resetForm();
      }
    } catch (error: any) {
      console.error('Error fetching career Card data:', error);
      resetForm();
    } finally {
      setLoading(false);
    }
  };

  const setFormFields = (data: CareerHeaderFooterData) => {
    setTitle(data.title || '');
    setLongDescription(data.long_description || '');
    
    if (data.banner_image) {
      setBannerImage(data.banner_image);
      const fileUrl = `${assetUrl}/${data.banner_image}`;
      setBannerPreview(fileUrl);
      
      // Check if it's a video
      const videoExtensions = ['.mp4', '.webm', '.ogg', '.mov'];
      const isVideoFile = videoExtensions.some(ext => 
        data.banner_image.toLowerCase().endsWith(ext)
      );
      setIsVideo(isVideoFile);
    } else {
      setBannerImage(null);
      setBannerPreview('');
      setIsVideo(false);
    }
  };

  const resetForm = () => {
    setTitle('');
    setLongDescription('');
    setBannerImage(null);
    setBannerPreview('');
    setIsVideo(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedAcademic) {
      toast.error('Please select an academic first');
      return;
    }

    if (!title || !longDescription) {
      toast.error('Please fill all required fields');
      return;
    }

    setSaving(true);

    try {
      const formData = new FormData();
      formData.append('academic_id', parseInt(selectedAcademic).toString());
      formData.append('s_id', user?.id?.toString() || '');
      formData.append('title', title);
      formData.append('long_description', longDescription);

      // Append banner image if it's a File
      if (bannerImage instanceof File) {
        formData.append('banner_image', bannerImage);
      } else if (typeof bannerImage === 'string' && bannerImage) {
        // If it's a string (existing file path), send it as is
        formData.append('banner_image', bannerImage);
      }

      const response = await axios.post(
        `${apiUrl}/${user?.role}/Career/update-card-content`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${user?.token}`,
            'Content-Type': 'multipart/form-data',
          },
        },
      );

      if (response.data?.status) {
        toast.success(response.data?.message || 'Career Card updated successfully!');
        getCareerHeaderFooter();
      } else {
        toast.error(response.data?.message || 'Failed to update career Card');
      }
    } catch (error: any) {
      console.error('Error updating career:', error);
    } finally {
      setSaving(false);
    }
  };

  const handleBannerChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setBannerImage(file);
      
      // Check if it's a video
      const videoExtensions = ['.mp4', '.webm', '.ogg', '.mov', '.avi', '.mkv'];
      const isVideoFile = videoExtensions.some(ext => 
        file.name.toLowerCase().endsWith(ext)
      );
      setIsVideo(isVideoFile);
      
      if (isVideoFile) {
        setBannerPreview(URL.createObjectURL(file));
      } else {
        // For images, create preview
        const reader = new FileReader();
        reader.onload = () => setBannerPreview(reader.result as string);
        reader.readAsDataURL(file);
      }
    }
  };

  const handleRemoveBanner = () => {
    setBannerImage(null);
    setBannerPreview('');
    setIsVideo(false);
  };

  if (!selectedAcademic) {
    return (
      <Card className="p-6">
        <p className="text-gray-500 italic">
          Please select an academic from above to manage career header & footer.
        </p>
      </Card>
    );
  }

  return (
    <div>
      {loading ? (
        <Loader />
      ) : (
        <div className="space-y-6">
          {/* Header & Footer Form */}
          <Card>
            <div className="p-6">
              <h2 className="text-xl font-semibold mb-6">Career Card Management</h2>
              
              <form onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 gap-6">
                  {/* Title */}
                  <div>
                    <Label htmlFor="title" className="block mb-2">
                      Page Title *
                    </Label>
                    <TextInput
                      id="title"
                      type="text"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      placeholder="Enter career page title"
                      required
                    />
                  </div>

                  {/* Banner Image/Video */}
                  <div>
                    <Label htmlFor="bannerImage" className="block mb-2">
                      Banner Image/Video
                    </Label>
                    <div className="space-y-4">
                      {bannerPreview && (
                        <div className="relative">
                          <div className="border border-gray-300 rounded-lg overflow-hidden max-w-2xl">
                            {isVideo ? (
                              <video 
                                src={bannerPreview} 
                                controls 
                                className="w-full h-auto max-h-96 object-contain"
                              />
                            ) : (
                              <img
                                src={bannerPreview}
                                alt="Banner Preview"
                                className="w-full h-auto max-h-96 object-contain"
                              />
                            )}
                          </div>
                          <div className="flex items-center space-x-2 mt-2">
                            <Button
                              type="button"
                              color="light"
                              size="xs"
                              onClick={() => setShowPreviewModal(true)}
                            >
                              Preview
                            </Button>
                            <Button
                              type="button"
                              color="failure"
                              size="xs"
                              onClick={handleRemoveBanner}
                            >
                              Remove
                            </Button>
                          </div>
                        </div>
                      )}
                      
                      <div className="flex items-center gap-4">
                        <input
                          id="bannerImage"
                          type="file"
                          accept="image/*,video/*"
                          onChange={handleBannerChange}
                          className="block border border-gray-300 rounded-lg p-2 text-sm flex-1"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Long Description - Rich Text Editor */}
                  <div>
                    <Label htmlFor="longDescription" className="block mb-2">
                      Page Description *
                    </Label>
                    <div className="border border-gray-300 rounded-lg overflow-hidden">
                      <JoditEditor
                        ref={editorRef}
                        value={longDescription}
                        config={editorConfig}
                        onBlur={handleEditorBlur}
                      />
                    </div>
                  </div>

                  {/* Submit Button */}
                  <div className="flex justify-end pt-4">
                    <Button type="submit" className="min-w-[120px]" disabled={saving}>
                      {saving ? (
                        <>
                          <Spinner size="sm" className="mr-2" /> Saving...
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
        </div>
      )}

    </div>
  );
};

export default CareerCardSection;