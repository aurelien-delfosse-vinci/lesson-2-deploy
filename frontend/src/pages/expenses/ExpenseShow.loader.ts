
import type { LoaderFunctionArgs } from "react-router";
import { graphqlRequest } from "../../lib/graphql";
import type { Expense } from "../../types/Expense";

const EXPENSE_QUERY = /* GraphQL */ `
  query Expense($id: Int!) {
    expense(id: $id) {
      id
      description
      amount
      date
      payer {
        name
        email
        bankAccount
      }
      participants {
        name
        email
      }
      category {
        name
        colour
      }
    }
  }
`;

export async function expenseShowLoader({
  params,
}: LoaderFunctionArgs): Promise<Expense> {
  const data = await graphqlRequest<{
    expense: Expense | null;
  }>(EXPENSE_QUERY, {
    id: Number(params.id),
  });

  if (!data.expense) {
    throw new Response("Expense not found", { status: 404 });
  }

  return data.expense;
}
