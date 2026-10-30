import type { LoaderFunctionArgs } from "react-router";
import type { Expense } from "../../types/Expense";
import { apiRequest } from "../../lib/rest";

export async function expenseShowLoader({
  params,
}: LoaderFunctionArgs): Promise<Expense> {
  return apiRequest<Expense>(`/api/expenses/${params.id}`);
}