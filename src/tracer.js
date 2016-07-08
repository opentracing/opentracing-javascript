'use strict';

import Span from './span';
import Constants from './constants';

/**
 * Tracer is the entry-point between the instrumentation API and the tracing
 * implementation.
 *
 * The default object acts as a no-op implementation.
 */
export default class Tracer {

    // ---------------------------------------------------------------------- //
    // OpenTracing API methods
    // ---------------------------------------------------------------------- //

    /**
     * Starts and returns a new Span representing a logical unit of work.
     *
     * @param  {string|object} nameOrFields - if the given argument is a
     *        string, it is the name of the operation and the second `fields`
     *        argument is optional. If it is an object, it is treated as the
     *        fields argument and a second argument should not be provided.
     * @param {object} [fields] - the fields to set on the newly created span.
     * @param {string} [fields.operationName] - the name to use for the newly
     *        created span. Required if called with a single argument.
     * @param {Span} [fields.parent] - the parent of the newly created span
     * @param {object} [fields.tags] - set of key-value pairs which will be set
     *        as tags on the newly created Span. Ownership of the object is
     *        passed to the created span for efficiency reasons (the caller
     *        should not modify this object after calling startSpan).
     * @param {number} [fields.startTime] - a manually specified start time for
     *        the created Span object. The time should be specified in
     *        milliseconds as Unix timestamp. Decimal value are supported
     *        to represent time values with sub-millisecond accuracy.
     * @return {Span} - a new Span object.
     */
    startSpan(nameOrFields, fields) {
        if (API_CONFORMANCE_CHECKS) {
            if (arguments.length > 2) {
                throw new Error('Invalid number of arguments.');
            }
            if (typeof nameOrFields !== 'string' && typeof nameOrFields !== 'object') {
                throw new Error('argument expected to be a string or object');
            }
            if (typeof nameOrFields === 'string' && nameOrFields.length === 0) {
                throw new Error('operation name cannot be length zero');
            }
            if (typeof nameOrFields === 'object') {
                if (arguments.length !== 1) {
                    throw new Error('Unexpected number of arguments');
                }
                if (nameOrFields === null) {
                    throw new Error('fields should not be null');
                }
                if (!nameOrFields.operationName) {
                    throw new Error('operationName is a required parameter');
                }
            }
        }

        let spanImp = null;
        if (this._imp) {
            // Normalize the argument so the implementation is always provided
            // an associative array of fields.
            if (arguments.length === 1) {
                if (typeof nameOrFields === 'string') {
                    fields = {
                        operationName : nameOrFields,
                    };
                } else {
                    fields = nameOrFields;
                }
            } else {
                fields.operationName = nameOrFields;
            }
            spanImp = this._imp.startSpan(fields);
        }
        return new Span(spanImp);
    }

    /**
     * Injects the information about the given span into the carrier
     * so that the span can propogate across inter-process barriers.
     *
     * See FORMAT_TEXT_MAP and FORMAT_BINARY for the two required carriers.
     *
     * Consider this pseudocode example:
     *
     *     var clientSpan = ...;
     *     ...
     *     // Inject clientSpan into a text carrier.
     *     var textCarrier = {};
     *     Tracer.inject(clientSpan, Tracer.FORMAT_TEXT_MAP, textCarrier);
     *     // Incorporate the textCarrier into the outbound HTTP request header
     *     // map.
     *     outboundHTTPReq.headers.extend(textCarrier);
     *     // ... send the httpReq
     *
     * For FORMAT_BINARY, inject() will set the buffer field to an Array-like
     * (Array, ArrayBuffer, or TypedBuffer) object containing the injected
     * binary data.  Any valid Object can be used as long as the buffer field of
     * the object can be set.
     *
     * @param  {Span} span - the span whose information should be injected into
     *         the carrier.
     * @param  {string} format - the format of the carrier.
     * @param  {any} carrier - see the method description for details on the
     *         carrier object.
     */
    inject(span, format, carrier) {
        if (API_CONFORMANCE_CHECKS) {
            if (arguments.length !== 3) {
                throw new Error('Invalid number of arguments.');
            }
            if (!(span instanceof Span)) {
                throw new Error('Expected span object as first argument');
            }
            if (typeof format !== 'string') {
                throw new Error(`format expected to be a string. Found: ${typeof format}`);
            }
            if (format === Constants.FORMAT_TEXT_MAP && typeof carrier !== 'object') {
                throw new Error('Unexpected carrier object for TEXT_MAP format');
            }
            if (format === Constants.FORMAT_BINARY && typeof carrier !== 'object') {
                throw new Error('Unexpected carrier object for BINARY format');
            }
        }

        if (this._imp) {
            this._imp.inject(span._imp, format, carrier);
        }
    }

    /**
     * Returns a new Span object with the given operation name using the trace
     * information from the carrier.
     *
     * See FORMAT_TEXT_MAP and FORMAT_BINARY for the two required carriers.
     *
     * Consider this pseudocode example:
     *
     *     // Use the inbound HTTP request's headers as a text map carrier.
     *     var textCarrier = inboundHTTPReq.headers;
     *     var serverSpan = Tracer.join(
     *         "operation name", Tracer.FORMAT_TEXT_MAP, textCarrier);
     *
     * For FORMAT_BINARY, `carrier` is expected to have a field named `buffer`
     * that contains an Array-like object (Array, ArrayBuffer, or TypedBuffer).
     *
     * @param  {string} operationName - operation name to use on the newly
     *         created span.
     * @param  {string} format - the format of the carrier.
     * @param  {any} carrier - the type of the carrier object is determined by
     *         the format.
     * @return {Span}
     */
    join(operationName, format, carrier) {
        if (API_CONFORMANCE_CHECKS) {
            if (arguments.length !== 3) {
                throw new Error('Invalid number of arguments.');
            }
            if (typeof operationName !== 'string' || !operationName.length) {
                throw new Error('operationName is expected to be a string of non-zero length');
            }
            if (typeof format !== 'string' || !format.length) {
                throw new Error('format is expected to be a string of non-zero length');
            }
            if (format === Constants.FORMAT_TEXT_MAP && !(typeof carrier === 'object')) {
                throw new Error('Unexpected carrier object for FORMAT_TEXT_MAP');
            }
            if (format === Constants.FORMAT_BINARY) {
                if (carrier.buffer !== undefined && typeof carrier.buffer !== 'object') {
                    throw new Error('Unexpected carrier object for FORMAT_BINARY');
                }
            }
        }
        let spanImp = null;
        if (this._imp) {
            spanImp = this._imp.join(operationName, format, carrier);
        }
        return new Span(spanImp);
    }

    /**
     * Request that any buffered or in-memory data is flushed out of the process.
     *
     * @param {function(err: objectg)} done - optional callback function with
     *        the signature `function(err)` that will be called as soon as the
     *        flush completes. `err` should be null or undefined if the flush
     *        was successful.
     */
    flush(done) {
        if (API_CONFORMANCE_CHECKS) {
            if (arguments.length > 1) {
                throw new Error('Invalid number of arguments');
            }
            if (done !== undefined && typeof done !== 'function') {
                throw new Error('callback expected to be a function');
            }
        }
        if (!this._imp) {
            done(null);
            return;
        }
        this._imp.flush(done);
    }


    // ---------------------------------------------------------------------- //
    // Private and non-standard methods
    // ---------------------------------------------------------------------- //

    /**
     * Note: this constructor should not be called directly by consumers of this
     * code. The singleton's initNewTracer() method should be invoked instead.
     */
    constructor(imp) {
        this._imp = imp || null;
    }

    /**
     * Handle to implementation object.
     *
     * Use of this method is discouraged as it greatly reduces the portability of
     * the calling code. Use only when implementation-specific functionality must
     * be used and cannot accessed otherwise.
     *
     * @return {object}
     *         An implementation-dependent object.
     */
    imp() {
        return this._imp;
    }
}
