"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Constants = require("./constants");
var Functions = require("./functions");
var Noop = require("./noop");
var span_1 = require("./span");
var span_context_1 = require("./span_context");
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
var Tracer = (function () {
    function Tracer() {
    }
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
     *     var child = Tracer.startSpan('load-from-db', {
     *         childOf: parent.context(),
     *     });
     *
     *     // Start a new async (FollowsFrom) Span:
     *     var child = Tracer.startSpan('async-cache-write', {
     *         references: [
     *             opentracing.followsFrom(parent.context())
     *         ],
     *     });
     *
     * @param {string} name - the name of the operation (REQUIRED).
     * @param {SpanFields} [fields] - the fields to set on the newly created span.
     * @return {Span} - a new Span object.
     */
    Tracer.prototype.startSpan = function (name, fields) {
        if (fields === void 0) { fields = {}; }
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
            if (fields && fields.childOf && !(fields.childOf instanceof span_1.default ||
                fields.childOf instanceof span_context_1.default)) {
                throw new Error('childOf must be a Span or SpanContext instance');
            }
        }
        // Convert fields.childOf to fields.references as needed.
        if (fields.childOf) {
            // Convert from a Span or a SpanContext into a Reference.
            var childOf = Functions.childOf(fields.childOf);
            if (fields.references) {
                fields.references.push(childOf);
            }
            else {
                fields.references = [childOf];
            }
            delete (fields.childOf);
        }
        return this._startSpan(name, fields);
    };
    Tracer.prototype.inject = function (spanContext, format, carrier) {
        // Debug-only runtime checks on the arguments
        if (process.env.NODE_ENV === 'debug') {
            if (arguments.length !== 3) {
                throw new Error('Invalid number of arguments.');
            }
            if (!(spanContext instanceof span_context_1.default || spanContext instanceof span_1.default)) {
                throw new Error('first argument must be a SpanContext or Span instance');
            }
            if (typeof format !== 'string') {
                throw new Error("format expected to be a string. Found: " + typeof format);
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
        if (spanContext instanceof span_1.default) {
            spanContext = spanContext.context();
        }
        return this._inject(spanContext, format, carrier);
    };
    Tracer.prototype.extract = function (format, carrier) {
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
    };
    // ---------------------------------------------------------------------- //
    // Derived classes can choose to implement the below
    // ---------------------------------------------------------------------- //
    // NOTE: the input to this method is *always* an associative array. The
    // public-facing startSpan() method normalizes the arguments so that
    // all N implementations do not need to worry about variations in the call
    // signature.
    //
    // The default behavior returns a no-op span.
    Tracer.prototype._startSpan = function (name, fields) {
        return Noop.span;
    };
    // The default behavior is a no-op.
    Tracer.prototype._inject = function (spanContext, format, carrier) {
    };
    // The default behavior is to return null.
    Tracer.prototype._extract = function (format, carrier) {
        return Noop.spanContext;
    };
    return Tracer;
}());
exports.Tracer = Tracer;
exports.default = Tracer;
//# sourceMappingURL=tracer.js.map