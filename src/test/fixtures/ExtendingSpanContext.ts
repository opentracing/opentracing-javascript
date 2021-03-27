import SpanContext from '../../span_context';

export class ExtendingSpanContext extends SpanContext {

  context(): any {
    return null;
  }
}
