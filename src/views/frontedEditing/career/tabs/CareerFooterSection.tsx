import React, { useEffect, useState } from 'react';
import { Card, Label, TextInput, Button, Spinner, Textarea } from 'flowbite-react';
import { toast } from 'react-hot-toast';
import axios from 'axios';
import Loader from 'src/Frontend/Common/Loader';

interface CareerFooterData {
  id?: number;
  career_header_logo?: string;
  career_footer_logo?: string;
  career_header_text?: string;
  career_footer_text?: string;
  career_contact_email?: string;
  career_contact_phone?: string;
  career_address?: string;
  career_copyright?: string;
  career_social_links?: {
    facebook?: string;
    twitter?: string;
    linkedin?: string;
    instagram?: string;
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
  const [headerLogo, setHeaderLogo] = useState<File | string | null>(null);
  const [headerLogoPreview, setHeaderLogoPreview] = useState('');
  const [headerText, setHeaderText] = useState('');
  
  // Footer Fields
  const [footerLogo, setFooterLogo] = useState<File | string | null>(null);
  const [footerLogoPreview, setFooterLogoPreview] = useState('');
  const [footerText, setFooterText] = useState('');
  const [copyright, setCopyright] = useState('');
  
  // Contact Fields
  const [contactEmail, setContactEmail] = useState('');
  const [contactPhone, setContactPhone] = useState('');
  const [address, setAddress] = useState('');
  
  // Social Media Fields
  const [facebook, setFacebook] = useState('');
  const [twitter, setTwitter] = useState('');
  const [linkedin, setLinkedin] = useState('');
  const [instagram, setInstagram] = useState('');

  useEffect(() => {
    if (selectedAcademic) getCareerFooterData(selectedAcademic);
    else resetForm();
  }, [selectedAcademic]);

  const getCareerFooterData = async (academicId: string) => {
    if (!academicId) return;
    setLoading(true);
    try {
      const response = await axios.post(
        `${apiUrl}/${user?.role}/CareerEditing/get-career-footer`,
        { academic_id: parseInt(academicId) },
        {
          headers: {
            Authorization: `Bearer ${user?.token}`,
            'Content-Type': 'application/json',
          },
        },
      );

      if (response.data.success) {
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
    if (data.career_header_logo) {
      setHeaderLogo(data.career_header_logo);
      setHeaderLogoPreview(`${assetUrl}/${data.career_header_logo}`);
    }
    setHeaderText(data.career_header_text || '');
    
    // Footer
    if (data.career_footer_logo) {
      setFooterLogo(data.career_footer_logo);
      setFooterLogoPreview(`${assetUrl}/${data.career_footer_logo}`);
    }
    setFooterText(data.career_footer_text || '');
    setCopyright(data.career_copyright || '');
    
    // Contact
    setContactEmail(data.career_contact_email || '');
    setContactPhone(data.career_contact_phone || '');
    setAddress(data.career_address || '');
    
    // Social Media
    const social = data.career_social_links || {};
    setFacebook(social.facebook || '');
    setTwitter(social.twitter || '');
    setLinkedin(social.linkedin || '');
    setInstagram(social.instagram || '');
  };

  const resetForm = () => {
    setHeaderLogo(null);
    setHeaderLogoPreview('');
    setHeaderText('');
    setFooterLogo(null);
    setFooterLogoPreview('');
    setFooterText('');
    setCopyright('');
    setContactEmail('');
    setContactPhone('');
    setAddress('');
    setFacebook('');
    setTwitter('');
    setLinkedin('');
    setInstagram('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedAcademic) {
      toast.error('Please select an academic first');
      return;
    }

    setSaving(true);

    try {
      const formData = new FormData();
      formData.append('academic_id', parseInt(selectedAcademic).toString());
      formData.append('s_id', user?.id?.toString() || '');
      
      // Header
      formData.append('career_header_text', headerText);
      if (headerLogo instanceof File) {
        formData.append('career_header_logo', headerLogo);
      } else if (typeof headerLogo === 'string') {
        formData.append('career_header_logo', headerLogo);
      }
      
      // Footer
      formData.append('career_footer_text', footerText);
      formData.append('career_copyright', copyright);
      if (footerLogo instanceof File) {
        formData.append('career_footer_logo', footerLogo);
      } else if (typeof footerLogo === 'string') {
        formData.append('career_footer_logo', footerLogo);
      }
      
      // Contact
      formData.append('career_contact_email', contactEmail);
      formData.append('career_contact_phone', contactPhone);
      formData.append('career_address', address);
      
      // Social Media
      const socialLinks = {
        facebook,
        twitter,
        linkedin,
        instagram
      };
      formData.append('career_social_links', JSON.stringify(socialLinks));

      const response = await axios.post(
        `${apiUrl}/${user?.role}/CareerEditing/update-career-footer`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${user?.token}`,
            'Content-Type': 'multipart/form-data',
          },
        },
      );

      if (response.data.success) {
        toast.success('Career footer data updated successfully!');
        getCareerFooterData(selectedAcademic);
      } else {
        toast.error(response.data.message || 'Failed to update career footer data');
      }
    } catch (error: any) {
      console.error('Error updating career footer data:', error);
      toast.error(error.response?.data?.message || 'Error updating career footer data');
    } finally {
      setSaving(false);
    }
  };

  const handleFileChange = (setFile: any, setPreview: any) => (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setFile(file);
      const reader = new FileReader();
      reader.onload = () => setPreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

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
                {/* Header Logo */}
                <div>
                  <Label htmlFor="headerLogo" className="block mb-2">
                    Career Header Logo
                  </Label>
                  <div className="flex items-center gap-4">
                    {headerLogoPreview && (
                      <div className="w-32 h-32 flex items-center justify-center border border-gray-200 rounded-lg shadow-sm bg-white">
                        <img
                          src={headerLogoPreview}
                          alt="Header Logo Preview"
                          className="w-full h-full object-contain rounded-lg"
                        />
                      </div>
                    )}
                    <input
                      id="headerLogo"
                      type="file"
                      accept="image/*"
                      className="block border border-gray-300 rounded-lg p-2 text-sm w-2/3"
                      onChange={handleFileChange(setHeaderLogo, setHeaderLogoPreview)}
                    />
                  </div>
                </div>

                {/* Header Text */}
                <div>
                  <Label htmlFor="headerText" className="block mb-2">
                    Header Text
                  </Label>
                  <TextInput
                    id="headerText"
                    type="text"
                    value={headerText}
                    onChange={(e) => setHeaderText(e.target.value)}
                    placeholder="Enter header text"
                  />
                </div>

                {/* Footer Logo */}
                <div>
                  <Label htmlFor="footerLogo" className="block mb-2">
                    Career Footer Logo
                  </Label>
                  <div className="flex items-center gap-4">
                    {footerLogoPreview && (
                      <div className="w-32 h-32 flex items-center justify-center border border-gray-200 rounded-lg shadow-sm bg-white">
                        <img
                          src={footerLogoPreview}
                          alt="Footer Logo Preview"
                          className="w-full h-full object-contain rounded-lg"
                        />
                      </div>
                    )}
                    <input
                      id="footerLogo"
                      type="file"
                      accept="image/*"
                      className="block border border-gray-300 rounded-lg p-2 text-sm w-2/3"
                      onChange={handleFileChange(setFooterLogo, setFooterLogoPreview)}
                    />
                  </div>
                </div>

                {/* Footer Text */}
                <div>
                  <Label htmlFor="footerText" className="block mb-2">
                    Footer Text
                  </Label>
                  <TextInput
                    id="footerText"
                    type="text"
                    value={footerText}
                    onChange={(e) => setFooterText(e.target.value)}
                    placeholder="Enter footer text"
                  />
                </div>

                {/* Copyright */}
                <div className="md:col-span-2">
                  <Label htmlFor="copyright" className="block mb-2">
                    Copyright Text
                  </Label>
                  <TextInput
                    id="copyright"
                    type="text"
                    value={copyright}
                    onChange={(e) => setCopyright(e.target.value)}
                    placeholder="© 2025 Career Portal. All rights reserved."
                  />
                </div>
              </div>

              <h2 className="text-xl font-semibold mb-6">Contact Information</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
                <div>
                  <Label htmlFor="contactEmail" className="block mb-2">
                    Contact Email
                  </Label>
                  <TextInput
                    id="contactEmail"
                    type="email"
                    value={contactEmail}
                    onChange={(e) => setContactEmail(e.target.value)}
                    placeholder="career@example.com"
                  />
                </div>

                <div>
                  <Label htmlFor="contactPhone" className="block mb-2">
                    Contact Phone
                  </Label>
                  <TextInput
                    id="contactPhone"
                    type="text"
                    value={contactPhone}
                    onChange={(e) => setContactPhone(e.target.value)}
                    placeholder="+91 9876543210"
                  />
                </div>

                <div className="md:col-span-2">
                  <Label htmlFor="address" className="block mb-2">
                    Address
                  </Label>
                  <Textarea
                    id="address"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="Enter complete address"
                    rows={3}
                  />
                </div>
              </div>

              <h2 className="text-xl font-semibold mb-6">Social Media Links</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
                <div>
                  <Label htmlFor="facebook" className="block mb-2">
                    Facebook URL
                  </Label>
                  <TextInput
                    id="facebook"
                    type="url"
                    value={facebook}
                    onChange={(e) => setFacebook(e.target.value)}
                    placeholder="https://facebook.com/username"
                  />
                </div>

                <div>
                  <Label htmlFor="twitter" className="block mb-2">
                    Twitter URL
                  </Label>
                  <TextInput
                    id="twitter"
                    type="url"
                    value={twitter}
                    onChange={(e) => setTwitter(e.target.value)}
                    placeholder="https://twitter.com/username"
                  />
                </div>

                <div>
                  <Label htmlFor="linkedin" className="block mb-2">
                    LinkedIn URL
                  </Label>
                  <TextInput
                    id="linkedin"
                    type="url"
                    value={linkedin}
                    onChange={(e) => setLinkedin(e.target.value)}
                    placeholder="https://linkedin.com/company/username"
                  />
                </div>

                <div>
                  <Label htmlFor="instagram" className="block mb-2">
                    Instagram URL
                  </Label>
                  <TextInput
                    id="instagram"
                    type="url"
                    value={instagram}
                    onChange={(e) => setInstagram(e.target.value)}
                    placeholder="https://instagram.com/username"
                  />
                </div>
              </div>

              <div className="flex justify-end pt-4 border-t">
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