import 'dotenv/config'
import { knex as setupKnex, Knex } from 'knex'

// console.log(process.env)

if (!process.env.DATABASE_URL) {
  throw new Error('Database_url env not found')
}

export const config: Knex.Config = {
  client: 'sqlite',
  connection: {
    filename: process.env.DATABASE_URL,
  },
  useNullAsDefault: true,
  migrations: {
    extension: 'ts',
    directory: './db/migration',
  },
}

export const knex = setupKnex(config)
