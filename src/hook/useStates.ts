import { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from './useAuth';

export interface State {
  state_id: number;
  state_title: string;
}

export const useStates = () => {
  const [states, setStates] = useState<State[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();
  const apiUrl = import.meta.env.VITE_API_URL;

  const fetchStates = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Adjust the API endpoint based on your actual states API
      const response = await axios.post(
        `${apiUrl}/Public/state`, 
        {
          headers: {
            'Authorization': `Bearer ${user?.token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      if (response.data.status) {
        setStates(response.data.states);
      } else {
        setError(response.data.message || 'Failed to fetch states data');
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'An error occurred while fetching states data');
      console.error('Error fetching states:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user?.token) {
      fetchStates();
    }
  }, [user?.token]);

  return { states, loading, error, refetch: fetchStates };
};