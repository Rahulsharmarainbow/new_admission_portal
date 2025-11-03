import React from "react";
import Select from "react-select";

const OrganizationSelect = ({ formData, setFormData, loading }) => {
  // Options list
  const options = [
    { value: "1", label: "School" },
    { value: "2", label: "College" },
    { value: "3", label: "University" },
  ];

  // Handle change
  const handleChange = (selectedOption) => {
    setFormData({ ...formData, organizationType: selectedOption?.value || "" });
  };

  return (
    <Select
      name="organizationType"
      value={options.find(
        (option) => option.value === formData.organizationType
      )}
      onChange={handleChange}
      options={options}
      isDisabled={loading}
      placeholder="Select organization type..."
      className="w-full text-sm"
      classNamePrefix="react-select"
    //   styles={{
    //     control: (base, state) => ({
    //       ...base,
    //       backgroundColor: "transparent",
    //       border: "none",
    //       boxShadow: state.isFocused ? "0 0 0 1px #3b82f6" : "none",
    //       borderRadius: "0.5rem",
    //       padding: "2px",
    //     }),
    //     menu: (base) => ({
    //       ...base,
    //       zIndex: 50,
    //     }),
    //   }}
    />
  );
};

export default OrganizationSelect;
