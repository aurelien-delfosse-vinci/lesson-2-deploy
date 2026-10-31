import { db } from "../src/prisma/db.ts";
import type { Expense, ExpenseFilter, NewExpense, NewExpenseInput } from "../types/expense.ts";
import fs from "node:fs";
import path from "node:path";

export class ExpensesService {
  private static readonly resetPath = path.resolve("data/expenses.init.json");
  public static async getExpenses(filters: ExpenseFilter = {}) {
    let expenses = await db.orm.public.Expense.include("payer")
      .include("participants")
      .include("category")
      .all();

    if (filters.amount !== undefined) {
      expenses = expenses.filter(
        (expense) => expense.amount >= filters.amount!,
      );
    }

    if (filters.payerId !== undefined) {
      expenses = expenses.filter(
        (expense) => expense.payerId === filters.payerId,
      );
    }

    if (filters.categoryId !== undefined) {
      expenses = expenses.filter(
        (expense) => expense.categoryId === filters.categoryId,
      );
    }

    return expenses;
  }

  public static async getExpenseById(id: number) {
    const expense = await db.orm.public.Expense.include("payer")
      .include("participants")
      .include("category")
      .first({ id });

    return expense;
  }

 public static async addExpense(newExpense: NewExpenseInput) {
  const expense = await db.orm.public.Expense.create({
    date: newExpense.date,
    description: newExpense.description,
    amount: newExpense.amount,
    payerId: newExpense.payerId,
    categoryId: newExpense.categoryId ?? null,
  });

  for (const userId of newExpense.participants) {
    await db.orm.public.Participations.create({
      expenseId: expense.id,
      userId,
    });
  }

  return this.getExpenseById(expense.id);
}

  public static async resetExpenses() {
    const defaultExpenses: NewExpense[] = JSON.parse(
      fs.readFileSync(this.resetPath, "utf-8"),
    );

    // Supprime d'abord les participations liées aux dépenses.
    await db.orm.public.Participations.where({}).deleteAll();

    // Supprime les dépenses existantes.
    await db.orm.public.Expense.where(({ id }) => id.gt(0)).deleteAll();

    // Réinsère les dépenses initiales.
    for (const expense of defaultExpenses) {
      const payer = await db.orm.public.User.first({
        name: expense.payer,
      });

      if (!payer) {
        throw new Error(`Payer "${expense.payer}" not found`);
      }

      await db.orm.public.Expense.create({
        date: expense.date,
        description: expense.description ?? "",
        amount: expense.amount,
        payerId: payer.id,
      });
    }

    return this.getExpenses();
  }
}
