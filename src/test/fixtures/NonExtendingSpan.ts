import * as noop from '../../noop';
import SpanContext from '../../span_context';
import Tracer from '../../tracer';

/**
 * Span implementation for unit tests. Does not extend opentracing.Span, but
 * implements the interface
 */
export class NonExtendingSpan {

  constructor(private ctx: SpanContext) {
  }

  context(): SpanContext {
    return this.ctx;
  }

  tracer(): Tracer {
    return this._tracer();
  }

  setOperationName(name: string): this {
    this._setOperationName(name);
    return this;
  }

  setBaggageItem(key: string, value: string): this {
    this._setBaggageItem(key, value);
    return this;
  }

  getBaggageItem(key: string): string | undefined {
    return this._getBaggageItem(key);
  }

  setTag(key: string, value: any): this {
    this._addTags({ [key]: value });
    return this;
  }

  addTags(keyValueMap: { [key: string]: any }): this {
    this._addTags(keyValueMap);
    return this;
  }

  log(keyValuePairs: { [key: string]: any }, timestamp?: number): this {
    this._log(keyValuePairs, timestamp);
    return this;
  }

  logEvent(eventName: string, payload: any): void {
    return this._log({ event: eventName, payload });
  }

  finish(finishTime?: number): void {
    this._finish(finishTime);
  }

  protected _context(): SpanContext {
    return noop.spanContext!;
  }

  protected _tracer(): Tracer {
    return noop.tracer!;
  }

  protected _setOperationName(name: string): void {
  }

  protected _setBaggageItem(key: string, value: string): void {
  }

  protected _getBaggageItem(key: string): string | undefined {
    return undefined;
  }

  protected _addTags(keyValuePairs: { [key: string]: any }): void {
  }

  protected _log(keyValuePairs: { [key: string]: any }, timestamp?: number): void {
  }

  protected _finish(finishTime?: number): void {
  }
}
