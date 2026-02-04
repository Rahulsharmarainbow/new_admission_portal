import React, { useEffect, useState } from "react";
import Select from "react-select";
import { useAllAcademics } from "src/hook/useAllAcademics";

interface AllAcademicsMultiDropdownProps {
  name?: string;
  label?: string;
  isRequired?: boolean;
  placeholder?: string;
  className?: string;
  formData?: Record<string, any>;
  setFormData?: React.Dispatch<React.SetStateAction<any>>;
  disabled?: boolean;
}

const AllAcademicsMultiDropdown: React.FC<AllAcademicsMultiDropdownProps> = ({
  name = "assign_academic_id",
  label = "",
  isRequired = false,
  placeholder = "Select academics...",
  className = "",
  formData,
  setFormData,
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
      setOptions(list);
    }
  }, [academics]);

  const handleChange = (selected: any) => {
    const selectedValues = selected ? selected.map((item: any) => item.value) : [];

    if (setFormData) {
      setFormData((prev: any) => ({
        ...prev,
        [name]: selectedValues,
      }));
    }
  };

  const selectedOptions =
    options.filter((opt) =>
      (formData?.[name] || []).includes(opt.value)
    ) || [];

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
        value={selectedOptions}
        onChange={handleChange}
        isMulti
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

export default AllAcademicsMultiDropdown;
