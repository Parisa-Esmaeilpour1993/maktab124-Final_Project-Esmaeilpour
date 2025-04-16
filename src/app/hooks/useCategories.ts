import { useEffect, useState } from "react";
import { Category } from "@/app/types/category";
import { API_KEY, BASE_url } from "@/app/constants/api/BASE_URL";
import { sweetAlert } from "../constants/localization/fa/localization";

export default function useFetchCategories() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${BASE_url}/api/records/category`, {
          headers: {
            api_key: API_KEY,
          },
        });

        const data = await response.json();

        if (response.ok) {
          setCategories(data.records || []);
        } else {
          setError(sweetAlert.errorInReceiveData);
        }
      } catch (err) {
        setError(sweetAlert.error);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  return { categories, loading, error };
}
