# Include some variables
include .env

# IMPORTANT : make changes on dependencies (package.json) locally, and then re-build the container

# Build an image made for dev purposes
buildDev:
	docker-compose -f "docker-compose.yml" -f "docker-compose.dev.yml" build

# Build an optimized image of the project, the *.prod.yml fields will override the fields in the other yml file
buildProd:
	docker-compose -f "docker-compose.yml" -f "docker-compose.prod.yml" build

# Start a dev environment with the react project
runDev:
	docker-compose -f "docker-compose.yml" -f "docker-compose.dev.yml" up

# Start a dev environment with the react project
runPreprod:
	docker-compose -f "docker-compose.yml" -f "docker-compose.preprod.yml" up

runTest:
	docker-compose -f "docker-compose.yml" up -d

# Restart the server, keep the db running
serverRestart:
	docker-compose restart server

serverLogs:
	docker-compose logs -f server

# Bash access to the container, warning, the server is still running
bash:
	docker exec -it $(PROJECT_NAME)_server bash

# Similar to npm run test (start the script in package.json) 
test:
	docker exec ${PROJECT_NAME}_server sh -c /usr/app/test.sh

# Start a production image
runProd:
	docker-compose -f "docker-compose.yml" -f "docker-compose.prod.yml" up -d


# Stop the dev runtime, and the prod runtime
stop:
	docker-compose stop
start:
	docker-compose start

# Stop containers and remove them
down:
	-docker-compose -f "docker-compose.yml" -f "docker-compose.prod.yml" down
	-docker-compose -f "docker-compose.yml" down

# Remove every containers and images (the '-' is to say : "ignore errors")
clean:
	-docker-compose -f "docker-compose.yml" -f "docker-compose.preprod.yml" down --rmi 'all'
	-docker-compose -f "docker-compose.yml" -f "docker-compose.prod.yml" down --rmi 'all'
	-docker-compose -f "docker-compose.yml" down --rmi 'all'

.PHONY: buildDev buildProd runDev test runProd stop start clean
