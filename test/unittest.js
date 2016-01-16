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
                expect(Tracer.encodeTraceContext).to.be.a('function');
                expect(Tracer.decodeTraceContext).to.be.a('function');

                expect(Tracer.newRootTraceContext).to.be.a('function');
                expect(Tracer.newChildTraceContext).to.be.a('function');

                expect(Tracer.startTrace).to.be.a('function');
                expect(Tracer.joinTrace).to.be.a('function');
                expect(Tracer.startSpanWithContext).to.be.a('function');
            });

            it('should have the required Span functions', function() {
                var span = Tracer.startTrace('test_operation');

                expect(span.traceContext).to.be.a('function');
                expect(span.setTag).to.be.a('function');
                expect(span.finish).to.be.a('function');
                expect(span.info).to.be.a('function');
                expect(span.error).to.be.a('function');
            });
        });

        describe('Tracer API conformance', function() {
            describe("encodeTraceContext", function() {
                it("should have basic API conformance tests");
            });
            describe("decodeTraceContext", function() {
                it("should have basic API conformance tests");
            });
            describe("newRootTraceContext", function() {
                it("should have basic API conformance tests");
            });
            describe("newChildTraceContext", function() {
                it("should have basic API conformance tests");
            });
            describe("startTrace", function() {
                it("should except only a single string argument", function() {
                    expect(Tracer.startTrace("test")).to.be.an('object');
                    expect(function() { Tracer.startTrace(); }).to.throw();
                    expect(function() { Tracer.startTrace(null); }).to.throw();
                    expect(function() { Tracer.startTrace(123); }).to.throw();
                    expect(function() { Tracer.startTrace(''); }).to.throw();
                    expect(function() { Tracer.startTrace([]); }).to.throw();
                    expect(function() { Tracer.startTrace({}); }).to.throw();
                });
            });
            describe("joinTrace", function() {
                it("should have basic API conformance tests");
            });
            describe("startSpanWithContext", function() {
                it("should have basic API conformance tests");
            });
        });

        describe('Span API conformance', function() {
            describe("traceContext", function() {
                it("should have basic API conformance tests");
            });
            describe("setTag", function() {
                it("should have basic API conformance tests");
            });
            describe("finish", function() {
                it("should have basic API conformance tests");
            });
            describe("info", function() {
                it("should have basic API conformance tests");
            });
            describe("error", function() {
                it("should have basic API conformance tests");
            });
        });
    });
});
