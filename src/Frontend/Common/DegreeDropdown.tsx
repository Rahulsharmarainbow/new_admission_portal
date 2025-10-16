import React, { useEffect, useState } from "react";
import Select from "react-select";
import { useDegrees } from "src/hook/useDegrees"; // You'll need to create this hook

interface DegreeDropdownProps {
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
  /** Whether to show "All Degree" option */
  includeAllOption?: boolean;
  /** Whether to disable dropdown */
  disabled?: boolean;
  /** Academic ID to filter degrees */
  academicId?: string | number;
}

const DegreeDropdown: React.FC<DegreeDropdownProps> = ({
  value,
  onChange,
  name = "degree_id",
  label = "",
  isRequired = false,
  placeholder = "Search degree...",
  className = "",
  formData,
  setFormData,
  includeAllOption = true,
  disabled = false,
  academicId,
}) => {
  const { degrees, loading: degreeLoading } = useDegrees(academicId);
  const [options, setOptions] = useState<{ value: string; label: string }[]>([]);

  useEffect(() => {
    if (degrees && Array.isArray(degrees)) {
      const list = degrees.map((degree: any) => ({
        value: degree.value || degree.id,
        label: degree.text || degree.degree_name,
      }));
      if (includeAllOption) {
        list.unshift({ value: "", label: "All Degree" });
      }
      setOptions(list);
    }
  }, [degrees, includeAllOption]);

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
    (formData && (formData[name] ?? formData.degree ?? "")) ??
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
        isLoading={degreeLoading}
        isDisabled={disabled || degreeLoading || !academicId}
        options={options}
        value={selectedOption}
        onChange={handleChange}
        isClearable
        placeholder={!academicId ? "Select academic first" : placeholder}
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

export default DegreeDropdown;