import * as Constants from './constants';
import Reference from './reference';
import Span from './span';
import SpanContext from './span_context';

/**
 * Return a new REFERENCE_CHILD_OF reference.
 *
 * @param {SpanContext} spanContext - the parent SpanContext instance to
 *        reference.
 * @return a REFERENCE_CHILD_OF reference pointing to `spanContext`
 */
export function childOf(spanContext: SpanContext | Span): Reference {
    return new Reference(Constants.REFERENCE_CHILD_OF, spanContext);
}

/**
 * Return a new REFERENCE_FOLLOWS_FROM reference.
 *
 * @param {SpanContext} spanContext - the parent SpanContext instance to
 *        reference.
 * @return a REFERENCE_FOLLOWS_FROM reference pointing to `spanContext`
 */
export function followsFrom(spanContext: SpanContext | Span): Reference {
    return new Reference(Constants.REFERENCE_FOLLOWS_FROM, spanContext);
}
