import * as shimmer from 'shimmer';
import Span from './span';

const wrapEmitter = require('emitter-listener');

export type ScopeCallback<T> = (...args: any[]) => T | void;

export type EventName = string | symbol;

export type EventListener = (...args: any[]) => any;

export interface Markable {
    [key: string]: (Span | null)[];
}

export type EmitterMethod = (eventName: EventName, listener: EventListener) => any;

export interface EventEmitter {
    emit(eventName: EventName, ...args: any[]): any;
    on: EmitterMethod;
    addListener: EmitterMethod;
    removeListener: EmitterMethod;
}

export type BindTarget<T> = ScopeCallback<T> | EventEmitter | Promise<T>;

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
     * For promises and event emitters, the active span is evaluated when a
     * handler is registered.
     *
     * @param {any} target
     * @param {Span | null} [span]
     *
     * @returns {any} The provided function bound to the span.
     */
    bind<T>(fn: ScopeCallback<T>, span?: Span | null): ScopeCallback<T>;
    bind<T>(fn: Promise<T>, span?: Span | null): Promise<T>;
    bind(emitter: EventEmitter, span?: Span | null): EventEmitter;
    bind(target: any, span?: Span | null, ...args: any[]): any {
        if (this._isEmitter(target)) {
            return this._bindEmitter(target, span);
        } else if (this._isPromise(target)) {
            return this._bindPromise(target, span);
        } else if (typeof target === 'function') {
            return this._bindFn(target, span);
        } else {
            return this._bind(target, span, ...args);
        }
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

    protected _bindFn<T>(fn: ScopeCallback<T>, span?: Span | null): ScopeCallback<T> {
        const scope = this;
        const spanOrActive = this._spanOrActive(span);

        return function (...args: any[]): T {
            return scope.activate(spanOrActive, () => {
                return fn.apply(this, args);
            });
        };
    }

    protected _bindEmitter(emitter: EventEmitter, span?: Span | null): EventEmitter {
        const scope = this;

        function mark(listener: EventListener & Markable): void {
            if (!listener) { return; }

            listener[SCOPE_SYMBOL] = listener[SCOPE_SYMBOL] || [];
            listener[SCOPE_SYMBOL].push(scope._spanOrActive(span));
        }

        function prepare(listener: EventListener & Markable): EventListener {
            if (!listener || !listener[SCOPE_SYMBOL]) { return listener; }

            return listener[SCOPE_SYMBOL]
                .reduce((prev: EventListener, next: Span | null): EventListener => {
                    return scope.bind(prev, next);
                }, listener);
        }

        wrapEmitter(emitter, mark, prepare);

        return emitter;
    }

    protected _bindPromise<T>(promise: Promise<T>, span?: Span | null): Promise<T> {
        const scope = this;

        shimmer.wrap(promise, 'then', (then: any): any => {
            return function (...args: any[]): Promise<T> {
                return then.apply(this, args.map(arg => {
                    if (typeof arg !== 'function') { return arg; }
                    return scope.bind(arg, span);
                }));
            };
        });

        return promise;
    }

    private _spanOrActive(span?: Span | null): Span | null {
        return span !== undefined ? span : this.active();
    }

    private _isEmitter(emitter: EventEmitter): boolean {
        return emitter &&
            typeof emitter.emit === 'function' &&
            typeof emitter.on === 'function' &&
            typeof emitter.addListener === 'function' &&
            typeof emitter.removeListener === 'function';
    }

    private _isPromise<T>(promise: Promise<T>): boolean {
        return promise && typeof promise.then === 'function';
    }
}
Object.create(null).ptoto;
