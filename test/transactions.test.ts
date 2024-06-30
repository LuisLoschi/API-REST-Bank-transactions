import { it, expect, beforeAll, afterAll, describe } from 'vitest'
import { app } from '../src/app'
import request from 'supertest'

describe('Transaction routes', () => {
  beforeAll(async () => {
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  it('should be able to create a new transaction', async () => {
    const response = await request(app.server).post('/transactions').send({
      title: 'New Transaction',
      amount: 1000,
      type: 'credit',
    })

    expect(response.statusCode).toEqual(201)
  })
})
