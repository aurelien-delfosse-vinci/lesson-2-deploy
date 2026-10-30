import { useCallback, useEffect, useState } from "react";
import type { Category } from "../types/Category";
import { apiRequest } from "../lib/rest";

function useCategories() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loadingCategories, setLoadingCategories] = useState(true);
  const [categoriesError, setCategoriesError] = useState<string | null>(null);

  const fetchAll = useCallback(async () => {
    setLoadingCategories(true);
    setCategoriesError(null);

    try {
      const data = await apiRequest<Category[]>("/api/categories");
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
