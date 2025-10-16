// src/hook/useDegrees.ts
import { useState, useEffect } from 'react';

export const useDegrees = (academicId?: string | number) => {
  const [degrees, setDegrees] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchDegrees = async () => {
      if (!academicId) {
        setDegrees([]);
        return;
      }

      setLoading(true);
      try {
        const response = await fetch(
          'https://rainbowsolutionandtechnology.com/NewAdmissionPortal/public/api/SuperAdmin/Dropdown/get-degree',
          {
            method: 'POST',
            headers: {
              'accept': '/',
              'accept-language': 'en-IN,en-GB;q=0.9,en-US;q=0.8,en;q=0.7,hi;q=0.6',
              'content-type': 'application/json',
              'Authorization': 'Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJodHRwczovL3JhaW5ib3dzb2x1dGlvbmFuZHRlY2hub2xvZ3kuY29tL05ld0FkbWlzc2lvblBvcnRhbC9wdWJsaWMvYXBpL2F1dGgvdmVyaWZ5LW90cCIsImlhdCI6MTc1OTMwNjA1NywiZXhwIjoxNzYxODk4MDU3LCJuYmYiOjE3NTkzMDYwNTcsImp0aSI6IlRyUmhvcHdvYkJFNHBleHUiLCJzdWIiOiI0MzQiLCJlbWFpbCI6InNoYWFubXNrNEBnbWFpbC5jb20iLCJsb2dpbl90eXBlIjoxLCJyb2xlIjoiU1VQRVJBRE1JTiJ9.uU1-gvBhIrbSrnJ-2rvsBmRuGzpyE4DiazagpC61sZQ'
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