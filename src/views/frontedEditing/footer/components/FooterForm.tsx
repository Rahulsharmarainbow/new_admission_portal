import React, { useState, useEffect } from 'react';
import { Card, Label, TextInput, Button, Spinner } from 'flowbite-react';
import { toast } from 'react-hot-toast';
import { useAuth } from 'src/hook/useAuth';
import axios from 'axios';
import AcademicDropdown from 'src/Frontend/Common/AcademicDropdown';
import Loader from 'src/Frontend/Common/Loader';

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
}

const FooterForm = () => {
  const apiUrl = import.meta.env.VITE_API_URL;
  const { user } = useAuth();

  const [selectedAcademic, setSelectedAcademic] = useState('');
  const [formVisible, setFormVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  
  // Form fields
  const [admissionQueryMobile, setAdmissionQueryMobile] = useState('');
  const [admissionQueryEmail, setAdmissionQueryEmail] = useState('');
  const [technicalSupportEmail, setTechnicalSupportEmail] = useState('');
  const [technicalPrimaryContact, setTechnicalPrimaryContact] = useState('');
  const [technicalSecondaryContact, setTechnicalSecondaryContact] = useState('');
  const [footerLine, setFooterLine] = useState('');
  const [footerMobile, setFooterMobile] = useState('');
  const [footerAddress, setFooterAddress] = useState('');
  const [footerEmail, setFooterEmail] = useState('');

  const handleAcademicSelect = (selectedId: string) => {
    setSelectedAcademic(selectedId);
    setFormVisible(true);
    getFooterData(selectedId);
  };

  const getFooterData = async (academicId: string) => {
    if(!academicId) return;
    setLoading(true);
    try {
      const response = await axios.post(
        `${apiUrl}/${user?.role}/FrontendEditing/get-footer`,
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
        const footerData: FooterData = response.data.data;
        setFormFields(footerData);
      } else {
        toast.error(response.data.message || 'Failed to fetch footer data');
        resetForm();
      }
    } catch (error: any) {
      console.error('Error fetching footer data:', error);
      if (error.response?.status === 404) {
        // If no data found, show empty form
        resetForm();
      } else {
        toast.error(error.response?.data?.message || 'An error occurred while fetching footer data');
      }
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
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      // Validate required fields
      if (!admissionQueryMobile || !admissionQueryEmail || !footerLine) {
        toast.error('Please fill all required fields');
        return;
      }

      const submitData = {
        academic_id: parseInt(selectedAcademic),
        s_id: user?.id || '',
        admissio_query_mobile: admissionQueryMobile,
        admissio_query_email: admissionQueryEmail,
        technical_support_email: technicalSupportEmail,
        technical_primary_contact: technicalPrimaryContact,
        technical_secondary_contact: technicalSecondaryContact,
        footer_line: footerLine,
        footer_mobile: footerMobile,
        footer_address: footerAddress,
        footer_email: footerEmail,
      };

      await updateFooterData(submitData);
    } catch (error) {
      console.error('Error in handleSubmit:', error);
    } finally {
      setSaving(false);
    }
  };

  const updateFooterData = async (data: any) => {
    try {
      const response = await axios.post(
        `${apiUrl}/${user?.role}/FrontendEditing/update-footer-content`,
        data,
        {
          headers: {
            Authorization: `Bearer ${user?.token}`,
            'Content-Type': 'application/json',
          },
        }
      );

      if (response.data.success) {
        toast.success('Footer data updated successfully!');
        // Refresh the data after update
        getFooterData(selectedAcademic);
      } else {
        toast.error(response.data.message || 'Failed to update footer data');
      }
    } catch (error: any) {
      console.error('Error updating footer data:', error);
      toast.error(error.response?.data?.message || 'An error occurred while updating footer data');
    }
  };

  const handleInputChange =
    (setStateFunction: React.Dispatch<React.SetStateAction<string>>) =>
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setStateFunction(event.target.value);
    };

  return (
    <div>
      {/* Select Academic Section */}
      <Card className="mb-6">
        <div className="w-[40%]">
          <AcademicDropdown
            value={selectedAcademic}
            onChange={handleAcademicSelect}
            label="First Select Academic"
            isRequired
          />
        </div>
      </Card>

      {/* Footer Form */}
      {
        loading ? (
          <Loader />
        ):
        (
         selectedAcademic && (
        <Card>
          <div className="p-6">
            <h2 className="text-xl font-semibold mb-6">Footer Content Editing</h2>
            <form onSubmit={handleSubmit}>
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
                  <h3 className="text-lg font-medium text-gray-900 border-b pb-2">
                    Footer Information
                  </h3>
                  
                  <div>
                    <Label htmlFor="footerLine" className="block mb-2">
                      Footer Line *
                    </Label>
                    <TextInput
                      id="footerLine"
                      type="text"
                      value={footerLine}
                      onChange={handleInputChange(setFooterLine)}
                      placeholder="Enter footer text (e.g., © 2025 Your Company. All Rights Reserved.)"
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

                {/* Submit Button */}
                <div className="md:col-span-2 flex justify-end pt-4 border-t">
                  <Button 
                    type="submit" 
                    className="min-w-[120px]" 
                    disabled={saving}
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
      )
        )
      }
    </div>
  );
};

export default FooterForm;