'use strict'

const path = require('path')
const pm2 = require('pm2')

async function start() {
  await new Promise((r) => pm2.connect(r))
  const list = await new Promise((r) => pm2.list((error, list) => r(list)))
  const alreadyRunning = list.some((a) => a.name === this.performanceScriptSlug)
  if (alreadyRunning) {
    this.logger.notify(`The performance script is already running. Stopping.`)
    await new Promise((r) => pm2.delete(this.performanceScriptSlug, r))
    this.logger.notify(`The performance script has been stopped.`)
  }
  const appObject = {
    script: path.join(__dirname, '..', 'scripts', this.performanceScriptFile),
    name: this.performanceScriptSlug,
    exec_mode: 'fork',
    instances: 1,
  }
  this.logger.notify(`Starting performance script.`)
  await new Promise((r) => pm2.start(appObject, r))
  if (!this.pm2Listening) {
    this.pm2Listening = true
    const bus = await new Promise((r) => pm2.launchBus((error, bus) => r(bus)))
    bus.on('process:msg', (packet) => {
      this.hdbCore.requestWithoutAuthentication({
        body: {
          operation: 'insert',
          schema: this.schema,
          table: this.performanceTable,
          records: [packet.data.average],
        },
      })
    })
  }

  this.logger.notify(`Performance script has been started.`)
  return 'Performance script has been started.'
}

module.exports = start
