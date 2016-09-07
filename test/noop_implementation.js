// For the convenience of unit testing, add these to the global namespace
var _      = require('underscore');
var expect = require('chai').expect;

// Unit testing is done against the debug version of the library as it has
// additional conformance checks that are optimized out of the production
// library.  Again, globals are used purely for convenience.
var opentracing = require('../debug.js');

module.exports = function noopImplementationTests(_createTracer) {
    var createTracer = _createTracer || function() { return new opentracing.Tracer(); };

    describe('Noop Tracer Implementation', function() {
        describe('Tracer#inject', function() {
            it('should enforce the required carrier types', function() {
                var tracer = createTracer();
                var spanContext = tracer.startSpan('test_operation').context();
                expect(function() { tracer.inject(spanContext, opentracing.FORMAT_TEXT_MAP, ''); }).to.throw(Error);
                expect(function() { tracer.inject(spanContext, opentracing.FORMAT_TEXT_MAP, 5); }).to.throw(Error);

                expect(function() { tracer.extract(opentracing.FORMAT_BINARY, { buffer : '' }); }).to.throw(Error);
                expect(function() { tracer.extract(opentracing.FORMAT_BINARY, { buffer : 5 }); }).to.throw(Error);
            });

            it('should handle Spans and SpanContexts', function() {
                var tracer = createTracer();
                var span = tracer.startSpan('test_operation');
                var textCarrier = {};
                expect(function() { tracer.inject(span, opentracing.FORMAT_TEXT_MAP, textCarrier); }).to.not.throw(Error);
            });
        });

        describe('Span#finish', function() {
            it('should return undefined', function() {
                var tracer = createTracer();
                var span = tracer.startSpan('test_span');
                expect(span.finish()).to.be.undefined;
            });

            it('should only accept numbers as an argument', function() {
                var tracer = createTracer();
                function f(arg) {
                    return function() {
                        var span = tracer.startSpan('test_span');
                        span.finish(arg);
                    }
                }
                expect(f('1234567')).to.throw(Error);
                expect(f([])).to.throw(Error);
                expect(f({})).to.throw(Error);
            });
            it('should throw an Error if given more than 1 argument', function() {
                var tracer = createTracer();
                var span = tracer.startSpan('test_span');
                expect(function() { span.finish(Date.now(), { extra : 123 }) }).to.be.throw(Error);
            });
        });

        describe('Miscellaneous', function() {
            describe('Memory usage', function() {
                it('should not report leaks after setting the global tracer', function() {
                    opentracing.initGlobalTracer(createTracer());
                });
            });
        });
    });
}
