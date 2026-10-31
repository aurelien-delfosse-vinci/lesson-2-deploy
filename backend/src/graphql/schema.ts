
import { createSchema } from "graphql-yoga";
import { ExpensesService } from "../../services/expenses.service.ts";
import { UsersService } from "../../services/users.service.ts";
import { CategoriesService } from "../../services/categories.service.ts";
import type { Expense } from "../../types/expense.ts";

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
  `,
  resolvers: {
  Expense: {
    date: (expense: Expense) => new Date(expense.date).toISOString(),
  },
  Query: {
    expenses: (_parent, args) =>
      ExpensesService.getExpenses(args.filter ?? {}),

    expense: (_parent, args) =>
      ExpensesService.getExpenseById(args.id),

    users: () => UsersService.getUsers(),

    categories: () => CategoriesService.getCategories(),
  },
},
});
