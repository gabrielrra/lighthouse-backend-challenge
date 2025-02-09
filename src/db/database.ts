import { drizzle } from 'drizzle-orm/libsql';
import { createClient } from '@libsql/client';
import * as schema from '../db/schema';
import dotenv from 'dotenv';

dotenv.config({ path: process.env.NODE_ENV === 'test' ? '.env.test' : '.env' });
const client = createClient({
  url: process.env.DB_URL!,
});

export const db = drizzle(client, { schema });
