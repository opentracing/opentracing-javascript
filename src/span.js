import * as noop from './noop';

/**
 * Span represents a logical unit of work as part of a broader Trace. Examples
 * of span might include remote procedure calls or a in-process function calls
 * to sub-components. A Trace has a single, top-level "root" Span that in turn
 * may have zero or more child Spans, which in turn may have children.
 */
export default class Span {

    // ---------------------------------------------------------------------- //
    // OpenTracing API methods
    // ---------------------------------------------------------------------- //

    /**
     * Returns the SpanContext object associated with this Span.
     *
     * @return {SpanContext}
     */
    context() {
        // Debug-only runtime checks on the arguments
        if (process.env.NODE_ENV === 'debug') {
            if (arguments.length !== 0) {
                throw new Error('Invalid number of arguments');
            }
        }

        return this._context();
    }


    /**
     * Returns the Tracer object used to create this Span.
     *
     * @return {Tracer}
     */
    tracer() {
        // Debug-only runtime checks on the arguments
        if (process.env.NODE_ENV === 'debug') {
            if (arguments.length !== 0) {
                throw new Error('Invalid number of arguments');
            }
        }

        return this._tracer();
    }

    /**
     * Sets the string name for the logical operation this span represents.
     *
     * @param {string} name
     */
    setOperationName(name) {
        // Debug-only runtime checks on the arguments
        if (process.env.NODE_ENV === 'debug') {
            if (arguments.length !== 1) {
                throw new Error('Invalid number of arguments');
            }
            if (typeof name !== 'string' || name.length === 0) {
                throw new Error('Name must be a string of length > 0');
            }
        }

        this._setOperationName(name);
        return this;
    }

    /**
     * Sets a key:value pair on this Span that also propagates to future
     * children of the associated Span.
     *
     * setBaggageItem() enables powerful functionality given a full-stack
     * opentracing integration (e.g., arbitrary application data from a web
     * client can make it, transparently, all the way into the depths of a
     * storage system), and with it some powerful costs: use this feature with
     * care.
     *
     * IMPORTANT NOTE #1: setBaggageItem() will only propagate baggage items to
     * *future* causal descendants of the associated Span.
     *
     * IMPORTANT NOTE #2: Use this thoughtfully and with care. Every key and
     * value is copied into every local *and remote* child of the associated
     * Span, and that can add up to a lot of network and cpu overhead.
     *
     * @param {string} key
     * @param {string} value
     */
    setBaggageItem(key, value) {
        // Debug-only runtime checks on the arguments
        if (process.env.NODE_ENV === 'debug') {
            if (arguments.length !== 2) {
                throw new Error('Invalid number of arguments');
            }
        }

        this._setBaggageItem(key, value);
        return this;
    }

    /**
     * Returns the value for a baggage item given its key.
     *
     * @param  {string} key
     *         The key for the given trace attribute.
     * @return {string}
     *         String value for the given key, or undefined if the key does not
     *         correspond to a set trace attribute.
     */
    getBaggageItem(key) {
        // Debug-only runtime checks on the arguments
        if (process.env.NODE_ENV === 'debug') {
            if (arguments.length !== 1) {
                throw new Error('Invalid number of arguments');
            }
        }

        return this._getBaggageItem(key);
    }

    /**
     * Adds a single tag to the span.  See `addTags()` for details.
     *
     * @param {string} key
     * @param {any} value
     */
    setTag(key, value) {
        // Debug-only runtime checks on the arguments
        if (process.env.NODE_ENV === 'debug') {
            if (arguments.length !== 2) {
                throw new Error('Invalid number of arguments');
            }
            if (typeof key !== 'string') {
                throw new Error('Tag key must be a string');
            }
        }

        // NOTE: the call is normalized to a call to _addTags()
        this._addTags({ [key] : value });
        return this;
    }

    /**
     * Adds the given key value pairs to the set of span tags.
     *
     * Multiple calls to addTags() results in the tags being the superset of
     * all calls.
     *
     * The behavior of setting the same key multiple times on the same span
     * is undefined.
     *
     * The supported type of the values is implementation-dependent.
     * Implementations are expected to safely handle all types of values but
     * may choose to ignore unrecognized / unhandle-able values (e.g. objects
     * with cyclic references, function objects).
     *
     * @return {[type]} [description]
     */
    addTags(keyValueMap) {
        // Debug-only runtime checks on the arguments
        if (process.env.NODE_ENV === 'debug') {
            if (arguments.length !== 1) {
                throw new Error('Invalid number of arguments');
            }
            if (typeof keyValueMap !== 'object') {
                throw new Error('Invalid argument type');
            }
        }

        this._addTags(keyValueMap);
        return this;
    }

    /**
     * Add a log record to this Span, optionally at a user-provided timestamp.
     *
     * For example:
     *
     *     span.log({
     *         size: rpc.size(),  // numeric value
     *         URI: rpc.URI(),  // string value
     *         payload: rpc.payload(),  // Object value
     *         "keys can be arbitrary strings": rpc.foo(),
     *     });
     *
     *     span.log({
     *         "error.description": someError.description(),
     *     }, someError.timestampMillis());
     *
     * @param {object} keyValuePairs
     *        An object mapping string keys to arbitrary value types. All
     *        Tracer implementations should support bool, string, and numeric
     *        value types, and some may also support Object values.
     * @param {number} timestamp
     *        An optional parameter specifying the timestamp in milliseconds
     *        since the Unix epoch. Fractional values are allowed so that
     *        timestamps with sub-millisecond accuracy can be represented. If
     *        not specified, the implementation is expected to use its notion
     *        of the current time of the call.
     */
    log(keyValuePairs, timestamp) {
        // Debug-only runtime checks on the arguments
        if (process.env.NODE_ENV === 'debug') {
            if (arguments.length > 2 || arguments.length === 0) {
                throw new Error('Invalid number of arguments');
            }
            if (arguments.length === 2) {
                if (typeof timestamp !== 'number') {
                    throw new Error('Expected timestamp to be a number');
                }
            }
            if (typeof keyValuePairs !== 'object') {
                throw new Error('Expected keyValuePairs to be an object');
            }
        }

        this._log(keyValuePairs, timestamp);
        return this;
    }

    /**
     * DEPRECATED
     */
    logEvent(eventName, payload) {
        // Debug-only runtime checks on the arguments
        if (process.env.NODE_ENV === 'debug') {
            if (arguments.length > 2 || arguments.length < 1) {
                throw new Error('Invalid number of arguments');
            }
            if (typeof eventName !== 'string') {
                throw new Error('Expected eventName to be a string');
            }
            if (payload !== undefined && typeof payload !== 'object') {
                throw new Error('Expected payload to be an object');
            }
        }

        return this._log({
            event   : eventName,
            payload : payload,
        });
    }

    /**
     * Sets the end timestamp and finalizes Span state.
     *
     * With the exception of calls to Span.context() (which are always allowed),
     * finish() must be the last call made to any span instance, and to do
     * otherwise leads to undefined behavior.
     *
     * @param  {number} finishTime
     *         Optional finish time in milliseconds as a Unix timestamp. Decimal
     *         values are supported for timestamps with sub-millisecond accuracy.
     *         If not specified, the current time (as defined by the
     *         implementation) will be used.
     */
    finish(finishTime) {
        // Debug-only runtime checks on the arguments
        if (process.env.NODE_ENV === 'debug') {
            if (arguments.length > 1) {
                throw new Error('Invalid arguments');
            }
            if (arguments.length === 1 && typeof finishTime !== 'number') {
                throw new Error('Unexpected argument type');
            }
        }

        this._finish(finishTime);

        // Do not return `this`. The Span generally should not be used after it
        // is finished so chaining is not desired in this context.
    }


    // ---------------------------------------------------------------------- //
    // Derived classes can choose to implement the below
    // ---------------------------------------------------------------------- //

    // By default returns a no-op SpanContext.
    _context() {
        return noop.spanContext;
    }

    // By default returns a no-op tracer.
    //
    // The base class could store the tracer that created it, but it does not
    // in order to ensure the no-op span implementation has zero members,
    // which allows V8 to aggressively optimize calls to such objects.
    _tracer() {
        return noop.tracer;
    }

    // By default does nothing
    _setOperationName(name) {
    }

    // By default does nothing
    _setBaggageItem(key, value) {
    }

    // By default does nothing
    _getBaggageItem(key) {
    }

    // By default does nothing
    //
    // NOTE: both setTag() and addTags() map to this function. keyValuePairs
    // will always be an associative array.
    _addTags(keyValuePairs) {
    }

    // By default does nothing
    _log(keyValuePairs, timestamp) {
    }

    // By default does nothing
    //
    // finishTime is expected to be either a number or undefined.
    _finish(finishTime) {
    }
}
