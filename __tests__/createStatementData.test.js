const createStatementData = require('../src/createStatementData')
const invoices = require('../data/invoices.json')
const plays = require('../data/plays.json')

test('createStatementData', () => {
  const expected = {
    customer: 'BigCo',
    performances: [
      {
        playID: 'hamlet',
        audience: 55,
        play: {
          name: 'Hamlet',
          type: 'tragedy'
        },
        amount: 65000,
        volumeCredits: 25
      },
      {
        playID: 'as-like',
        audience: 35,
        play: {
          name: 'As You Like It',
          type: 'comedy'
        },
        amount: 58000,
        volumeCredits: 12
      },
      {
        playID: 'othello',
        audience: 40,
        play: {
          name: 'Othello',
          type: 'tragedy'
        },
        amount: 50000,
        volumeCredits: 10
      }
    ],
    totalAmount: 173000,
    totalVolumeCredits: 47
  }

  expect(createStatementData(invoices[0], plays)).toEqual(expected)
})
