import { config } from 'dotenv'
import { z } from 'zod'

if (process.env.NODE_ENV === 'test') {
  config({ path: '.env.test' })
} else {
  config()
}

// Acessar as variaveis
const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']).default('production'),
  DATABASE_CLIENT: z.enum(['sqlite', 'pg']).default('sqlite'),
  DATABASE_URL: z.string(),
  PORT: z.coerce.number().default(3333), // coerce convert variable type
})

// faz validação
const _env = envSchema.safeParse(process.env)

if (_env.success === false) {
  console.error('😥Invalid enviroment variables!', _env.error.format())

  throw new Error('Invalid environment variables')
}

export const env = _env.data
