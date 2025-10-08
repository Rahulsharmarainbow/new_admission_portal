import { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from './useAuth';

export interface Caste {
  id: number;
  name: string;
  type: string;
}

export const useCaste = () => {
  const [caste, setCaste] = useState<Caste[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();
  const apiUrl = import.meta.env.VITE_API_URL;

  const fetchCaste = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await axios.post(
        `${apiUrl}/Public/Caste`,
        {},
        {
          headers: {
            'Authorization': `Bearer ${user?.token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      if (response.data.status) {
        setCaste(response.data.data);
      } else {
        setError(response.data.message || 'Failed to fetch caste data');
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'An error occurred while fetching caste data');
      console.error('Error fetching caste:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user?.token) {
      fetchCaste();
    }
  }, [user?.token]);

  return { caste, loading, error, refetch: fetchCaste };
};