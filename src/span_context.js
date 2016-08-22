'use strict';

/**
 * SpanContext represents Span state that must propagate to descendant Spans
 * and across process boundaries.
 *
 * SpanContext is logically divided into two pieces: the user-level "Baggage"
 * (see setBaggageItem and getBaggageItem) that propagates across Span
 * boundaries and any Tracer-implementation-specific fields that are needed to
 * identify or otherwise contextualize the associated Span instance (e.g., a
 * <trace_id, span_id, sampled> tuple).
 */
export default class SpanContext {
    /**
     * Constructs a new SpanContext object.
     *
     * This method should not be called directly; Span.context() should be used
     * instead.
     */
    constructor(imp) {
        this._imp = imp;
    }

    /**
     * Returns the SpanContext implementation object. The returned object is by
     * its nature entirely implementation-dependent.
     */
    imp() {
        return this._imp;
    }
}
