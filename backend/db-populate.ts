
import { readFile } from 'node:fs/promises';
import { db } from './src/prisma/db.ts';


interface ExpenseFromJson {
  id: string;
  date: string;
  description: string;
  payer: string;
  amount: number;
}

async function main() {
  const json = await readFile('./data/expenses.json', 'utf8');
  const expenses: ExpenseFromJson[] = JSON.parse(json);

  const rows = expenses.map(
    ({ date, description, payer, amount }) => ({
      date,
      description,
      payer,
      amount,
    }),
  );

  const created = await db.orm.public.Expense.createAll(rows);

  console.log(`${created.length} dépenses créées.`);
  console.log(created);
}

main()
  .then(() => process.exit(0))
  .catch((e) => {
    console.error(e);
    process.exit(1);
  });
