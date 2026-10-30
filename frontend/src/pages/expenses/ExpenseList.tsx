
import { useLoaderData, useSearchParams } from "react-router";

import ExpenseItem from "../../components/ExpenseItem";
import type { ExpenseListItem } from "../../types/Expense";
import useUsers from "../../hooks/useUsers";

interface SearchFormValues {
  amount?: number;
  payerId?: string;
  categoryId?: string;
}

function ExpenseList() {
  const expenses = useLoaderData() as ExpenseListItem[];
  const { users, loadingUsers, usersError } = useUsers();

  const [searchParams, setSearchParams] = useSearchParams();

  const onSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);

    const data: SearchFormValues = {
      amount: formData.get("amount")
        ? Number(formData.get("amount"))
        : undefined,
      payerId: String(formData.get("payerId") ?? ""),
      categoryId: String(formData.get("categoryId") ?? ""),
    };

    const filters: Record<string, string> = {};

    if (data.amount) filters.amount = String(data.amount);
    if (data.payerId) filters.payerId = data.payerId;
    if (data.categoryId) filters.categoryId = data.categoryId;

    setSearchParams(filters);
  };

  const handleShowAll = () => {
    setSearchParams({});
  };

  return (
    <div>
      <h1>Your expenses</h1>

      <h2>Search expenses</h2>

      <form onSubmit={onSubmit}>
        <div>
          <label htmlFor="amount">Minimum amount</label>
          <input
            id="amount"
            name="amount"
            type="number"
            min="0"
            step="any"
            defaultValue={searchParams.get("amount") ?? ""}
            placeholder="Any amount"
          />
        </div>

        <div>
          <label htmlFor="payerId">Payer</label>
          <select
            id="payerId"
            name="payerId"
            defaultValue={searchParams.get("payerId") ?? ""}
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

        <button type="submit">
          Search
        </button>

        <button type="button" onClick={handleShowAll}>
          Show all expenses
        </button>
      </form>

      <h2>Your expenses</h2>

      <ul>
        {expenses.map((expense) => (
          <li key={expense.id}>
            <ExpenseItem expense={expense} />
          </li>
        ))}
      </ul>

      {expenses.length === 0 && (
        <p>No expenses found.</p>
      )}
    </div>
  );
}

export default ExpenseList;
