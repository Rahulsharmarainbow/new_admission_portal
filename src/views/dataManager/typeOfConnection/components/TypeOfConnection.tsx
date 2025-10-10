


import { useState, useEffect } from 'react';

interface TypeOfConnectionProps {
  selectedAcademic: string;
  onTypeChange: (type: string) => void;
}

interface TypeResponse {
  status: boolean;
  data: string[];
}

const TypeOfConnection = ({ selectedAcademic, onTypeChange }: TypeOfConnectionProps) => {
  const [types, setTypes] = useState<string[]>([]);
  const [selectedType, setSelectedType] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    const fetchTypes = async () => {
      if (!selectedAcademic) {
        setTypes([]);
        setSelectedType('');
        onTypeChange('');
        return;
      }

      setLoading(true);
      setError('');
      
      try {
        console.log('Fetching types for academic ID:', selectedAcademic);

        // Exact headers from your curl command
        const headers: HeadersInit = {
          'accept': '*/*',
          'accept-language': 'en-IN,en-GB;q=0.9,en-US;q=0.8,en;q=0.7,hi;q=0.6',
          'origin': 'http://localhost:3010',
          'priority': 'u=1, i',
          'referer': 'http://localhost:3010/',
          'sec-ch-ua': '"Chromium";v="140", "Not=A?Brand";v="24", "Google Chrome";v="140"',
          'sec-ch-ua-mobile': '?0',
          'sec-ch-ua-platform': '"Windows"',
          'sec-fetch-dest': 'empty',
          'sec-fetch-mode': 'cors',
          'sec-fetch-site': 'cross-site',
          'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36',
          'Authorization': 'Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJodHRwczovL3JhaW5ib3dzb2x1dGlvbmFuZHRlY2hub2xvZ3kuY29tL05ld0FkbWlzc2lvblBvcnRhbC9wdWJsaWMvYXBpL2F1dGgvdmVyaWZ5LW90cCIsImlhdCI6MTc1OTMwNjA1NywiZXhwIjoxNzYxODk4MDU3LCJuYmYiOjE3NTkzMDYwNTcsImp0aSI6IlRyUmhvcHdvYkJFNHBleHUiLCJzdWIiOiI0MzQiLCJlbWFpbCI6InNoYWFubXNrNEBnbWFpbC5jb20iLCJsb2dpbl90eXBlIjoxLCJyb2xlIjoiU1VQRVJBRE1JTiJ9.uU1-gvBhIrbSrnJ-2rvsBmRuGzpyE4DiazagpC61sZQ',
          'Content-Type': 'application/json'
        };

        const response = await fetch(
          'https://rainbowsolutionandtechnology.com/NewAdmissionPortal/public/api/SuperAdmin/Dropdown/get-type',
          {
            method: 'POST',
            headers: headers,
            body: JSON.stringify({
              academic_id: parseInt(selectedAcademic)
            })
          }
        );

        console.log('Response status:', response.status);

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data: TypeResponse = await response.json();
        console.log('API Response data:', data);
        
        if (data.status && Array.isArray(data.data)) {
          setTypes(data.data);
          console.log('Types loaded successfully:', data.data);
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

    // Add delay to avoid too many API calls
    const timeoutId = setTimeout(fetchTypes, 300);
    
    return () => clearTimeout(timeoutId);
  }, [selectedAcademic, onTypeChange]);

  const handleTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    setSelectedType(value);
    onTypeChange(value);
  };

  const formatTypeName = (type: string): string => {
    return type
      .split('_')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  return (
    <div className="relative w-full sm:w-auto">
      <select 
        value={selectedType}
        onChange={handleTypeChange}
        disabled={!selectedAcademic || loading || types.length === 0}
        className={`w-full sm:w-auto min-w-[200px] p-2 border border-gray-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none text-sm ${
          !selectedAcademic || loading || types.length === 0 ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'
        }`}
      >
        {!selectedAcademic ? (
          <option value="">Select Academic First</option>
        ) : loading ? (
          <option value="">Loading types...</option>
        ) : error ? (
          <option value="">Error loading types</option>
        ) : types.length === 0 ? (
          <option value="">No types available</option>
        ) : (
          <>
            <option value="">Select Type</option>
            {types.map((type, index) => (
              <option key={index} value={type}>
                {formatTypeName(type)}
              </option>
            ))}
          </>
        )}
      </select>
      
      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
        {loading ? (
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
        ) : (
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
          </svg>
        )}
      </div>

      {error && (
        <p className="text-red-500 text-xs mt-1 max-w-[200px]">{error}</p>
      )}
    </div>
  );
};

export default TypeOfConnection;