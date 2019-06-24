module.exports = function createStatementData(invoice, plays) {
  const { customer, performances } = invoice
  const result = {
    customer,
    performances: performances.map(enrichPerformance)
  }

  result.totalAmount = totalAmount(result)
  result.totalVolumeCredits = totalVolumeCredits(result)

  return result

  function enrichPerformance(aPerformance) {
    const calculator = createPerformanceCalculator(
      aPerformance,
      playFor(aPerformance)
    )
    const result = { ...aPerformance }

    result.play = calculator.play
    result.amount = calculator.amount
    result.volumeCredits = calculator.volumeCredits

    return result
  }

  function playFor(aPerformance) {
    return plays[aPerformance.playID]
  }
}

function totalAmount(data) {
  return data.performances.reduce((sum, perf) => sum + perf.amount, 0)
}

function totalVolumeCredits(data) {
  return data.performances.reduce((sum, perf) => sum + perf.volumeCredits, 0)
}

function createPerformanceCalculator(aPerformance, aPlay) {
  switch (aPlay.type) {
    case 'comedy':
      return comedyCalculatorFactory(aPerformance, aPlay)

    case 'tragedy':
      return tragedyCalculatorFactory(aPerformance, aPlay)

    default:
      throw new Error(`Unknown type: ${aPlay.type}`)
  }
}

function calculatorFactory(amountFn, volumeCreditsFn) {
  return (performance, play) => ({
    performance,
    play,
    get amount() {
      return amountFn(this.performance.audience)
    },
    get volumeCredits() {
      return volumeCreditsFn(this.performance.audience)
    }
  })
}

const comedyCalculatorFactory = calculatorFactory(
  comedyAmount,
  comedyVolumeCredits
)
const tragedyCalculatorFactory = calculatorFactory(
  tragedyAmount,
  standardVolumeCredits
)

function standardVolumeCredits(audience) {
  return Math.max(audience - 30, 0)
}

function comedyAmount(audience) {
  let result = 30000

  if (audience > 20) {
    result += 10000 + 500 * (audience - 20)
  }

  result += 300 * audience

  return result
}

function comedyVolumeCredits(audience) {
  return standardVolumeCredits(audience) + Math.floor(audience / 5)
}

function tragedyAmount(audience) {
  let result = 40000

  if (audience > 30) {
    result += 1000 * (audience - 30)
  }

  return result
}
