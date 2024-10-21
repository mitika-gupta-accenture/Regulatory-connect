'use server';

import { Client } from 'pg';

async function initialiseClient() {
  return new Client({
    user: process.env.PGSQL_USER,
    password: process.env.PGSQL_PASSWORD,
    host: process.env.PGSQL_HOST,
    port: process.env.PGSQL_PORT,
    database: process.env.PGSQL_DATABASE,
    ssl: process.env.HOST !== 'localhost',
  });
}

export const queryConnection = async (query, values) => {
  const client = await initialiseClient();
  await client.connect();
  const result = await client.query(query, values);
  await client.end();
  return result;
};
