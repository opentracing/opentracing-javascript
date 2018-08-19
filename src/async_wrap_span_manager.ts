import Span from './span';
import { SpanManager } from './span_manager';

const asyncHookJl = require('async-hook-jl');
asyncHookJl.enable();

let currentId: number | null = 1;
asyncHookJl.addHooks({
    pre: (id: number) => currentId = id,
    post: () => currentId = null // in case of bugs
});

/**
 * ScopeManger using Node.js {@link async_hooks|https://nodejs.org/api/async_hooks.html}
 */
export class AsyncWrapSpanManager implements SpanManager {
    private readonly _hook = {
        post: (id: number) => {
            if (this._spans.delete(id) && !this._spans.size) {
                asyncHookJl.removeHooks(this._hook);
            }
        },
        init: (id: number, handle: any, provider: any, parentId: number | null) => {
            // async-hook-jl patches have parentId = 0
            const span = this._spans.get(parentId || currentId);
            if (span) {
                this._spans.set(id, span);
            }
        }
    };

    private readonly _spans = new Map<number | null, Span>();

    active(): Span | null {
        return this._spans.get(currentId) || null;
    }

    activate<A>(span: Span | null, f: () => A): A {
        const oldSpan = this._spans.get(currentId);
        if (span) {
            if (!this._spans.size) {
                asyncHookJl.addHooks(this._hook);
            }
            this._spans.set(currentId, span);
        }
        try {
            return f();
        } finally {
            if (oldSpan) {
                this._spans.set(currentId, oldSpan);
            } else {
                this._spans.delete(currentId);
            }
        }
    }
}
