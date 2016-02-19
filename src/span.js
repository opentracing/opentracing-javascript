'use strict';

const kKeyRegExp = new RegExp(/^[a-z0-9][-a-z0-9]*/);

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
     * Adds a single tag to the span.  See `AddTags()` for details.
     *
     * @param {string} key
     * @param {any} value
     */
    setTag(key, value) {
        if (API_CONFORMANCE_CHECKS) {
            if (arguments.length !== 2) {
                throw new Error('Invalid number of arguments');
            }
            if (typeof key !== 'string') {
                throw new Error('Tag key must be a string');
            }
        }
        this.addTags({ [key] : value });
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
    addTags(keyValuePairs) {
        if (API_CONFORMANCE_CHECKS) {
            if (arguments.length !== 1) {
                throw new Error('Invalid number of arguments');
            }
            if (typeof keyValuePairs !== 'object') {
                throw new Error('Invalid argument type');
            }
        }

        if (!this._imp) {
            return;
        }
        this._imp.addTags(keyValuePairs);
    }

    /**
     * Set an arbitrary key-value string pair that will be carried along the
     * full path of a trace.
     *
     * All spans created as children of this span will inherit the set of trace
     * attributes of this span.
     *
     * Trace attributes are copied between all spans, both in-process and across
     * distributed requets, therefore this feature should be used with care to
     * ensure undue overhead is not incurred.
     *
     * Trace keys are case insensitive, must match the regular expresssion
     * `[a-z0-9][-a-z0-9]*`.
     *
     * @param {string} key
     * @param {string} value
     */
    setTraceAttribute(key, value) {

        if (API_CONFORMANCE_CHECKS) {
            if (arguments.length !== 2) {
                throw new Error('Expected 2 arguments');
            }
            if (typeof key !== 'string' || key.length === 0) {
                throw new Error('Key must be a string');
            }
            if (!kKeyRegExp.match(key)) {
                throw new Error('Invalid trace key');
            }

            let valueType = typeof value;
            if (value !== null &&
                valueType !== 'boolean' &&
                valueType !== 'number' &&
                valueType !== 'string') {
                throw new Error('Trace attribute values can only be basic types');
            }
        }

        if (this._imp) {
            this._imp.setTraceAttribute(key, value);
        }
        return;
    }

    /**
     * Returns the value for the given trace attribute key.
     *
     * @param  {string} key
     *         The key for the given trace attribute.
     * @return {string}
     *         String value for the given key, or undefined if the key does not
     *         correspond to a set trace attribute.
     */
    getTraceAttribute(key) {
        if (API_CONFORMANCE_CHECKS) {
            if (arguments.length !== 1) {
                throw new Error('Expected 1 arguments');
            }
            if (typeof key !== 'string' || key.length === 0) {
                throw new Error('Key must be a string');
            }
            if (!kKeyRegExp.match(key)) {
                throw new Error('Invalid trace key');
            }
        }

        if (!this._imp) {
            return undefined;
        }
        return this._imp.getTraceAttribute(key);
    }

    /**
     * Starts a child span with the given operation name.
     *
     * Child spans automatically inherit all the trace attributes of the
     * parent span. Child span do not inherit any of the parent span tags.
     *
     * @param  {string} operationName
     *         Operation name to use for the child span.
     * @param  {Object} fields
     *         Optional associative array of key-value pairs. The set of valid
     *         fields is the same as `Tracer.startSpan` with the exception that
     *         `parent` is not valid in this context.
     * @return {Span}
     *         The newly created span.
     */
    startChildSpan(operationNameOrFields) {
        if (API_CONFORMANCE_CHECKS) {
            if (arguments.length !== 1) {
                throw new Error('Invalid arguments');
            }
            if (typeof operationNameOrFields !== 'string' && typeof operationNameOrFields !== 'object') {
                throw new Error('Invalid arguments');
            }
        }

        let spanImp = null;
        if (this._imp) {
            if (typeof operationNameOrFields === 'string') {
                operationNameOrFields = {
                    operationName: operationNameOrFields,
                };
            }

            spanImp = this._imp.startChild(operationNameOrFields);
        }
        return new Span(spanImp);
    }

    /**
     * Explicitly create a log record associated with the span.
     *
     * @param  {[type]} fields [description]
     * @param  {object} fields
     *         Optional associative array of fields.
     *         - `timestamp` {Number} Optional field specifying the timestamp
     *         		in milliseconds as a Unix timestamp. Fractional values are
     *         		allowed so that timestamps with sub-millisecond accuracy
     *         		can be represented. If not specified, the implementation
     *              is expected to use it's notion of the current time of the
     *         		call.
     *         - `event` {string}
     *         		The event name.
     *         - `payload` {object}
     *         		An arbitrary structured payload. It is implementation-dependent
     *         		how this will be processed.
     */
    log(fields) {
        if (API_CONFORMANCE_CHECKS) {
            if (arguments.length !== 1) {
                throw new Error('Invalid number of arguments');
            }
            if (typeof fields !== 'object') {
                throw new Error('Expected fields to be an object');
            }
        }
        if (!this._imp) {
            return;
        }
        this._imp.log(fields);
    }

    /**
     * Logs a event with an optional payload.
     *
     * @param  {string} eventName [description]
     * @param  {} payload   [description]
     * @return {[type]}           [description]
     */
    logEvent(eventName, payload) {
        return this.log({
            'event'   : eventName,
            'payload' : payload,
        });
    }

    /**
     * Indicates that the unit of work represented by the span is complete or
     * has otherwise been terminated.
     *
     * All Span objects must have finish() called on them before they are
     * reported to the backend implementation.
     *
     * Once `finish()` is called on a Span object, the behavior of all methods
     * on the object is considered undefined.
     *
     * @param  {Number} finishTime
     *         Optional finish time in milliseconds as a Unix timestamp. Decimal
     *         values are supported for timestamps with sub-millisecond accuracy.
     *         If not specified, the current time (as defined by the
     *         implementation) will be used.
     */
    finish(finishTime) {
        if (API_CONFORMANCE_CHECKS) {
            if (arguments.length > 1) {
                throw new Error('Invalid arguments');
            }
            if (arguments.length === 1 && typeof finishTime !== 'number') {
                throw new Error('Unexpected argument type');
            }
        }

        if (!this._imp) {
            return;
        }
        this._imp.finish(finishTime);
    }

    // ---------------------------------------------------------------------- //
    // Private and non-standard methods
    // ---------------------------------------------------------------------- //

    /**
     * Constructs a new Span object. This method should not be called directly.
     */
    constructor(imp) {
        this._imp = imp;
    }

    /**
     * Returns the Span implementation object. The returned object is by its
     * nature entirely implementation-dependent.
     */
    imp() {
        return this._imp;
    }
}
