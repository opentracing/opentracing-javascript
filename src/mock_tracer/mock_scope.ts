import * as opentracing from '../index';

/**
 * OpenTracing Scope implementation designed for use in unit tests.
 */
export class MockScope extends opentracing.Scope {
    private _span: opentracing.Span | null;

    protected _active(): opentracing.Span | null {
        return this._span;
    }

    protected _activate<T>(span: opentracing.Span | null, callback: () => T): T {
        const previous = this._span;

        this._span = span;
        const result = callback();
        this._span = previous;

        return result;
    }
}

export default MockScope;
