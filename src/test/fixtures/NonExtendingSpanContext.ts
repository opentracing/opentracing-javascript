export class NonExtendingSpanContext {

  toTraceId(): string {
    return '';
  }

  toSpanId(): string {
    return '';
  }
}
