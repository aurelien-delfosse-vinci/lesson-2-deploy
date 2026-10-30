/**
 * A simple component to display an expense item
 */

import type { ExpenseListItem } from "../types/Expense";
import { Link } from "react-router";

interface ExpenseItemProps {
  expense: ExpenseListItem;
}

function ExpenseItem({ expense }: ExpenseItemProps) {
  return (
    <div>
      <h3>Expense {expense.id}</h3>
      <p>Date: {expense.date}</p>
      <Link to={`/expenses/${expense.id}`}>{expense.description}</Link>
      {/* amount must be restricted to 2 decimal places */}
      <p>Amount: {expense.amount.toFixed(2)}</p>
      <p>Payer: {expense.payer.name}</p>
      {expense.category && (
        <span
          style={{
            color: expense.category.colour,
            marginLeft: "8px",
            fontWeight: "bold",
          }}
        >
          {expense.category.name}
        </span>
      )}
    </div>
  );
}

export default ExpenseItem;
