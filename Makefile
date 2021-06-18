COMMITHASH=$(shell git rev-parse --short HEAD)

install:
	go get ./...
.PHONY: install

static:
	sed 's/{{ COMMITHASH }}/$(COMMITHASH)/g' ./_index.html > ./static/index.html
.PHONY: static

build: static
	go build
.PHONY: build

deploy: static
	gcloud --project ${PROJECT_ID} app deploy app.yml
.PHONY: deploy
