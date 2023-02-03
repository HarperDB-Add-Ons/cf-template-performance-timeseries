default: dev

dev: down
	docker run \
		-v $(shell pwd)/src:/opt/harperdb/hdb \
		-e HDB_ADMIN_USERNAME=hdbperformance \
		-e HDB_ADMIN_PASSWORD=hdbperformance \
		-e LOG_TO_STDSTREAMS=true \
		-e RUN_IN_FOREGROUND=true \
		-e CUSTOM_FUNCTIONS=true \
		-e SERVER_PORT=9925 \
		-e CUSTOM_FUNCTIONS_PORT=9926 \
		-p 9925:9925 \
		-p 9926:9926 \
		harperdb/harperdb:latest

bash:
	docker run \
		-it \
		-v $(shell pwd)/src:/opt/harperdb/hdb \
		harperdb/harperdb:latest \
		bash

down:
	docker stop $(shell docker ps -q --filter ancestor=harperdb/harperdb ) || exit 0
