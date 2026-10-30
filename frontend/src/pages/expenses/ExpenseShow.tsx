
import { Link, useLoaderData } from "react-router";
import type { Expense } from "../../types/Expense";

function ExpenseShow() {
  const expense = useLoaderData() as Expense;

  return (
    <div>
      <h1>Expense details</h1>

      <h2>{expense.description}</h2>

      <p>
        <strong>Amount:</strong> ${expense.amount.toFixed(2)}
      </p>

      <p>
        <strong>Date:</strong> {expense.date}
      </p>

      <p>
        <strong>Paid by:</strong> {expense.payer}
      </p>

      <div>
        <strong>Category:</strong>{" "}

        {expense.category ? (
          <span
            style={{
              backgroundColor: expense.category.colour,
              padding: "4px 8px",
              borderRadius: "4px",
            }}
          >
            {expense.category.name}
          </span>
        ) : (
          <span>No category</span>
        )}
      </div>

      <br />

      <Link to="/expenses">Back to expenses</Link>
    </div>
  );
}

export default ExpenseShow;
