// For the convenience of unit testing, add these to the global namespace
var _      = require('underscore');
var expect = require('chai').expect;

// Enable additional conformance checks that are optimized out of the production library.
process.env.NODE_ENV = 'debug';
var opentracing = require('..');

module.exports = function noopImplementationTests(_createTracer) {
    var createTracer = _createTracer || function() { return new opentracing.Tracer(); };

    describe('Noop Tracer Implementation', function() {
        describe('Tracer#inject', function() {

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
