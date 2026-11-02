import { db } from "./src/prisma/db.ts";
import bcrypt from "bcrypt";

const DEMO_PASSWORD = "topsecret";

async function main() {
  console.log("Starting database population...");

  // 1. Hash the demo password.
  const passwordHash = await bcrypt.hash(DEMO_PASSWORD, 10);

  // 2. Create or retrieve users.
  const bob = await db.orm.public.User.upsert({
    create: {
      name: "Bob",
      email: "bob@example.com",
      bankAccount: "BE001234567890",
      passwordHash,
    },
    update: {
      name: "Bob",
      bankAccount: "BE001234567890",
      passwordHash,
    },
    conflictOn: {
      email: "bob@example.com",
    },
  });

  const alice = await db.orm.public.User.upsert({
    create: {
      name: "Alice",
      email: "alice@example.com",
      bankAccount: "BE009876543210",
      passwordHash,
    },
    update: {
      name: "Alice",
      bankAccount: "BE009876543210",
      passwordHash,
    },
    conflictOn: {
      email: "alice@example.com",
    },
  });

  console.log("Users created or retrieved.");

  // 3. Remove existing data in dependency order.
  await db.orm.public.Participations.where({}).deleteAll();
  await db.orm.public.Transfer.where({}).deleteAll();
  await db.orm.public.Expense.where({}).deleteAll();

  // 4. Create expenses.
  const lunch = await db.orm.public.Expense.create({
    description: "Lunch",
    amount: 24.50,
    date: new Date().toISOString(),
    payerId: bob.id,
  });

  const groceries = await db.orm.public.Expense.create({
    description: "Groceries",
    amount: 52.75,
    date: new Date().toISOString(),
    payerId: alice.id,
  });

  const cinema = await db.orm.public.Expense.create({
    description: "Cinema tickets",
    amount: 30,
    date: new Date().toISOString(),
    payerId: bob.id,
  });

  console.log("Expenses created.");

  // 5. Link users to expenses through the join table.
  await db.orm.public.Participations.createAll([
    { expenseId: lunch.id, userId: bob.id },
    { expenseId: lunch.id, userId: alice.id },
    { expenseId: groceries.id, userId: bob.id },
    { expenseId: groceries.id, userId: alice.id },
    { expenseId: cinema.id, userId: bob.id },
    { expenseId: cinema.id, userId: alice.id },
  ]);

  console.log("Expense participants created.");

  // 6. Create transfers between users.
  await db.orm.public.Transfer.create({
    amount: 12.25,
    date: new Date().toISOString(),
    sourceId: alice.id,
    targetId: bob.id,
  });

  await db.orm.public.Transfer.create({
    amount: 8.50,
    date: new Date().toISOString(),
    sourceId: bob.id,
    targetId: alice.id,
  });

  console.log("Transfers created.");
  console.log("Database population completed.");
}

main().catch((error) => {
  console.error("Database population failed:", error);
  process.exitCode = 1;
});