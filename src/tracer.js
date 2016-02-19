'use strict';

import Span from './span';

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
     * 		   If the given argument is a `string`, it is the name of the
     *         the operation from the perpsective of the current service.
     *
     *         If the given argument is a object, it is treated as a set of
     *         fields to set on the newly created span.
     *
     *         - `operationName` {string} Required. This is the name to use for
     *              the newly created span.
     *         - `parent` {Span}  Optional. The newly created Span will be created
     *         		as a child of `parent`.
     *         - `tags` {object} Optional set of key-value pairs which will be set as
     *          	tags on the newly created Span. Ownership of the object is
     *         		passed to the created span and the caller for efficiency
     *         		reasons.
     *         - `startTime` {Number} Optional manually specified start time for the
     *         		created Span object. The time should be specified in
     *         		milliseconds as Unix timestamp. Decimal value are supported
     *         		to represent time values with sub-millisecond accuracy.
     *
     * @return {Span}
     *         A new Span object.
     */
    startSpan(nameOrFields) {
        if (API_CONFORMANCE_CHECKS) {
            if (arguments.length !== 1) {
                throw new Error('Invalid number of arguments.');
            }
            if (typeof nameOrFields !== 'string' && typeof nameOrFields !== 'object') {
                throw new Error('argument expected to be a string or object');
            }
            if (typeof nameOrFields === 'string' && nameOrFields.length === 0) {
                throw new Error('operation name cannot be length zero');
            }
            if (typeof nameOrFields === 'object') {
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
            // the same argument type.
            if (typeof nameOrFields === 'string') {
                nameOrFields = {
                    operationName : nameOrFields,
                }
            }
            spanImp = this._imp.startSpan(nameOrFields);
        }
        return new Span(spanImp);
    }

    /**
     * Returns an Injector object that handles the given `format`.
     *
     * @param  {string} format
     *         See the Injector documentation for valid formats.
     * @return {Injector}
     */
    injector(format) {
        if (API_CONFORMANCE_CHECKS) {
            if (arguments.length !== 1) {
                throw new Error('Invalid number of arguments.');
            }
            if (typeof format !== 'string') {
                throw new Error('format expected to be a string');
            }
        }

        let imp = null;
        if (this._imp) {
            imp = this._imp.injector(format);
        }
        return new Injector(imp);
    }

    /**
     * Returns an Extractor object that handles the given `format`.
     *
     * @param  {string} format
     *         See the Extractor documentation for valid formats.
     * @return {Injector}
     */
    extractor(format) {
        if (API_CONFORMANCE_CHECKS) {
            if (arguments.length !== 1) {
                throw new Error('Invalid number of arguments.');
            }
            if (typeof format !== 'string') {
                throw new Error('format expected to be a string');
            }
        }
        let imp = null;
        if (this._imp) {
            imp = this._imp.extractor(format);
        }
        return new Extractor(imp);
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
