import express from "express";
import type { NewExpense } from "../types/expense.ts";
import { expenseFilterSchema } from "../types/expense.ts";
import { ExpensesService } from "../services/expenses.service.ts";
import { isValidNewExpense } from "../guards/expenses.guard.ts";

const expensesRouter = express.Router();

expensesRouter.get("/", async (req, res) => {
  try {
    const result = expenseFilterSchema.safeParse({
      amount: req.query.amount,
      payerId: req.query.payerId,
    });

    if (!result.success) {
      return res.status(400).json({
        error: "Invalid expense filters",
      });
    }

    const expenses = await ExpensesService.getExpenses(result.data);
    return res.json(expenses);
  } catch (error) {
    console.error("GET EXPENSES ERROR:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
});

expensesRouter.post("/", async (req, res) => {
  try {
    const expense: NewExpense = req.body;

    if (!isValidNewExpense(expense)) {
      return res.status(400).json({ error: "Invalid expense" });
    }

    const expenses = await ExpensesService.addExpense(expense);
    return res.status(201).json(expenses);
  } catch (error) {
    console.error("ADD EXPENSE ERROR:", error);
    return res.status(500).json({
      error: "Internal server error",
    });
  }
});

expensesRouter.post("/reset", async (req, res) => {
  try {
    const expenses = await ExpensesService.resetExpenses();
    return res.json(expenses);
  } catch (error) {
    console.error("RESET EXPENSE ERROR:", error);
    return res.status(500).json({
      error: "Internal server error",
    });
  }
});

export default expensesRouter;