// Ensure the stack trace lines numbers are correct on errors
require('source-map-support').install();

// For the convenience of unit testing, add these to the global namespace
global._      = require('underscore');
global.expect = require('chai').expect;

// Unit testing is done against the debug version of the library as it has
// additional conformance checks that are optimized out of the production
// library.  Again, globals are used purely for convenience.
global.opentracing = require('../debug.js');
global.Tracer = opentracing.globalTracer();

describe('OpenTracing API', function() {

    describe('Standalone functions', function() {
        it('should have a function initGlobalTracer', function() {
            expect(opentracing.initGlobalTracer).to.be.a('function');
        });
        it('should have a function globalTracer', function() {
            expect(opentracing.globalTracer).to.be.a('function');
        });
    });
    describe('Constants', function() {
        var constStrings = [
            'FORMAT_TEXT_MAP',
            'FORMAT_BINARY',
            'FORMAT_HTTP_HEADERS',
            'REFERENCE_CHILD_OF',
            'REFERENCE_FOLLOWS_FROM',
        ];
        _.each(constStrings, function(name) {
            it(name + ' should be a constant string', function() {
                expect(opentracing[name]).to.be.a('string');
            });
        });
    });

    describe('Tracer', function() {
        it('should be a class', function() {
            expect(opentracing.Tracer).to.be.a('function');
            expect(new opentracing.Tracer()).to.be.an('object');
        });

        var tracer = new opentracing.Tracer();
        var funcs = [
            'startSpan',
            'inject',
            'extract',
            'flush',
            'childOf',
            'followsFrom',
        ];
        _.each(funcs, function(name) {
            it(name + ' should be a method', function() {
                expect(tracer[name]).to.be.a('function');
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
            it('should enforce the required carrier types', function() {
                let tracer = new opentracing.Tracer();
                var spanContext = tracer.startSpan('test_operation').context();
                var textCarrier = {};
                expect(function() { tracer.inject(spanContext, opentracing.FORMAT_TEXT_MAP, textCarrier); }).to.not.throw(Error);
                expect(function() { tracer.inject(spanContext, opentracing.FORMAT_TEXT_MAP, ''); }).to.throw(Error);
                expect(function() { tracer.inject(spanContext, opentracing.FORMAT_TEXT_MAP, 5); }).to.throw(Error);

                var binCarrier = new opentracing.BinaryCarrier();
                expect(function() { tracer.inject(spanContext, opentracing.FORMAT_BINARY, binCarrier); }).to.not.throw(Error);
                expect(function() { tracer.inject(spanContext, opentracing.FORMAT_BINARY, new Object); }).to.not.throw(Error);
                expect(function() { tracer.inject(spanContext, opentracing.FORMAT_BINARY, {}); }).to.not.throw(Error);
                expect(function() { tracer.inject(spanContext, opentracing.FORMAT_BINARY, { buffer : null }); }).to.not.throw(Error);

                expect(function() { tracer.extract(opentracing.FORMAT_BINARY, binCarrier); }).to.not.throw(Error);
                expect(function() { tracer.extract(opentracing.FORMAT_BINARY, {}); }).to.not.throw(Error);
                expect(function() { tracer.extract(opentracing.FORMAT_BINARY, { buffer : null }); }).to.not.throw(Error);
                expect(function() { tracer.extract(opentracing.FORMAT_BINARY, { buffer : '' }); }).to.throw(Error);
                expect(function() { tracer.extract(opentracing.FORMAT_BINARY, { buffer : 5 }); }).to.throw(Error);
            });
            it('should handle Spans and SpanContexts', function() {
                var tracer = new opentracing.Tracer();
                var span = tracer.startSpan('test_operation');
                var textCarrier = {};
                expect(function() { tracer.inject(span, opentracing.FORMAT_TEXT_MAP, textCarrier); }).to.not.throw(Error);
            });
        });
    });

    describe('Span', function() {

        var tracer = new opentracing.Tracer();
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

        describe('Span#finish', function() {
            it('should return undefined', function() {
                var tracer = new opentracing.Tracer();
                var span = tracer.startSpan('test_span');
                expect(span.finish()).to.be.undefined;
            });
            it('should only accept numbers as an argument', function() {
                var tracer = new opentracing.Tracer();
                function f(arg) {
                    return function() {
                        var span = tracer.startSpan('test_span');
                        span.finish(arg);
                    }
                }
                expect(f(10)).to.not.throw(Error);
                expect(f(Date.now())).to.not.throw(Error);
                expect(f('1234567')).to.throw(Error);
                expect(f([])).to.throw(Error);
                expect(f({})).to.throw(Error);
            });
            it('should throw an Error if given more than 1 argument', function() {
                var tracer = new opentracing.Tracer();
                var span = tracer.startSpan('test_span');
                expect(function() { span.finish(Date.now(), { extra : 123 }) }).to.be.throw(Error);
            });
        });
    });

    describe('SpanContext', function() {

        var tracer = new opentracing.Tracer();
        var span = tracer.startSpan('test_span');
        var spanContext = span.context();

        it('should be a class', function() {
            expect(spanContext).to.be.an('object');
        });
    });


    describe('Reference', function() {

        var tracer = new opentracing.Tracer();
        var span = tracer.startSpan('test_span');
        var ref = new opentracing.Reference(opentracing.REFERENCE_CHILD_OF, span.context());

        it('should be a class', function() {
            expect(ref).to.be.an('object');
        });
        it('should handle Spans and SpanContexts', function() {
            var tracer = new opentracing.Tracer();
            var span = tracer.startSpan('test_operation');
            expect(function() { new opentracing.Reference(opentracing.REFERENCE_CHILD_OF, span); }).to.not.throw(Error);
        });
    });
});
describe('Miscellaneous', function() {
    describe('Memory usage', function() {
        it('should not report leaks after setting the global tracer', function() {
            opentracing.initGlobalTracer(new opentracing.Tracer());
        });
    });
});
