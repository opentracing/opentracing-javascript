'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _ = require('../..');

var _2 = _interopRequireDefault(_);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

/**
 * OpenTracing Context implementation designed for use in
 * unit tests.
 */
var MockContext = function (_opentracing$SpanCont) {
    _inherits(MockContext, _opentracing$SpanCont);

    //------------------------------------------------------------------------//
    // MockContext-specific
    //------------------------------------------------------------------------//

    function MockContext(span) {
        _classCallCheck(this, MockContext);

        // Store a reference to the span itself since this is a mock tracer
        // intended to make debugging and unit testing easier.
        var _this = _possibleConstructorReturn(this, (MockContext.__proto__ || Object.getPrototypeOf(MockContext)).call(this));

        _this._span = span;
        return _this;
    }

    return MockContext;
}(_2.default.SpanContext);

exports.default = MockContext;

//# sourceMappingURL=mock_context.js.map