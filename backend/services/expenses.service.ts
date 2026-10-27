import fs from "fs";
import type { Expense, NewExpense } from "../types/expense.ts";
import { db } from "../src/prisma/db.ts";

export class ExpensesService {

  private static dataPath = "./data/expenses.json";
  private static resetPath = "./data/expenses.init.json";
  
  public static async getExpenses(): Promise<Expense[]> {
  const expenses = await db.orm.public.Expense.all();

  return expenses.map((expense) => ({
    ...expense,
    id: expense.id.toString()
  }));
}
  
  public static async addExpense(newExpense: NewExpense): Promise<Expense[]> {
    await db.orm.public.Expense.create({
      ...newExpense
    });

    return await this.getExpenses();
  }
  
  public static async resetExpenses(): Promise<Expense[]> {
    const defaultExpenses: NewExpense[] = JSON.parse(
    fs.readFileSync(this.resetPath, "utf-8")
  );

  // Supprime toutes les dépenses de la base de données.
  await db.orm.public.Expense.where(({id}) => id.gt(0)).deleteAll();

  // Réinsère les dépenses initiales.
  for (const expense of defaultExpenses) {
    await db.orm.public.Expense.create({
      date: expense.date,
      description: expense.description,
      payer: expense.payer,
      amount: expense.amount,
    });
  }

  // Renvoie la liste mise à jour.
  return await this.getExpenses();
  }
  
  private static readExpenses(): Expense[] {
    try {
      const data = JSON.parse(fs.readFileSync(this.dataPath, "utf-8"));
      return data;
    } catch (error) {
      console.error("Error reading expenses file:", error);
      throw error;
    }
  }
  
  private static saveExpenses(expenses: Expense[]): void {
    try {
      fs.writeFileSync(this.dataPath, JSON.stringify(expenses, null, 2));
    } catch (error) {
      console.error("Error saving expenses file:", error);
      throw error;
    }
  }

}