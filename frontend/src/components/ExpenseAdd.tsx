import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import type { NewExpenseInput } from "../types/Expense";
import useCategories from "../hooks/useCategories";

// Schéma de validation Zod
const expenseSchema = z.object({
  payerId: z.number().int().positive(),

  participants: z.array(z.string()).transform((values) => values.map(Number)),
  date: z.string().min(1, "Date is required"),

  description: z.string().max(200, "Description cannot exceed 200 characters"),

  amount: z
    .number({ error: "Amount must be a number" })
    .positive("Amount must be greater than 0")
    .finite("Amount must be a finite number"),

  categoryId: z.number().int().positive().nullable(),
});

type ExpenseFormInput = z.input<typeof expenseSchema>;
type ExpenseFormData = z.output<typeof expenseSchema>;

interface ExpenseAddProps {
  addExpense: (expense: NewExpenseInput) => Promise<void>;
}

function ExpenseAdd({ addExpense }: ExpenseAddProps) {
  const {
  register,
  handleSubmit,
  formState: { errors },
} = useForm<ExpenseFormInput, any, ExpenseFormData>({
  resolver: zodResolver(expenseSchema),
  defaultValues: {
    payerId: undefined,
    participants: [],
    date: "",
    description: "",
    categoryId: null,
  },
});

  const { categories, loadingCategories } = useCategories();

  async function onSubmit(data: ExpenseFormData) {
    await addExpense({
      ...data,
      description: data.description ?? "",
    });
  }

  return (
    <div>
      <h2>Add a new Expense</h2>

      <form
        onSubmit={handleSubmit(onSubmit, (errors) =>
          console.log("Erreurs du formulaire :", errors),
        )}
      >
        <label>
          Payer:
          <select {...register("payerId", { valueAsNumber: true })}>
            <option value="">Choose a payer</option>
            <option value="1">Bob</option>
            <option value="2">Alice</option>
          </select>
          {errors.payerId && <p role="alert">Please select a payer</p>}
        </label>

        <br />

        <label>
          Participants:
          <select multiple {...register("participants")}>
            <option value="1">Bob</option>
            <option value="2">Alice</option>
          </select>
        </label>

        <br />

        <label htmlFor="categoryId">Category</label>

        <select
          id="categoryId"
          {...register("categoryId", {
            setValueAs: (value) => (value === "" ? null : Number(value)),
          })}
          disabled={loadingCategories || categories.length === 0}
        >
          <option value="">Select a category</option>

          {categories.map((category) => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </select>

        {errors.categoryId && <p role="alert">{errors.categoryId.message}</p>}

        <br />

        <label>
          Date:
          <input type="date" {...register("date")} />
          {errors.date && <p role="alert">{errors.date.message}</p>}
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
          {errors.amount && <p role="alert">{errors.amount.message}</p>}
        </label>

        <br />

        <button
          type="submit"
          disabled={loadingCategories || categories.length === 0}
        >
          Add
        </button>
      </form>
    </div>
  );
}

export default ExpenseAdd;
