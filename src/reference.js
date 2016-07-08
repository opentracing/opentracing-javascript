'use strict';

/**
 * Reference pairs a reference type constant (e.g., REFERENCE_CHILD_OF or
 * REFERENCE_FOLLOWS_FROM) with the SpanContext it points to.
 *
 * See the exported childOf() and followsFrom() functions at the package level.
 */
export default class Reference {

    /**
     * @return {string} The Reference type (e.g., REFERENCE_CHILD_OF or
     *         REFERENCE_FOLLOWS_FROM).
     */
    type() {
        return this._type;
    }

    /**
     * @return {SpanContext} The SpanContext being referred to (e.g., the
     *         parent in a REFERENCE_CHILD_OF Reference).
     */
    spanContext() {
        return this._spanContext;
    }

    /**
     * Initialize a new Reference instance.
     *
     * @param {type} string - the Reference type constant (e.g.,
     *        REFERENCE_CHILD_OF or REFERENCE_FOLLOWS_FROM).
     * @param {spanContext} SpanContext - the SpanContext being referred to.
     */
    constructor(type, spanContext) {
        this._type = type;
        this._spanContext = spanContext;
    }
}
