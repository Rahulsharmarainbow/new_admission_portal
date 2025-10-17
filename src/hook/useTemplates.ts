import { useState, useEffect } from 'react';
import { useAuth } from './useAuth';

const apiUrl = import.meta.env.VITE_API_URL;

export const useTemplates = () => {
  const [templates, setTemplates] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const {user} = useAuth();

  useEffect(() => {
    const fetchTemplates = async () => {
      try {
        setLoading(true);
        const response = await fetch(
          `${apiUrl}/${user?.role}/Dropdown/get-template`,
          {
            method: 'POST',
            headers: {
              'accept': 'application/json',
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${user?.token}`,
            },
          }
        );

        if (!response.ok) {
          throw new Error('Failed to fetch templates');
        }

        const data = await response.json();
        
        if (data.status && Array.isArray(data.data)) {
          setTemplates(data.data);
        } else {
          setTemplates([]);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
        console.error('Error fetching templates:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchTemplates();
  }, []);

  return { templates, loading, error };
};