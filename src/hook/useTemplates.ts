import { useState, useEffect } from 'react';

export const useTemplates = () => {
  const [templates, setTemplates] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTemplates = async () => {
      try {
        setLoading(true);
        const response = await fetch(
          'https://rainbowsolutionandtechnology.com/NewAdmissionPortal/public/api/SuperAdmin/Dropdown/get-template',
          {
            method: 'POST',
            headers: {
              'accept': 'application/json',
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${localStorage.getItem('token') || 'YOUR_TOKEN'}`,
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