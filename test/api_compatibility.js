// For the convenience of unit testing, add these to the global namespace
var _      = require('underscore');
var assert = require('chai').assert;
var expect = require('chai').expect;

// Unit testing is done against the debug version of the library as it has
// additional conformance checks that are optimized out of the production
// library.  Again, globals are used purely for convenience.
var opentracing = require('../debug.js');

var tracerFunctions = [
    'startSpan',
    'inject',
    'extract'
];

var spanFunctions = [
    'tracer',
    'context',
    'setOperationName',
    'setTag',
    'addTags',
    'log',
    'logEvent',
    'finish',
    'setBaggageItem',
    'getBaggageItem',
];

// TODO(oibe) update documentation to address carrier factory map
module.exports = function apiCompatibilityChecks(_createTracer, carrierFormatFactoryMap, checkBaggageValues) {
    var createTracer = _createTracer || function() { return new opentracing.Tracer(); };

    describe('OpenTracing API Compatibility', function() {
        var tracer;
        var span;

        beforeEach(function() {
            tracer = createTracer();
            span = tracer.startSpan('test-span');
        });

        describe('Tracer', function() {
            _.each(tracerFunctions, function(name) {
                it(name + ' should be a method', function() {
                    expect(tracer[name]).to.be.a('function');
                });
            });

            describe('Tracer#startSpan', function() {
                it('should handle Spans and SpanContexts', function() {
                    expect(function() { tracer.startSpan('child', { childOf : span }); }).to.not.throw(Error);
                });
            });

            describe('Tracer#inject', function() {
                it('should not throw exception on required carrier types', function() {
                    var spanContext = span.context();
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
                    var textCarrier = {};
                    expect(function() { tracer.inject(span, opentracing.FORMAT_TEXT_MAP, textCarrier); }).to.not.throw(Error);
                });
            });
        });

        describe('Span', function() {
            _.each(spanFunctions, function(name) {
                it(name + ' should be a method', function() {
                    expect(span[name]).to.be.a('function');
                });
            });

            describe('Span#finish', function() {
                it('should not throw exceptions on valid arguments', function() {
                    function f(arg) {
                        return function() {
                            span = tracer.startSpan('test-span');
                            span.finish(arg);
                        }
                    }
                    expect(f(10)).to.not.throw(Error);
                    expect(f(Date.now())).to.not.throw(Error);
                });
            });
        });

        describe('Reference', function() {
            it('should handle Spans and span.context()', function() {
                expect(function() { new opentracing.Reference(opentracing.REFERENCE_CHILD_OF, span); }).to.not.throw(Error);
            });
        });
    });

    describe('Opentracing implementation compatibility', function() {
        var tracer;
        var span;

        beforeEach(function() {
            tracer = createTracer();
            span = tracer.startSpan('test-span');
        });

        describe('Tracer', function() {
            _.each(spanFunctions, function(name) {
                it(name + ' should be a method', function() {
                    var span = tracer.startSpan('test-span');
                    expect(span[name]).to.be.a('function');
                });
            });
        });

        describe('Span', function() {
            _.each(spanFunctions, function(name) {
                it(name + ' should be a method', function() {
                    expect(span[name]).to.be.a('function');
                });
            });

            var spanExecutions = [
                {name: 'tracer', args: [], chainable: false},
                {name: 'context', args: [], chainable: false},
                {name: 'setOperationName', args: ['name'], chainable: true},
                {name: 'setTag', args: ['key', 'value'], chainable: true},
                {name: 'addTags', args: [{'key': 'value'}], chainable: true},
                {name: 'log', args: [
                    {'event': 'event-name', 'payload': {'key': 'value'}}
                ], chainable: false},
                {name: 'logEvent', args: ['eventName', null], chainable: false},
                {name: 'logEvent', args: ['eventName', {'key': 'value'}], chainable: false},
                {name: 'finish', args: [], chainable: false},
                {name: 'setBaggageItem', args: ['key', 'value'], chainable: true},
                {name: 'getBaggageItem', args: ['key'], chainable: false},
            ];
            _.each(spanExecutions, function(a) {
                it(a.name + 'should not throw exceptions', function() {
                    var newSpan = span[a.name].apply(span, a.args);
                    if (a['chainable']) {
                        _.each(spanFunctions, function(name) {
                            assert.isOk(newSpan[name] instanceof Function);
                        });
                    }
                })
            });

            it('should set baggage and retrieve baggage', function() {
                span.setBaggageItem('some-key', 'some-value');
                var val = span.getBaggageItem('some-key');
                if (checkBaggageValues) {
                    assert.equal('some-value', val);
                }
            });

            it('setTag should be chainable', function() {
                var newSpan = span.setTag('key', 'value');
                expect(span['setTag']).to.be.a('function');
            });
        });
    });
}
