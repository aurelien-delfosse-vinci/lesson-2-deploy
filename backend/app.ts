import { createYoga } from "graphql-yoga";
import { schema } from "./src/graphql/schema.ts";
import express from 'express';
import logger from 'morgan';
import cors from 'cors';
import expensesRouter from './routes/expenses.router.ts';
import usersRouter from "./routes/users.router.ts";
import categoriesRouter from './routes/categories.router.ts';
import authRouter from "./routes/auths.router.ts";
import { yoga } from "./src/graphql/yoga.ts";

const app = express();

app.use(
  cors({
    origin: [
      'http://localhost:5173',
      /\.onrender\.com$/,
    ],
  })
);

app.use(logger('dev'));
app.use(express.json());

app.get('/ping', (_req, res) => {
  res.sendStatus(204);
});

app.use('/api/expenses', expensesRouter);
app.use('/api/users', usersRouter);
app.use("/api/categories", categoriesRouter);
app.use("/api/auth", authRouter);

const port = Number(process.env.PORT) || 3000;

app.use(yoga.graphqlEndpoint, yoga);

app.use(yoga.graphqlEndpoint, yoga);

app.listen(port, '0.0.0.0', () => {
  console.log(`Server listening on port ${port}`);
});

export default app;
