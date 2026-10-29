#!/usr/bin/env -S node
import type { Contract as End } from '../../snapshots/87659713d6f2c51f7eb085d403b2dafacc651590d041d2d8457c0373b27b662f/contract';
import endContract from '../../snapshots/87659713d6f2c51f7eb085d403b2dafacc651590d041d2d8457c0373b27b662f/contract.json' with { type: 'json' };
import type { Contract as Start } from '../../snapshots/b31c0cdda34f8a3007f23ad411cab149d371c3b906002268192171b765904468/contract';
import startContract from '../../snapshots/b31c0cdda34f8a3007f23ad411cab149d371c3b906002268192171b765904468/contract.json' with { type: 'json' };
import { Migration, MigrationCLI, col, primaryKey } from '@prisma/orm-postgres/migration';

export default class M extends Migration<Start, End> {
  override readonly startContractJson = startContract;
  override readonly endContractJson = endContract;

  override get operations() {
    return [
      this.createTable({
        schema: 'public',
        table: 'Category',
        columns: [
          col('colour', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('id', 'SERIAL', { notNull: true, codecRef: { codecId: 'pg/int4@1' } }),
          col('name', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
        ],
        constraints: [primaryKey(['id'])],
      }),
      this.addColumn({
        schema: 'public',
        table: 'Expense',
        column: col('categoryId', 'int4', { codecRef: { codecId: 'pg/int4@1' } }),
      }),
      this.addUnique({
        schema: 'public',
        table: 'Category',
        constraint: 'Category_name_key',
        columns: ['name'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'Expense',
        index: 'Expense_categoryId_idx_15c304f2',
        columns: ['categoryId'],
      }),
      this.addForeignKey({
        schema: 'public',
        table: 'Expense',
        foreignKey: {
          name: 'Expense_categoryId_fkey',
          columns: ['categoryId'],
          references: { schema: 'public', table: 'Category', columns: ['id'] },
        },
      }),
    ];
  }
}

MigrationCLI.run(import.meta.url, M);
