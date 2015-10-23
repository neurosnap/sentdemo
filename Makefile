
browserify:
	browserify -t babelify index.js -o ./public/js/index.js

build:
	go build
