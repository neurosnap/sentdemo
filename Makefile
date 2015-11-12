
install:
	go get ./...
	npm install

browserify:
	browserify -t [ babelify --stage 0 ] index.js -o ./static/index.js

static: browserify
	esc -o static.go static index.html

build: static
	go build

deploy: static
	export GOOS=linux
	export GOARCH=amd64
	go build

	scp ./sentdemo $(SENTDEMO_USER)@$(SENTDEMO_SERVER):$(SENTDEMO_DIR)/sentdemo_new
	scp ./deploy.sh $(SENTDEMO_USER)@$(SENTDEMO_SERVER):$(SENTDEMO_DIR)

	ssh $(SENTDEMO_USER)@$(SENTDEMO_SERVER) chmod u+x $(SENTDEMO_DIR)/deploy.sh
	ssh $(SENTDEMO_USER)@$(SENTDEMO_SERVER) SENTDEMO_DIR=$(SENTDEMO_DIR) $(SENTDEMO_DIR)/deploy.sh
