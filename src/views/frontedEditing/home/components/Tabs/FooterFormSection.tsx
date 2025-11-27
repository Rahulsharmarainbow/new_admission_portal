import React, { useEffect, useMemo, useState, useRef, useCallback } from 'react';
import { Card, Label, TextInput, Button, Spinner } from 'flowbite-react';
import { toast } from 'react-hot-toast';
import axios from 'axios';
import Loader from 'src/Frontend/Common/Loader';
import JoditEditor from 'jodit-react';

interface FooterData {
  id?: number;
  admissio_query_mobile: string;
  admissio_query_email: string;
  technical_support_email: string;
  technical_primary_contact: string;
  technical_secondary_contact: string;
  footer_line: string;
  footer_mobile: string;
  footer_address: string;
  footer_email: string;
  academic_website: string;
  academic_new_logo: string;
  academic_favicon: string;
  name: string;
  logo: string;
  address: string;
  pages: any[];
  selected_pages: any[];
}

interface FooterFormSectionProps {
  selectedAcademic: string;
  user: any;
  apiUrl: string;
}

const assetUrl = import.meta.env.VITE_ASSET_URL;

const FooterFormSection: React.FC<FooterFormSectionProps> = ({
  selectedAcademic,
  user,
  apiUrl,
}) => {
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  // Form fields
  const [academicLogo, setAcademicLogo] = useState<File | string | null>(null);
  const [logoPreview, setLogoPreview] = useState("");
  const [academicName, setAcademicName] = useState("");
  const [academicAddress, setAcademicAddress] = useState("");
  const [pages, setPages] = useState<any[]>([]);
  const [selectedPages, setSelectedPages] = useState<any[]>([]);

  // New fields
  const [academicWebsite, setAcademicWebsite] = useState('');
  const [academicNewLogo, setAcademicNewLogo] = useState<File | string | null>(null);
  const [academicNewLogoPreview, setAcademicNewLogoPreview] = useState("");
  const [academicFavicon, setAcademicFavicon] = useState<File | string | null>(null);
  const [academicFaviconPreview, setAcademicFaviconPreview] = useState("");

  const [admissionQueryMobile, setAdmissionQueryMobile] = useState('');
  const [admissionQueryEmail, setAdmissionQueryEmail] = useState('');
  const [technicalSupportEmail, setTechnicalSupportEmail] = useState('');
  const [technicalPrimaryContact, setTechnicalPrimaryContact] = useState('');
  const [technicalSecondaryContact, setTechnicalSecondaryContact] = useState('');
  const [footerLine, setFooterLine] = useState('');
  const [footerMobile, setFooterMobile] = useState('');
  const [footerAddress, setFooterAddress] = useState('');
  const [footerEmail, setFooterEmail] = useState('');

  // Jodit Editor ref
  const editorRef = useRef(null);

  const editorConfig = useMemo(
    () => ({
      readonly: false,
      height: 400,
      toolbarSticky: false,
      toolbarAdaptive: false,
      buttons: [
        "source",
        "|",
        "bold",
        "italic",
        "underline",
        "strikethrough",
        "|",
        "ul",
        "ol",
        "|",
        "font",
        "fontsize",
        "brush",
        "paragraph",
        "|",
        "image",
        "video",
        "table",
        "link",
        "|",
        "left",
        "center",
        "right",
        "justify",
        "|",
        "undo",
        "redo",
        "|",
        "hr",
        "eraser",
        "copyformat",
        "fullsize",
      ],
      showXPathInStatusbar: false,
      showCharsCounter: false,
      showWordsCounter: false,
      uploader: { insertImageAsBase64URI: true },
      placeholder: "Start typing your content here...",
      theme: "default",
    }),
    []
  );

  const handleEditorBlur = useCallback((newContent: string) => {
    setAcademicAddress(newContent);
  }, []);

  // 🔹 Fetch footer data whenever academic changes
  useEffect(() => {
    if (selectedAcademic) getFooterData(selectedAcademic);
    else resetForm();
  }, [selectedAcademic]);

  const getFooterData = async (academicId: string) => {
    if (!academicId) return;
    setLoading(true);
    try {
      const response = await axios.post(
        `${apiUrl}/${user?.role}/FrontendEditing/get-footer`,
        { academic_id: parseInt(academicId) },
        {
          headers: {
            Authorization: `Bearer ${user?.token}`,
            'Content-Type': 'application/json',
          },
        }
      );

      if (response.data.success) {
        setFormFields(response.data.data);
      } else {
        toast.error(response.data.message || 'Failed to fetch footer data');
        resetForm();
      }
    } catch (error: any) {
      console.error('Error fetching footer data:', error);
      if (error.response?.status === 404) resetForm();
      else toast.error(error.response?.data?.message || 'Error fetching data');
    } finally {
      setLoading(false);
    }
  };

  const setFormFields = (data: FooterData) => {
    setAdmissionQueryMobile(data.admissio_query_mobile || '');
    setAdmissionQueryEmail(data.admissio_query_email || '');
    setTechnicalSupportEmail(data.technical_support_email || '');
    setTechnicalPrimaryContact(data.technical_primary_contact || '');
    setTechnicalSecondaryContact(data.technical_secondary_contact || '');
    setFooterLine(data.footer_line || '');
    setFooterMobile(data.footer_mobile || '');
    setFooterAddress(data.footer_address || '');
    setFooterEmail(data.footer_email || '');
    setPages(data.pages || []);
    setSelectedPages(data.selected_pages || []);

    setAcademicName(data.name || '');
    setAcademicAddress(data.address || '');
    
    // New fields
    setAcademicWebsite(data.academic_website || '');
    
    if (data.academic_new_logo) {
      setAcademicNewLogo(data.academic_new_logo);
      setAcademicNewLogoPreview(`${assetUrl}/${data.academic_new_logo}`);
    } else {
      setAcademicNewLogo(null);
      setAcademicNewLogoPreview('');
    }
    
    if (data.academic_favicon) {
      setAcademicFavicon(data.academic_favicon);
      setAcademicFaviconPreview(`${assetUrl}/${data.academic_favicon}`);
    } else {
      setAcademicFavicon(null);
      setAcademicFaviconPreview('');
    }

    if (data.logo) {
      setAcademicLogo(data.logo);
      setLogoPreview(`${assetUrl}/${data.logo}`);
    } else {
      setAcademicLogo(null);
      setLogoPreview('');
    }
  };

  const resetForm = () => {
    setAdmissionQueryMobile('');
    setAdmissionQueryEmail('');
    setTechnicalSupportEmail('');
    setTechnicalPrimaryContact('');
    setTechnicalSecondaryContact('');
    setFooterLine('');
    setFooterMobile('');
    setFooterAddress('');
    setFooterEmail('');
    setAcademicWebsite('');
    setAcademicNewLogo(null);
    setAcademicNewLogoPreview('');
    setAcademicFavicon(null);
    setAcademicFaviconPreview('');
    setAcademicAddress('');
    setAcademicName('');
    setAcademicLogo(null);
    setLogoPreview('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedAcademic) {
      toast.error('Please select an academic first');
      return;
    }

    if (!admissionQueryMobile || !admissionQueryEmail || !footerLine) {
      toast.error('Please fill all required fields');
      return;
    }

    setSaving(true);

    try {
      const formData = new FormData();
      formData.append('academic_id', parseInt(selectedAcademic).toString());
      formData.append('s_id', user?.id?.toString() || '');
      formData.append('admissio_query_mobile', admissionQueryMobile);
      formData.append('admissio_query_email', admissionQueryEmail);
      formData.append('technical_support_email', technicalSupportEmail);
      formData.append('technical_primary_contact', technicalPrimaryContact);
      formData.append('technical_secondary_contact', technicalSecondaryContact);
      formData.append('footer_line', footerLine);
      formData.append('footer_mobile', footerMobile);
      formData.append('footer_address', footerAddress);
      formData.append('footer_email', footerEmail);
      formData.append('academic_name', academicName || '');
      formData.append('academic_address', academicAddress || '');
      formData.append('academic_website', academicWebsite || '');

      // ✅ Append files only if they are File objects
      if (academicLogo instanceof File) {
        formData.append('academic_logo', academicLogo);
      } else if (typeof academicLogo === 'string') {
        formData.append('academic_logo', academicLogo);
      }

      if (academicNewLogo instanceof File) {
        formData.append('academic_new_logo', academicNewLogo);
      } else if (typeof academicNewLogo === 'string') {
        formData.append('academic_new_logo', academicNewLogo);
      }

      if (academicFavicon instanceof File) {
        formData.append('academic_favicon', academicFavicon);
      } else if (typeof academicFavicon === 'string') {
        formData.append('academic_favicon', academicFavicon);
      }

      formData.append('selected_pages', JSON.stringify(selectedPages));

      const response = await axios.post(
        `${apiUrl}/${user?.role}/FrontendEditing/update-footer-content`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${user?.token}`,
            'Content-Type': 'multipart/form-data',
          },
        }
      );

      if (response.data.success) {
        toast.success('Footer data updated successfully!');
        getFooterData(selectedAcademic);
      } else {
        toast.error(response.data.message || 'Failed to update footer data');
      }
    } catch (error: any) {
      console.error('Error updating footer data:', error);
      toast.error(error.response?.data?.message || 'Error updating footer data');
    } finally {
      setSaving(false);
    }
  };

  const handleInputChange =
    (setState: React.Dispatch<React.SetStateAction<string>>) =>
    (event: React.ChangeEvent<HTMLInputElement>) =>
      setState(event.target.value);

  const handleFileChange = (setFile: any, setPreview: any) => 
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];
      if (file) {
        setFile(file);
        const reader = new FileReader();
        reader.onload = () => setPreview(reader.result as string);
        reader.readAsDataURL(file);
      }
    };

  // 🧭 Render Section
  if (!selectedAcademic) {
    return (
      <Card className="p-6">
        <p className="text-gray-500 italic">
          Please select an academic from above to edit footer details.
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
              <h2 className="text-xl font-semibold mb-6">Header Editing</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
                {/* Academic Logo Upload with Preview */}
                <div>
                  <Label htmlFor="academicLogo" className="block mb-2">
                    Academic Logo
                  </Label>
                  <div className="flex items-center gap-4">
                    {logoPreview && (
                      <div className="w-32 h-32 flex items-center justify-center border border-gray-200 rounded-lg shadow-sm bg-white">
                        <img
                          src={logoPreview}
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
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        setAcademicLogo(file);
                        if (file) {
                          const reader = new FileReader();
                          reader.onload = () => setLogoPreview(reader.result as string);
                          reader.readAsDataURL(file);
                        }
                      }}
                    />
                  </div>
                </div>

                {/* Academic New Logo */}
                <div>
                  <Label htmlFor="academicNewLogo" className="block mb-2">
                    Academic New Logo
                  </Label>
                  <div className="flex items-center gap-4">
                    {academicNewLogoPreview && (
                      <div className="w-32 h-32 flex items-center justify-center border border-gray-200 rounded-lg shadow-sm bg-white">
                        <img
                          src={academicNewLogoPreview}
                          alt="New Logo Preview"
                          className="w-full h-full object-contain rounded-lg"
                        />
                      </div>
                    )}
                    <input
                      id="academicNewLogo"
                      type="file"
                      accept="image/*"
                      className="block border border-gray-300 rounded-lg p-2 text-sm w-2/3"
                      onChange={handleFileChange(setAcademicNewLogo, setAcademicNewLogoPreview)}
                    />
                  </div>
                </div>

                {/* Academic Name */}
                <div>
                  <Label htmlFor="academicName" className="block mb-2">
                    Academic Name
                  </Label>
                  <TextInput
                    id="academicName"
                    type="text"
                    value={academicName}
                    onChange={handleInputChange(setAcademicName)}
                    placeholder="Enter academic name"
                  />
                </div>

                {/* Academic Website */}
                <div>
                  <Label htmlFor="academicWebsite" className="block mb-2">
                    Academic Website
                  </Label>
                  <TextInput
                    id="academicWebsite"
                    type="url"
                    value={academicWebsite}
                    onChange={handleInputChange(setAcademicWebsite)}
                    placeholder="https://example.com"
                  />
                </div>                

                {/* Academic Favicon */}
                <div>
                  <Label htmlFor="academicFavicon" className="block mb-2">
                    Academic Favicon
                  </Label>
                  <div className="flex items-center gap-4">
                    {academicFaviconPreview && (
                      <div className="w-16 h-16 flex items-center justify-center border border-gray-200 rounded-lg shadow-sm bg-white">
                        <img
                          src={academicFaviconPreview}
                          alt="Favicon Preview"
                          className="w-full h-full object-contain rounded-lg"
                        />
                      </div>
                    )}
                    <input
                      id="academicFavicon"
                      type="file"
                      accept="image/*,.ico"
                      className="block border border-gray-300 rounded-lg p-2 text-sm w-2/3"
                      onChange={handleFileChange(setAcademicFavicon, setAcademicFaviconPreview)}
                    />
                  </div>
                  <p className="text-xs text-gray-500 mt-1">Recommended: 32x32 or 16x16 pixels</p>
                </div>

                {/* Academic Address - full width */}
                <div className="md:col-span-2">
                  <Label htmlFor="academicAddress" className="block mb-2">
                    Academic Address
                  </Label>
                  <div className="border border-gray-300 rounded-lg overflow-hidden">
                    <JoditEditor
                      ref={editorRef}
                      value={academicAddress}
                      config={editorConfig}
                      onBlur={handleEditorBlur}
                    />
                  </div>
                </div>
              </div>

              <h2 className="text-xl font-semibold mb-6">Footer Editing</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Admission Query Section */}
                <div className="space-y-4">
                  <h3 className="text-lg font-medium text-gray-900 border-b pb-2">
                    Admission Query Information
                  </h3>

                  <div>
                    <Label htmlFor="admissionQueryMobile" className="block mb-2">
                      Admission Query Mobile *
                    </Label>
                    <TextInput
                      id="admissionQueryMobile"
                      type="text"
                      value={admissionQueryMobile}
                      onChange={handleInputChange(setAdmissionQueryMobile)}
                      placeholder="Enter mobile number"
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="admissionQueryEmail" className="block mb-2">
                      Admission Query Email *
                    </Label>
                    <TextInput
                      id="admissionQueryEmail"
                      type="email"
                      value={admissionQueryEmail}
                      onChange={handleInputChange(setAdmissionQueryEmail)}
                      placeholder="Enter email address"
                      required
                    />
                  </div>
                </div>

                {/* Technical Support Section */}
                <div className="space-y-4">
                  <h3 className="text-lg font-medium text-gray-900 border-b pb-2">
                    Technical Support Information
                  </h3>

                  <div>
                    <Label htmlFor="technicalSupportEmail" className="block mb-2">
                      Technical Support Email
                    </Label>
                    <TextInput
                      id="technicalSupportEmail"
                      type="email"
                      value={technicalSupportEmail}
                      onChange={handleInputChange(setTechnicalSupportEmail)}
                      placeholder="Enter technical support email"
                    />
                  </div>

                  <div>
                    <Label htmlFor="technicalPrimaryContact" className="block mb-2">
                      Technical Primary Contact
                    </Label>
                    <TextInput
                      id="technicalPrimaryContact"
                      type="text"
                      value={technicalPrimaryContact}
                      onChange={handleInputChange(setTechnicalPrimaryContact)}
                      placeholder="Enter primary contact number"
                    />
                  </div>

                  <div>
                    <Label htmlFor="technicalSecondaryContact" className="block mb-2">
                      Technical Secondary Contact
                    </Label>
                    <TextInput
                      id="technicalSecondaryContact"
                      type="text"
                      value={technicalSecondaryContact}
                      onChange={handleInputChange(setTechnicalSecondaryContact)}
                      placeholder="Enter secondary contact number"
                    />
                  </div>
                </div>

                {/* Footer Information Section */}
                <div className="space-y-4 md:col-span-2">
                  <div>
                    <Label htmlFor="footerLine" className="block mb-2">
                      Footer Line *
                    </Label>
                    <TextInput
                      id="footerLine"
                      type="text"
                      value={footerLine}
                      onChange={handleInputChange(setFooterLine)}
                      placeholder="Enter footer text (e.g., © 2025 Your Institute. All Rights Reserved.)"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <Label htmlFor="footerMobile" className="block mb-2">
                        Footer Mobile
                      </Label>
                      <TextInput
                        id="footerMobile"
                        type="text"
                        value={footerMobile}
                        onChange={handleInputChange(setFooterMobile)}
                        placeholder="Enter footer mobile number"
                      />
                    </div>

                    <div>
                      <Label htmlFor="footerEmail" className="block mb-2">
                        Footer Email
                      </Label>
                      <TextInput
                        id="footerEmail"
                        type="email"
                        value={footerEmail}
                        onChange={handleInputChange(setFooterEmail)}
                        placeholder="Enter footer email"
                      />
                    </div>

                    <div>
                      <Label htmlFor="footerAddress" className="block mb-2">
                        Footer Address
                      </Label>
                      <TextInput
                        id="footerAddress"
                        type="text"
                        value={footerAddress}
                        onChange={handleInputChange(setFooterAddress)}
                        placeholder="Enter footer address"
                      />
                    </div>
                  </div>
                </div>

                {/* Select Pages Section */}
                <div className="space-y-4 md:col-span-2">
                  <h3 className="text-lg font-medium text-gray-900 border-b pb-2">
                    Select Pages to Show in Footer
                  </h3>
                  
                  {pages.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                      {pages.map((page) => (
                        <label key={page.id} className="flex items-center space-x-2">
                          <input
                            type="checkbox"
                            value={page.id}
                            checked={selectedPages.includes(page.id)}
                            onChange={(e) => {
                              const id = page.id;
                              if (e.target.checked) {
                                setSelectedPages([...selectedPages, id]);
                              } else {
                                setSelectedPages(selectedPages.filter(pid => pid !== id));
                              }
                            }}
                            className="w-4 h-4 accent-blue-600"
                          />
                          <span>{page.name}</span>
                        </label>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-500">No pages available for this academic.</p>
                  )}
                </div>

                {/* Submit Button */}
                <div className="md:col-span-2 flex justify-end pt-4 border-t">
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
      )}
    </div>
  );
};

export default FooterFormSection;