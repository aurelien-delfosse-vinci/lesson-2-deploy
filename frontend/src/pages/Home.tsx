import type { FormEvent } from "react";
import { useState } from "react";
import type { Expense } from "../types/Expense";
import ExpenseItem from "../components/ExpenseItem";
import ExpenseAdd from "../components/ExpenseAdd";
import ExpenseReset from "../components/ExpenseReset";
import ExpenseSorter from "../components/ExpenseSorter";
import useExpenses from "../hooks/useExpenses";
import useUsers from "../hooks/useUsers";

function Home() {
  const {
    expenses,
    addExpense,
    resetExpenses,
    searchExpenses,
    showAllExpenses,
    loading,
    error,
  } = useExpenses();

  const { users, loadingUsers, usersError } = useUsers();

  const [amount, setAmount] = useState("");
  const [payerId, setPayerId] = useState("");

  const [sortingAlgo, setSortingAlgo] = useState<
    (a: Expense, b: Expense) => number
  >(() => () => 1);

  const handleAlgoChange = (
    algo: (a: Expense, b: Expense) => number,
  ) => {
    setSortingAlgo(() => algo);
  };

  const handleSearch = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const filters: { amount?: number; payerId?: string } = {};

    if (amount.trim() !== "") {
      const minimumAmount = Number(amount);

      if (!Number.isFinite(minimumAmount) || minimumAmount < 0) {
        return;
      }

      filters.amount = minimumAmount;
    }

    if (payerId !== "") {
      filters.payerId = payerId;
    }

    await searchExpenses(filters);
  };

  const handleShowAll = async () => {
    setAmount("");
    setPayerId("");
    await showAllExpenses();
  };

  const sortedExpenses = [...expenses].sort(sortingAlgo);

  return (
    <div>
      <h1>Manage your expenses</h1>

      <ExpenseAdd addExpense={addExpense} />
      <ExpenseReset resetExpenses={resetExpenses} />

      <h2>Search expenses</h2>

      <form onSubmit={handleSearch}>
        <div>
          <label htmlFor="minimumAmount">Minimum amount</label>
          <input
            id="minimumAmount"
            type="number"
            min="0"
            step="any"
            value={amount}
            onChange={(event) => setAmount(event.target.value)}
            placeholder="Any amount"
          />
        </div>

        <div>
          <label htmlFor="payerId">Payer</label>
          <select
            id="payerId"
            value={payerId}
            onChange={(event) => setPayerId(event.target.value)}
          >
            <option value="">All users</option>
            {users.map((user) => (
              <option key={user.id} value={user.id}>
                {user.name}
              </option>
            ))}
          </select>
        </div>

        {loadingUsers && <p>Loading users...</p>}
        {usersError && <p role="alert">{usersError}</p>}

        <button type="submit" disabled={loading}>
          Search
        </button>

        <button
          type="button"
          onClick={handleShowAll}
          disabled={loading}
        >
          Show all expenses
        </button>
      </form>

      {error && <p role="alert">{error}</p>}
      {loading && <p>Loading expenses...</p>}

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

      {!loading && sortedExpenses.length === 0 && (
        <p>No expenses found.</p>
      )}
    </div>
  );
}

export default Home;