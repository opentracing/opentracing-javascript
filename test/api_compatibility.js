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
        describe('Tracer', function() {
            it('should be a class', function() {
                expect(createTracer).to.be.a('function');
                expect(createTracer()).to.be.an('object');
            });

            var tracer = new createTracer();
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

        describe('Span', function() {
            var tracer = new createTracer();
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

        describe('SpanContext', function() {
            var tracer = new createTracer();
            var span = tracer.startSpan('test_span');
            var spanContext = span.context();

            it('should be a class', function() {
                expect(spanContext).to.be.an('object');
            });
        });


        describe('Reference', function() {
            var tracer = new createTracer();
            var span = tracer.startSpan('test_span');
            var ref = new opentracing.Reference(opentracing.REFERENCE_CHILD_OF, span.context());

            it('should be a class', function() {
                expect(ref).to.be.an('object');
            });
        });
    });
}
