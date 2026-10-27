
import { db } from "../src/prisma/db.ts";
import { Expense, NewExpense } from "../types/expense.ts";


export class ExpensesService {
  public static async getExpenses(): Promise<Expense[]> {
    const expenses = await db.orm.public.Expense
      .include("payer")
      .all();

    return expenses.map((expense) => ({
      id: expense.id.toString(),
      date: expense.date,
      description: expense.description,
      payer: expense.payer.name,
      amount: expense.amount,
    }));
  }

  public static async addExpense(
    newExpense: NewExpense,
  ): Promise<Expense[]> {
    const payer = await db.orm.public.User.first({
      name: newExpense.payer,
    });

    if (!payer) {
      throw new Error(`Payer "${newExpense.payer}" not found`);
    }

    await db.orm.public.Expense.create({
      date: newExpense.date,
      description: newExpense.description ?? "",
      amount: newExpense.amount,
      payerId: payer.id,
    });

    return this.getExpenses();
  }
}