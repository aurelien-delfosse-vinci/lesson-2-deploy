import { createSchema } from "graphql-yoga";
import { ExpensesService } from "../../services/expenses.service.ts";
import { UsersService } from "../../services/users.service.ts";
import { CategoriesService } from "../../services/categories.service.ts";
import type { Expense } from "../../types/expense.ts";
import { GraphQLError } from "graphql";
import { parseNewExpense } from "../../types/expense.ts";

export const schema = createSchema({
  typeDefs: /* GraphQL */ `
    type User {
      id: Int!
      name: String!
      email: String!
      bankAccount: String
    }

    type Category {
      id: Int!
      name: String!
      colour: String!
    }

    type Expense {
      id: Int!
      description: String!
      amount: Float!
      date: String!
      payer: User!
      participants: [User!]!
      category: Category
    }

    input ExpenseFilter {
      amount: Float
      payerId: Int
      categoryId: Int
    }

    type Query {
      expenses(filter: ExpenseFilter): [Expense!]!
      expense(id: Int!): Expense
      users: [User!]!
      categories: [Category!]!
    }

    input CreateExpenseInput {
      description: String!
      amount: Float!
      date: String!
      payerId: Int!
      participants: [Int!]!
      categoryId: Int
    }

    type Mutation {
      createExpense(input: CreateExpenseInput!): Expense!
    }
  `,
  resolvers: {
    Expense: {
      date: (expense: Expense) => new Date(expense.date).toISOString(),
    },
    Query: {
      expenses: (_parent, args) =>
        ExpensesService.getExpenses(args.filter ?? {}),

      expense: (_parent, args) => ExpensesService.getExpenseById(args.id),

      users: () => UsersService.getUsers(),

      categories: () => CategoriesService.getCategories(),
    },
    Mutation: {
      createExpense: (_parent, args) => {
        const newExpense = parseNewExpense(args.input);

        if (newExpense === false) {
          throw new GraphQLError("Invalid expense");
        }

        return ExpensesService.addExpense(newExpense);
      },
    },
  },
});
