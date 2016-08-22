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
     * Sets a key:value pair on this SpanContext that also propagates to future
     * children of the associated Span.
     *
     * setBaggageItem() enables powerful functionality given a full-stack
     * opentracing integration (e.g., arbitrary application data from a web
     * client can make it, transparently, all the way into the depths of a
     * storage system), and with it some powerful costs: use this feature with
     * care.
     *
     * IMPORTANT NOTE #1: setBaggageItem() will only propagate baggage items to
     * *future* causal descendants of the associated Span.
     *
     * IMPORTANT NOTE #2: Use this thoughtfully and with care. Every key and
     * value is copied into every local *and remote* child of the associated
     * Span, and that can add up to a lot of network and cpu overhead.
     *
     * @param {string} key
     * @param {string} value
     */
    setBaggageItem(key, value) {
        if (process.env.NODE_ENV === 'debug') {
            if (arguments.length !== 2) {
                throw new Error('Invalid number of arguments');
            }
        }
        if (this._imp) {
            this._imp.setBaggageItem(key, value);
        }
    }

    /**
     * Returns the value for a baggage item given its key.
     *
     * @param  {string} key
     *         The key for the given trace attribute.
     * @return {string}
     *         String value for the given key, or undefined if the key does not
     *         correspond to a set trace attribute.
     */
    getBaggageItem(key) {
        if (process.env.NODE_ENV === 'debug') {
            if (arguments.length !== 1) {
                throw new Error('Invalid number of arguments');
            }
        }
        if (this._imp) {
            return this._imp.getBaggageItem(key);
        }
        return undefined;
    }

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
