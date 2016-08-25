import * as Constants from './constants';
import Span from './span';
import Reference from './reference';

/**
 * Return a new REFERENCE_CHILD_OF reference.
 *
 * @param {SpanContext} spanContext - the parent SpanContext instance to
 *        reference.
 * @return a REFERENCE_CHILD_OF reference pointing to `spanContext`
 */
export function childOf(spanContext) {
    // Allow the user to pass a Span instead of a SpanContext
    if (spanContext instanceof Span) {
        spanContext = spanContext.context();
    }
    return new Reference(Constants.REFERENCE_CHILD_OF, spanContext);
}

/**
 * Return a new REFERENCE_FOLLOWS_FROM reference.
 *
 * @param {SpanContext} spanContext - the parent SpanContext instance to
 *        reference.
 * @return a REFERENCE_FOLLOWS_FROM reference pointing to `spanContext`
 */
export function followsFrom(spanContext) {
    // Allow the user to pass a Span instead of a SpanContext
    if (spanContext instanceof Span) {
        spanContext = spanContext.context();
    }
    return new Reference(Constants.REFERENCE_FOLLOWS_FROM, spanContext);
}
