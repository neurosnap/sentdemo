
browserify:
	browserify -t babelify index.js -o ./public/index.js

build:
	go build
