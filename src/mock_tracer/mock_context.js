import opentracing from '../..';

/**
 * OpenTracing Context implementation designed for use in
 * unit tests.
 */
export default class MockContext extends opentracing.SpanContext {

    //------------------------------------------------------------------------//
    // MockContext-specific
    //------------------------------------------------------------------------//

    constructor(span) {
        super();
        // Store a reference to the span itself since this is a mock tracer
        // intended to make debugging and unit testing easier.
        this._span = span;
    }
}
