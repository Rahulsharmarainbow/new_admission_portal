import React, { useEffect, useState } from "react";
import Select from "react-select";
import axios from "axios";
import { useAuth } from "src/hook/useAuth";

interface RouteDropdownProps {
  /** academic_id (required for API) */
  academicId?: string | number;
  /** Controlled value */
  value?: string;
  /** On change callback */
  onChange?: (value: string) => void;
  /** Form key name */
  name?: string;
  /** Label */
  label?: string;
  /** Required mark */
  isRequired?: boolean;
  /** Placeholder */
  placeholder?: string;
  /** Wrapper class */
  className?: string;
  /** Form object */
  formData?: Record<string, any>;
  /** Setter for form object */
  setFormData?: React.Dispatch<React.SetStateAction<any>>;
  /** Disable dropdown */
  disabled?: boolean;
}

const RouteDropdown: React.FC<RouteDropdownProps> = ({
  academicId,
  value,
  onChange,
  name = "page_route",
  label = "",
  isRequired = false,
  placeholder = "Select route...",
  className = "",
  formData,
  setFormData,
  disabled = false,
}) => {
  const { user } = useAuth();
  const apiUrl = import.meta.env.VITE_API_URL;

  const [loading, setLoading] = useState(false);
  const [options, setOptions] = useState<
    { value: string; label: string }[]
  >([]);

  // 🔄 Fetch routes when academicId changes
  useEffect(() => {
    if (!academicId) {
      setOptions([]);
      return;
    }

    const fetchRoutes = async () => {
      setLoading(true);
      try {
        const res = await axios.post(
          `${apiUrl}/SuperAdmin/Dropdown/get-form-route`,
          { academic_id: academicId },
          {
            headers: {
              Authorization: `Bearer ${user?.token}`,
              "Content-Type": "application/json",
            },
          }
        );

        if (res.data?.data && Array.isArray(res.data.data)) {
          const list = res.data.data.map((item: any) => ({
            value: item.id,
            label: item.page_name,
          }));
          setOptions(list);
        } else {
          setOptions([]);
        }
      } catch (error) {
        console.error("Failed to fetch routes", error);
        setOptions([]);
      } finally {
        setLoading(false);
      }
    };

    fetchRoutes();
  }, [academicId, apiUrl, user?.token]);

  // 🔄 Change handler
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

  // 🎯 Resolve current value
  const currentValue =
    value ??
    (formData && (formData[name] ?? "")) ??
    "";

  const selectedOption =
    options.find(
      (opt) => String(opt.value) === String(currentValue)
    ) || null;

  return (
    <div className={`w-full ${className}`}>
      {label && (
        <label className="block mb-2 text-sm font-medium text-gray-900">
          {label} {isRequired && <span className="text-red-500">*</span>}
        </label>
      )}

      <Select
        isLoading={loading}
        isDisabled={disabled || loading || !academicId}
        options={options}
        value={selectedOption}
        onChange={handleChange}
        isClearable
        placeholder={
          academicId ? placeholder : "Select academic first"
        }
        classNamePrefix="react-select"
        styles={{
          control: (base) => ({
            ...base,
            borderColor: "#d1d5db",
            borderRadius: "0.5rem",
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

export default RouteDropdown;
