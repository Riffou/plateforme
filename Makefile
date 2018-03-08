PROJECT=plateforme

# Build an image made for dev purposes
buildDev:
	docker build -t $(PROJECT):dev -f ./Dockerfile-dev .

# Build an optimized image of the project
buildProd:
	docker build -t $(PROJECT):prod -f ./Dockerfile-prod .

# Start a dev environment with the react project
runDev:
	docker run -d \
	-v $(PWD)/src:/usr/app/src \
	-v $(PWD)/test:/usr/app/test \
	-v $(PWD)/coverage:/usr/app/coverage \
	-v $(PWD)/package.json:/usr/app/package.json \
	--name $(PROJECT) -p 80:3000 $(PROJECT):dev

# Preferable to runDev during development, to start / stop the server when wanted
bash:
	-docker stop $(PROJECT)
	-docker rm $(PROJECT)
	docker run -it --entrypoint=bash \
	-v $(PWD)/src:/usr/app/src \
	-v $(PWD)/test:/usr/app/test \
	-v $(PWD)/coverage:/usr/app/coverage \
	-v $(PWD)/package.json:/usr/app/package.json \
	--name $(PROJECT) -p 80:3000 $(PROJECT):dev

# Similar to npm run test (start the script in package.json)
test:
	docker exec --interactive --tty $(PROJECT) sh -c /usr/app/test.sh

# Start a production image
runProd:
	docker run -d -p 80:3000 --name $(PROJECT) $(PROJECT):prod


# Stop the dev runtime, and the prod runtime
stop:
	-docker container stop $(PROJECT) && docker container rm -v $(PROJECT)

# Remove every images (the '-' is to say : "ignore errors")
clean: stop
	-docker rmi -f $(PROJECT):dev
	-docker rmi -f $(PROJECT):prod

.PHONY: buildDev buildProd runDev test runProd stop
