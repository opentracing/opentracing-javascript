.PHONY: build publish test

DST_FILES = \
	dist/opentracing-node-debug.js \
	dist/opentracing-node.js \
	dist/opentracing-browser.js \
	dist/opentracing-browser.min.js
SRC_FILES = $(shell find src/ -type f) \
	webpack.config.js \
	package.json

build: $(DST_FILES)
$(DST_FILES) : node_modules $(SRC_FILES)
	npm run webpack

node_modules:
	npm install

# NOTE: `npm version` automatically creates a git commit ang git tag for the
# incremented version
publish: test
	npm version patch
	make build # need to rebuild with the new version number
	git push
	git push --tags
	npm publish

test: build
	npm test
