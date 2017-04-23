import * as opentracing from '../index';

/**
 * OpenTracing Context implementation designed for use in
 * unit tests.
 */
export class MockContext extends opentracing.SpanContext {

    //------------------------------------------------------------------------//
    // MockContext-specific
    //------------------------------------------------------------------------//

    private _span: opentracing.Span;

    constructor(span: opentracing.Span) {
        super();
        // Store a reference to the span itself since this is a mock tracer
        // intended to make debugging and unit testing easier.
        this._span = span;
    }
}

export default MockContext;
