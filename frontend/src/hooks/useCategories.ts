import { useCallback, useEffect, useState } from "react";
import type { Category } from "../types/Category";

const host = import.meta.env.VITE_API_URL || "http://localhost:3000";

function useCategories() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loadingCategories, setLoadingCategories] = useState(true);
  const [categoriesError, setCategoriesError] = useState<string | null>(null);

  const fetchAll = useCallback(async () => {
    setLoadingCategories(true);
    setCategoriesError(null);

    try {
      const response = await fetch(`${host}/api/categories`);

      if (!response.ok) {
        throw new Error("Impossible de récupérer les catégories.");
      }

      const data: Category[] = await response.json();
      setCategories(data);
    } catch (error) {
      setCategoriesError(
        error instanceof Error ? error.message : "Une erreur est survenue.",
      );
    } finally {
      setLoadingCategories(false);
    }
  }, []);

  useEffect(() => {
    void fetchAll();
  }, [fetchAll]);

  return {
    categories,
    loadingCategories,
    categoriesError,
    fetchAll,
  };
}

export default useCategories;