'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _span = require('./span');

var _span2 = _interopRequireDefault(_span);

var _span_context = require('./span_context');

var _span_context2 = _interopRequireDefault(_span_context);

var _constants = require('./constants');

var _constants2 = _interopRequireDefault(_constants);

var _reference = require('./reference');

var _reference2 = _interopRequireDefault(_reference);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * Tracer is the entry-point between the instrumentation API and the tracing
 * implementation.
 *
 * The default object acts as a no-op implementation.
 */
var Tracer = function () {
    _createClass(Tracer, [{
        key: 'startSpan',


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
        value: function startSpan(nameOrFields, fields) {

            var spanImp = null;
            if (this._imp) {
                // Normalize the argument so the implementation is always provided
                // an associative array of fields.
                if (arguments.length === 1) {
                    if (typeof nameOrFields === 'string') {
                        fields = {
                            operationName: nameOrFields
                        };
                    } else {
                        fields = nameOrFields;
                    }
                } else {
                    fields.operationName = nameOrFields;
                }

                // Convert fields.childOf to fields.references as needed.
                if (fields.childOf) {
                    // Convert from a Span or a SpanContext into a Reference.
                    var childOf = this.childOf(fields.childOf);
                    if (fields.references) {
                        fields.references.push(childOf);
                    } else {
                        fields.references = [childOf];
                    }
                    delete fields.childOf;
                }
                spanImp = this._imp.startSpan(fields);
            }
            return new _span2.default(spanImp);
        }

        /**
         * Return a new REFERENCE_CHILD_OF reference.
         *
         * @param {SpanContext} spanContext - the parent SpanContext instance to
         *        reference.
         * @return a REFERENCE_CHILD_OF reference pointing to `spanContext`
         */

    }, {
        key: 'childOf',
        value: function childOf(spanContext) {
            return new _reference2.default(_constants2.default.REFERENCE_CHILD_OF, spanContext);
        }

        /**
         * Return a new REFERENCE_FOLLOWS_FROM reference.
         *
         * @param {SpanContext} spanContext - the parent SpanContext instance to
         *        reference.
         * @return a REFERENCE_FOLLOWS_FROM reference pointing to `spanContext`
         */

    }, {
        key: 'followsFrom',
        value: function followsFrom(spanContext) {
            return new _reference2.default(_constants2.default.REFERENCE_FOLLOWS_FROM, spanContext);
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

    }, {
        key: 'inject',
        value: function inject(spanContext, format, carrier) {

            if (this._imp) {
                // Allow the user to pass a Span instead of a SpanContext
                if (spanContext instanceof _span2.default) {
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
         *     var serverSpan = Tracer.startSpan('...', { childOf : wireCtx });
         *
         * @param  {string} format - the format of the carrier.
         * @param  {any} carrier - the type of the carrier object is determined by
         *         the format.
         * @return {SpanContext}
         *         The extracted SpanContext, or null if no such SpanContext could
         *         be found in `carrier`
         */

    }, {
        key: 'extract',
        value: function extract(format, carrier) {
            var spanContextImp = null;
            if (this._imp) {
                spanContextImp = this._imp.extract(format, carrier);
            }
            if (spanContextImp !== null) {
                return new _span_context2.default(spanContextImp);
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

    }, {
        key: 'flush',
        value: function flush(done) {
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

    }]);

    function Tracer(imp) {
        _classCallCheck(this, Tracer);

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


    _createClass(Tracer, [{
        key: 'imp',
        value: function imp() {
            return this._imp;
        }
    }]);

    return Tracer;
}();

exports.default = Tracer;

//# sourceMappingURL=tracer.js.map