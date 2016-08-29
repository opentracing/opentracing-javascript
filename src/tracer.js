import Span from './span';
import SpanContext from './span_context';
import * as Constants from './constants';
import * as Functions from './functions';
import * as Noop from './noop';

/**
 * Tracer is the entry-point between the instrumentation API and the tracing
 * implementation.
 *
 * The default object acts as a no-op implementation.
 *
 * Note to implementators: derived classes can choose to directly implement the
 * methods in the "OpenTracing API methods" section, or optionally the subset of
 * underscore-prefixed methods to pick up the argument checking and handling
 * automatically from the base class.
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
     *         childOf: parent.context(),
     *     });
     *
     * @param {string} name - the name of the operation.
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
    startSpan(name, fields) {
        // Debug-only runtime checks on the arguments
        if (process.env.NODE_ENV === 'debug') {
            if (arguments.length > 2) {
                throw new Error('Invalid number of arguments.');
            }
            if (typeof name !== 'string') {
                throw new Error('argument expected to be a string');
            }
            if (name.length === 0) {
                throw new Error('operation name cannot be length zero');
            }
            if (fields && fields.childOf && fields.references) {
                throw new Error('At most one of `childOf` and ' +
                        '`references` may be specified');
            }
            if (fields && fields.childOf && !(
                        fields.childOf instanceof Span ||
                        fields.childOf instanceof SpanContext)) {
                throw new Error('childOf must be a Span or SpanContext instance');
            }
        }

        // Convert fields.childOf to fields.references as needed.
        fields = fields || {};
        if (fields.childOf) {
            // Convert from a Span or a SpanContext into a Reference.
            let childOf = Functions.childOf(fields.childOf);
            if (fields.references) {
                fields.references.push(childOf);
            } else {
                fields.references = [childOf];
            }
            delete(fields.childOf);
        }
        return this._startSpan(name, fields);
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
     *     Object.assign(outboundHTTPReq.headers, headersCarrier);
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
        // Debug-only runtime checks on the arguments
        if (process.env.NODE_ENV === 'debug') {
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

        // Allow the user to pass a Span instead of a SpanContext
        if (spanContext instanceof Span) {
            spanContext = spanContext.context();
        }
        return this._inject(spanContext, format, carrier);
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
     *     var serverSpan = Tracer.startSpan('...', { childOf : wireCtx });
     *
     * @param  {string} format - the format of the carrier.
     * @param  {any} carrier - the type of the carrier object is determined by
     *         the format.
     * @return {SpanContext}
     *         The extracted SpanContext, or null if no such SpanContext could
     *         be found in `carrier`
     */
    extract(format, carrier) {
        // Debug-only runtime checks on the arguments
        if (process.env.NODE_ENV === 'debug') {
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
        return this._extract(format, carrier);
    }

    // ---------------------------------------------------------------------- //
    // Derived classes can choose to implement the below
    // ---------------------------------------------------------------------- //

    // NOTE: the input to this method is *always* an associative array. The
    // public-facing startSpan() method normalizes the arguments so that
    // all N implementations do not need to worry about variations in the call
    // signature.
    //
    // The default behavior returns a no-op span.
    _startSpan(name, fields) {
        return Noop.span;
    }

    // The default behavior is a no-op.
    _inject(spanContext, format, carrier) {
    }

    // The default behavior is to return null.
    _extract(format, carrier) {
        return Noop.spanContext;
    }
}
