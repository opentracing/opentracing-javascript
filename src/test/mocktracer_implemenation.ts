
import { expect } from 'chai';
import {initGlobalTracer, MockTracer } from '../index';
import { MockSpan } from '../mock_tracer';

export function mockTracerimplementationTests(createTracer = () => new MockTracer()): void {

    describe('Mock Tracer Implementation', () => {
        describe('Tracer#api', () => {

            it('should handle Spans, SpanContexts and tags and logs ', () => {
                const tracer = createTracer();
                const span = tracer.startSpan('test_operation') as MockSpan;
                span.setTag('tag name', 'tag value');
                span.log({state: 'test'});
                expect(() => { span.finish(); }).to.not.throw (Error);
                // currently injection is not implemented
                // const textCarrier = {};
                // expect(() => { tracer.inject(span, FORMAT_TEXT_MAP, textCarrier); }).to.not.throw(Error);
            });
        });

        describe ('Tracer#report', () => {

            it ('should not throw exceptions when running report', () => {
                const tracer = createTracer();
                const span = tracer.startSpan('test_operation');
                span.finish ();
                expect (() => {
                    const report = tracer.report();
                    for (const span of report.spans) {
                        span.tags();
                    }
                }).to.not.throw (Error);
            });
        });

        describe('Span#finish', () => {
            it('should return undefined', () => {
                const tracer = createTracer();
                const span = tracer.startSpan('test_span');
                expect(span.finish()).to.be.undefined;
            });
        });

        describe('Miscellaneous', () => {
            describe('Memory usage', () => {
                it('should not report leaks after setting the global tracer', () => {
                    initGlobalTracer(createTracer());
                });
            });
        });
    });
}

export default mockTracerimplementationTests;
