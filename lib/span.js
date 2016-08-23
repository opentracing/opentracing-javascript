'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _tracer2 = require('./tracer');

var _tracer3 = _interopRequireDefault(_tracer2);

var _span_context = require('./span_context');

var _span_context2 = _interopRequireDefault(_span_context);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var noopTracer = new _tracer3.default();
var noopSpanContext = new _span_context2.default();

/**
 * Span represents a logical unit of work as part of a broader Trace. Examples
 * of span might include remote procedure calls or a in-process function calls
 * to sub-components. A Trace has a single, top-level "root" Span that in turn
 * may have zero or more child Spans, which in turn may have children.
 */

var Span = function () {
    function Span() {
        _classCallCheck(this, Span);
    }

    _createClass(Span, [{
        key: 'context',


        // ---------------------------------------------------------------------- //
        // OpenTracing API methods
        // ---------------------------------------------------------------------- //

        /**
         * Returns the SpanContext object associated with this Span.
         *
         * @return {SpanContext}
         */
        value: function context() {

            return this._context();
            // Debug-only runtime checks on the arguments
        }

        /**
         * Returns the Tracer object used to create this Span.
         *
         * @return {Tracer}
         */

    }, {
        key: 'tracer',
        value: function tracer() {

            return this._tracer();
            // Debug-only runtime checks on the arguments
        }

        /**
         * Sets the string name for the logical operation this span represents.
         *
         * @param {string} name
         */

    }, {
        key: 'setOperationName',
        value: function setOperationName(name) {

            this._setOperationName(name);
            // Debug-only runtime checks on the arguments

            return this;
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

    }, {
        key: 'setBaggageItem',
        value: function setBaggageItem(key, value) {

            this._setBaggageItem(key, value);
            // Debug-only runtime checks on the arguments

            return this;
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

    }, {
        key: 'getBaggageItem',
        value: function getBaggageItem(key) {

            return this._getBaggageItem(key);
            // Debug-only runtime checks on the arguments
        }

        /**
         * Adds a single tag to the span.  See `AddTags()` for details.
         *
         * @param {string} key
         * @param {any} value
         */

    }, {
        key: 'setTag',
        value: function setTag(key, value) {

            // NOTE: the call is normalized to a call to _addTags()
            this._addTags(_defineProperty({}, key, value));
            // Debug-only runtime checks on the arguments

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

    }, {
        key: 'addTags',
        value: function addTags(keyValuePairs) {

            this._addTags(keyValuePairs);
            // Debug-only runtime checks on the arguments

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

    }, {
        key: 'log',
        value: function log(fields) {

            this._log(fields);
            // Debug-only runtime checks on the arguments

            return this;
        }

        /**
         * Logs a event with an optional payload.
         *
         * @param  {string} eventName - string associated with the log record
         * @param  {object} [payload] - arbitrary payload object associated with the
         *         log record.
         */

    }, {
        key: 'logEvent',
        value: function logEvent(eventName, payload) {

            return this._log({
                event: eventName,
                payload: payload
            });
            // Debug-only runtime checks on the arguments
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

    }, {
        key: 'finish',
        value: function finish(finishTime) {

            this._finish(finishTime);

            // Do not return this. The Span generally should not be used after it
            // is finished so chaining is not desired in this context.

            // Debug-only runtime checks on the arguments
        }

        // ---------------------------------------------------------------------- //
        // Methods to be implemented by derived classes
        // ---------------------------------------------------------------------- //

        // By default returns a no-op SpanContext.

    }, {
        key: '_context',
        value: function _context() {
            return noopSpanContext;
        }

        // By default returns a no-op tracer.
        //
        // The base class could store the tracer that created it, but it does not
        // in order to ensure the no-op span implementation has zero members,
        // which allows V8 to aggressively optimize calls to such objects.

    }, {
        key: '_tracer',
        value: function _tracer() {
            return noopTracer;
        }

        // By default does nothing

    }, {
        key: '_setOperationName',
        value: function _setOperationName(name) {}

        // By default does nothing

    }, {
        key: '_setBaggageItem',
        value: function _setBaggageItem(key, value) {}

        // By default does nothing

    }, {
        key: '_getBaggageItem',
        value: function _getBaggageItem(key) {}

        // By default does nothing
        //
        // NOTE: both setTag() and addTags() map to this function. keyValuePairs
        // will always be an associative array.

    }, {
        key: '_addTags',
        value: function _addTags(keyValuePairs) {}

        // By default does nothing
        //
        // NOTE: both log() and logEvent() map to this function. fields will always
        // be an associative array.

    }, {
        key: '_log',
        value: function _log(fields) {}

        // By default does nothing
        //
        // finishTime is expected to be either a number or undefined.

    }, {
        key: '_finish',
        value: function _finish(finishTime) {}
    }]);

    return Span;
}();

exports.default = Span;

//# sourceMappingURL=span.js.map