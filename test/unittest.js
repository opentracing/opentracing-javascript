// For the convenience of unit testing, add these to the global namespace
global._      = require('underscore');
global.expect = require('chai').expect;

// Unit testing is done against the debug version of the library as it has
// additional conformance checks that are optimized out of the production
// library.
global.Tracer = require('../dist/opentracing-node-debug.js');

describe('OpenTracing API', function() {

    // Test that the API layer, while in debug mode, catches API misuse
    // before the implementation is even invoked (i.e. even with the no-op
    // implementation).
    describe("Base layer conformance", function() {

        describe("API surface area", function() {
            it('should have the required functions on the singleton', function() {
                expect(Tracer.initGlobalTracer).to.be.a('function');
                expect(Tracer.initNewTracer).to.be.a('function');
            });

            it('should have the required Tracer functions', function() {
                expect(Tracer.startSpan).to.be.a('function');
                expect(Tracer.injector).to.be.a('function');
                expect(Tracer.extractor).to.be.a('function');
                expect(Tracer.flush).to.be.a('function');
            });

            it('should have the required Span functions', function() {
                var span = Tracer.startSpan('test_operation');

                expect(span.setTag).to.be.a('function');
                expect(span.addTags).to.be.a('function');
                expect(span.setTraceAttribute).to.be.a('function');
                expect(span.getTraceAttribute).to.be.a('function');
                expect(span.startChildSpan).to.be.a('function');
                expect(span.log).to.be.a('function');
                expect(span.logEvent).to.be.a('function');
                expect(span.finish).to.be.a('function');
            });
        });
    });
});
