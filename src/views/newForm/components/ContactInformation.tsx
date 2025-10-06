import React from "react";
import { Card, Label, TextInput } from "flowbite-react";
import { FormData } from "src/types/formTypes";

interface ContactInformationProps {
  formData: FormData;
  updateFormData: (updates: Partial<FormData>) => void;
}

const ContactInformation: React.FC<ContactInformationProps> = ({ formData, updateFormData }) => {
  
  const validateEmail = (email: string) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  const validatePhone = (phone: string) => {
    return /^\d{10}$/.test(phone.replace(/\D/g, ''));
  };

  const handleContactChange = (field: string, value: string) => {
    updateFormData({ [field]: value });
  };

  const contactFields = [
    {
      title: "Technical Contact",
      prefix: "technical",
      data: {
        name: formData.technicalName,
        email: formData.technicalEmail,
        phone: formData.technicalPhone,
        location: formData.technicalLocation
      }
    },
    {
      title: "Billing Contact",
      prefix: "billing",
      data: {
        name: formData.billingName,
        email: formData.billingEmail,
        phone: formData.billingPhone,
        location: formData.billingLocation
      }
    },
    {
      title: "Additional Contact",
      prefix: "additional",
      data: {
        name: formData.additionalName,
        email: formData.additionalEmail,
        phone: formData.additionalPhone,
        location: formData.additionalLocation
      }
    }
  ];

  return (
    <div className="space-y-6">
      {contactFields.map((contact) => (
        <Card key={contact.prefix} className="overflow-hidden">
          <h5 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 break-words">
            {contact.title}
          </h5>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <Label htmlFor={`${contact.prefix}Name`} className="mb-2 block">Name</Label>
              <TextInput
                id={`${contact.prefix}Name`}
                value={contact.data.name}
                onChange={(e) => handleContactChange(`${contact.prefix}Name`, e.target.value)}
                placeholder="Enter Name"
                className="w-full"
              />
            </div>
            <div>
              <Label htmlFor={`${contact.prefix}Email`} className="mb-2 block">Email</Label>
              <TextInput
                id={`${contact.prefix}Email`}
                type="email"
                value={contact.data.email}
                onChange={(e) => handleContactChange(`${contact.prefix}Email`, e.target.value)}
                placeholder="Enter Email"
                color={contact.data.email && !validateEmail(contact.data.email) ? "failure" : "gray"}
                className="w-full"
              />
            </div>
            <div>
              <Label htmlFor={`${contact.prefix}Phone`} className="mb-2 block">Phone</Label>
              <TextInput
                id={`${contact.prefix}Phone`}
                value={contact.data.phone}
                onChange={(e) => handleContactChange(`${contact.prefix}Phone`, e.target.value)}
                placeholder="Enter Phone"
                color={contact.data.phone && !validatePhone(contact.data.phone) ? "failure" : "gray"}
                className="w-full"
              />
            </div>
            <div>
              <Label htmlFor={`${contact.prefix}Location`} className="mb-2 block">Location</Label>
              <TextInput
                id={`${contact.prefix}Location`}
                value={contact.data.location}
                onChange={(e) => handleContactChange(`${contact.prefix}Location`, e.target.value)}
                placeholder="Enter Location"
                className="w-full"
              />
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
};

export default ContactInformation;