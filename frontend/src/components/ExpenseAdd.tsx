import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import type { NewExpense } from "../types/Expense";
import useCategories from "../hooks/useCategories";
import { useState } from "react";

// Schéma de validation Zod
const expenseSchema = z.object({
  payer: z.enum(["Bob", "Alice"], {
    error: "Payer must be either Bob or Alice",
  }),

  date: z.string().min(1, "Date is required"),

  description: z.string().max(200, "Description cannot exceed 200 characters"),

  amount: z
    .number({ error: "Amount must be a number" })
    .positive("Amount must be greater than 0")
    .finite("Amount must be a finite number"),

  categoryId: z.string().min(1, "Please select a category"),
});

type ExpenseFormData = z.infer<typeof expenseSchema>;

interface ExpenseAddProps {
  addExpense: (expense: NewExpense) => Promise<void>;
}

function ExpenseAdd({ addExpense }: ExpenseAddProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ExpenseFormData>({
    resolver: zodResolver(expenseSchema),
    defaultValues: {
      payer: undefined,
      date: "",
      description: "",
      categoryId: "",
    },
  });

  const { categories, loadingCategories, categoriesError } = useCategories();

  const [categoryId, setCategoryId] = useState("");

  async function onSubmit(data: ExpenseFormData) {
    await addExpense({
      ...data,
      categoryId,
      description: data.description ?? "",
    });
    setCategoryId("");
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
          {errors.payer && <p role="alert">{errors.payer.message}</p>}
        </label>

        <br />

        <label htmlFor="categoryId">Category:</label>
        <select
          id="categoryId"
          {...register("categoryId")}
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
        {loadingCategories && <p>Loading categories...</p>}
        {categoriesError && <p role="alert">{categoriesError}</p>}

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
