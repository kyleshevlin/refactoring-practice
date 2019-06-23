module.exports = function createStatementData(invoice, plays) {
  const { customer, performances } = invoice
  const result = {
    customer,
    performances: performances.map(enrichPerformance)
  }

  result.totalAmount = totalAmount(result)
  result.totalVolumeCredits = totalVolumeCredits(result)

  console.log(JSON.stringify(result, null, 2))

  return result

  function enrichPerformance(aPerformance) {
    const result = { ...aPerformance }

    result.play = playFor(result)
    result.amount = amountFor(result)
    result.volumeCredits = volumeCreditsFor(result)

    return result
  }

  function playFor(aPerformance) {
    return plays[aPerformance.playID]
  }
}

function amountFor(aPerformance) {
  const { audience, play } = aPerformance
  let result = 0

  switch (play.type) {
    case 'comedy':
      result = 30000

      if (audience > 20) {
        result += 10000 + 500 * (audience - 20)
      }

      result += 300 * audience
      break

    case 'tragedy':
      result = 40000

      if (audience > 30) {
        result += 1000 * (audience - 30)
      }
      break

    default:
      throw new Error(`Unknown type: ${play.type}`)
  }

  return result
}

function volumeCreditsFor(aPerformance) {
  const { audience, play } = aPerformance
  let result = 0

  result += Math.max(audience - 30, 0)

  if ('comedy' === play.type) {
    result += Math.floor(audience / 5)
  }

  return result
}

function totalAmount(data) {
  return data.performances.reduce((sum, perf) => sum + perf.amount, 0)
}

function totalVolumeCredits(data) {
  return data.performances.reduce((sum, perf) => sum + perf.volumeCredits, 0)
}
