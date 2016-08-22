[![Build Status][ci-img]][ci] [![Coverage Status][cov-img]][cov]

# OpenTracing API for JavaScript

This library is a JavaScript implementation of Open Tracing API. It is intended for use both on the server and in the browser.

## Required Reading

To fully understand this platform API, it's helpful to be familiar with the [OpenTracing project](http://opentracing.io) and
[terminology](http://opentracing.io/spec/) more generally.

## Quick Start

Install the package:

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

## API Documentation

There is a hosted copy of the current generated [ESDoc API Documentation here](https://doc.esdoc.org/github.com/opentracing/opentracing-javascript/).

## Notes on backwards-incompatible changes

### v0.9.x to v0.10.x

This release makes the `opentracing-javascript` package conformant with the ideas proposed in [opentracing/opentracing.github.io#99](https://github.com/opentracing/opentracing.github.io/issues/99). The API changes can be summarized as follows:

* Every `Span` has a `SpanContext`, available via `Span.context()`. The `SpanContext` represents the subset of `Span` state that must propagate across process boundaries in-band along with the application data.
* `Span.setBaggageItem()` and `Span.getBaggageItem()` have moved to `SpanContext`. Calls can be migrated trivially: `Span.context().{set,get}BaggageItem()`.
* The first parameter to `Tracer.inject()` is now a `SpanContext`. As a convenience, a `Span` may be passed instead.
* There is a new concept called a `Reference`; a reference describes a relationship between a newly started `Span` and some other `Span` (via a `SpanContext`). The common case is to describe a reference to a parent `Span` that depends on the child `Span` ('REFERENCE_CHILD_OF`).
* `Tracer.startSpan(operation, fields)` no longer accepts `fields.parent`; it now accepts either `fields.childOf`, a `SpanContext` or `Span` instance, or `fields.references`, an array of one or more `Reference` objects. The former is just a shorthand for the latter.
* `Tracer.join(operationName, format, carrier)` has been removed from the API. In its place, use `Tracer.extract(format, carrier)` which returns a `SpanContext`, and pass that `SpanContext` as a reference in `Tracer.startSpan()`.

TL;DR, to start a child span, do this:

```javascript
let parentSpan = ...;
let childSpan = Tracer.startSpan('child op', { childOf : parentSpan });
```

... and to continue a trace from the server side of an RPC, do this:

```javascript
let format = ...;  // same as for Tracer.join()
let carrier = ...;  // same as for Tracer.join()
let extractedCtx = Tracer.extract(format, carrier);
let serverSpan = Tracer.startSpan('...', { childOf : extractedCtx });
```

## Development Information

*I.e., information for developers working on this package.*

#### Building the library

* `make build` creates the compiled, distributable code
* `make test` runs the tests

## JavaScript OpenTracing Implementations

*I.e. information for developers wanting to create an OpenTracing-compatible JavaScript implementation.*

The API layer uses a [bridge pattern](https://en.wikipedia.org/wiki/Bridge_pattern) to pass work to the specific tracing implementation. The indirection allows the API layer to enforce greater API conformance and standardization across implementations (especially in debug builds), which helps keep instrumented code more portable across OpenTracing implementations.

The "implementation API" - i.e. the interface the API layer expects to be able to call on the implementation - is a proper subset of the API layer itself. The surface area of the implementation API has been reduced in the case where the an API layer method (usually a convenience method of some form) can be expressed in terms of another more general method. For example, `logEvent` can be expressed as a `log` call, therefore the implementation only needs to implement `log`.

For truly implementation-dependent methods, the JavaScript API layer *does* expose `imp()` methods on each major type to allow the implementations to be accessed directly. Use of implementation-dependent methods is discouraged as it immediately makes instrumented code no longer portable.  However, the `imp()` call does at least call attention to deviations from the standard API without making implementation-dependent calls impossible.


  [ci-img]: https://travis-ci.org/opentracing/opentracing-javascript.svg?branch=master
  [cov-img]: https://coveralls.io/repos/github/opentracing/opentracing-javascript/badge.svg?branch=master
  [ci]: https://travis-ci.org/opentracing/opentracing-javascript
  [cov]: https://coveralls.io/github/opentracing/opentracing-javascript?branch=master

