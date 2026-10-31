import { useNavigate } from "react-router";
import ExpenseAdd from "../../components/ExpenseAdd";
import { graphqlRequest } from "../../lib/graphql";
import type { NewExpenseInput } from "../../types/Expense";

const CREATE_EXPENSE = /* GraphQL */ `
  mutation CreateExpense($input: CreateExpenseInput!) {
    createExpense(input: $input) {
      id
    }
  }
`;

function ExpenseNew() {
  const navigate = useNavigate();

  const createExpense = async (expense: NewExpenseInput) => {
    try {
      console.log("Données envoyées :", expense);

      const result = await graphqlRequest(CREATE_EXPENSE, {
        input: expense,
      });

      console.log("Réponse du serveur :", result);

      navigate("/expenses");
    } catch (error) {
      console.error("Erreur de création :", error);
    }
  };

  return <ExpenseAdd addExpense={createExpense} />;
}

export default ExpenseNew;