import { knex as setupKnex, Knex } from 'knex'
import { env } from './env'

// console.log(process.env)

const verifySqliteOrPostgreesConnection =
  env.DATABASE_CLIENT === 'sqlite'
    ? { filename: env.DATABASE_URL }
    : env.DATABASE_URL

export const config: Knex.Config = {
  client: env.DATABASE_CLIENT,
  connection: verifySqliteOrPostgreesConnection,
  useNullAsDefault: true,
  migrations: {
    extension: 'ts',
    directory: './db/migration',
  },
}

export const knex = setupKnex(config)
