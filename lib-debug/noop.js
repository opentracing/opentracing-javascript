'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.span = exports.spanContext = exports.tracer = undefined;
exports.initialize = initialize;

var _tracer = require('./tracer');

var _tracer2 = _interopRequireDefault(_tracer);

var _span_context = require('./span_context');

var _span_context2 = _interopRequireDefault(_span_context);

var _span = require('./span');

var _span2 = _interopRequireDefault(_span);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/* eslint-disable import/no-mutable-exports */
var tracer = exports.tracer = null;
var spanContext = exports.spanContext = null;
var span = exports.span = null;
/* eslint-enable import/no-mutable-exports */

// Deferred initialization to avoid a dependency cycle where Tracer depends on
// Span which depends on the noop tracer.
function initialize() {
    exports.tracer = tracer = new _tracer2.default();
    exports.span = span = new _span2.default();
    exports.spanContext = spanContext = new _span_context2.default();
}

//# sourceMappingURL=noop.js.map