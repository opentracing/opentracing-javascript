# OpenTracing API for JavaScript

This library is a JavaScript implementation of Open Tracing API. It is intended for use both on the server and in the browser.

[![Build Status][ci-img]][ci] [![Coverage Status][cov-img]][cov]

## Required Reading

To fully understand this platform API, it's helpful to be familiar with the [OpenTracing project](http://opentracing.io) and
[terminology](http://opentracing.io/documentation/pages/spec.html) more specifically.

## Quick Start

Install the package using `npm`:

```bash
npm install --save opentracing
```

### Example

The package contains a example using a naive `MockTracer` implementation. To run the example:

```bash
make example
```

The output should look something like:

```
Spans:
    parent_span - 1521ms
        tag 'custom':'tag value'
        tag 'alpha':'1000'
    child_span - 503ms
        tag 'alpha':'200'
        tag 'beta':'50'
```

### Code snippet

In your JavaScript code, add instrumentation to the operations to be tracked. This is composed primarily of using "spans" around operations of interest and adding log statements to capture useful data relevant to those operations.

```js
var http = require('http');
var opentracing = require('opentracing');

// NOTE: the default OpenTracing tracer does not record any tracing information.
// Replace this line with the tracer implementation of your choice.
var tracer = new opentracing.Tracer();

var span = tracer.startSpan('http_request');
var opts = {
    host : 'example.com',
    method: 'GET',
    port : '80',
    path: '/',
};
http.request(opts, function (res) {
    res.setEncoding('utf8');
    res.on('error', function (err) {
        span.logEvent('request_error', err);
        span.finish();
    });
    res.on('data', function (chunk) {
        span.logEvent('data_received', chunk);
    });
    res.on('end', function(err) {
        span.logEvent('request_end', err);
        span.finish();
    });
}).end();
```

As noted in the source snippet, the default behavior of the `opentracing` package is to act as a "no op" implementation. To capture and make the tracing data actionable, the `tracer` object should be initialized with the OpenTracing implementation of your choice as in the pseudo-code below:

```js
var CustomTracer = require('tracing-implementation-of-your-choice');
var tracer = new CustomTracer();
```

### Usage in the browser

The package contains two bundles built with webpack that can be included using a standard `<script>` tag. The library will be exposed under the global `opentracing` symbol:

* `dist/opentracing-browser.min.js` - minified, no runtime checks
* `dist/opentracing-browser.js` - debug version with runtime checks

### Global tracer

The library also provides a global singleton tracer for convenience. This can be set and accessed via the following:

```javascript
opentracing.initGlobalTracer(new CustomTracer());

var tracer = opentracing.globalTracer();
```

Note: `globalTracer()` returns a wrapper on the actual tracer object. This is done for convenience of use as it ensures that the function will always return a non-null object.  This can be helpful in cases where it is difficult or impossible to know precisely when `initGlobalTracer` is called (for example, when writing a utility library that does not control the initialization process).  For more precise control, individual `Tracer` objects can be used instead of the global tracer.

### Node.js debug version

```javascript
var opentracing = require('opentracing/debug');
```

Requiring `opentracing/debug` will include a version of the library with additional runtime checks that are useful for debugging but not desirable for production use.

## API Documentation

There is a hosted copy of the current generated [ESDoc API Documentation here](https://doc.esdoc.org/github.com/opentracing/opentracing-javascript/).

## Contributing & developer information

See the [OpenTracing website](http://opentracing.io) for general information on contributing to OpenTracing.

The project is built using a `Makefile`. Run:

* `make build` creates the compiled, distributable code
* `make test` runs the tests

## OpenTracing tracer implementations

*This section is intended for developers wishing to* ***implement their own tracers***. *Developers who simply wish to* ***use OpenTracing*** *can safely ignore this information.*

### Custom tracer implementation

Implementations can subclass `opentracing.Trace`, `opentracing.Span`, and the other API classes to build a OpenTracing tracer.

Due to the dynamic nature of JavaScript, implementations can simply implement classes with the same signatures as the OpenTracing classes and use these directly as well (there's no need to subclass).

Lastly, optionally implementations may choose to subclass `opentracing.Trace`, etc. and implement the underscore prefixed methods such as `_addTag` to pick up a bit of common code implemented in the base classes. This is entirely optional.

### API compatibility testing

If `mocha` is being used for unit testing, the `api_compatibility.js` file can be used to test the custom tracer. The file exports a single function that expects as an argument a function that will return a new instance of the tracer.

```javascript
var apiCompatibilityChecks = require('opentracing/test/api_compatibility.js');
apiCompatibilityCheck(function() {
     return new CustomTracer();
});
```

### MockTracer

An minimal example tracer is provided in the `src/mock_tracer` directory of the source code.

  [ci-img]: https://travis-ci.org/opentracing/opentracing-javascript.svg?branch=master
  [cov-img]: https://coveralls.io/repos/github/opentracing/opentracing-javascript/badge.svg?branch=master
  [ci]: https://travis-ci.org/opentracing/opentracing-javascript
  [cov]: https://coveralls.io/github/opentracing/opentracing-javascript?branch=master
