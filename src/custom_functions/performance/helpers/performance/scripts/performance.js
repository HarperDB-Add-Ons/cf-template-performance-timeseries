/*
  Performance Script
  check CPU and Memory usage every second
  every Minute, 5 Minutes, Hour
  insert the average into the performance table
 */

const os = require('os')

async function main() {
  const history = []
  const MINUTE = 60
  const FIVE_MINUTES = 300
  const HOUR = 3600
  const ranges = [MINUTE, FIVE_MINUTES, HOUR]
  const maxRange = Math.max(...ranges)
  while (true) {
    const fremen = os.freemem() / os.totalmem()
    const memUsage = 1 - fremen
    const cpus = os.cpus()
    const totalCpu = cpus.reduce((a, v) => a + v.times.user + v.times.nice + v.times.sys + v.times.idle, 0)
    const idleCpu = cpus.reduce((a, v) => a + v.times.idle, 0)
    const cpuUsage = 1 - idleCpu / totalCpu
    const performance = { memUsage, cpuUsage }
    history.push(performance)
    // check all time ranges
    // whenever one is met, create an average and insert it
    for (const range of ranges) {
      if (history.length % range === 0) {
        const cpuUsage = history.slice(-range).reduce((a, v) => a + v.cpuUsage, 0) / range
        const memUsage = history.slice(-range).reduce((a, v) => a + v.memUsage, 0) / range
        const average = { cpuUsage, memUsage, range }
        process.send({
          type: 'process:msg',
          data: { average },
        })
      }
    }
    // whenever there's 2x the maxRange of history, chop it in half
    if (history.length === maxRange * 2) {
      history.splice(maxRange, maxRange)
    }
    await new Promise((r) => setTimeout(r, 1000))
  }
}

main()
