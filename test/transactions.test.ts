import { it, expect, beforeAll, afterAll, describe, beforeEach } from 'vitest'
import { app } from '../src/app'
import request from 'supertest'
import { execSync } from 'child_process'

describe('Transaction routes', () => {
  beforeAll(async () => {
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  beforeEach(() => {
    execSync('knex migrate:rollback --all')
    execSync('knex migrate:latest')
  })

  it('should be able to create a new transaction', async () => {
    const response = await request(app.server).post('/transactions').send({
      title: 'New Transaction',
      amount: 1000,
      type: 'credit',
    })

    expect(response.statusCode).toEqual(201)
  })

  it('should be able to list all transactions', async () => {
    const createTransactionResponse = await request(app.server)
      .post('/transactions')
      .send({
        title: 'New Transaction',
        amount: 1000,
        type: 'credit',
      })

    const cookies = createTransactionResponse.get('Set-Cookie')

    const response = await request(app.server)
      .get('/transactions')
      .set('Cookie', cookies || [])

    expect(response.statusCode).toEqual(200)

    expect(response.body.transactions).toEqual([
      expect.objectContaining({
        title: 'New Transaction',
        amount: 1000,
      }),
    ])
  })

  it('should be able to get specific transaction', async () => {
    const createTransactionResponse = await request(app.server)
      .post('/transactions')
      .send({
        title: 'New Transaction',
        amount: 1000,
        type: 'credit',
      })

    const cookies = createTransactionResponse.get('Set-Cookie')

    const listTransactionResponse = await request(app.server)
      .get('/transactions')
      .set('Cookie', cookies || [])

    expect(listTransactionResponse.statusCode).toEqual(200)

    const transactionId = listTransactionResponse.body.transactions[0].id

    const getTransactionResponse = await request(app.server)
      .get(`/transactions/${transactionId}`)
      .set('Cookie', cookies || [])
      .expect(200)

    expect(getTransactionResponse.body.transactions).toEqual(
      expect.objectContaining({
        title: 'New Transaction',
        amount: 1000,
      }),
    )
  })

  it('should be able to get the summary of the transactions', async () => {
    const createTransactionResponse = await request(app.server)
      .post('/transactions')
      .send({
        title: 'Credit Transaction',
        amount: 2000,
        type: 'credit',
      })

    const cookies = createTransactionResponse.get('Set-Cookie')

    await request(app.server)
      .post('/transactions')
      .set('Cookie', cookies || [])
      .send({
        title: 'Debit Transaction',
        amount: 500,
        type: 'debit',
      })

    const summaryResponse = await request(app.server)
      .get('/transactions/summary')
      .set('Cookie', cookies || [])
      .expect(200)

    expect(summaryResponse.body.summary).toEqual({
      amount: 1500,
    })
  })
})
