
import type { Expense } from "../types/Expense";
import ExpenseItem from "../components/ExpenseItem";
import { useState } from "react";
import ExpenseAdd from "../components/ExpenseAdd";
import useExpenses from "../hooks/useExpenses";
import ExpenseReset from "../components/ExpenseReset";
import ExpenseSorter from "../components/ExpenseSorter";

function Home() {
  const {
    expenses,
    addExpense,
    resetExpenses,
    searchExpensesByAmount,
    showAllExpenses,
  } = useExpenses();

  const [sortingAlgo, setSortingAlgo] = useState<
    (a: Expense, b: Expense) => number
  >(() => () => 1);

  const [amount, setAmount] = useState("");

  const handleAlgoChange = (
    algo: (a: Expense, b: Expense) => number,
  ) => {
    setSortingAlgo(() => algo);
  };

  const handleSearch = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (amount.trim() === "") {
      return;
    }

    const minimumAmount = Number(amount);

    if (!Number.isFinite(minimumAmount) || minimumAmount < 0) {
      return;
    }

    await searchExpensesByAmount(minimumAmount);
  };

  const handleResetSearch = async () => {
  setAmount("");
  await showAllExpenses();
};

  const sortedExpenses = [...expenses].sort(sortingAlgo);

  return (
    <div>
      <h1>Manage your expenses</h1>

      <ExpenseAdd addExpense={addExpense} />
      <ExpenseReset resetExpenses={resetExpenses} />

      <h2>Search by minimum amount</h2>

      <form onSubmit={handleSearch}>
        <label htmlFor="minimumAmount">Minimum amount</label>
        <input
          id="minimumAmount"
          type="number"
          min="0"
          step="any"
          value={amount}
          onChange={(event) => setAmount(event.target.value)}
          placeholder="Enter an amount"
          required
        />
        <button type="submit">Search</button>
        <button type="button" onClick={handleResetSearch}>
          Show all expenses
        </button>
      </form>

      <h2>Your expenses</h2>

      {sortedExpenses.length > 0 && (
        <ExpenseSorter setSortingAlgo={handleAlgoChange} />
      )}

      <ul>
        {sortedExpenses.map((expense) => (
          <li key={expense.id}>
            <ExpenseItem expense={expense} />
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Home;
