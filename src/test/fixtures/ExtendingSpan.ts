import Span from '../../span';
import SpanContext from '../../span_context';

/**
 * Span implementation for unit tests. Extends opentracing.Span.
 */
export class ExtendingSpan extends Span {

  constructor(private ctx: SpanContext) {
    super();
  }

  context(): SpanContext {
    return this.ctx;
  }
}
