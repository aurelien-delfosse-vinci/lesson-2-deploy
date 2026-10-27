import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import type { NewExpense } from "../types/Expense";

// Schéma de validation Zod
const expenseSchema = z.object({
  payer: z.enum(["Bob", "Alice"], {
    error: "Payer must be either Bob or Alice",
  }),

  date: z.string().min(1, "Date is required"),

  description: z
    .string()
    .max(200, "Description cannot exceed 200 characters")
    .optional(),

  amount: z
    .number({ error: "Amount must be a number" })
    .positive("Amount must be greater than 0")
    .finite("Amount must be a finite number"),
});

interface ExpenseAddProps {
  addExpense: (expense: NewExpense) => Promise<void>;
}

function ExpenseAdd({ addExpense }: ExpenseAddProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<NewExpense>({
    resolver: zodResolver(expenseSchema),
    defaultValues: {
      payer: undefined,
      date: "",
      description: "",
    },
  });

  async function onSubmit(data: NewExpense) {
    await addExpense(data);
  }

  return (
    <div>
      <h2>Add a new Expense</h2>

      <form onSubmit={handleSubmit(onSubmit)}>
        <label>
          Payer:
          <select {...register("payer")}>
            <option value="">Choose a payer</option>
            <option value="Bob">Bob</option>
            <option value="Alice">Alice</option>
          </select>
          {errors.payer && (
            <p role="alert">{errors.payer.message}</p>
          )}
        </label>

        <br />

        <label>
          Date:
          <input type="date" {...register("date")} />
          {errors.date && (
            <p role="alert">{errors.date.message}</p>
          )}
        </label>

        <br />

        <label>
          Description:
          <input
            type="text"
            placeholder="Enter description (optional)"
            {...register("description")}
          />
          {errors.description && (
            <p role="alert">{errors.description.message}</p>
          )}
        </label>

        <br />

        <label>
          Amount:
          <input
            type="number"
            step="any"
            placeholder="Enter amount"
            {...register("amount", { valueAsNumber: true })}
          />
          {errors.amount && (
            <p role="alert">{errors.amount.message}</p>
          )}
        </label>

        <br />

        <button type="submit">Add</button>
      </form>
    </div>
  );
}

export default ExpenseAdd;