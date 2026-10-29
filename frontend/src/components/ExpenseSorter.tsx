import { useState } from "react";
import type { Expense } from "../types/Expense";
import useCategories from "../hooks/useCategories";

type SortOption = "date-newest" | "date-oldest";
type SortingAlgo = (a: Expense, b: Expense) => number;

interface ExpenseSorterProps {
  setSortingAlgo: (algo: SortingAlgo) => void;
  searchExpenses: (filters: {
    amount?: number;
    payerId?: string;
    categoryId?: string;
  }) => void;
  showAllExpenses: () => void;
}

const dateNewestAlgo: SortingAlgo = (a, b) =>
  new Date(b.date).getTime() - new Date(a.date).getTime();
const dateOldestAlgo: SortingAlgo = (a, b) =>
  new Date(a.date).getTime() - new Date(b.date).getTime();

export default function ExpenseSorter({
  setSortingAlgo,
  searchExpenses,
  showAllExpenses,
}: ExpenseSorterProps) {
  const [sortBy, setSortBy] = useState<SortOption>("date-newest");
  const { categories, loadingCategories, categoriesError } = useCategories();
  const [categoryId, setCategoryId] = useState("");

  const handleCategoryChange = (
  event: React.ChangeEvent<HTMLSelectElement>,
) => {
  const newCategoryId = event.target.value;
  setCategoryId(newCategoryId);

  if (newCategoryId === "") {
    showAllExpenses();
  } else {
    searchExpenses({
      categoryId: newCategoryId,
    });
  }
};

  const handleSortChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const newSortOption = event.target.value as SortOption;
    setSortBy(newSortOption);

    switch (newSortOption) {
      case "date-newest":
        setSortingAlgo(dateNewestAlgo);
        break;
      case "date-oldest":
        setSortingAlgo(dateOldestAlgo);
        break;
      default:
        setSortingAlgo(dateNewestAlgo);
        break;
    }
  };

  return (
    <div>
      <label htmlFor="sort-select">Sort:</label>
      <select id="sort-select" value={sortBy} onChange={handleSortChange}>
        <option value="date-newest">Chronological</option>
        <option value="date-oldest">Reverse chronological</option>
      </select>
      <label htmlFor="categoryId">Category</label>

      <select
        id="categoryId"
        value={categoryId}
        onChange={handleCategoryChange}
        disabled={loadingCategories}
      >
        <option value="">All categories</option>

        {categories.map((category) => (
          <option key={category.id} value={category.id}>
            {category.name}
          </option>
        ))}
      </select>

      {categoriesError && <p>{categoriesError}</p>}
    </div>
  );
}
