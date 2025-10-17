// src/hook/useDegrees.ts
import { useState, useEffect } from 'react';
import { useAuth } from './useAuth';
const apiUrl = import.meta.env.VITE_API_URL;

export const useDegrees = (academicId?: string | number) => {
  const [degrees, setDegrees] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    const fetchDegrees = async () => {
      if (!academicId) {
        setDegrees([]);
        return;
      }

      setLoading(true);
      try {
        const response = await fetch(
          `${apiUrl}/${user?.role}/Dropdown/get-degree`,
          {
            method: 'POST',
            headers: {
              'accept': '/',
              'accept-language': 'en-IN,en-GB;q=0.9,en-US;q=0.8,en;q=0.7,hi;q=0.6',
              'content-type': 'application/json',
              'Authorization': 'Bearer' + user?.token,
            },
            body: JSON.stringify({
              academic_id: academicId
            })
          }
        );

        if (response.ok) {
          const data = await response.json();
          setDegrees(data.data || []);
        } else {
          console.error('Failed to fetch degrees');
          setDegrees([]);
        }
      } catch (error) {
        console.error('Error fetching degrees:', error);
        setDegrees([]);
      } finally {
        setLoading(false);
      }
    };

    fetchDegrees();
  }, [academicId]);

  return { degrees, loading };
};