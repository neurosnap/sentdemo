COMMITHASH=$(shell git rev-parse --short HEAD)

install:
	go get ./...
	npm install

browserify:
	./node_modules/.bin/browserify -t babelify index.js -o ./static/index.js

static: browserify
	sed 's/{{COMMITHASH}}/$(COMMITHASH)/g' ./_index.html > ./index.html
	esc -o static.go static index.html

build: static
	go build

deploy: static
	GOOS=linux GOARCH=amd64 go build -ldflags "-X main.COMMITHASH=$(COMMITHASH)"

	scp ./sentdemo $(SENTDEMO_USER)@$(SENTDEMO_SERVER):$(SENTDEMO_DIR)/sentdemo_new
	scp ./deploy.sh $(SENTDEMO_USER)@$(SENTDEMO_SERVER):$(SENTDEMO_DIR)

	ssh $(SENTDEMO_USER)@$(SENTDEMO_SERVER) chmod u+x $(SENTDEMO_DIR)/deploy.sh
	ssh $(SENTDEMO_USER)@$(SENTDEMO_SERVER) SENTDEMO_DIR=$(SENTDEMO_DIR) $(SENTDEMO_DIR)/deploy.sh
