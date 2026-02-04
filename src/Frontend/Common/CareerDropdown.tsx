import React, { useEffect, useState } from "react";
import Select from "react-select";
import axios from "axios";
import { useAuth } from "src/hook/useAuth";

const apiUrl = import.meta.env.VITE_API_URL;

interface SchoolDropdownProps {
  value?: string | number;
  onChange?: (value: string) => void;
  name?: string;
  label?: string;
  isRequired?: boolean;
  placeholder?: string;
  className?: string;
  formData?: Record<string, any>;
  setFormData?: React.Dispatch<React.SetStateAction<any>>;
  includeAllOption?: boolean;
  disabled?: boolean;
}

const CareerDropdown: React.FC<SchoolDropdownProps> = ({
  value,
  onChange,
  name = "academic_id",
  label = "",
  isRequired = false,
  placeholder = "Search Career...",
  className = "",
  formData,
  setFormData,
  includeAllOption = true,
  disabled = false,
}) => {
  const [schools, setSchools] = useState<{ value: string; label: string }[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const { user } = useAuth();

  useEffect(() => {
    const fetchSchools = async () => {
      setLoading(true);
      try {
        const response = await axios.post(
          `${apiUrl}/SuperAdmin/Dropdown/get-career-academic`,
          {s_id: user?.id},
          {
            headers: {
              Authorization: `Bearer ${user?.token}`,
              "Content-Type": "application/json",
            },
          }
        );

        if (response.data?.status && Array.isArray(response.data.academic)) {
          let list = response.data.academic.map((s: any) => ({
            value: s.id.toString(),
            label: s.academic_name,
          }));
        //   if (includeAllOption) {
        //     list.unshift({ value: "", label: "All Schools" });
        //   }
          setSchools(list);
        }
      } catch (error) {
        console.error("Error fetching schools:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchSchools();
  }, [includeAllOption, user?.token]);

  // ✅ Determine the current value
  const currentValue =
    value ??
    formData?.[name] ??
    formData?.academic_id ??
    formData?.school ??
    "";

  // ✅ Find the option that matches the value
  const selectedOption =
    schools.find((opt) => String(opt.value) === String(currentValue)) || null;

  // ✅ Re-sync once schools are loaded and formData already exists
  useEffect(() => {
    if (schools.length > 0 && currentValue && !selectedOption && setFormData) {
      const match = schools.find(
        (opt) => String(opt.value) === String(currentValue)
      );
      if (match) {
        setFormData((prev: any) => ({
          ...prev,
          [name]: match.value,
        }));
      }
    }
  }, [schools, currentValue]);

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

  return (
    <div className={`w-full ${className}`}>
      {label && (
        <label className="block mb-2 text-sm font-medium text-gray-900">
          {label} {isRequired && <span className="text-red-500">*</span>}
        </label>
      )}
      <Select
        isLoading={loading}
        isDisabled={disabled || loading}
        options={schools}
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

export default CareerDropdown;
