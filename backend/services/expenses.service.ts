import { db } from "../src/prisma/db.ts";
import type { Expense, ExpenseFilter, NewExpense } from "../types/expense.ts";
import fs from "node:fs";
import path from "node:path";

export class ExpensesService {
  private static readonly resetPath = path.resolve("data/expenses.init.json");
  public static async getExpenses(
  filter?: ExpenseFilter,
): Promise<Expense[]> {
  const minimumAmount = filter?.amount;
  const payerId = filter?.payerId;

  let expenses;

  if (minimumAmount !== undefined && payerId !== undefined) {
    expenses = await db.orm.public.Expense
      .include("payer")
      .where(({ amount }) => amount.gte(minimumAmount))
      .where({ payerId })
      .all();
  } else if (minimumAmount !== undefined) {
    expenses = await db.orm.public.Expense
      .include("payer")
      .where(({ amount }) => amount.gte(minimumAmount))
      .all();
  } else if (payerId !== undefined) {
    expenses = await db.orm.public.Expense
      .include("payer")
      .where({ payerId })
      .all();
  } else {
    expenses = await db.orm.public.Expense
      .include("payer")
      .all();
  }

  return expenses.map((expense) => ({
    id: expense.id.toString(),
    date: expense.date,
    description: expense.description,
    payer: expense.payer.name,
    amount: expense.amount,
  }));
}

  public static async addExpense(newExpense: NewExpense): Promise<Expense[]> {
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
  public static async resetExpenses(): Promise<Expense[]> {
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
