import Span from './span';

/**
 * Manages span activation and implicit in-process propogation.
 */
export interface SpanManager {
    /**
     * Gets the currently active span.
     *
     * @return {Span} the active span.
     */
    active(): Span | null;

    /**
     * Executes the function, setting the provided span as the active one.
     *
     * @param {Span|null} span span to activate.
     * @param {function()} f function to execute.
     */
    activate<A>(span: Span | null, f: () => A): A;
}

/**
 * Activates spans over the synchronous call graph.
 */
export class SyncSpanManager implements SpanManager {
    private _span: Span | null = null;

    active(): Span | null {
        return this._span || null;
    }

    activate<A>(span: Span | null, f: () => A): A {
        const oldSpan = this._span;
        this._span = span;
        try {
            return f();
        } finally {
            this._span = oldSpan;
        }
    }
}
