
// TODO: Move mock-tracer to its own NPM package once it is complete and tested.
import opentracing from '../..';

import MockSpan from './mock_span';
import MockReport from './mock_report';

/**
 * OpenTracing Tracer implementation designed for use in unit tests.
 */
export default class MockTracer extends opentracing.Tracer {

    //------------------------------------------------------------------------//
    // OpenTracing implementation
    //------------------------------------------------------------------------//

    _startSpan(name, fields) {
        // _allocSpan is given it's own method so that derived classes can
        // allocate any type of object they want, but not have to duplicate
        // the other common logic in startSpan().
        const span = this._allocSpan(fields);
        span.setOperationName(name);
        this._spans.push(span);

        if (fields.references) {
            for (let i = 0; i < fields.references; i++) {
                span.addReference(fields.references[i]);
            }
        }

        // Capture the stack at the time the span started
        span._startStack = new Error().stack;
        return span;
    }

    _inject(span, format, carrier) {
        throw new Error('NOT YET IMPLEMENTED');
    }

    _extract(format, carrier) {
        throw new Error('NOT YET IMPLEMENTED');
    }

    //------------------------------------------------------------------------//
    // MockTracer-specific
    //------------------------------------------------------------------------//

    constructor() {
        super();
        this._spans = [];
    }

    _allocSpan() {
        return new MockSpan(this);
    }

    /**
     * Discard any buffered data.
     */
    clear() {
        this._spans = [];
    }

    /**
     * Return the buffered data in a format convenient for making unit test
     * assertions.
     */
    report() {
        return new MockReport(this._spans);
    }
}
