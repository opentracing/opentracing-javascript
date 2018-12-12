import Span from './span';

export type ScopeCallback<T> = (...args: any[]) => T | void;

/**
 * Scope manages context propagation of a Span.
 */
export class Scope {
    /**
     * Gets the current active span.
     *
     * @returns {Span | null} The active span or null if there is none.
     */
    active(): Span | null {
        return this._active() || null;
    }

    /**
     * Activates a new span in the scope of the provided callback.
     *
     * Create a new scope for the callback as a child of the current scope,
     * and activate the provided span in that new scope.
     *
     * @param {Span | null} span
     *        The span to activate in the scope of the callback, or null if the
     *        callback scope should not have an span.
     * @param {ScopeCallback<T>} callback
     *        The callback for which to activate the span.
     *
     * @returns {T} The return value of the provided callback.
     */
    activate<T>(span: Span | null, callback: ScopeCallback<T>): T | void {
        if (typeof callback !== 'function') { return callback; }

        return this._activate(span, callback);
    }

    /**
     * Binds the target function to the provided span, or the current active
     * span otherwise.
     *
     * @param {ScopeCallback<T>} fn
     * @param {Span | null} [span]
     *
     * @returns {ScopeCallback<T>} The provided function bound to the span.
     */
    bind<T>(fn: ScopeCallback<T>, span?: Span | null): ScopeCallback<T> {
        if (typeof fn !== 'function') { return fn; }

        if (span === undefined) {
          span = this.active();
        }

        return this._bindFn(fn, span);
    }

    // By default does nothing
    protected _active(): Span | null {
        return null;
    }

    // By default does nothing
    protected _activate<T>(span: Span | null, callback: () => T): T {
        return callback();
    }

    private _bindFn<T>(fn: ScopeCallback<T>, span?: Span | null): ScopeCallback<T> {
        return function (...args: any[]): T {
            const self = this;

            return this.activate(span, () => {
                return fn.apply(self, args);
            });
        };
    }
}
