import Tracer from './tracer';
import SpanContext from './span_context';
import Span from './span';

/* eslint-disable import/no-mutable-exports */
export let tracer = null;
export let spanContext = null;
export let span = null;
/* eslint-enable import/no-mutable-exports */

// Deferred initialization to avoid a dependency cycle where Tracer depends on
// Span which depends on the noop tracer.
export function initialize() {
    tracer = new Tracer();
    span = new Span();
    spanContext = new SpanContext();
}
