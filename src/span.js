'use strict';

import Tracer from './tracer';
let defaultTracer = require('./default_tracer');

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
     * Returns the Tracer object used to create this Span.
     *
     * @return {Tracer}
     */
    tracer() {
        if (API_CONFORMANCE_CHECKS) {
            if (arguments.length !== 0) {
                throw new Error('Invalid number of arguments');
            }
        }
        if (this._imp) {
            return new Tracer(this._imp.tracer());
        }
        return defaultTracer;
    }

    /**
     * Sets the string name for the logical operation this span represents.
     *
     * @param {string} name
     */
    setOperationName(name) {
        if (API_CONFORMANCE_CHECKS) {
            if (arguments.length !== 1) {
                throw new Error('Invalid number of arguments');
            }
            if (typeof name !== 'string' || name.length > 0) {
                throw new Error('Name must be a string of length > 0');
            }
        }
        if (this._imp) {
            this._imp.setOperationName(name);
        }
        return this;
    }

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
        return this;
    }

    /**
     * Set an arbitrary key-value string pair that will be carried along the
     * full path of a trace.
     *
     * All spans created as children of this span will inherit the baggage items
     * of this span.
     *
     * Baggage items are copied between all spans, both in-process and across
     * distributed requests, therefore this feature should be used with care to
     * ensure undue overhead is not incurred.
     *
     * Keys are case insensitive and must match the regular expresssion
     * `[a-z0-9][-a-z0-9]*`.
     *
     * @param {string} key
     * @param {string} value
     */
    setBaggageItem(key, value) {
        if (API_CONFORMANCE_CHECKS) {
            if (arguments.length !== 2) {
                throw new Error('Expected 2 arguments');
            }
            if (typeof key !== 'string' || key.length === 0) {
                throw new Error('Key must be a string');
            }
            if (!kKeyRegExp.test(key)) {
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
            this._imp.setBaggageItem(key, value);
        }
        return this;
    }

    /**
     * Returns the value for the given baggage item key.
     *
     * @param  {string} key
     *         The key for the given trace attribute.
     * @return {string}
     *         String value for the given key, or undefined if the key does not
     *         correspond to a set trace attribute.
     */
    getBaggageItem(key) {
        if (API_CONFORMANCE_CHECKS) {
            if (arguments.length !== 1) {
                throw new Error('Expected 1 arguments');
            }
            if (typeof key !== 'string' || key.length === 0) {
                throw new Error('Key must be a string');
            }
            if (!kKeyRegExp.test(key)) {
                throw new Error('Invalid trace key');
            }
        }

        if (!this._imp) {
            return undefined;
        }
        return this._imp.getBaggageItem(key);
    }

    /**
     * Explicitly create a log record associated with the span.
     *
     * @param {object} fields - object containing the log record properties
     * @param {number} [fields.timestamp] - optional field specifying the
     *        timestamp in milliseconds as a Unix timestamp. Fractional values
     *        are allowed so that timestamps with sub-millisecond accuracy
     *        can be represented. If not specified, the implementation is
     *        expected to use it's notion of the current time of the call.
     * @param {string} [fields.event] - the event name
     * @param {object} [fields.payload] - an arbitrary structured payload. It is
     *        implementation-dependent how this will be processed.
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
        return this;
    }

    /**
     * Logs a event with an optional payload.
     *
     * @param  {string} eventName - string associated with the log record
     * @param  {object} [payload] - arbitrary payload object associated with the
     *         log record.
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
