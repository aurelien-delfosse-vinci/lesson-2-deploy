import { useCallback, useEffect, useState } from "react";
import type { Expense, NewExpense } from "../types/Expense";

const host = import.meta.env.VITE_API_URL || "http://localhost:3000";

interface UseExpensesResult {
  expenses: Expense[];
  loading: boolean;
  error: string | null;
  addExpense: (expense: NewExpense) => Promise<void>;
  resetExpenses: () => Promise<void>;
  searchExpensesByAmount: (amount: number) => Promise<void>;
  showAllExpenses: () => Promise<void>;
}

function errorMessage(error: unknown): string {
  return error instanceof Error ? error.message : "Unknown error";
}

function useExpenses(): UseExpensesResult {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchExpenses = useCallback(async (amount?: number) => {
    try {
      setLoading(true);
      setError(null);

      const url =
        amount === undefined
          ? `${host}/api/expenses`
          : `${host}/api/expenses?amount=${encodeURIComponent(amount)}`;

      const response = await fetch(url);

      if (!response.ok) {
        throw new Error(`Failed to fetch expenses (${response.status})`);
      }

      const data = (await response.json()) as Expense[];
      setExpenses(data);
    } catch (err) {
      setError(errorMessage(err));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void fetchExpenses();
  }, [fetchExpenses]);

  const searchExpensesByAmount = useCallback(
    async (amount: number) => {
      await fetchExpenses(amount);
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
    searchExpensesByAmount,
    showAllExpenses,
  };
}

export default useExpenses;
