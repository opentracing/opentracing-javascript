'use strict';

import Span from './span';
import SpanContext from './span_context';

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
     * @param {string} type - the Reference type constant (e.g.,
     *        REFERENCE_CHILD_OF or REFERENCE_FOLLOWS_FROM).
     * @param {SpanContext} spanContext - the SpanContext being referred to. As
     *        a convenience, a Span instance may be passed in instead (in which
     *        case its .context() is used here).
     */
    constructor(type, spanContext) {
        if (API_CONFORMANCE_CHECKS) {
            if (!(spanContext instanceof SpanContext || spanContext instanceof Span)) {
                throw new Error('spanContext must be a Span or SpanContext instance');
            }
        }
        this._type = type;
        this._spanContext = (
                spanContext instanceof Span ?
                spanContext.context() :
                spanContext);
    }
}
