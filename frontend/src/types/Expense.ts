export interface NewExpense {
  date: string;
  description: string;
  payer: string;
  amount: number;
}

export interface Expense extends NewExpense {
  id: string;
}