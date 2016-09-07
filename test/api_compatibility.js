// For the convenience of unit testing, add these to the global namespace
var _      = require('underscore');
var expect = require('chai').expect;

// Unit testing is done against the debug version of the library as it has
// additional conformance checks that are optimized out of the production
// library.  Again, globals are used purely for convenience.
var opentracing = require('../debug.js');

module.exports = function apiCompatibilityChecks(_createTracer) {
    var createTracer = _createTracer || function() { return opentracing.Tracer(); };

    describe('OpenTracing API', function() {
        describe('Standalone functions', function() {
            var funcs = [
                'childOf',
                'followsFrom',
            ];
            _.each(funcs, function(name) {
                it(name + ' should be a function', function() {
                    expect(opentracing[name]).to.be.a('function');
                });
            });
        });

        describe('Tracer', function() {
            it('should be a class', function() {
                expect(createTracer).to.be.a('function');
                expect(createTracer()).to.be.an('object');
            });

            var tracer = createTracer();
            var funcs = [
                'startSpan',
                'inject',
                'extract',
            ];
            _.each(funcs, function(name) {
                it(name + ' should be a method', function() {
                    expect(tracer[name]).to.be.a('function');
                });
            });
        });

        describe('Tracer#startSpan', function() {
            it('should handle Spans and SpanContexts', function() {
                var tracer = new opentracing.Tracer();
                var span = tracer.startSpan('test_operation');
                expect(function() { tracer.startSpan('child', { childOf : span }); }).to.not.throw(Error);
            });
        });

        describe('Tracer#inject', function() {
            it('should not throw exception on required carrier types', function() {
                var tracer = new opentracing.Tracer();
                var spanContext = tracer.startSpan('test_operation').context();
                var textCarrier = {};
                var binCarrier = new opentracing.BinaryCarrier();
                expect(function() { tracer.inject(spanContext, opentracing.FORMAT_TEXT_MAP, textCarrier); }).to.not.throw(Error);
                expect(function() { tracer.inject(spanContext, opentracing.FORMAT_BINARY, binCarrier); }).to.not.throw(Error);
                expect(function() { tracer.inject(spanContext, opentracing.FORMAT_BINARY, new Object); }).to.not.throw(Error);
                expect(function() { tracer.inject(spanContext, opentracing.FORMAT_BINARY, {}); }).to.not.throw(Error);
                expect(function() { tracer.inject(spanContext, opentracing.FORMAT_BINARY, { buffer : null }); }).to.not.throw(Error);

                expect(function() { tracer.extract(opentracing.FORMAT_BINARY, binCarrier); }).to.not.throw(Error);
                expect(function() { tracer.extract(opentracing.FORMAT_BINARY, {}); }).to.not.throw(Error);
                expect(function() { tracer.extract(opentracing.FORMAT_BINARY, { buffer : null }); }).to.not.throw(Error);
            });

            it('should handle Spans and SpanContexts', function() {
                var tracer = new opentracing.Tracer();
                var span = tracer.startSpan('test_operation');
                var textCarrier = {};
                expect(function() { tracer.inject(span, opentracing.FORMAT_TEXT_MAP, textCarrier); }).to.not.throw(Error);
            });
        });

        describe('Span', function() {
            var tracer = createTracer();
            var span = tracer.startSpan('test_span');

            it('should be a class', function() {
                expect(span).to.be.an('object');
            });

            var funcs = [
                'tracer',
                'context',
                'setTag',
                'addTags',
                'log',
                'logEvent',
                'finish',
                'setBaggageItem',
                'getBaggageItem',
            ];
            _.each(funcs, function(name) {
                it(name + ' should be a method', function() {
                    expect(span[name]).to.be.a('function');
                });
            });
        });

        describe('Span#finish', function() {
            it('should not throw exceptions on valid arguments', function() {
                var tracer = new opentracing.Tracer();
                function f(arg) {
                    return function() {
                        var span = tracer.startSpan('test_span');
                        span.finish(arg);
                    }
                }
                expect(f(10)).to.not.throw(Error);
                expect(f(Date.now())).to.not.throw(Error);
            });
        });

        describe('SpanContext', function() {
            var tracer = createTracer();
            var span = tracer.startSpan('test_span');
            var spanContext = span.context();

            it('should be a class', function() {
                expect(spanContext).to.be.an('object');
            });
        });


        describe('Reference', function() {
            var tracer = createTracer();
            var span = tracer.startSpan('test_span');
            var ref = new opentracing.Reference(opentracing.REFERENCE_CHILD_OF, span.context());

            it('should be a class', function() {
                expect(ref).to.be.an('object');
            });
        });
    });
}
