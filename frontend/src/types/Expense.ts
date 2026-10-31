
export interface User {
  id: string;
  name: string;
  email: string;
  bankAccount: string | null;
}

export interface Category {
  id: string;
  name: string;
  colour: string;
}

export interface Expense {
  id: string;
  date: string;
  description: string;
  amount: number;
  payer: User;
  participants: User[];
  category: Category | null;
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
  category: Category | null;
}

export type NewExpense = {
  date: string;
  description: string;
  payer: string;
  amount: number;
  categoryId: string;
};

export interface NewExpenseInput {
  description: string;
  amount: number;
  date: string;
  payerId: number;
  participants: number[];
  categoryId?: number | null;
}
