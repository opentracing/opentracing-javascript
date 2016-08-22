'use strict';

import Tracer from './tracer';
import SpanContext from './span_context';
let defaultTracer = require('./default_tracer');

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
        if (API_CONFORMANCE_CHECKS) {
            if (arguments.length !== 0) {
                throw new Error('Invalid number of arguments');
            }
        }
        let spanContextImp = null;
        if (this._imp) {
            spanContextImp = this._imp.context();
        }
        return new SpanContext(spanContextImp);
    }

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
            if (typeof name !== 'string' || name.length === 0) {
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
        if (API_CONFORMANCE_CHECKS) {
            if (arguments.length !== 2) {
                throw new Error('Invalid number of arguments');
            }
        }
        if (this._imp) {
            this._imp.setBaggageItem(key, value);
        }
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
        if (API_CONFORMANCE_CHECKS) {
            if (arguments.length !== 1) {
                throw new Error('Invalid number of arguments');
            }
        }
        if (this._imp) {
            return this._imp.getBaggageItem(key);
        }
        return undefined;
    }

    // ---------------------------------------------------------------------- //
    // Private and non-standard methods
    // ---------------------------------------------------------------------- //

    /**
     * Constructs a new Span object, this method should not be called directly;
     * Tracer.startSpan() or Tracer.join() should be used instead.
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
