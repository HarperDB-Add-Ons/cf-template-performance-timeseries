'use strict'

// Standard Normal variate using Box-Muller transform.
// https://stackoverflow.com/questions/25582882/javascript-math-random-normal-distribution-gaussian-bell-curve/39187274#39187274
function randn_bm() {
  const min = 0
  const max = 100
  const skew = 1
  let u = 0,
    v = 0
  while (u === 0) u = Math.random() //Converting [0,1) to (0,1)
  while (v === 0) v = Math.random()
  let num = Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v)

  num = num / 10.0 + 0.5 // Translate to 0 -> 1
  if (num > 1 || num < 0) num = randn_bm(min, max, skew) // resample between 0 and 1 if out of range
  else {
    num = Math.pow(num, skew) // Skew
    num *= max - min // Stretch to fill range
    num += min // offset to min
  }
  return num / 100
}

async function backfill() {
  const nUnits = 60 * 20 // 20 hours
  const cpuUsage = new Array(nUnits).fill().map(randn_bm)
  const memUsage = new Array(nUnits).fill().map(randn_bm)
  const performance = new Array(nUnits).fill().map((v, i) => ({ cpuUsage: cpuUsage[i], memUsage: memUsage[i] }))
  await this.hdbCore.requestWithoutAuthentication({
    body: {
      operation: 'insert',
      schema: this.schema,
      table: this.performanceTable,
      records: performance,
    },
  })

  const message = 'Performance data has been backfilled'
  this.logger.notify(message)
  return { success: true, message }
}

module.exports = backfill
