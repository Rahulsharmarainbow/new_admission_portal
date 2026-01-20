import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Card, Label, TextInput, Button, Spinner, Textarea } from 'flowbite-react';
import { toast } from 'react-hot-toast';
import axios from 'axios';
import Loader from 'src/Frontend/Common/Loader';
import { FaPlus, FaTrash } from 'react-icons/fa';
import { HiOutlinePlus, HiOutlineTrash } from 'react-icons/hi';
import { set } from 'lodash';
import JoditEditor from 'jodit-react';

// Static Font Awesome icons list
const fontAwesomeIcons = [
  { value: 'fa-brands fa-facebook-f', label: 'Facebook' },
  { value: 'fa-brands fa-instagram', label: 'Instagram' },
  { value: 'fa-brands fa-linkedin-in', label: 'LinkedIn' },
  { value: 'fa-brands fa-x-twitter', label: 'Twitter' },
  { value: 'fa-brands fa-youtube', label: 'YouTube' },
  { value: 'fa-brands fa-whatsapp', label: 'WhatsApp' },
  { value: 'fa-brands fa-telegram', label: 'Telegram' },
  { value: 'fa-brands fa-github', label: 'GitHub' },
  { value: 'fa-brands fa-tiktok', label: 'TikTok' },
  { value: 'fa-brands fa-snapchat', label: 'Snapchat' },
  { value: 'fa-solid fa-globe', label: 'Website' },
  { value: 'fa-solid fa-envelope', label: 'Email' },
  { value: 'fa-solid fa-phone', label: 'Phone' },
  { value: 'fa-solid fa-map-marker-alt', label: 'Location' },
];

interface SocialIcon {
  icon_url: string;
  icon: string;
}

interface CareerFooterData {
  header: {
    header_heading: string;
    academic_address: string;
    academic_logo: string;
  };
  footer: {
    academic_mobile: string;
    academic_email: string;
    social_icon: SocialIcon[];
  };
}

interface CareerFooterSectionProps {
  selectedAcademic: string;
  user: any;
  apiUrl: string;
}

const assetUrl = import.meta.env.VITE_ASSET_URL;

const CareerFooterSection: React.FC<CareerFooterSectionProps> = ({
  selectedAcademic,
  user,
  apiUrl,
}) => {
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  // Header Fields
  const [academicLogo, setAcademicLogo] = useState<File | string | null>(null);
  const [academicLogoPreview, setAcademicLogoPreview] = useState('');
  const [academicIcon, setAcademicIcon] = useState<File | string | null>(null);
  const [academicIconPreview, setAcademicIconPreview] = useState('');
  const [headerHeading, setHeaderHeading] = useState('');
  const [academicAddress, setAcademicAddress] = useState('');
  const [buttonUrl, setButtonUrl] = useState('');
  const editorRef = useRef(null);
  const [longDescription, setLongDescription] = useState('');
  // Footer Fields
  const [academicMobile, setAcademicMobile] = useState('');
  const [academicEmail, setAcademicEmail] = useState('');

  // Social Media Fields
  const [socialIcons, setSocialIcons] = useState<SocialIcon[]>([{ icon_url: '', icon: '' }]);

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

  useEffect(() => {
    if (selectedAcademic) getCareerFooterData(selectedAcademic);
    else resetForm();
  }, [selectedAcademic]);

  const getCareerFooterData = async (academicId: string) => {
    if (!academicId) return;
    setLoading(true);
    try {
      const response = await axios.post(
        `${apiUrl}/${user?.role}/Career/get-header-footer`,
        { academic_id: parseInt(academicId) },
        {
          headers: {
            Authorization: `Bearer ${user?.token}`,
            'Content-Type': 'application/json',
            superadmin_auth_token: user?.token,
          },
        },
      );

      if (response.data.status) {
        setFormFields(response.data.data);
      } else {
        toast.error(response.data.message || 'Failed to fetch career footer data');
        resetForm();
      }
    } catch (error: any) {
      console.error('Error fetching career footer data:', error);
      if (error.response?.status === 404) resetForm();
      else toast.error(error.response?.data?.message || 'Error fetching data');
    } finally {
      setLoading(false);
    }
  };

  const setFormFields = (data: CareerFooterData) => {
    // Header
    if (data.header?.academic_logo) {
      setAcademicLogo(data.header.academic_logo);
      setAcademicIcon(data.header.academic_favicon);
      setAcademicLogoPreview(`${assetUrl}/${data.header.academic_logo}`);
      setAcademicIconPreview(`${assetUrl}/${data.header.academic_favicon}`);
      setButtonUrl(`${data.header.academic_website}`);
    }
    setHeaderHeading(data.header?.header_heading || '');
    setAcademicAddress(data.header?.academic_address || '');

    // Footer
    setAcademicEmail(data.footer?.academic_email || '');
    setAcademicMobile(data.footer?.academic_mobile || '');

    // Social Media
    setSocialIcons(data.footer?.social_icon || [{ icon_url: '', icon: '' }]);
  };

  const resetForm = () => {
    setAcademicLogo(null);
    setAcademicLogoPreview('');
    setHeaderHeading('');
    setAcademicAddress('');
    setAcademicEmail('');
    setAcademicMobile('');
    setSocialIcons([{ icon_url: '', icon: '' }]);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedAcademic) {
      toast.error('Please select an academic first');
      return;
    }

    // Validate social icons
    const validSocialIcons = socialIcons.filter(
      (icon) => icon.icon_url.trim() !== '' && icon.icon.trim() !== '',
    );

    if (validSocialIcons.length === 0) {
      toast.error('At least one social icon with both icon class and URL is required');
      return;
    }

    setSaving(true);

    try {
      const formData = new FormData();
      formData.append('academic_id', selectedAcademic);
      formData.append('s_id', user?.id?.toString() || '');

      // Header
      formData.append('header_heading', headerHeading);
      formData.append('academic_address', academicAddress);
      formData.append('academic_website', buttonUrl);
      if (academicLogo instanceof File) {
        formData.append('academic_logo', academicLogo);
      } else if (typeof academicLogo === 'string' && academicLogo) {
        formData.append('academic_logo', academicLogo);
      }

      if (academicIcon instanceof File) {
        formData.append('favicon', academicIcon);
      } else if (typeof academicIcon === 'string' && academicIcon) {
        formData.append('favicon', academicIcon);
      }

      // Footer
      formData.append('academic_mobile', academicMobile);
      formData.append('academic_email', academicEmail);

      // Social Media
      formData.append('social_icon', JSON.stringify(validSocialIcons));

      const response = await axios.post(
        `${apiUrl}/${user?.role}/Career/update-header-footer`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${user?.token}`,
            superadmin_auth_token: user?.token,
            'Content-Type': 'multipart/form-data',
          },
        },
      );

      if (response.data.status) {
        toast.success('Career header & footer data updated successfully!');
        getCareerFooterData(selectedAcademic);
      } else {
        toast.error(response.data.message || 'Failed to update data');
      }
    } catch (error: any) {
      console.error('Error updating data:', error);
      toast.error(error.response?.data?.message || 'Error updating data');
    } finally {
      setSaving(false);
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setAcademicLogo(file);
      const reader = new FileReader();
      reader.onload = () => setAcademicLogoPreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleIconChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setAcademicIcon(file);
      const reader = new FileReader();
      reader.onload = () => setAcademicIconPreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleSocialIconChange = (index: number, field: keyof SocialIcon, value: string) => {
    const updatedIcons = [...socialIcons];
    updatedIcons[index] = {
      ...updatedIcons[index],
      [field]: value,
    };
    setSocialIcons(updatedIcons);
  };

  const addSocialIcon = () => {
    setSocialIcons([...socialIcons, { icon_url: '', icon: '' }]);
  };

  const removeSocialIcon = (index: number) => {
    if (socialIcons.length > 1) {
      const updatedIcons = socialIcons.filter((_, i) => i !== index);
      setSocialIcons(updatedIcons);
    }
  };

  const handleEditorBlur = useCallback((newContent: string) => {
    setAcademicAddress(newContent);
  }, []);

  if (!selectedAcademic) {
    return (
      <Card className="p-6">
        <p className="text-gray-500 italic">
          Please select an academic from above to edit career header & footer details.
        </p>
      </Card>
    );
  }

  return (
    <div>
      {loading ? (
        <Loader />
      ) : (
        <Card>
          <div className="p-6">
            <form onSubmit={handleSubmit}>
              <h2 className="text-xl font-semibold mb-6">Career Header Editing</h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
                {/* Academic Logo */}
                <div>
                  <Label htmlFor="academicLogo" className="block mb-2">
                    Academic Logo
                  </Label>
                  <div className="flex items-center gap-4">
                    {academicLogoPreview && (
                      <div className="w-32 h-32 flex items-center justify-center border border-gray-200 rounded-lg shadow-sm bg-white">
                        <img
                          src={academicLogoPreview}
                          alt="Academic Logo Preview"
                          className="w-full h-full object-contain rounded-lg"
                        />
                      </div>
                    )}
                    <input
                      id="academicLogo"
                      type="file"
                      accept="image/*"
                      className="block border border-gray-300 rounded-lg p-2 text-sm w-2/3"
                      onChange={handleFileChange}
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="academicLogo" className="block mb-2">
                    Academic Icon
                  </Label>
                  <div className="flex items-center gap-4">
                    {academicIconPreview && (
                      <div className="w-32 h-32 flex items-center justify-center border border-gray-200 rounded-lg shadow-sm bg-white">
                        <img
                          src={academicIconPreview}
                          alt="Academic Logo Preview"
                          className="w-full h-full object-contain rounded-lg"
                        />
                      </div>
                    )}
                    <input
                      id="academicIcon"
                      type="file"
                      accept="image/*"
                      className="block border border-gray-300 rounded-lg p-2 text-sm w-2/3"
                      onChange={handleIconChange}
                    />
                  </div>
                </div>

                {/* Header Heading */}
                <div>
                  <Label htmlFor="headerHeading" className="block mb-2">
                    Header Heading
                  </Label>
                  <TextInput
                    id="headerHeading"
                    type="text"
                    value={headerHeading}
                    onChange={(e) => setHeaderHeading(e.target.value)}
                    placeholder="Enter header heading"
                  />
                </div>

                <div>
                  <Label htmlFor="academic_website" className="block mb-2">
                    Button URL
                  </Label>
                  <TextInput
                    id="academic_website"
                    type="url"
                    value={buttonUrl}
                    onChange={(e) => setButtonUrl(e.target.value)}
                    placeholder="https://example.com/apply"
                  />
                </div>

                {/* Academic Address */}
                <div className="md:col-span-2">
                  <Label htmlFor="academicAddress" className="block mb-2">
                    Academic Address
                  </Label>
                  <JoditEditor
                    ref={editorRef}
                    value={academicAddress}
                    config={editorConfig}
                    onBlur={handleEditorBlur}
                  />
                  {/* <Textarea
                    id="academicAddress"
                    value={academicAddress}
                    onChange={(e) => setAcademicAddress(e.target.value)}
                    placeholder="Enter academic address"
                    rows={3}
                  /> */}
                </div>
              </div>

              <h2 className="text-xl font-semibold mb-6">Contact Information</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
                <div>
                  <Label htmlFor="academicEmail" className="block mb-2">
                    Academic Email
                  </Label>
                  <TextInput
                    id="academicEmail"
                    type="email"
                    value={academicEmail}
                    onChange={(e) => setAcademicEmail(e.target.value)}
                    placeholder="career@example.com"
                  />
                </div>

                <div>
                  <Label htmlFor="academicMobile" className="block mb-2">
                    Academic Mobile
                  </Label>
                  <TextInput
                    id="academicMobile"
                    type="text"
                    value={academicMobile}
                    onChange={(e) => setAcademicMobile(e.target.value)}
                    placeholder="+91 9876543210"
                  />
                </div>
              </div>

              <h2 className="text-xl font-semibold mb-6">Social Media Icons</h2>
              <div className="space-y-4 mb-10">
                {socialIcons.map((icon, index) => (
                  <div
                    key={index}
                    className="grid grid-cols-1 md:grid-cols-12 gap-4 items-end p-4 border border-gray-200 rounded-lg"
                  >
                    {/* Icon Class Dropdown - 5 columns */}
                    <div className="md:col-span-5">
                      <Label htmlFor={`icon-class-${index}`} className="block mb-2">
                        Icon Class
                      </Label>
                      <select
                        id={`icon-class-${index}`}
                        value={icon.icon}
                        onChange={(e) => handleSocialIconChange(index, 'icon', e.target.value)}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      >
                        <option value="">Select an icon</option>
                        {fontAwesomeIcons.map((iconOption) => (
                          <option key={iconOption.label} value={iconOption.label}>
                            {iconOption.label}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Icon URL Input - 5 columns */}
                    <div className="md:col-span-5">
                      <Label htmlFor={`icon-url-${index}`} className="block mb-2">
                        Icon URL
                      </Label>
                      <TextInput
                        id={`icon-url-${index}`}
                        type="url"
                        value={icon.icon_url}
                        onChange={(e) => handleSocialIconChange(index, 'icon_url', e.target.value)}
                        placeholder="https://facebook.com/username"
                      />
                    </div>

                    {/* Action Buttons - 2 columns */}
                    <div className="md:col-span-2 flex gap-2 justify-end">
                      {/* Remove Button - Show for all rows except last if more than 1 row */}
                      {socialIcons.length > 1 && (
                        <Button
                          type="button"
                          color="failure"
                          onClick={() => removeSocialIcon(index)}
                          className="px-3 py-2"
                          title="Remove"
                        >
                          <HiOutlineTrash className="h-5 w-5" />
                        </Button>
                      )}

                      {/* Add Button - Show only for last row */}
                      {index === socialIcons.length - 1 && (
                        <Button
                          type="button"
                          color="success"
                          onClick={addSocialIcon}
                          className="px-3 py-2"
                          title="Add More"
                        >
                          <HiOutlinePlus className="h-5 w-5" />
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>

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
            </form>
          </div>
        </Card>
      )}
    </div>
  );
};

export default CareerFooterSection;
