import React, { useEffect, useState } from "react";
import Select from "react-select";
import { useTemplates } from "src/hook/useTemplates";

interface TemplateDropdownProps {
  /** Controlled value */
  value?: string | number;
  /** Called when user selects a new value */
  onChange?: (value: string) => void;
  /** For forms or filters object handling */
  name?: string;
  /** Label text */
  label?: string;
  /** Whether selection is required */
  isRequired?: boolean;
  /** Placeholder text */
  placeholder?: string;
  /** Optional container class */
  className?: string;
  /** Optional form object like formData / filters */
  formData?: Record<string, any>;
  /** Setter for that form object */
  setFormData?: React.Dispatch<React.SetStateAction<any>>;
  /** Whether to show "All Template" option */
  includeAllOption?: boolean;
  /** Whether to disable dropdown */
  disabled?: boolean;
}

const TemplateDropdown: React.FC<TemplateDropdownProps> = ({
  value,
  onChange,
  name = "template_id",
  label = "",
  isRequired = false,
  placeholder = "Select template...",
  className = "",
  formData,
  setFormData,
  includeAllOption = true,
  disabled = false,
}) => {
  const { templates, loading: templateLoading } = useTemplates();
  const [options, setOptions] = useState<{ value: string; label: string }[]>([]);

  useEffect(() => {
    if (templates && Array.isArray(templates)) {
      const list = templates.map((template: any) => ({
        value: template.id.toString(),
        label: template.name,
      }));
      
      if (includeAllOption) {
        list.unshift({ value: "", label: "All Templates" });
      }
      setOptions(list);
    }
  }, [templates, includeAllOption]);

  const handleChange = (selected: any) => {
    const selectedValue = selected ? selected.value : "";
    if (onChange) onChange(selectedValue);
    if (setFormData) {
      setFormData((prev: any) => ({
        ...prev,
        [name]: selectedValue,
      }));
    }
  };

  const currentValue =
    value ??
    (formData && (formData[name] ?? formData.template ?? "")) ??
    "";

  const selectedOption =
    options.find((opt) => String(opt.value) === String(currentValue)) || null;

  return (
    <div className={`w-full ${className}`}>
      {label && (
        <label className="block mb-2 text-sm font-medium text-gray-900">
          {label} {isRequired && <span className="text-red-500">*</span>}
        </label>
      )}
      <Select
        isLoading={templateLoading}
        isDisabled={disabled || templateLoading}
        options={options}
        value={selectedOption}
        onChange={handleChange}
        isClearable
        placeholder={placeholder}
        classNamePrefix="react-select"
        styles={{
          control: (base) => ({
            ...base,
            borderColor: "#d1d5db",
            borderRadius: "0.5rem",
            padding: "2px",
            minHeight: "42px",
            boxShadow: "none",
            "&:hover": { borderColor: "#93c5fd" },
          }),
          menu: (base) => ({
            ...base,
            zIndex: 50,
          }),
        }}
      />
    </div>
  );
};

export default TemplateDropdown;