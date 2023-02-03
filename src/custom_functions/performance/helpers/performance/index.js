'use strict'

const setup = require('./methods/setup')
const reset = require('./methods/reset')
const start = require('./methods/start')
const backfill = require('./methods/backfill')
const aggregate = require('./methods/aggregate')

class Performance {
  constructor(hdbCore, logger) {
    this.hdbCore = hdbCore
    this.logger = logger

    this.schema = 'hdb_performance'
    this.performanceScriptFile = 'performance.js'
    this.performanceScriptSlug = 'performanceScript'
    this.performanceTable = 'performance'
    this.tables = [this.performanceTable]
    this.pm2Listening = false
  }
}

Performance.prototype.setup = setup
Performance.prototype.reset = reset
Performance.prototype.start = start
Performance.prototype.backfill = backfill
Performance.prototype.aggregate = aggregate

module.exports = Performance
