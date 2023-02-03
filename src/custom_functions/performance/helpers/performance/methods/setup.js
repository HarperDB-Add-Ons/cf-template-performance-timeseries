'use strict'

async function setup(update) {
  await createSchema.apply(this)

  const message = 'Performance setup complete'
  this.logger.notify(message)
  return { success: true, message }
}

async function createSchema() {
  let already = 'already '
  this.logger.notify(`Checking for Performance schema ${this.schema}.`)
  try {
    await this.hdbCore.requestWithoutAuthentication({
      body: {
        operation: 'describe_schema',
        schema: this.schema,
      },
    })
  } catch (error) {
    already = ''
    this.logger.notify(`Performance schema does not exist. Creating ${this.schema} schema.`)
    await this.hdbCore.requestWithoutAuthentication({
      body: {
        operation: 'create_schema',
        schema: this.schema,
      },
    })
  }
  this.logger.notify(`Performance schema ${this.schema} ${already}created.`)

  for (let table of this.tables) {
    already = 'already '
    this.logger.notify(`Checking for Performance table ${this.schema}.${table}.`)
    try {
      await this.hdbCore.requestWithoutAuthentication({
        body: {
          operation: 'describe_table',
          schema: this.schema,
          table,
        },
      })
    } catch (error) {
      already = ''
      this.logger.notify(`Performance table does not exist. Creating ${this.schema}.${table}.`)
      await this.hdbCore.requestWithoutAuthentication({
        body: {
          operation: 'create_table',
          schema: this.schema,
          table,
          hash_attribute: 'id',
        },
      })
    }
    this.logger.notify(`Performance table ${this.schema}.${table} ${already}created.`)
  }
}

module.exports = setup
