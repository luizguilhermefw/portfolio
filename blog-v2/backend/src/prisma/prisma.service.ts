import { Injectable, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient } from '../generated/prisma/client.js';
import { PrismaMariaDb } from '@prisma/adapter-mariadb';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleDestroy {
  constructor() {
    super({ adapter: new PrismaMariaDb(mysqlConnectionConfig()) });
  }

  // Prisma connects lazily on the first query so liveness needs no database.
  async onModuleDestroy(): Promise<void> {
    await this.$disconnect();
  }
}

function mysqlConnectionConfig(): string | { timezone: string } {
  if (!process.env.DATABASE_URL) return { timezone: '+00:00' };
  try {
    const url = new URL(process.env.DATABASE_URL);
    if (url.protocol !== 'mysql:') throw new Error();
    // MySQL DATETIME has no timezone; use UTC consistently in the driver.
    url.searchParams.set('timezone', '+00:00');
    return url.toString();
  } catch {
    throw new Error('DATABASE_URL deve ser uma URL MySQL válida');
  }
}
