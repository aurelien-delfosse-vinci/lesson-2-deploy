
import { useNavigate } from "react-router";
import ExpenseAdd from "../../components/ExpenseAdd";
import type { NewExpense } from "../../types/Expense";

function ExpenseNew() {
  const navigate = useNavigate();

  const createExpense = async (expense: NewExpense) => {
    console.log(
      "Expense to create (not sent to the backend yet):",
      expense,
    );

    navigate("/expenses");
  };

  return <ExpenseAdd addExpense={createExpense} />;
}

export default ExpenseNew;
