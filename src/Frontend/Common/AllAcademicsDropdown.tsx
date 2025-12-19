// src/components/AllAcademicsDropdown.tsx
import React, { useEffect, useState } from "react";
import Select from "react-select";
import { useAllAcademics } from "src/hook/useAllAcademics";

interface AllAcademicsDropdownProps {
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
  /** Whether to show "All Academics" option */
  includeAllOption?: boolean;
  /** Whether to disable dropdown */
  disabled?: boolean;
}

const AllAcademicsDropdown: React.FC<AllAcademicsDropdownProps> = ({
  value,
  onChange,
  name = "academic_id",
  label = "",
  isRequired = false,
  placeholder = "Select academic...",
  className = "",
  formData,
  setFormData,
  includeAllOption = true,
  disabled = false,
}) => {
  const { academics, loading: academicLoading } = useAllAcademics();
  const [options, setOptions] = useState<{ value: string; label: string }[]>([]);

  useEffect(() => {
    if (academics && Array.isArray(academics)) {
      const list = academics.map((a: any) => ({
        value: String(a.id),
        label: a.academic_name,
      }));
      
      // Add "All Academics" option if required
      if (includeAllOption) {
        list.unshift({ value: "", label: "All Academics" });
      }
      
      setOptions(list);
    }
  }, [academics, includeAllOption]);

  const handleChange = (selected: any) => {
    const selectedValue = selected ? selected.value : "";
    // console.log('selectedValue', selectedValue);
    // Call onChange callback if provided
    if (onChange) onChange(selectedValue);
    
    // Update formData if provided
    if (setFormData) {
      setFormData((prev: any) => ({
        ...prev,
        [name]: selectedValue,
      }));
    }
  };

  // Determine current value from props or formData
  const currentValue =
    value ??
    (formData && (formData[name] ?? formData.academic ?? "")) ??
    "";

  // Find the currently selected option
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
        isLoading={academicLoading}
        isDisabled={disabled || academicLoading}
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

export default AllAcademicsDropdown;