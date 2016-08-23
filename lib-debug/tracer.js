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

var _reference2 = require('./reference');

var _reference3 = _interopRequireDefault(_reference2);

var _constants = require('./constants');

var Constants = _interopRequireWildcard(_constants);

var _noop = require('./noop');

var noop = _interopRequireWildcard(_noop);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * Tracer is the entry-point between the instrumentation API and the tracing
 * implementation.
 *
 * The default object acts as a no-op implementation.
 *
 * ### Note to implementators:
 *
 * An implementation should derive from Tracer. The base class provides
 * "public" methods such as `startSpan()` which do two things before calling
 * the a similarly named worker method (in this case, `_startSpan()`), which the
 * derived class is expected to implement. The base does two things before
 * calling the worker method:
 *
 * (1) It normalizes the arguments before passing the arguments along to the
 * derived class. This avoids all N implementations from having to re-implement
 * error-prone argument manipulation to support different call signatures.  For
 * example, `inject()` allows either a `Span` or a `SpanContext` to be passed to
 * the function; `_inject()` will always be passed a `SpanContext`.
 *
 * (2) It provides argument checking when run in debug mode.
 *
 * Derived classes, of course, can override the "public" methods directly if
 * desired.
 */
var Tracer = function () {
    function Tracer() {
        _classCallCheck(this, Tracer);
    }

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
            // Debug-only runtime checks on the arguments
            if (process.env.NODE_ENV === 'debug') {
                if (arguments.length > 2) {
                    throw new Error('Invalid number of arguments.');
                }
                if (typeof nameOrFields !== 'string' && (typeof nameOrFields === 'undefined' ? 'undefined' : _typeof(nameOrFields)) !== 'object') {
                    throw new Error('argument expected to be a string or object');
                }
                if (typeof nameOrFields === 'string' && nameOrFields.length === 0) {
                    throw new Error('operation name cannot be length zero');
                }
                if ((typeof nameOrFields === 'undefined' ? 'undefined' : _typeof(nameOrFields)) === 'object') {
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
            if (process.env.NODE_ENV === 'debug') {
                if (fields.childOf && fields.references) {
                    throw new Error('At most one of `childOf` and ' + '`references` may be specified');
                }
                if (fields.childOf && !(fields.childOf instanceof _span2.default || fields.childOf instanceof _span_context2.default)) {
                    throw new Error('childOf must be a Span or SpanContext instance');
                }
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
            return this._startSpan(fields);
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
            // Allow the user to pass a Span instead of a SpanContext
            if (spanContext instanceof _span2.default) {
                spanContext = spanContext.context();
            }
            return this._reference(Constants.REFERENCE_CHILD_OF, spanContext);
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
            // Allow the user to pass a Span instead of a SpanContext
            if (spanContext instanceof _span2.default) {
                spanContext = spanContext.context();
            }
            return this._reference(Constants.REFERENCE_FOLLOWS_FROM, spanContext);
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
            // Debug-only runtime checks on the arguments
            if (process.env.NODE_ENV === 'debug') {
                if (arguments.length !== 3) {
                    throw new Error('Invalid number of arguments.');
                }
                if (!(spanContext instanceof _span_context2.default || spanContext instanceof _span2.default)) {
                    throw new Error('first argument must be a SpanContext or Span instance');
                }
                if (typeof format !== 'string') {
                    throw new Error('format expected to be a string. Found: ' + (typeof format === 'undefined' ? 'undefined' : _typeof(format)));
                }
                if (format === Constants.FORMAT_TEXT_MAP && (typeof carrier === 'undefined' ? 'undefined' : _typeof(carrier)) !== 'object') {
                    throw new Error('Unexpected carrier object for FORMAT_TEXT_MAP');
                }
                if (format === Constants.FORMAT_HTTP_HEADERS && (typeof carrier === 'undefined' ? 'undefined' : _typeof(carrier)) !== 'object') {
                    throw new Error('Unexpected carrier object for FORMAT_HTTP_HEADERS');
                }
                if (format === Constants.FORMAT_BINARY && (typeof carrier === 'undefined' ? 'undefined' : _typeof(carrier)) !== 'object') {
                    throw new Error('Unexpected carrier object for FORMAT_BINARY');
                }
            }

            // Allow the user to pass a Span instead of a SpanContext
            if (spanContext instanceof _span2.default) {
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

    }, {
        key: 'extract',
        value: function extract(format, carrier) {
            // Debug-only runtime checks on the arguments
            if (process.env.NODE_ENV === 'debug') {
                if (arguments.length !== 2) {
                    throw new Error('Invalid number of arguments.');
                }
                if (typeof format !== 'string' || !format.length) {
                    throw new Error('format is expected to be a string of non-zero length');
                }
                if (format === Constants.FORMAT_TEXT_MAP && !((typeof carrier === 'undefined' ? 'undefined' : _typeof(carrier)) === 'object')) {
                    throw new Error('Unexpected carrier object for FORMAT_TEXT_MAP');
                }
                if (format === Constants.FORMAT_HTTP_HEADERS && !((typeof carrier === 'undefined' ? 'undefined' : _typeof(carrier)) === 'object')) {
                    throw new Error('Unexpected carrier object for FORMAT_HTTP_HEADERS');
                }
                if (format === Constants.FORMAT_BINARY) {
                    if (carrier.buffer !== undefined && _typeof(carrier.buffer) !== 'object') {
                        throw new Error('Unexpected carrier object for FORMAT_BINARY');
                    }
                }
            }
            return this._extract(format, carrier);
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
            // Debug-only runtime checks on the arguments
            if (process.env.NODE_ENV === 'debug') {
                if (arguments.length > 1) {
                    throw new Error('Invalid number of arguments');
                }
                if (done !== undefined && typeof done !== 'function') {
                    throw new Error('callback expected to be a function');
                }
            }

            this._flush(done);
        }

        // ---------------------------------------------------------------------- //
        // Methods to be implemented by derived classes
        // ---------------------------------------------------------------------- //

        // NOTE: the input to this method is *always* an associative array. The
        // public-facing startSpan() method normalizes the arguments so that
        // all N implementations do not need to worry about variations in the call
        // signature.
        //
        // The default behavior returns a no-op span.

    }, {
        key: '_startSpan',
        value: function _startSpan(fields) {
            return noop.span;
        }

        // The default behavior returns a valid Reference of the given type

    }, {
        key: '_reference',
        value: function _reference(type, spanContext) {
            return new _reference3.default(type, spanContext);
        }

        // The default behavior is a no-op.

    }, {
        key: '_inject',
        value: function _inject(spanContext, format, carrier) {}

        // The default behavior is to return null.

    }, {
        key: '_extract',
        value: function _extract(format, carrier) {
            return noop.spanContext;
        }

        // The default implementation is a no-op that directly calls the callback,
        // presuming one is provided.

    }, {
        key: '_flush',
        value: function _flush(done) {
            if (done) {
                done(null);
            }
        }
    }]);

    return Tracer;
}();

exports.default = Tracer;

//# sourceMappingURL=tracer.js.map