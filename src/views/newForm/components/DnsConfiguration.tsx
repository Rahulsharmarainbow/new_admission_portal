import React, { useState, useEffect } from "react";
import { Alert, Button, Label, TextInput } from "flowbite-react";
import { HiInformationCircle, HiCheckCircle } from "react-icons/hi";
import { FormData } from "src/types/formTypes";

interface DnsConfigurationProps {
  formData: FormData;
  updateFormData: (updates: Partial<FormData>) => void;
  isEditMode?: boolean;
  errors?: Record<string, string>;
}

const DnsConfiguration: React.FC<DnsConfigurationProps> = ({
  formData,
  updateFormData,
  isEditMode = false,
  errors = {},
}) => {
  const [shouldShowInput, setShouldShowInput] = useState(true);

  const domainNameRegex = /^(?:[a-zA-Z0-9-]+\.)+[a-zA-Z]{2,}$/;

  useEffect(() => {
    if (isEditMode && formData.configure === "1" && formData.updateConfigure === 0) {
      setShouldShowInput(false);
    }
  }, [isEditMode, formData.configure, formData.updateConfigure]);

  const handleConfigure = () => {
    if (!formData.domainNameError && formData.domainName) {
      updateFormData({
        configure: "1",
        updateConfigure: 1,
      });
      setShouldShowInput(false);
    }
  };

  const handleReconfigure = () => {
    updateFormData({
      configure: "0",
      updateConfigure: 1,
    });
    setShouldShowInput(true);
  };

  const handleCancelReconfigure = () => {
    updateFormData({
      configure: "1",
      updateConfigure: 0,
    });
    setShouldShowInput(false);
  };

  const handleDomainChange = (value: string) => {
    updateFormData({ domainName: value });

    if (!domainNameRegex.test(value)) {
      updateFormData({
        domainNameError: true,
        domainNameErrorMsg: "Please enter a valid domain name (e.g., example.com).",
      });
    } else {
      updateFormData({ domainNameError: false, domainNameErrorMsg: "" });
    }
  };

  return (
    <div className="space-y-6">
      <Alert color="info" icon={HiInformationCircle}>
        Important: Ensure DNS A-record is pointed correctly before configuring domain.
      </Alert>

      {shouldShowInput ? (
        <div className="flex flex-col text-center space-y-4 py-8">
          <Label htmlFor="domainName">Enter Domain Name</Label>

          <TextInput
            id="domainName"
            value={formData.domainName}
            onChange={(e) => handleDomainChange(e.target.value)}
            color={errors.domainName || formData.domainNameError ? "failure" : "gray"}
            placeholder="example.com"
            helperText={errors.domainName || formData.domainNameErrorMsg}
            className="w-1/2 text-center m-auto"
          />

          <div className="flex justify-center gap-4 mt-3" >
            <Button
              onClick={handleConfigure}
              disabled={!formData.domainName || !!errors.domainName || formData.domainNameError}
            >
              {isEditMode ? "Update Domain" : "Configure Domain"}
            </Button>

            {isEditMode && (
              <Button color="gray" onClick={handleCancelReconfigure}>
                Cancel
              </Button>
            )}
          </div>
        </div>
      ) : (
        <div className="flex flex-col items-center space-y-4 py-8">
          <HiCheckCircle className="w-16 h-16 text-green-500" />
          <p className="font-semibold text-lg">
            Domain: <span className="text-blue-600">{formData.domainName}</span>
          </p>
          <p className="text-gray-500">Domain is configured successfully.</p>

          {isEditMode && (
            <Button color="light" onClick={handleReconfigure}>
              Change Domain
            </Button>
          )}
        </div>
      )}
    </div>
  );
};

export default DnsConfiguration;
