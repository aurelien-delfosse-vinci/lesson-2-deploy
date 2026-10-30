export interface Expense {
  id: string;
  date: string;
  description: string;
  payer: string;
  amount: number;
  category: {
    id: string;
    name: string;
    colour: string;
  } | null;
}

export interface ExpenseListItem {
  id: string;
  date: string;
  description: string;
  amount: number;
  payer: {
    id: string;
    name: string;
  };
  category: {
    id: string;
    name: string;
    colour: string;
  } | null;
}

export type NewExpense = Omit<Expense, "id" | "category"> & {
  categoryId: string;
};