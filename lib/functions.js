'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.childOf = childOf;
exports.followsFrom = followsFrom;

var _constants = require('./constants');

var Constants = _interopRequireWildcard(_constants);

var _span = require('./span');

var _span2 = _interopRequireDefault(_span);

var _reference = require('./reference');

var _reference2 = _interopRequireDefault(_reference);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

/**
 * Return a new REFERENCE_CHILD_OF reference.
 *
 * @param {SpanContext} spanContext - the parent SpanContext instance to
 *        reference.
 * @return a REFERENCE_CHILD_OF reference pointing to `spanContext`
 */
function childOf(spanContext) {
    // Allow the user to pass a Span instead of a SpanContext
    if (spanContext instanceof _span2.default) {
        spanContext = spanContext.context();
    }
    return new _reference2.default(Constants.REFERENCE_CHILD_OF, spanContext);
}

/**
 * Return a new REFERENCE_FOLLOWS_FROM reference.
 *
 * @param {SpanContext} spanContext - the parent SpanContext instance to
 *        reference.
 * @return a REFERENCE_FOLLOWS_FROM reference pointing to `spanContext`
 */
function followsFrom(spanContext) {
    // Allow the user to pass a Span instead of a SpanContext
    if (spanContext instanceof _span2.default) {
        spanContext = spanContext.context();
    }
    return new _reference2.default(Constants.REFERENCE_FOLLOWS_FROM, spanContext);
}

//# sourceMappingURL=functions.js.map