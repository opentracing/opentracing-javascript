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
    referencedContext() {
        return this._referencedContext;
    }

    /**
     * Initialize a new Reference instance.
     *
     * @param {string} type - the Reference type constant (e.g.,
     *        REFERENCE_CHILD_OF or REFERENCE_FOLLOWS_FROM).
     * @param {SpanContext} referencedContext - the SpanContext being referred
     *        to. As a convenience, a Span instance may be passed in instead
     *        (in which case its .context() is used here).
     */
    constructor(type, referencedContext) {
        if (process.env.NODE_ENV === 'debug') {
            if (!(referencedContext instanceof SpanContext || referencedContext instanceof Span)) {
                throw new Error('referencedContext must be a Span or SpanContext instance');
            }
        }
        this._type = type;
        this._referencedContext = (
                referencedContext instanceof Span ?
                referencedContext.context() :
                referencedContext);
    }
}
