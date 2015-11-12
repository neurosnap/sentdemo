
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
	ssh $(SENTDEMO_USER)@$(SENTDEMO_SERVER) supervisorctl stop sentdemo
	scp ./sentdemo $(SENTDEMO_USER)@$(SENTDEMO_SERVER):/srv/sites/sentdemo
	ssh $(SENTDEMO_USER)@$(SENTDEMO_SERVER) supervisorctl start sentdemo
