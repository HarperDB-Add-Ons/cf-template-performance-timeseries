'use strict'

const pm2 = require('pm2')

async function reset(update) {
  await stopTraining.apply(this)
  await dropSchema.apply(this)

  const message = 'The Performance setup has been reset'
  this.logger.notify(message)
  return { success: true, message }
}

async function stopTraining() {
  await new Promise((r) => pm2.connect(r))
  const list = await new Promise((r) => pm2.list((error, list) => r(list)))
  const isRunning = list.some((a) => a.name === this.performanceScriptSlug)
  if (isRunning) {
    this.logger.notify(`The Performance Script is stopping.`)
    await new Promise((r) => pm2.delete(this.performanceScriptSlug, r))
    this.logger.notify(`The Performance Script has been stopped.`)
  }
}

async function dropSchema() {
  let already = ''
  this.logger.notify(`Checking for Performance schema ${this.schema}.`)
  try {
    await this.hdbCore.requestWithoutAuthentication({
      body: {
        operation: 'drop_schema',
        schema: this.schema,
      },
    })
  } catch (error) {
    already = 'alread '
  }
  this.logger.notify(`Performance schema ${this.schema} has ${already}been dropped.`)
}

module.exports = reset
