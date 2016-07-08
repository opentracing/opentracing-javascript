// For the convenience of unit testing, add these to the global namespace
global._      = require('underscore');
global.expect = require('chai').expect;

// Unit testing is done against the debug version of the library as it has
// additional conformance checks that are optimized out of the production
// library.
global.Tracer = require('../dist/opentracing-node-debug.js');

var NoopTracerImp;

describe('OpenTracing API', function() {

    // Test that the API layer, while in debug mode, catches API misuse
    // before the implementation is even invoked (i.e. even with the no-op
    // implementation).

    describe('surface area', function() {
        it('should have the required functions on the singleton', function() {
            expect(Tracer.initGlobalTracer).to.be.a('function');
            expect(Tracer.initNewTracer).to.be.a('function');
        });

        it('should have the required constants', function() {
            expect(Tracer.FORMAT_TEXT_MAP).to.be.a('string');
            expect(Tracer.FORMAT_BINARY).to.be.a('string');
            expect(Tracer.REFERENCE_CHILD_OF).to.be.a('string');
            expect(Tracer.REFERENCE_FOLLOWS_FROM).to.be.a('string');
        });

        it('should have the required Tracer functions', function() {
            expect(Tracer.startSpan).to.be.a('function');
            expect(Tracer.inject).to.be.a('function');
            expect(Tracer.extract).to.be.a('function');
            expect(Tracer.flush).to.be.a('function');
        });

        it('should have the required Span functions', function() {
            var span = Tracer.startSpan('test_operation');
            expect(span.tracer).to.be.a('function');
            expect(span.context).to.be.a('function');
            expect(span.setTag).to.be.a('function');
            expect(span.addTags).to.be.a('function');
            expect(span.log).to.be.a('function');
            expect(span.logEvent).to.be.a('function');
            expect(span.finish).to.be.a('function');
        });

        it('should have the required SpanContext functions', function() {
            var spanContext = Tracer.startSpan('test_operation').context();
            expect(spanContext.setBaggageItem).to.be.a('function');
            expect(spanContext.getBaggageItem).to.be.a('function');
        });

        it('should enforce the required carrier types', function() {
            var spanContext = Tracer.startSpan('test_operation').context();

            var textCarrier = {};
            expect(function() { Tracer.inject(spanContext, Tracer.FORMAT_TEXT_MAP, textCarrier); }).to.not.throw(Error);
            expect(function() { Tracer.inject(spanContext, Tracer.FORMAT_TEXT_MAP, ''); }).to.throw(Error);
            expect(function() { Tracer.inject(spanContext, Tracer.FORMAT_TEXT_MAP, 5); }).to.throw(Error);

            var binCarrier = new Tracer.BinaryCarrier();
            expect(function() { Tracer.inject(spanContext, Tracer.FORMAT_BINARY, binCarrier); }).to.not.throw(Error);
            expect(function() { Tracer.inject(spanContext, Tracer.FORMAT_BINARY, new Object); }).to.not.throw(Error);
            expect(function() { Tracer.inject(spanContext, Tracer.FORMAT_BINARY, {}); }).to.not.throw(Error);
            expect(function() { Tracer.inject(spanContext, Tracer.FORMAT_BINARY, { buffer : null }); }).to.not.throw(Error);

            expect(function() { Tracer.extract(Tracer.FORMAT_BINARY, binCarrier); }).to.not.throw(Error);
            expect(function() { Tracer.extract(Tracer.FORMAT_BINARY, {}); }).to.not.throw(Error);
            expect(function() { Tracer.extract(Tracer.FORMAT_BINARY, { buffer : null }); }).to.not.throw(Error);
            expect(function() { Tracer.extract(Tracer.FORMAT_BINARY, { buffer : '' }); }).to.throw(Error);
            expect(function() { Tracer.extract(Tracer.FORMAT_BINARY, { buffer : 5 }); }).to.throw(Error);
        });
    });

    describe('No-op tracer', function() {
        it('should return a valid no-op tracer object when given a null implementation', function() {
            var tracer;
            expect(function() {
                tracer = Tracer.initNewTracer(null);
            }).not.to.throw();
            expect(tracer).to.be.an('object');

            var span = tracer.startSpan('test_span')
            expect(span).to.be.an('object');
            span.finish();
        });
    });

    describe('Memory usage', function() {
        before(function() {
            NoopTracerImp = require('./imp/noop_imp.js');
        });

        it('should not report leaks after setting the global tracer', function() {
            Tracer.initGlobalTracer(new NoopTracerImp());
        });
    });
});
