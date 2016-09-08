'use strict';

var _global_tracer = require('./global_tracer');

var GlobalTracer = _interopRequireWildcard(_global_tracer);

var _constants = require('./constants');

var Constants = _interopRequireWildcard(_constants);

var _functions = require('./functions');

var Functions = _interopRequireWildcard(_functions);

var _noop = require('./noop');

var Noop = _interopRequireWildcard(_noop);

var _tags = require('./ext/tags');

var Tags = _interopRequireWildcard(_tags);

var _binary_carrier = require('./binary_carrier');

var _binary_carrier2 = _interopRequireDefault(_binary_carrier);

var _reference = require('./reference');

var _reference2 = _interopRequireDefault(_reference);

var _span_context = require('./span_context');

var _span_context2 = _interopRequireDefault(_span_context);

var _span = require('./span');

var _span2 = _interopRequireDefault(_span);

var _tracer = require('./tracer');

var _tracer2 = _interopRequireDefault(_tracer);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

// Object.assign() is not available on Node v0.12, so implement a similar
// function here (subset of a proper polyfill).
function _extend(target) {
    for (var index = 1; index < arguments.length; index++) {
        var source = arguments[index];
        for (var key in source) {
            // eslint-disable-line no-restricted-syntax
            if (source.hasOwnProperty(key)) {
                target[key] = source[key];
            }
        }
    }
    return target;
}

// Use `module.exports` rather than `export` to avoid the need to use `.default`
// when requiring the package in ES5 code.
module.exports = _extend({
    BinaryCarrier: _binary_carrier2.default,
    Reference: _reference2.default,
    SpanContext: _span_context2.default,
    Span: _span2.default,
    Tracer: _tracer2.default,
    Tags: Tags
}, Constants, Functions, GlobalTracer);

// Initialize the noops last to avoid a dependecy cycle between the classes.
Noop.initialize();

//# sourceMappingURL=index.js.map