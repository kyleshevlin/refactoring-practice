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
      return new ComedyCalculator(aPerformance, aPlay)

    case 'tragedy':
      return new TragedyCalculator(aPerformance, aPlay)

    default:
      throw new Error(`Unknown type: ${aPlay.type}`)
  }
}

class PerformanceCalculator {
  constructor(aPerformance, aPlay) {
    this.performance = aPerformance
    this.play = aPlay
  }

  get amount() {
    throw new Error('Subclass must implement amount')
  }

  get volumeCredits() {
    return Math.max(this.performance.audience - 30, 0)
  }
}

class ComedyCalculator extends PerformanceCalculator {
  get amount() {
    const { audience } = this.performance
    let result = 30000

    if (audience > 20) {
      result += 10000 + 500 * (audience - 20)
    }

    result += 300 * audience

    return result
  }

  get volumeCredits() {
    return super.volumeCredits + Math.floor(this.performance.audience / 5)
  }
}

class TragedyCalculator extends PerformanceCalculator {
  get amount() {
    const { audience } = this.performance
    let result = 40000

    if (audience > 30) {
      result += 1000 * (audience - 30)
    }

    return result
  }
}
