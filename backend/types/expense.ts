import { z } from "zod";

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

export interface NewExpense {
  date: string;
  description: string;
  payer: string;
  amount: number;
  categoryId: string;
}

export const expenseFilterSchema = z.object({
  amount: z
    .string()
    .regex(/^\d+(\.\d+)?$/)
    .transform(Number)
    .pipe(z.number().finite().nonnegative())
    .optional(),
  payerId: z
    .string()
    .regex(/^\d+$/)
    .transform(Number)
    .pipe(z.number().int().positive())
    .optional(),
});

export const newExpenseSchema = z.object({
  date: z.string().min(1),
  description: z.string(),
  payer: z.string().min(1),
  amount: z.number().finite().positive(),
  categoryId: z.string().regex(/^\d+$/).transform(Number).pipe(
    z.number().int().positive(),
  ),
});

export type ExpenseFilter = z.infer<typeof expenseFilterSchema>;