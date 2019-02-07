COMMITHASH=$(shell git rev-parse --short HEAD)

install:
	go get ./...
	yarn

browserify:
	./node_modules/.bin/browserify -t babelify index.js -o ./static/index.js

static: browserify
	sed 's/{{COMMITHASH}}/$(COMMITHASH)/g' ./_index.html > ./static/index.html

build: static
	go build

deploy: static
	GOOS=linux GOARCH=amd64 go build -ldflags "-X main.COMMITHASH=$(COMMITHASH)"
