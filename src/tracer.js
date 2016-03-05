'use strict';

import Span from './span';
import Constants from './constants';
import SplitTextCarrier from './carriers/split_text_carrier';
import BinaryCarrier from './carriers/binary_carrier';

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
     * @param  {string|object} nameOrFields
     *         If the given argument is a `string`, it is the name of the
     *         the operation from the perpsective of the current service.
     *
     *         If the given argument is a object, it is treated as a set of
     *         fields to set on the newly created span.
     *
     *         - `operationName` {string} Required. This is the name to use for
     *              the newly created span.
     *         - `parent` {Span}  Optional. The newly created Span will be created
     *              as a child of `parent`.
     *         - `tags` {object} Optional set of key-value pairs which will be set as
     *              tags on the newly created Span. Ownership of the object is
     *              passed to the created span and the caller for efficiency
     *              reasons.
     *         - `startTime` {Number} Optional manually specified start time for the
     *              created Span object. The time should be specified in
     *              milliseconds as Unix timestamp. Decimal value are supported
     *              to represent time values with sub-millisecond accuracy.
     *
     * @return {Span}
     *         A new Span object.
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
                    throw new Error('operationName is a required parameter')
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
     * @param  {Span} span
     *         The span whose information should be injected into the carrier.
     * @param  {string} format
     *         The format of the carrier.
     * @param  {any} carrier
     *         The type of the carrier object is determined by the format.
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
                throw new Error('format expected to be a string');
            }
            if (format === Constants.FORMAT_SPLIT_TEXT && !(carrier instanceof SplitTextCarrier)) {
                throw new Error('Unexpected carrier object for "split_text" format');
            }
            if (format === Constants.FORMAT_BINARY && !(carrier instanceof BinaryCarrier)) {
                throw new Error('Unexpected carrier object for "binary" format');
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
     * @param  {string} operationName
     *         Operation name to use on the newly created span.
     * @param  {string} format
     *         The format of the carrier.
     * @param  {any} carrier
     *         The type of the carrier object is determined by the format.
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
            if (format === Constants.FORMAT_SPLIT_TEXT && !(carrier instanceof SplitTextCarrier)) {
                throw new Error('Unexpected carrier object for "split_text" format');
            }
            if (format === Constants.FORMAT_BINARY && !(carrier instanceof BinaryCarrier)) {
                throw new Error('Unexpected carrier object for "binary" format');
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
     * @param {function} done
     *        Optional callback function with the signature `function(err)` that
     *        will be called as soon as the flush completes. `err` should be
     *        null or undefined if the flush was successful.
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
