import { useState, useEffect } from 'react';
import Select from 'react-select';
import axios from 'axios';
import { useAuth } from 'src/hook/useAuth';

const apiUrl = import.meta.env.VITE_API_URL;

interface TypeOfConnectionProps {
  selectedAcademic: string;
  onTypeChange: (typeId: number | null) => void;
}

interface TypeItem {
  id: number;
  type: string;
}

interface TypeResponse {
  status: boolean;
  data: TypeItem[];
}

const TypeOfConnection = ({ selectedAcademic, onTypeChange }: TypeOfConnectionProps) => {
  const [types, setTypes] = useState<{ value: number; label: string }[]>([]);
  const [selectedType, setSelectedType] = useState<{ value: number; label: string } | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { user } = useAuth();

  useEffect(() => {
    const fetchTypes = async () => {
      if (!selectedAcademic) {
        setTypes([]);
        setSelectedType(null);
        onTypeChange(null);
        return;
      }

      setLoading(true);
      setError('');

      try {
        const response = await axios.post<TypeResponse>(
          `${apiUrl}/${user?.role}/Dropdown/get-type`,
          { academic_id: parseInt(selectedAcademic) },
          {
            headers: {
              Authorization: `Bearer ${user?.token}`,
              'Content-Type': 'application/json',
            },
          }
        );

        if (response.data.status && Array.isArray(response.data.data)) {
          const formatted = response.data.data.map((item) => ({
            value: item.id, // Using ID as value
            label: formatTypeName(item.type),
          }));
          setTypes(formatted);
        } else {
          throw new Error('Invalid response format');
        }
      } catch (err: any) {
        console.error('Error fetching types:', err);
        setTypes([]);
        setError('Failed to load types');
      } finally {
        setLoading(false);
      }
    };

    const timeoutId = setTimeout(fetchTypes, 300);
    return () => clearTimeout(timeoutId);
  }, [selectedAcademic, user?.token]);

  const formatTypeName = (type: string): string => {
    return type
      .split('_')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  const handleTypeChange = (selected: { value: number; label: string } | null) => {
    console.log('Selected Type ID:', selected?.value);
    setSelectedType(selected);
    onTypeChange(selected ? selected.value : null);
  };

  return (
    <div className="relative w-full sm:w-auto min-w-[200px]">
      <Select
        isLoading={loading}
        isDisabled={!selectedAcademic || loading}
        options={types}
        value={selectedType}
        onChange={handleTypeChange}
        placeholder={
          !selectedAcademic
            ? 'Select Academic First'
            : loading
            ? 'Loading types...'
            : types.length === 0
            ? 'No types available'
            : 'Select Type'
        }
        classNamePrefix="react-select"
        styles={{
          control: (base, state) => ({
            ...base,
            borderColor: state.isFocused ? '#3b82f6' : '#d1d5db',
            boxShadow: state.isFocused ? '0 0 0 1px #3b82f6' : 'none',
            '&:hover': { borderColor: '#3b82f6' },
            minHeight: '38px',
          }),
          placeholder: (base) => ({
            ...base,
            color: '#9ca3af',
            fontSize: '0.875rem',
          }),
        }}
      />
    </div>
  );
};

export default TypeOfConnection;