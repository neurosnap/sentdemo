COMMITHASH=$(shell git rev-parse --short HEAD)

install:
	go get ./...
	npm install

browserify:
	browserify -t [ babelify --presets [ es2015 ] --plugins [ transform-object-assign syntax-object-rest-spread babel-plugin-transform-object-rest-spread ] ] index.js -o ./static/index.js

watch:
	./node_modules/.bin/watchify -t [ babelify --presets [ es2015 ] ] -p browserify-hmr index.js -o ./static/index.js &
	./node_modules/.bin/http-server -c 1 -a localhost &
	wait

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
