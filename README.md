# OpenTracing API for JavaScript

This library is a JavaScript implementation of Open Tracing API intended for use both on the server and in the browser.

**STATUS**: this library is still in development but should be ready shortly.

## Objectives

Distributed tracing and context propagation have become important analysis tools for today's multi-layer distributed systems comprised of numerous micro-services implemented in different languages.  The success of these tools is dependent on pervasive instrumentation of applications and libraries with trace context propagation support.

The OpenTracing project (http://opentracing.github.io) provides a multi-lingual standard for application-level instrumentation that's loosely coupled to any particular downstream tracing or monitoring system. In this way, adding or switching tracing implementations becomes a single-step code change.

## Quick Start

Install the package:

```bash
npm install --save opentracing
```

In the JS code, add instrumentation to the operations to be tracked. This is composed primarily of using "spans" around operations of interest and adding log statements to capture useful data relevant to those operations.

```js
var http = require('http');
var Tracer = require('opentracing');

var span = Tracer.startTrace('http_request');
var opts = {
    host : 'example.com',
    method: 'GET',
    port : '80',
    path: '/',
};
http.request(opts, function (res) {
    res.setEncoding('utf8');
    res.on('error', function (err) {
        span.info('Request error', err);
        span.finish();
    });
    res.on('data', function (chunk) {
        span.info('Data chunk received', chunk);
    });
    res.on('end', function(err) {
        span.info('Request finished', err);
        span.finish();
    });
}).end();
```

To capture and make the tracing data actionable, simply update the `initialize` call to specify a backend of your choosing to pipe the data to.  Note: the underlying implementation object is shared with between all inclusions of the `opentracing` package, so only the initialization code needs to concern itself with the implementation package.

```js
var Tracer = require('opentracing');
var TracingBackend = require('tracing-implementation-of-your-choice');

Tracer.initGlobalTracer(TracingBackend.create());
```

## Concepts

The main OpenTracing project (http://opentracing.github.io) provides the most up to date documentation on concepts, semantics, and best practices around effectively using OpenTracing.

## API

Coming soon!

## Usage Examples

Coming soon!

## Development

#### Unit tests

To run the unit tests:

```
npm test
```

*See [DEV.md](DEV.md) for additional detail.*
