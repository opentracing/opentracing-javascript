var _      = require('underscore');
var expect = require('chai').expect;
var opentracing = require('../debug.js');

module.exports = function opentracingAPITests() {
    describe('Opentracing API', function() {
        var tracer;
        var span;
        beforeEach(function() {
            tracer = new opentracing.Tracer();
            span = tracer.startSpan('test-span');
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

        describe('Standalone functions', function() {
            var funcs = [
                'childOf',
                'followsFrom',
                'initGlobalTracer',
                'globalTracer',

            ];
            _.each(funcs, function(name) {
                it(name + ' should be a function', function() {
                    expect(opentracing[name]).to.be.a('function');
                });
            });
        });

        describe('Tracer', function() {
            it('should be a class', function() {
                expect(new opentracing.Tracer()).to.be.an('object');
            });
        });

        describe('Span', function() {
            it('should be a class', function() {
                expect(span).to.be.an('object');
            });
        });

        describe('SpanContext', function() {
            it('should be a class', function() {
                var spanContext = span.context();
                expect(spanContext).to.be.an('object');
            });
        });

        describe('Reference', function() {
            it('should be a class', function() {
                var ref = new opentracing.Reference(opentracing.REFERENCE_CHILD_OF, span.context());
                expect(ref).to.be.an('object');
            });
        });
    });
}
