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

export type NewExpense = Omit<Expense, "id" | "category"> & {
  categoryId: string;
};