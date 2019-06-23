const createStatementData = require('./createStatementData')

function statement(invoice, plays) {
  return renderPlainText(createStatementData(invoice, plays))
}

function renderPlainText(data) {
  let result = `Statement for ${data.customer}\n`

  data.performances.forEach(perf => {
    // print line for performance
    result += `  ${perf.play.name}: ${usd(perf.amount)} (${
      perf.audience
    } seats)\n`
  })

  result += `Amount owed is ${usd(data.totalAmount)}\n`
  result += `You earned ${data.totalVolumeCredits} credits\n`

  return result
}

function htmlStatement(invoice, plays) {
  return renderHTML(createStatementData(invoice, plays))
}

function renderHTML(data) {
  let result = `<h1>Statement for ${data.customer}</h1>\n`
  result += '<table>\n'
  result += '<tr><th>Play</th><th>Seats</th><th>Cost</th></tr>\n'

  data.performances.forEach(perf => {
    result += '<tr>'
    result += `<td>${perf.play.name}</td>`
    result += `<td>${perf.audience}</td>`
    result += `<td>${usd(perf.amount)}</td>`
    result += '</tr>\n'
  })

  result += '</table>\n'
  result += `<p>Amount owed is <em>${usd(data.totalAmount)}</em></p>\n`
  result += `<p>You earned <em>${data.totalVolumeCredits}</em> credits</p>\n`

  return result
}

function usd(aNumber) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2
  }).format(aNumber / 100)
}

exports.statement = statement
exports.htmlStatement = htmlStatement
