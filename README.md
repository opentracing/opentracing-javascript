# OpenTracing API for JavaScript

This library is a JavaScript implementation of Open Tracing API. It is intended for use both on the server and in the browser.

[![Build Status][ci-img]][ci] [![Coverage Status][cov-img]][cov]

## Required Reading

To fully understand this platform API, it's helpful to be familiar with the [OpenTracing project](http://opentracing.io) and
[terminology](http://opentracing.io/spec/) more generally.

## Quick Start

Install the package using `npm`:

```bash
npm install --save opentracing
```

In your JavaScript code, add instrumentation to the operations to be tracked. This is composed primarily of using "spans" around operations of interest and adding log statements to capture useful data relevant to those operations.

```js
var http = require('http');
var Tracer = require('opentracing');

var span = Tracer.startSpan('http_request');
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

The default behavior of the `opentracing` package is to act as a "no-op" implementation.

To capture and make the tracing data actionable, the `Tracer` object should be initialized with the OpenTracing implementation of your choice as in the pseudo-code below:

```js
var Tracer = require('opentracing');
var TracingBackend = require('tracing-implementation-of-your-choice');

Tracer.initGlobalTracer(TracingBackend.create());
```

*Note: the underlying implementation object is shared between all inclusions of the `opentracing` package, so `initGlobalTracer` needs to only be called once during initialization.*

### Usage in the browser

The package contains two bundles built with webpack that can be included using a standard `<script>` tag. The library will be exposed under the global `opentracing` symbol:

* `dist/opentracing-browser.min.js` - minified, no runtime checks
* `dist/opentracing-browser.js` - debug version with runtime checks

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

Implementations can sub-class the `Tracer`, `Span`, `SpanContext`, and other OpenTracing API classes to build their own implementation. The derived classes can implement the set of underscore-prefixed methods called out in the source code (for example, `Tracer._startSpan` rather than `Tracer.startSpan`). By implementing these methods, the derived classes with automatically pick up "common" code from the base classes that won't vary between implementations. This includes argument normalization and conveniences such as only having to implement `Tracer._addTags` rather than both `Tracer.setTag` and `Tracer.addTags` (since the two methods are effectively map to the same functionality).  Implementors are encouraged to use this approach as it allows the OpenTracing library a place to enforce the call semantics of the API.

Implementations can of course directly override the API methods (i.e. `Tracer.startSpan` rather than `Tracer._startSpan`), if desired. This works fine but requires more code to be written.

An minimal example tracer is provided in the `src/mock_tracer` directory of the source code.

  [ci-img]: https://travis-ci.org/opentracing/opentracing-javascript.svg?branch=master
  [cov-img]: https://coveralls.io/repos/github/opentracing/opentracing-javascript/badge.svg?branch=master
  [ci]: https://travis-ci.org/opentracing/opentracing-javascript
  [cov]: https://coveralls.io/github/opentracing/opentracing-javascript?branch=master
