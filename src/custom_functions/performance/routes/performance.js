'use strict'

const Performance = require('../helpers/performance')
const fastifyStatic = require('fastify-static')
const path = require('path')

module.exports = async (server, { hdbCore, logger }) => {
  const performance = new Performance(hdbCore, logger)

  // restarts the CF server
  server.route({
    url: '/cf-reload',
    method: 'GET',
    handler: async (request) => {
      const response = await hdbCore.requestWithoutAuthentication({
        body: {
          operation: 'restart_service',
          service: 'custom_functions',
        },
      })
      return response
    },
  })

  // adds 20 hours of generated data
  server.route({
    url: '/backfill',
    method: 'GET',
    handler: async (request) => {
      return performance.backfill()
    },
  })

  // setup the schema and generate data
  server.route({
    url: '/setup',
    method: 'GET',
    handler: async (request) => {
      return performance.setup()
    },
  })

  // reset the schema and data
  server.route({
    url: '/reset',
    method: 'GET',
    handler: async (request) => {
      return performance.reset()
    },
  })

  // start the aggregation script
  server.route({
    url: '/start',
    method: 'GET',
    handler: async (request) => {
      return performance.start()
    },
  })

  // get an aggregate
  server.route({
    url: '/:timeDimension/:timeAmount',
    method: 'GET',
    handler: async (request) => {
      const { timeDimension, timeAmount } = request.params
      return await performance.aggregate(timeDimension, parseInt(timeAmount))
    },
  })

  server.register(fastifyStatic, {
    root: path.join(__dirname, '../ui'),
    prefix: '/graph',
    prefixAvoidTrailingSlash: true,
    decorateReply: false,
  })
}
