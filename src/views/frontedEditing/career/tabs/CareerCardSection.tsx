import React, { useEffect, useState, useRef, useMemo, useCallback } from 'react';
import { 
  Card, 
  Label, 
  TextInput, 
  Button, 
  Spinner,
  Select 
} from 'flowbite-react';
import { toast } from 'react-hot-toast';
import axios from 'axios';
import Loader from 'src/Frontend/Common/Loader';
import JoditEditor from 'jodit-react';
import { ChromePicker } from 'react-color';

interface CareerHeaderFooterData {
  id?: number;
  academic_id?: number;
  title?: string;
  long_description?: string;
  banner_image?: string;
  banner_color?: string;
  banner_text_color?: string;
  search_color?: string;
  search_text_color?: string;
  success_message?: string;
  terms_consent_text?: string;
  theme_colour?: string;
  font_family?: string;
  developed_by?: string;
  resume_size?: number;
  created_at?: string;
  updated_at?: string;
}

interface CareerCardSectionProps {
  selectedAcademic: string;
  user: any;
  apiUrl: string;
}

const assetUrl = import.meta.env.VITE_ASSET_URL;

// Font families array for dropdown
const FONT_FAMILIES = [
  { value: 'Roboto', label: 'Roboto' },
  { value: 'Open Sans', label: 'Open Sans' },
  { value: 'Montserrat', label: 'Montserrat' },
  { value: 'Poppins', label: 'Poppins' },
  { value: 'Lato', label: 'Lato' },
  { value: 'Nunito', label: 'Nunito' },
  { value: 'Inter', label: 'Inter' },
  { value: 'Raleway', label: 'Raleway' },
  { value: 'Ubuntu', label: 'Ubuntu' },
  { value: 'Merriweather', label: 'Merriweather' },
  { value: 'Playfair Display', label: 'Playfair Display' },
  { value: 'Source Sans Pro', label: 'Source Sans Pro' },
  { value: 'Oswald', label: 'Oswald' },
  { value: 'Roboto Condensed', label: 'Roboto Condensed' },
  { value: 'Noto Sans', label: 'Noto Sans' },
  { value: 'Arial, sans-serif', label: 'Arial' },
  { value: 'Helvetica, sans-serif', label: 'Helvetica' },
  { value: 'Georgia, serif', label: 'Georgia' },
  { value: 'Times New Roman, serif', label: 'Times New Roman' },
  { value: 'Verdana, sans-serif', label: 'Verdana' },
];

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
  
  // New fields
  const [bannerColor, setBannerColor] = useState('#3B82F6'); 
  const [bannerTextColor, setBannerTextColor] = useState('#FFFFFF'); 
  const [searchColor, setSearchColor] = useState('#10B981'); 
  const [searchTextColor, setSearchTextColor] = useState('#FFFFFF'); 
  const [successMessage, setSuccessMessage] = useState('');
  const [resumeSize, setResumeSize] = useState<number>(10); 
  
  // Newly added fields
  const [developedBy, setDevelopedBy] = useState('');
  const [fontFamily, setFontFamily] = useState('');
  const [themeColour, setThemeColour] = useState('#3B82F6');
  const [termsConsentText, setTermsConsentText] = useState('');
  
  // Color picker states
  const [showBannerColorPicker, setShowBannerColorPicker] = useState(false);
  const [showBannerTextColorPicker, setShowBannerTextColorPicker] = useState(false);
  const [showSearchColorPicker, setShowSearchColorPicker] = useState(false);
  const [showSearchTextColorPicker, setShowSearchTextColorPicker] = useState(false);
  const [showThemeColorPicker, setShowThemeColorPicker] = useState(false);

  // Date pickers
  const [bannerTextColorDate, setBannerTextColorDate] = useState<Date | null>(null);
  const [searchTextColorDate, setSearchTextColorDate] = useState<Date | null>(null);

  const editorRef = useRef(null);
  const termsEditorRef = useRef(null);
  const bannerColorPickerRef = useRef<HTMLDivElement>(null);
  const bannerTextColorPickerRef = useRef<HTMLDivElement>(null);
  const searchColorPickerRef = useRef<HTMLDivElement>(null);
  const searchTextColorPickerRef = useRef<HTMLDivElement>(null);
  const themeColorPickerRef = useRef<HTMLDivElement>(null);

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
      placeholder: 'Enter text here...',
      theme: 'default',
    }),
    [],
  );

  // Close color picker when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        bannerColorPickerRef.current && 
        !bannerColorPickerRef.current.contains(event.target as Node)
      ) {
        setShowBannerColorPicker(false);
      }
      if (
        bannerTextColorPickerRef.current && 
        !bannerTextColorPickerRef.current.contains(event.target as Node)
      ) {
        setShowBannerTextColorPicker(false);
      }
      if (
        searchColorPickerRef.current && 
        !searchColorPickerRef.current.contains(event.target as Node)
      ) {
        setShowSearchColorPicker(false);
      }
      if (
        searchTextColorPickerRef.current && 
        !searchTextColorPickerRef.current.contains(event.target as Node)
      ) {
        setShowSearchTextColorPicker(false);
      }
      if (
        themeColorPickerRef.current && 
        !themeColorPickerRef.current.contains(event.target as Node)
      ) {
        setShowThemeColorPicker(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleEditorBlur = useCallback((newContent: string) => {
    setLongDescription(newContent);
  }, []);

  const handleTermsEditorBlur = useCallback((newContent: string) => {
    setTermsConsentText(newContent);
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
    setBannerColor(data.banner_color || '#3B82F6');
    setBannerTextColor(data.banner_text_color || '#FFFFFF');
    setSearchColor(data.search_color || '#10B981');
    setSearchTextColor(data.search_text_color || '#FFFFFF');
    setSuccessMessage(data.success_message || '');
    setResumeSize(data.resume_size || 10);
    
    // New fields
    setDevelopedBy(data.developed_by || '');
    setFontFamily(data.font_family || '');
    setThemeColour(data.theme_colour || '#3B82F6');
    setTermsConsentText(data.terms_consent_text || '');
    
    // Set dates if they exist in the data
    if (data.banner_text_color_date) {
      setBannerTextColorDate(new Date(data.banner_text_color_date));
    }
    if (data.search_text_color_date) {
      setSearchTextColorDate(new Date(data.search_text_color_date));
    }
    
    if (data.banner_image) {
      setBannerImage(data.banner_image);
      const fileUrl = `${assetUrl}/${data.banner_image}`;
      setBannerPreview(fileUrl);
      
      // Check if it's a video
      const videoExtensions = ['.mp4', '.webm', '.ogg', '.mov'];
      const isVideoFile = videoExtensions.some(ext => 
        data.banner_image?.toLowerCase().endsWith(ext)
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
    setBannerColor('#3B82F6');
    setBannerTextColor('#FFFFFF');
    setSearchColor('#10B981');
    setSearchTextColor('#FFFFFF');
    setSuccessMessage('');
    setResumeSize(10);
    
    // Reset new fields
    setDevelopedBy('');
    setFontFamily('');
    setThemeColour('#3B82F6');
    setTermsConsentText('');
    
    setBannerTextColorDate(null);
    setSearchTextColorDate(null);
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

    // Validate resume size
    if (resumeSize < 1 || resumeSize > 100) {
      toast.error('Resume size must be between 1MB and 100MB');
      return;
    }

    setSaving(true);

    try {
      const formData = new FormData();
      formData.append('academic_id', parseInt(selectedAcademic).toString());
      formData.append('s_id', user?.id?.toString() || '');
      formData.append('title', title);
      formData.append('long_description', longDescription);
      formData.append('banner_color', bannerColor);
      formData.append('banner_text_color', bannerTextColor);
      formData.append('search_color', searchColor);
      formData.append('search_text_color', searchTextColor);
      formData.append('success_message', successMessage);
      formData.append('resume_size', resumeSize.toString());
      
      // New fields
      formData.append('developed_by', developedBy);
      formData.append('font_family', fontFamily);
      formData.append('theme_colour', themeColour);
      formData.append('terms_consent_text', termsConsentText);

      // Append dates if they exist
      if (bannerTextColorDate) {
        formData.append('banner_text_color_date', bannerTextColorDate.toISOString());
      }
      if (searchTextColorDate) {
        formData.append('search_text_color_date', searchTextColorDate.toISOString());
      }

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

                  {/* New fields - Developed By and Font Family */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Developed By */}
                    <div>
                      <Label htmlFor="developedBy" className="block mb-2">
                        Developed By
                      </Label>
                      <TextInput
                        id="developedBy"
                        type="text"
                        value={developedBy}
                        onChange={(e) => setDevelopedBy(e.target.value)}
                        placeholder="e.g., Company Name or Developer Name"
                      />
                    </div>

                    {/* Font Family */}
                   <div className="space-y-2">
  <div className="flex items-center justify-between">
    <label htmlFor="fontInput" className="font-medium text-gray-900">
      Font Family
    </label>
    {fontFamily && (
      <button
        type="button"
        onClick={() => setFontFamily('')}
        className="text-sm text-red-600 hover:text-red-800"
      >
        Clear
      </button>
    )}
  </div>
  
  <input
    id="fontInput"
    type="text"
    value={fontFamily}
    onChange={(e) => setFontFamily(e.target.value)}
    placeholder="Paste or type font family (e.g., 'Segoe UI', 'Montserrat', 'Open Sans')"
    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all bg-white text-gray-900 hover:border-gray-400 placeholder-gray-500"
  />
  
  {fontFamily && (
    <div className="pt-2">
      <p className="text-sm text-gray-600">
        Using font: <code className="px-2 py-1 bg-gray-100 rounded font-mono">{fontFamily}</code>
      </p>
    </div>
  )}
</div>
                  </div>

                  {/* Color Pickers */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Banner Color */}
                    <div>
                      <Label htmlFor="bannerColor" className="block mb-2">
                        Banner Background Color
                      </Label>
                      <div className="relative" ref={bannerColorPickerRef}>
                        <div className="flex items-center gap-3">
                          <div
                            className="w-10 h-10 rounded-lg border border-gray-300 cursor-pointer"
                            style={{ backgroundColor: bannerColor }}
                            onClick={() => setShowBannerColorPicker(!showBannerColorPicker)}
                          />
                          <TextInput
                            id="bannerColor"
                            type="text"
                            value={bannerColor}
                            onChange={(e) => setBannerColor(e.target.value)}
                            placeholder="#3B82F6"
                            className="flex-1"
                          />
                        </div>
                        
                        {showBannerColorPicker && (
                          <div className="absolute z-10 mt-2">
                            <ChromePicker
                              color={bannerColor}
                              onChange={(color) => setBannerColor(color.hex)}
                            />
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Search Color */}
                    <div>
                      <Label htmlFor="searchColor" className="block mb-2">
                        Search Button Color
                      </Label>
                      <div className="relative" ref={searchColorPickerRef}>
                        <div className="flex items-center gap-3">
                          <div
                            className="w-10 h-10 rounded-lg border border-gray-300 cursor-pointer"
                            style={{ backgroundColor: searchColor }}
                            onClick={() => setShowSearchColorPicker(!showSearchColorPicker)}
                          />
                          <TextInput
                            id="searchColor"
                            type="text"
                            value={searchColor}
                            onChange={(e) => setSearchColor(e.target.value)}
                            placeholder="#10B981"
                            className="flex-1"
                          />
                        </div>
                        
                        {showSearchColorPicker && (
                          <div className="absolute z-10 mt-2">
                            <ChromePicker
                              color={searchColor}
                              onChange={(color) => setSearchColor(color.hex)}
                            />
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Banner Text Color */}
                    <div>
                      <Label htmlFor="bannerTextColor" className="block mb-2">
                        Banner Text Color
                      </Label>
                      <div className="space-y-3">
                        <div className="relative" ref={bannerTextColorPickerRef}>
                          <div className="flex items-center gap-3">
                            <div
                              className="w-10 h-10 rounded-lg border border-gray-300 cursor-pointer"
                              style={{ backgroundColor: bannerTextColor }}
                              onClick={() => setShowBannerTextColorPicker(!showBannerTextColorPicker)}
                            />
                            <TextInput
                              id="bannerTextColor"
                              type="text"
                              value={bannerTextColor}
                              onChange={(e) => setBannerTextColor(e.target.value)}
                              placeholder="#FFFFFF"
                              className="flex-1"
                            />
                          </div>
                          
                          {showBannerTextColorPicker && (
                            <div className="absolute z-10 mt-2">
                              <ChromePicker
                                color={bannerTextColor}
                                onChange={(color) => setBannerTextColor(color.hex)}
                              />
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Search Text Color */}
                    <div>
                      <Label htmlFor="searchTextColor" className="block mb-2">
                        Search Text Color
                      </Label>
                      <div className="space-y-3">
                        <div className="relative" ref={searchTextColorPickerRef}>
                          <div className="flex items-center gap-3">
                            <div
                              className="w-10 h-10 rounded-lg border border-gray-300 cursor-pointer"
                              style={{ backgroundColor: searchTextColor }}
                              onClick={() => setShowSearchTextColorPicker(!showSearchTextColorPicker)}
                            />
                            <TextInput
                              id="searchTextColor"
                              type="text"
                              value={searchTextColor}
                              onChange={(e) => setSearchTextColor(e.target.value)}
                              placeholder="#FFFFFF"
                              className="flex-1"
                            />
                          </div>
                          
                          {showSearchTextColorPicker && (
                            <div className="absolute z-10 mt-2">
                              <ChromePicker
                                color={searchTextColor}
                                onChange={(color) => setSearchTextColor(color.hex)}
                              />
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Theme Colour */}
                    <div>
                      <Label htmlFor="themeColour" className="block mb-2">
                        Theme Colour
                      </Label>
                      <div className="relative" ref={themeColorPickerRef}>
                        <div className="flex items-center gap-3">
                          <div
                            className="w-10 h-10 rounded-lg border border-gray-300 cursor-pointer"
                            style={{ backgroundColor: themeColour }}
                            onClick={() => setShowThemeColorPicker(!showThemeColorPicker)}
                          />
                          <TextInput
                            id="themeColour"
                            type="text"
                            value={themeColour}
                            onChange={(e) => setThemeColour(e.target.value)}
                            placeholder="#3B82F6"
                            className="flex-1"
                          />
                        </div>
                        
                        {showThemeColorPicker && (
                          <div className="absolute z-10 mt-2">
                            <ChromePicker
                              color={themeColour}
                              onChange={(color) => setThemeColour(color.hex)}
                            />
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Success Message */}
                  <div>
                    <Label htmlFor="successMessage" className="block mb-2">
                      Success Message
                    </Label>
                    <TextInput
                      id="successMessage"
                      type="text"
                      value={successMessage}
                      onChange={(e) => setSuccessMessage(e.target.value)}
                      placeholder="Enter success message after application submission"
                    />
                  </div>

                  {/* Terms & Consent Text Editor */}
                  <div>
                    <Label htmlFor="termsConsentText" className="block mb-2">
                      Terms & Consent Text
                    </Label>
                    <div className="border border-gray-300 rounded-lg overflow-hidden">
                      <JoditEditor
                        ref={termsEditorRef}
                        value={termsConsentText}
                        config={{
                          ...editorConfig,
                          height: 200,
                          placeholder: 'Enter terms and conditions or consent text here...',
                        }}
                        onBlur={handleTermsEditorBlur}
                      />
                    </div>
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

                  {/* Resume Size */}
                  {/* <div className="max-w-xs">
                    <Label htmlFor="resumeSize" className="block mb-2">
                      Resume Size Limit (MB)
                    </Label>
                    <TextInput
                      id="resumeSize"
                      type="number"
                      value={resumeSize}
                      onChange={(e) => setResumeSize(parseInt(e.target.value) || 10)}
                      min={1}
                      max={100}
                      placeholder="10"
                    />
                    <p className="mt-1 text-sm text-gray-500">
                      Maximum file size for resume upload (1-100 MB)
                    </p>
                  </div> */}

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