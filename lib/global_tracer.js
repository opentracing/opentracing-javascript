'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

exports.initGlobalTracer = initGlobalTracer;
exports.globalTracer = globalTracer;

var _tracer = require('./tracer');

var _tracer2 = _interopRequireDefault(_tracer);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var noopTracer = new _tracer2.default();
var _globalTracer = null;

// Allows direct importing/requiring of the global tracer:
//
// let globalTracer = require('opentracing/global');
//      OR
// import globalTracer from 'opentracing/global';
//
// Acts a bridge to the global tracer that can be safely called before the
// global tracer is initialized. The purpose of the delegation is to avoid the
// sometimes nearly intractible initialization order problems that can arise in
// applications with a complex set of dependencies, while also avoiding the
// case where

var GlobalTracerDelegate = function (_Tracer) {
    _inherits(GlobalTracerDelegate, _Tracer);

    function GlobalTracerDelegate() {
        _classCallCheck(this, GlobalTracerDelegate);

        return _possibleConstructorReturn(this, (GlobalTracerDelegate.__proto__ || Object.getPrototypeOf(GlobalTracerDelegate)).apply(this, arguments));
    }

    _createClass(GlobalTracerDelegate, [{
        key: 'startSpan',
        value: function startSpan() {
            var tracer = _globalTracer || noopTracer;
            return tracer.startSpan.apply(tracer, arguments);
        }
    }, {
        key: 'inject',
        value: function inject() {
            var tracer = _globalTracer || noopTracer;
            return tracer.inject.apply(tracer, arguments);
        }
    }, {
        key: 'extract',
        value: function extract() {
            var tracer = _globalTracer || noopTracer;
            return tracer.extract.apply(tracer, arguments);
        }
    }]);

    return GlobalTracerDelegate;
}(_tracer2.default);

var globalTracerDelegate = new GlobalTracerDelegate();

/**
 * Set the global Tracer.
 *
 * The behavior is undefined if this function is called more than once.
 *
 * @param {Tracer} tracer - the Tracer implementation
 */
function initGlobalTracer(tracer) {
    _globalTracer = tracer;
}

/**
 * Returns the global tracer.
 */
function globalTracer() {
    // Return the delegate.  Since the global tracer is largely a convenience
    // (the user can always create their own tracers), the delegate is used to
    // give the added convenience of not needing to worry about initialization
    // order.
    return globalTracerDelegate;
}

//# sourceMappingURL=global_tracer.js.map