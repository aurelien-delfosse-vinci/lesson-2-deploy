import { useCallback, useEffect, useState } from "react";
import type { Expense, NewExpense } from "../types/Expense";

const host = import.meta.env.VITE_API_URL || "http://localhost:3000";

export interface ExpenseFilters {
  amount?: number;
  payerId?: string;
  categoryId?: string;
}

interface UseExpensesResult {
  expenses: Expense[];
  loading: boolean;
  error: string | null;
  addExpense: (expense: NewExpense) => Promise<void>;
  resetExpenses: () => Promise<void>;
  showAllExpenses: () => Promise<void>;
  searchExpenses: (filters: ExpenseFilters) => Promise<void>;
}

function errorMessage(error: unknown): string {
  return error instanceof Error ? error.message : "Unknown error";
}

function useExpenses(): UseExpensesResult {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchExpenses = useCallback(async (filters?: ExpenseFilters) => {
    setLoading(true);
    setError(null);

    try {
      const params = new URLSearchParams();

      if (filters?.amount !== undefined) {
        params.set("amount", filters.amount.toString());
      }

      if (filters?.payerId) {
        params.set("payerId", filters.payerId);
      }

      if (filters?.categoryId) {
        params.set("categoryId", filters.categoryId);
      }

      const query = params.toString();
      const url = `${host}/api/expenses${query ? `?${query}` : ""}`;

      const response = await fetch(url);

      if (!response.ok) {
        throw new Error("Failed to fetch expenses");
      }

      const data: Expense[] = await response.json();
      setExpenses(data);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "An unexpected error occurred",
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void fetchExpenses();
  }, [fetchExpenses]);

  const searchExpenses = useCallback(
    async (filters: ExpenseFilters) => {
      await fetchExpenses(filters);
    },
    [fetchExpenses],
  );

  const addExpense = useCallback(
    async (expense: NewExpense) => {
      try {
        setError(null);

        const response = await fetch(`${host}/api/expenses`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(expense),
        });

        if (!response.ok) {
          throw new Error(`Failed to add expense (${response.status})`);
        }

        await fetchExpenses();
      } catch (err) {
        setError(errorMessage(err));
      }
    },
    [fetchExpenses],
  );

  const resetExpenses = useCallback(async () => {
    try {
      setError(null);

      const response = await fetch(`${host}/api/expenses/reset`, {
        method: "POST",
      });

      if (!response.ok) {
        throw new Error(`Failed to reset expenses (${response.status})`);
      }

      await fetchExpenses();
    } catch (err) {
      setError(errorMessage(err));
    }
  }, [fetchExpenses]);

  const showAllExpenses = useCallback(async () => {
    await fetchExpenses();
  }, [fetchExpenses]);

  return {
    expenses,
    loading,
    error,
    addExpense,
    resetExpenses,
    showAllExpenses,
    searchExpenses,
  };
}

export default useExpenses;
