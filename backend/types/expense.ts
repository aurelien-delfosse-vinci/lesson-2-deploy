import { z } from "zod";

export interface Expense {
  id: string;
  date: string;
  description: string;
  payer: string;
  amount: number;
}

export type NewExpense = Omit<Expense, "id">;

export const expenseFilterSchema = z.object({
  amount: z
    .string()
    .regex(/^\d+(\.\d+)?$/)
    .transform(Number)
    .pipe(z.number().finite().nonnegative())
    .optional(),
});

export type ExpenseFilter = z.infer<typeof expenseFilterSchema>;