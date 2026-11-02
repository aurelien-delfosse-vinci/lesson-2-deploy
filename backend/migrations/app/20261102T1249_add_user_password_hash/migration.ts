#!/usr/bin/env -S node
import postgres from '@prisma/orm-postgres/runtime';
import type { Contract as Start } from '../../snapshots/87659713d6f2c51f7eb085d403b2dafacc651590d041d2d8457c0373b27b662f/contract';
import startContract from '../../snapshots/87659713d6f2c51f7eb085d403b2dafacc651590d041d2d8457c0373b27b662f/contract.json' with { type: 'json' };
import type { Contract as End } from '../../snapshots/a8d786fe9c7440da3ace055952c0682aeaefdc2e8f181fa1a7abb9612a24cc6c/contract';
import endContract from '../../snapshots/a8d786fe9c7440da3ace055952c0682aeaefdc2e8f181fa1a7abb9612a24cc6c/contract.json' with { type: 'json' };
import { Migration, MigrationCLI, col, placeholder } from '@prisma/orm-postgres/migration';


const {sql: db, contract} = postgres<End>({ contractJson: endContract});

const DEMO_PASSWORD_HASH = '$2b$10$Uz3U4mBwsgUKte9bQKBNX.5LGJjYw1Z9Qvhxzy4gxdZrahpUU9/N2';

export default class M extends Migration<Start, End> {
  override readonly startContractJson = startContract;
  override readonly endContractJson = endContract;

  override get operations() {
    return [
      this.addColumn({
        schema: 'public',
        table: 'User',
        column: col('passwordHash', 'text', { codecRef: { codecId: 'pg/text@1' } }),
      }),
      this.dataTransform(contract, 'backfill-User-passwordHash', {
        check: () => db.public.User.select('id').where((f, fns) => fns.eq(f.passwordHash, null)).limit(1),
        run: () => db.public.User
            .update({ passwordHash: DEMO_PASSWORD_HASH })
            .where((f, fns) => fns.eq(f.passwordHash, null)),
      }),
      this.setNotNull({ schema: 'public', table: 'User', column: 'passwordHash' }),
    ];
  }
}

MigrationCLI.run(import.meta.url, M);
