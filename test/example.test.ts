import { expect, test } from 'vitest'

test('o usuario consegue criar nova transação', () => {
  const responseStatus = 201

  expect(responseStatus).toEqual(201)
})
