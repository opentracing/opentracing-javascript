'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _span = require('./span');

var _span2 = _interopRequireDefault(_span);

var _span_context = require('./span_context');

var _span_context2 = _interopRequireDefault(_span_context);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * Reference pairs a reference type constant (e.g., REFERENCE_CHILD_OF or
 * REFERENCE_FOLLOWS_FROM) with the SpanContext it points to.
 *
 * See the exported childOf() and followsFrom() functions at the package level.
 */
var Reference = function () {
    _createClass(Reference, [{
        key: 'type',


        /**
         * @return {string} The Reference type (e.g., REFERENCE_CHILD_OF or
         *         REFERENCE_FOLLOWS_FROM).
         */
        value: function type() {
            return this._type;
        }

        /**
         * @return {SpanContext} The SpanContext being referred to (e.g., the
         *         parent in a REFERENCE_CHILD_OF Reference).
         */

    }, {
        key: 'referencedContext',
        value: function referencedContext() {
            return this._referencedContext;
        }

        /**
         * Initialize a new Reference instance.
         *
         * @param {string} type - the Reference type constant (e.g.,
         *        REFERENCE_CHILD_OF or REFERENCE_FOLLOWS_FROM).
         * @param {SpanContext} referencedContext - the SpanContext being referred
         *        to. As a convenience, a Span instance may be passed in instead
         *        (in which case its .context() is used here).
         */

    }]);

    function Reference(type, referencedContext) {
        _classCallCheck(this, Reference);

        this._type = type;
        this._referencedContext = referencedContext instanceof _span2.default ? referencedContext.context() : referencedContext;
    }

    return Reference;
}();

exports.default = Reference;

//# sourceMappingURL=reference.js.map