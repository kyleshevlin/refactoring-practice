const statement = require('../src/statement')
const invoices = require('../data/invoices.json')
const plays = require('../data/plays.json')

test('statement', () => {
  const expected = `Statement for BigCo
  Hamlet: $650.00 (55 seats)
  As You Like It: $580.00 (35 seats)
  Othello: $500.00 (40 seats)
Amount owed is $1,730.00
You earned 47 credits
`
  expect(statement(invoices[0], plays)).toEqual(expected)
})
