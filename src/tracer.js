'use strict';

import Span from './span';
import SpanContext from './span_context';
import Constants from './constants';
import Reference from './reference';

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
     * For example:
     *
     *     // Start a new (parentless) root Span:
     *     var parent = Tracer.startSpan('DoWork');
     *
     *     // Start a new (child) Span:
     *     var child = Tracer.startSpan('Subroutine', {
     *         reference: Tracer.childOf(parent.context()),
     *     });
     *
     * @param {string|object} nameOrFields - if the given argument is a
     *        string, it is the name of the operation and the second `fields`
     *        argument is optional. If it is an object, it is treated as the
     *        fields argument and a second argument should not be provided.
     * @param {object} [fields] - the fields to set on the newly created span.
     * @param {string} [fields.operationName] - the name to use for the newly
     *        created span. Required if called with a single argument.
     * @param {SpanContext} [fields.childOf] - a parent SpanContext (or Span,
     *        for convenience) that the newly-started span will be the child of
     *        (per REFERENCE_CHILD_OF). If specified, `fields.references` must
     *        be unspecified.
     * @param {array} [fields.references] - an array of Reference instances,
     *        each pointing to a causal parent SpanContext. If specified,
     *        `fields.childOf` must be unspecified.
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
            if (API_CONFORMANCE_CHECKS) {
                if (fields.childOf && fields.references) {
                    throw new Error('At most one of `childOf` and ' +
                            '`references` may be specified');
                }
                if (fields.childOf && !(
                            fields.childOf instanceof Span ||
                            fields.childOf instanceof SpanContext)) {
                    throw new Error('childOf must be a Span or SpanContext instance');
                }
            }
            // Convert fields.childOf to fields.references as needed.
            if (fields.childOf) {
                // Convert from a Span or a SpanContext into a Reference.
                let childOf = this.childOf(fields.childOf);
                if (fields.references) {
                    fields.references.push(childOf);
                } else {
                    fields.references = [childOf];
                }
                delete(fields.childOf);
            }
            spanImp = this._imp.startSpan(fields);
        }
        return new Span(spanImp);
    }

    /**
     * Return a new REFERENCE_CHILD_OF reference.
     *
     * @param {SpanContext} spanContext - the parent SpanContext instance to
     *        reference.
     * @return a REFERENCE_CHILD_OF reference pointing to `spanContext`
     */
    childOf(spanContext) {
        return new Reference(Constants.REFERENCE_CHILD_OF, spanContext);
    }

    /**
     * Return a new REFERENCE_FOLLOWS_FROM reference.
     *
     * @param {SpanContext} spanContext - the parent SpanContext instance to
     *        reference.
     * @return a REFERENCE_FOLLOWS_FROM reference pointing to `spanContext`
     */
    followsFrom(spanContext) {
        return new Reference(Constants.REFERENCE_FOLLOWS_FROM, spanContext);
    }

    /**
     * Injects the given SpanContext instance for cross-process propagation
     * within `carrier`. The expected type of `carrier` depends on the value of
     * `format.
     *
     * OpenTracing defines a common set of `format` values (see
     * FORMAT_TEXT_MAP, FORMAT_HTTP_HEADERS, and FORMAT_BINARY), and each has
     * an expected carrier type.
     *
     * Consider this pseudocode example:
     *
     *     var clientSpan = ...;
     *     ...
     *     // Inject clientSpan into a text carrier.
     *     var headersCarrier = {};
     *     Tracer.inject(clientSpan.context(), Tracer.FORMAT_HTTP_HEADERS, headersCarrier);
     *     // Incorporate the textCarrier into the outbound HTTP request header
     *     // map.
     *     outboundHTTPReq.headers.extend(headersCarrier);
     *     // ... send the httpReq
     *
     * @param  {SpanContext} spanContext - the SpanContext to inject into the
     *         carrier object. As a convenience, a Span instance may be passed
     *         in instead (in which case its .context() is used for the
     *         inject()).
     * @param  {string} format - the format of the carrier.
     * @param  {any} carrier - see the documentation for the chosen `format`
     *         for a description of the carrier object.
     */
    inject(spanContext, format, carrier) {
        if (API_CONFORMANCE_CHECKS) {
            if (arguments.length !== 3) {
                throw new Error('Invalid number of arguments.');
            }
            if (!(spanContext instanceof SpanContext || spanContext instanceof Span)) {
                throw new Error('first argument must be a SpanContext or Span instance');
            }
            if (typeof format !== 'string') {
                throw new Error(`format expected to be a string. Found: ${typeof format}`);
            }
            if (format === Constants.FORMAT_TEXT_MAP && typeof carrier !== 'object') {
                throw new Error('Unexpected carrier object for FORMAT_TEXT_MAP');
            }
            if (format === Constants.FORMAT_HTTP_HEADERS && typeof carrier !== 'object') {
                throw new Error('Unexpected carrier object for FORMAT_HTTP_HEADERS');
            }
            if (format === Constants.FORMAT_BINARY && typeof carrier !== 'object') {
                throw new Error('Unexpected carrier object for FORMAT_BINARY');
            }
        }

        if (this._imp) {
            // Allow the user to pass a Span instead of a SpanContext
            if (spanContext instanceof Span) {
                spanContext = spanContext.context();
            }
            this._imp.inject(spanContext._imp, format, carrier);
        }
    }

    /**
     * Returns a SpanContext instance extracted from `carrier` in the given
     * `format`.
     *
     * OpenTracing defines a common set of `format` values (see
     * FORMAT_TEXT_MAP, FORMAT_HTTP_HEADERS, and FORMAT_BINARY), and each has
     * an expected carrier type.
     *
     * Consider this pseudocode example:
     *
     *     // Use the inbound HTTP request's headers as a text map carrier.
     *     var headersCarrier = inboundHTTPReq.headers;
     *     var wireCtx = Tracer.extract(Tracer.FORMAT_HTTP_HEADERS, headersCarrier);
     *     var serverSpan = Tracer.startSpan('...', Tracer.childOf(wireCtx));
     *
     * @param  {string} format - the format of the carrier.
     * @param  {any} carrier - the type of the carrier object is determined by
     *         the format.
     * @return {SpanContext}
     *         The extracted SpanContext, or null if no such SpanContext could
     *         be found in `carrier`
     */
    extract(format, carrier) {
        if (API_CONFORMANCE_CHECKS) {
            if (arguments.length !== 2) {
                throw new Error('Invalid number of arguments.');
            }
            if (typeof format !== 'string' || !format.length) {
                throw new Error('format is expected to be a string of non-zero length');
            }
            if (format === Constants.FORMAT_TEXT_MAP && !(typeof carrier === 'object')) {
                throw new Error('Unexpected carrier object for FORMAT_TEXT_MAP');
            }
            if (format === Constants.FORMAT_HTTP_HEADERS && !(typeof carrier === 'object')) {
                throw new Error('Unexpected carrier object for FORMAT_HTTP_HEADERS');
            }
            if (format === Constants.FORMAT_BINARY) {
                if (carrier.buffer !== undefined && typeof carrier.buffer !== 'object') {
                    throw new Error('Unexpected carrier object for FORMAT_BINARY');
                }
            }
        }
        let spanContextImp = null;
        if (this._imp) {
            spanContextImp = this._imp.extract(format, carrier);
        }
        if (spanContextImp !== null) {
            return new SpanContext(spanContextImp);
        }
        return null;
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
