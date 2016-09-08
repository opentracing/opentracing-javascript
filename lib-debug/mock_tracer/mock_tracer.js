'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _ = require('../..');

var _2 = _interopRequireDefault(_);

var _mock_span = require('./mock_span');

var _mock_span2 = _interopRequireDefault(_mock_span);

var _mock_report = require('./mock_report');

var _mock_report2 = _interopRequireDefault(_mock_report);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }
// TODO: Move mock-tracer to its own NPM package once it is complete and tested.


/**
 * OpenTracing Tracer implementation designed for use in unit tests.
 */
var MockTracer = function (_opentracing$Tracer) {
    _inherits(MockTracer, _opentracing$Tracer);

    _createClass(MockTracer, [{
        key: '_startSpan',


        //------------------------------------------------------------------------//
        // OpenTracing implementation
        //------------------------------------------------------------------------//

        value: function _startSpan(name, fields) {
            // _allocSpan is given it's own method so that derived classes can
            // allocate any type of object they want, but not have to duplicate
            // the other common logic in startSpan().
            var span = this._allocSpan(fields);
            span.setOperationName(name);
            this._spans.push(span);

            if (fields.references) {
                for (var i = 0; i < fields.references; i++) {
                    span.addReference(fields.references[i]);
                }
            }

            // Capture the stack at the time the span started
            span._startStack = new Error().stack;
            return span;
        }
    }, {
        key: '_inject',
        value: function _inject(span, format, carrier) {
            throw new Error('NOT YET IMPLEMENTED');
        }
    }, {
        key: '_extract',
        value: function _extract(format, carrier) {
            throw new Error('NOT YET IMPLEMENTED');
        }

        //------------------------------------------------------------------------//
        // MockTracer-specific
        //------------------------------------------------------------------------//

    }]);

    function MockTracer() {
        _classCallCheck(this, MockTracer);

        var _this = _possibleConstructorReturn(this, (MockTracer.__proto__ || Object.getPrototypeOf(MockTracer)).call(this));

        _this._spans = [];
        return _this;
    }

    _createClass(MockTracer, [{
        key: '_allocSpan',
        value: function _allocSpan() {
            return new _mock_span2.default(this);
        }

        /**
         * Discard any buffered data.
         */

    }, {
        key: 'clear',
        value: function clear() {
            this._spans = [];
        }

        /**
         * Return the buffered data in a format convenient for making unit test
         * assertions.
         */

    }, {
        key: 'report',
        value: function report() {
            return new _mock_report2.default(this._spans);
        }
    }]);

    return MockTracer;
}(_2.default.Tracer);

exports.default = MockTracer;

//# sourceMappingURL=mock_tracer.js.map