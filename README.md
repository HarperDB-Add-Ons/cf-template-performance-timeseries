# HarperDB Performace Time Series
This is a HarperDB Custom Function that tracks the performance (CPU and Memory Usage) of the node.

## Setup
`curl http://localhost:9926/performance/setup`
This will create the schema for the project.
## Start
`curl http://localhost:9926/performance/start`
This will start the performance monitoring script. (**note**: setup must be ran first).
## Graph
`curl http://localhost:9926/performance/graphs`
This will show graphs of the recent performance history.
## Reset
`curl http://localhost:9926/performance/reset`
This will remove the schema and delete all of the performance data.
