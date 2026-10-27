
import { useState } from "react";
import type { Expense } from "../types/Expense";

interface ExpenseAddProps {
  addExpense: (expense: Expense) => void;
}

function ExpenseAdd({ addExpense }: ExpenseAddProps) {
  const [payer, setPayer] = useState("Bob");
  const [date, setDate] = useState("2026-09-18");
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const expense: Expense = {
      id: Math.round(Math.random() * 100).toString(),
      payer,
      date,
      description,
      amount: Number(amount),
    };

    await addExpense(expense);

    setDescription("");
    setAmount("");
  }

  return (
    <div>
      <h2>Add a new Expense</h2>

      <form onSubmit={handleSubmit}>
        <label>
          Payer:
          <select
            value={payer}
            onChange={(event) => setPayer(event.target.value)}
          >
            <option value="Bob">Bob</option>
            <option value="Alice">Alice</option>
          </select>
        </label>

        <br />

        <label>
          Date:
          <input
            type="date"
            value={date}
            onChange={(event) => setDate(event.target.value)}
            required
          />
        </label>

        <br />

        <label>
          Description:
          <input
            type="text"
            value={description}
            onChange={(event) => setDescription(event.target.value)}
            required
          />
        </label>

        <br />

        <label>
          Amount:
          <input
            type="number"
            min="0"
            step="0.01"
            value={amount}
            onChange={(event) => setAmount(event.target.value)}
            required
          />
        </label>

        <br />

        <button type="submit">Add</button>
      </form>
    </div>
  );
}

export default ExpenseAdd;
