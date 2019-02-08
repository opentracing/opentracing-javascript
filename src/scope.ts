import Span from './span';

export type ScopeCallback<T> = (...args: any[]) => T | void;

export const SCOPE_SYMBOL = 'opentracing@scope';

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
     * @returns {T | void} The return value of the provided callback.
     */
    activate<T>(span: Span | null, callback: ScopeCallback<T>): T | void {
        if (typeof callback !== 'function') { return callback; }

        return this._activate(span, callback);
    }

    /**
     * Binds the target to the provided span, or the active span otherwise.
     *
     * @param {any} target
     * @param {Span | null} [span]
     *
     * @returns {any} The provided target bound to the span.
     */
    bind(target: any, span?: Span | null, ...args: any[]): any {
        return this._bind(target, span, ...args);
    }

    protected _active(): Span | null {
        return null;
    }

    protected _activate<T>(span: Span | null, callback: () => T): T {
        return callback();
    }

    protected _bind<T>(target: T, span?: Span | null, ...args: any[]): T {
        return target;
    }
}
