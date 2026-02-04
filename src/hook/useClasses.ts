import { useState, useEffect } from 'react';
import { useAuth } from './useAuth';
const apiUrl = import.meta.env.VITE_API_URL;

export const useClasses = (academicId?: string | number) => {
  const [classes, setClasses] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    const fetchClasses = async () => {
      if (!academicId) {
        setClasses([]);
        return;
      }

      setLoading(true);
      try {
        const response = await fetch(
          `${apiUrl}/${user?.role}/Dropdown/get-classes`,
          {
            method: 'POST',
            headers: {
              'accept': '/',
              'accept-language': 'en-IN,en-GB;q=0.9,en-US;q=0.8,en;q=0.7,hi;q=0.6',
              'content-type': 'application/json',
              'Authorization': 'Bearer' + user?.token,
            },
            body: JSON.stringify({
              academic_id: academicId,
              s_id: user?.id
            })
          }
        );

        if (response.ok) {
          const data = await response.json();
          setClasses(data.data || []);
        } else {
          console.error('Failed to fetch classes');
          setClasses([]);
        }
      } catch (error) {
        console.error('Error fetching classes:', error);
        setClasses([]);
      } finally {
        setLoading(false);
      }
    };

    fetchClasses();
  }, [academicId]);

  return { classes, loading };
};