import Span from './span';
import SpanContext from './span_context';

const toContext = (contextOrSpan: SpanContext | Span): SpanContext => {
    if (contextOrSpan instanceof SpanContext) {
      return contextOrSpan;
    }

    // Second check is for cases when a Span implementation does not extend
    // opentracing.Span class directly (like Jaeger), just implements the same interface.
    // The only false-positive case here is a non-extending SpanContext class,
    // which has a method called "context".
    // But that's too much of a specification violation to take care of.
    if (contextOrSpan instanceof Span || 'context' in contextOrSpan) {
      return contextOrSpan.context();
    }

    return contextOrSpan;
};

/**
 * Reference pairs a reference type constant (e.g., REFERENCE_CHILD_OF or
 * REFERENCE_FOLLOWS_FROM) with the SpanContext it points to.
 *
 * See the exported childOf() and followsFrom() functions at the package level.
 */
export default class Reference {

    protected _type: string;
    protected _referencedContext: SpanContext;

    /**
     * @return {string} The Reference type (e.g., REFERENCE_CHILD_OF or
     *         REFERENCE_FOLLOWS_FROM).
     */
    type(): string {
        return this._type;
    }

    /**
     * @return {SpanContext} The SpanContext being referred to (e.g., the
     *         parent in a REFERENCE_CHILD_OF Reference).
     */
    referencedContext(): SpanContext {
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
    constructor(type: string, referencedContext: SpanContext | Span) {
        this._type = type;
        this._referencedContext = toContext(referencedContext);
    }
}
