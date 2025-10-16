// src/hook/useAcademics.ts
import { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "./useAuth";
const apiUrl = import.meta.env.VITE_API_URL;
export interface Academic {
  id: number;
  academic_name: string;
}

export const useAcademics = () => {
  const { user } = useAuth();
  const [academics, setAcademics] = useState<Academic[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchAcademics = async () => {
    if (!user?.token) return;
    setLoading(true);
    setError(null);

    try {
      const res = await axios.post(
        `${apiUrl}/${user?.role}/Dropdown/get-academic`,
        {},
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
            "Content-Type": "application/json",
          },
        }
      );
      if (res.data?.academic) {
        setAcademics(res.data.academic);
      }
    } catch (err: any) {
      console.error("Error fetching academics:", err);
      setError(err.response?.data?.message || "Failed to load academics");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAcademics();
  }, [user?.token]);

  return { academics, loading, error, refetch: fetchAcademics };
};
