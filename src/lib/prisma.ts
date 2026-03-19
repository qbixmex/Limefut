import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '../generated/prisma/client';

let databaseUrl = '';

if (process.env.DATABASE_URL === null) {
  throw new Error(
    'DATABASE_URL is not present !, \n' +
    'be sure is in the environment variables',
  );
} else {
  databaseUrl = process.env.DATABASE_URL;
}

const adapter = new PrismaPg({ connectionString: databaseUrl });
const globalForPrisma = global as unknown as { prisma: PrismaClient };
export const prisma = globalForPrisma.prisma || new PrismaClient({ adapter });

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;

export default prisma;
