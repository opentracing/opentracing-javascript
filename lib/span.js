'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _tracer = require('./tracer');

var _tracer2 = _interopRequireDefault(_tracer);

var _span_context = require('./span_context');

var _span_context2 = _interopRequireDefault(_span_context);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var defaultTracer = require('./default_tracer');

/**
 * Span represents a logical unit of work as part of a broader Trace. Examples
 * of span might include remote procedure calls or a in-process function calls
 * to sub-components. A Trace has a single, top-level "root" Span that in turn
 * may have zero or more child Spans, which in turn may have children.
 */

var Span = function () {
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
            var spanContextImp = null;
            if (this._imp) {
                spanContextImp = this._imp.context();
            }
            return new _span_context2.default(spanContextImp);
        }

        /**
         * Returns the Tracer object used to create this Span.
         *
         * @return {Tracer}
         */

    }, {
        key: 'tracer',
        value: function tracer() {
            if (this._imp) {
                return new _tracer2.default(this._imp.tracer());
            }
            return defaultTracer;
        }

        /**
         * Sets the string name for the logical operation this span represents.
         *
         * @param {string} name
         */

    }, {
        key: 'setOperationName',
        value: function setOperationName(name) {
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

    }, {
        key: 'setTag',
        value: function setTag(key, value) {
            this.addTags(_defineProperty({}, key, value));
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

    }, {
        key: 'log',
        value: function log(fields) {
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

    }, {
        key: 'logEvent',
        value: function logEvent(eventName, payload) {
            return this.log({
                event: eventName,
                payload: payload
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

    }, {
        key: 'finish',
        value: function finish(finishTime) {

            if (!this._imp) {
                return;
            }
            this._imp.finish(finishTime);
        }

        // ---------------------------------------------------------------------- //
        // Private and non-standard methods
        // ---------------------------------------------------------------------- //

        /**
         * Constructs a new Span object, this method should not be called directly;
         * Tracer.startSpan() or Tracer.join() should be used instead.
         */

    }]);

    function Span(imp) {
        _classCallCheck(this, Span);

        this._imp = imp;
    }

    /**
     * Returns the Span implementation object. The returned object is by its
     * nature entirely implementation-dependent.
     */


    _createClass(Span, [{
        key: 'imp',
        value: function imp() {
            return this._imp;
        }
    }]);

    return Span;
}();

exports.default = Span;

//# sourceMappingURL=span.js.map