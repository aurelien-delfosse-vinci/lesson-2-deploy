
import { useForm } from "react-hook-form";
import type { NewExpense } from "../types/Expense";

interface ExpenseAddProps {
  addExpense: (expense: NewExpense) => Promise<void>;
}

function ExpenseAdd({ addExpense }: ExpenseAddProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<NewExpense>();

  async function onSubmit(data: NewExpense) {
    await addExpense(data);
  }

  return (
    <div>
      <h2>Add a new Expense</h2>

      <form onSubmit={handleSubmit(onSubmit)}>
        <label>
          Payer:
          <select {...register("payer", { required: "Choose a payer" })}>
            <option value="">Choose a payer</option>
            <option value="Bob">Bob</option>
            <option value="Alice">Alice</option>
          </select>
          {errors.payer && <span>{errors.payer.message}</span>}
        </label>

        <br />

        <label>
          Date:
          <input
            type="date"
            {...register("date", { required: "Date is required" })}
          />
          {errors.date && <span>{errors.date.message}</span>}
        </label>

        <br />

        <label>
          Description:
          <input
            type="text"
            placeholder="Enter description"
            {...register("description", {
              required: "Description is required",
            })}
          />
          {errors.description && (
            <span>{errors.description.message}</span>
          )}
        </label>

        <br />

        <label>
          Amount:
          <input
            type="number"
            step="0.01"
            {...register("amount", {
              required: "Amount is required",
              valueAsNumber: true,
              min: {
                value: 0.01,
                message: "Amount must be positive",
              },
            })}
            placeholder="Enter amount"
          />
          {errors.amount && <span>{errors.amount.message}</span>}
        </label>

        <br />

        <button type="submit">Add</button>
      </form>
    </div>
  );
}

export default ExpenseAdd;
