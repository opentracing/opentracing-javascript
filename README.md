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
