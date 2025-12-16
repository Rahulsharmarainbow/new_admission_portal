// src/hook/useAllAcademics.ts
import { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "./useAuth";

const apiUrl = import.meta.env.VITE_API_URL;

export interface Academic {
  academic_type( academic_type: String): unknown;
  id: number;
  academic_name: string;
}

export const useAllAcademics = () => {
  const { user } = useAuth();
  const [academics, setAcademics] = useState<Academic[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchAllAcademics = async () => {
    if (!user?.token) return;
    setLoading(true);
    setError(null);

    try {
      const res = await axios.post(
        `${apiUrl}/${user?.role}/Dropdown/get-all-academic`,
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
      console.error("Error fetching all academics:", err);
      setError(err.response?.data?.message || "Failed to load academics");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllAcademics();
  }, [user?.token]);

  return { academics, loading, error, refetch: fetchAllAcademics };
};