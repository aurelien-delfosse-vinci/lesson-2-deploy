import type { Expense, NewExpense } from "../types/expense.ts";

export function isValidNewExpense(data: unknown): data is NewExpense {
  if (typeof data !== 'object' || data === null) {
    return false;
  }

  const candidate = data as Record<string, unknown>;

  return (
    typeof candidate.date === 'string' &&
    typeof candidate.description === 'string' &&
    typeof candidate.payer === 'string' &&
    typeof candidate.amount === 'number'
  );
}