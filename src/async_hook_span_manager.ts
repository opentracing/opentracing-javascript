import { createHook, executionAsyncId } from 'async_hooks';
import Span from './span';
import { SpanManager } from './span_manager';

/**
 * ScopeManger using Node.js {@link async_hooks|https://nodejs.org/api/async_hooks.html}
 */
export class AsyncHookSpanManager implements SpanManager {
    readonly _spans = new Map<number, Span>();

    private readonly _hook = createHook({
        after: asyncId => {
            if (this._spans.delete(asyncId) && !this._spans.size) {
                this._hook.disable();
            }
        },
        init: (asyncId, type, triggerAsyncId) => {
            const span = this._spans.get(triggerAsyncId);
            if (span) {
                this._spans.set(asyncId, span);
            }
        }
    });

    active(): Span | null {
        return this._spans.get(executionAsyncId()) || null;
    }

    activate<A>(span: Span | null, f: () => A): A {
        const asyncId = executionAsyncId();
        const oldSpan = this._spans.get(asyncId);
        if (span) {
            if (!this._spans.size) {
                this._hook.enable();
            }
            this._spans.set(asyncId, span);
        }
        try {
            return f();
        } finally {
            if (oldSpan) {
                this._spans.set(asyncId, oldSpan);
            } else {
                this._spans.delete(asyncId);
            }
        }
    }
}
