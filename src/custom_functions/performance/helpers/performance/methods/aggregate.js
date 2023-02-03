'use strict'

async function aggregate(dimension, amount) {
  const dimensions = {
    minutes: 1,
    hours: 60,
  }
  if (!Object.keys(dimensions).includes(dimension)) {
    return 'Valid time dimensions are: ' + Object.keys(dimensions).join(', ')
  }
  if (amount < 1 || amount > 59 || Math.round(amount) !== amount) {
    return 'Valid time amounts are integers between 1 and 59'
  }
  const dimensionalSkip = dimensions[dimension]
  const displayUnits = 10
  const limit = dimensionalSkip * amount * displayUnits
  const results = await this.hdbCore.requestWithoutAuthentication({
    body: {
      operation: 'sql',
      sql: 'SELECT * FROM hdb_performance.performance ORDER BY __createdtime__ DESC LIMIT ' + limit,
    },
  })
  const aggregates = []
  for (let i = 0; i < results.length; i += dimensionalSkip * amount) {
    const performance = { cpuUsage: null, memUsage: null }
    const resultsWindow = results.slice(i, i + dimensionalSkip * amount)
    for (const key in performance) {
      performance[key] = resultsWindow.reduce((a, v) => a + v[key], 0) / dimensionalSkip
    }
    aggregates.push(performance)
  }

  return aggregates
}

module.exports = aggregate
