import * as opentracing from '../index';
/**
 * OpenTracing Context implementation designed for use in
 * unit tests.
 */
export declare class MockContext extends opentracing.SpanContext {
    private _span;
    constructor(span: opentracing.Span);
}
export default MockContext;
