
browserify:
	browserify -t [ babelify --stage 0 ] index.js -o ./public/index.js

build:
	go build
