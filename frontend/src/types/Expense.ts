export type Payer = "Bob" | "Alice";

export interface NewExpense {
  date: string;
  description?: string;
  payer: Payer;
  amount: number;
}

export interface Expense extends NewExpense {
  id: string;
}