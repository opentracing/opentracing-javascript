# http://stackoverflow.com/questions/3774568/makefile-issue-smart-way-to-scan-directory-tree-for-c-files
recursive_wildcard = $(wildcard $1$2) $(foreach d,$(wildcard $1*),$(call recursive_wildcard,$d/,$2))

CMD_BABEL = node node_modules/babel-cli/bin/babel.js
SOURCES_JS = $(call recursive_wildcard,src/,*.js)
COMPILED_PROD_JS = $(SOURCES_JS:src/%.js=lib/%.js)
COMPILED_DEBUG_JS = $(SOURCES_JS:src/%.js=lib-debug/%.js)
DST_BROWSER = \
	dist/opentracing-browser.js \
	dist/opentracing-browser.min.js

.PHONY: build
build: node_modules build-node build-browser

# Compiles the ES6 source down to ES5 for greater compatibility across versions
# of node.
#
# Also builds a 'lib-debug' version of the library that will do additional
# runtime checks to help diagnose problems.
.PHONY: build-node
build-node: node_modules package.json $(COMPILED_PROD_JS) $(COMPILED_DEBUG_JS)
lib/%.js: src/%.js
	mkdir -p $(@D)
	NODE_ENV=production $(CMD_BABEL) --presets es2015 --plugins transform-node-env-inline-and-fold $< -o $@ --source-maps
lib-debug/%.js: src/%.js
	mkdir -p $(@D)
	$(CMD_BABEL) --presets es2015 $< -o $@ --source-maps

# Use webpack to build a minified production bundle ande debug bundle for the
# browser
.PHONY: build-browser
build-browser: $(DST_BROWSER) webpack.config.js package.json
$(DST_BROWSER): $(SOURCES_JS)
	npm run webpack

node_modules:
	npm install

.PHONY: clean
clean:
	rm -rf node_modules/
	rm -rf lib/ && mkdir lib
	rm -rf lib-debug/ && mkdir lib-debug
	rm -rf dist/apidoc
	rm dist/*

.PHONY: lint
lint:
	node node_modules/eslint/bin/eslint.js --fix --color src

# NOTE: `npm version` automatically creates a git commit and git tag for the
# incremented version
.PHONY: publish
publish: test
	npm version patch
	make build # need to rebuild with the new version number
	git push
	git push --tags
	npm publish

.PHONY: test
test: build
	node node_modules/eslint/bin/eslint.js --color src
	npm test

# A target that runs the unit tests without code coverage testing, as the code
# coverage testing throws off the source code line number information - making
# failures more difficult to debug.
.PHONY: test-no-coverage
test-no-coverage: build
	NODE_ENV=debug node ./node_modules/.bin/_mocha test/unittest.js --check-leaks --color

.PHONY: test-all
test-all: build
	scripts/docker_test.sh latest
	scripts/docker_test.sh 5.8
	scripts/docker_test.sh 4.4
	scripts/docker_test.sh 0.12

.PHONY: example
example: build
	NODE_ENV=debug node ./lib-debug/examples/demo/demo.js
