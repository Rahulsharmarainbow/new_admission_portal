import { useState, useEffect } from 'react';
import Select from 'react-select';
import axios from 'axios';
import { useAuth } from 'src/hook/useAuth';

const apiUrl = import.meta.env.VITE_API_URL;

interface TypeOfConnectionProps {
  selectedAcademic: string;
  onTypeChange: (type: string) => void;
}

interface TypeResponse {
  status: boolean;
  data: string[];
}

const TypeOfConnection = ({ selectedAcademic, onTypeChange }: TypeOfConnectionProps) => {
  const [types, setTypes] = useState<{ value: string; label: string }[]>([]);
  const [selectedType, setSelectedType] = useState<{ value: string; label: string } | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const { user } = useAuth();

  useEffect(() => {
    const fetchTypes = async () => {
      if (!selectedAcademic) {
        setTypes([]);
        setSelectedType(null);
        onTypeChange('');
        return;
      }

      setLoading(true);
      setError('');

      try {
        console.log('Fetching types for academic ID:', selectedAcademic);

        const response = await axios.post<TypeResponse>(
          `${apiUrl}/SuperAdmin/Dropdown/get-type`,
          { academic_id: parseInt(selectedAcademic) },
          {
            headers: {
              'Authorization': `Bearer ${user?.token}`,
              'Content-Type': 'application/json',
              'Accept': '*/*',
            },
          }
        );

        console.log('API Response:', response.data);

        if (response.data.status && Array.isArray(response.data.data)) {
          const formatted = response.data.data.map((t) => ({
            value: t,
            label: formatTypeName(t),
          }));
          setTypes(formatted);
          console.log('Types loaded successfully:', formatted);
        } else {
          throw new Error('Invalid response format from API');
        }
      } catch (err: any) {
        console.error('Error fetching types:', err);
        setError(`Failed to load types: ${err.message}`);
        setTypes([]);
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
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  const handleTypeChange = (selected: any) => {
    setSelectedType(selected);
    onTypeChange(selected?.value || '');
  };

  return (
    <div className="relative w-full sm:w-auto min-w-[200px]">
      <Select
        isLoading={loading}
        isDisabled={!selectedAcademic || loading || types.length === 0}
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
