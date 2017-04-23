
import { assert, expect } from 'chai';
import { BinaryCarrier, FORMAT_BINARY, FORMAT_TEXT_MAP, Reference, REFERENCE_CHILD_OF, Span, Tracer } from '../index';

export interface ApiCompatibilityChecksOptions {
    /** a boolean that controls whether or not to verify baggage values */
    checkBaggageValues?: boolean;
}

/**
 * A function that takes a tracer factory, and tests wheter the initialized tracer
 * fulfills Opentracing's api requirements.
 *
 * @param {object} createTracer - a factory function that allocates a tracer.
 * @param {object} [options] - the options to be set on api compatibility
 */
export function apiCompatibilityChecks(createTracer = () => new Tracer(), options: ApiCompatibilityChecksOptions = {}): void {

    describe('OpenTracing API Compatibility', () => {
        let tracer: Tracer;
        let span: Span;

        beforeEach(() => {
            tracer = createTracer();
            span = tracer.startSpan('test-span');
        });

        describe('Tracer', () => {

            describe('startSpan', () => {
                it('should handle Spans and SpanContexts', () => {
                    expect(() => { tracer.startSpan('child', { childOf : span }); }).to.not.throw(Error);
                    expect(() => { tracer.startSpan('child', { childOf : span.context() }); }).to.not.throw(Error);
                });
            });

            describe('inject', () => {
                it('should not throw exception on required carrier types', () => {
                    const spanContext = span.context();
                    const textCarrier = {};
                    const binCarrier = new BinaryCarrier([1, 2, 3]);
                    expect(() => { tracer.inject(spanContext, FORMAT_TEXT_MAP, textCarrier); }).to.not.throw(Error);
                    expect(() => { tracer.inject(spanContext, FORMAT_BINARY, binCarrier); }).to.not.throw(Error);
                    expect(() => { tracer.inject(spanContext, FORMAT_BINARY, {}); }).to.not.throw(Error);
                });

                it('should handle Spans and SpanContexts', () => {
                    const textCarrier = {};
                    expect(() => { tracer.inject(span, FORMAT_TEXT_MAP, textCarrier); }).to.not.throw(Error);
                    expect(() => { tracer.inject(span.context(), FORMAT_TEXT_MAP, textCarrier); }).to.not.throw(Error);
                });
            });

            describe('extract', () => {
                it('should not throw exception on required carrier types', () => {
                    const textCarrier = {};
                    const binCarrier = new BinaryCarrier([1, 2, 3]);
                    expect(() => { tracer.extract(FORMAT_TEXT_MAP, textCarrier); }).to.not.throw(Error);
                    expect(() => { tracer.extract(FORMAT_BINARY, binCarrier); }).to.not.throw(Error);
                    expect(() => { tracer.extract(FORMAT_BINARY, {}); }).to.not.throw(Error);
                    expect(() => { tracer.extract(FORMAT_BINARY, { buffer : null }); }).to.not.throw(Error);
                });
            });
        });

        describe('Span', () => {

            it('should set baggage and retrieve baggage', () => {
                span.setBaggageItem('some-key', 'some-value');
                const val = span.getBaggageItem('some-key');
                if (options.checkBaggageValues) {
                    assert.equal('some-value', val);
                }
            });

            describe('finish', () => {
                it('should not throw exceptions on valid arguments', () => {
                    span = tracer.startSpan('test-span');
                    expect(() => span.finish(Date.now())).to.not.throw(Error);
                });
            });
        });

        describe('Reference', () => {
            it('should handle Spans and span.context()', () => {
                expect(() => new Reference(REFERENCE_CHILD_OF, span)).to.not.throw(Error);
                expect(() => new Reference(REFERENCE_CHILD_OF, span.context())).to.not.throw(Error);
            });
        });
    });
}

export default apiCompatibilityChecks;
