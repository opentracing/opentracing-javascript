'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _global_tracer = require('./global_tracer');

var _tracer = require('./tracer');

var _tracer2 = _interopRequireDefault(_tracer);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var noopTracer = new _tracer2.default();

// Allows direct importing/requiring of the global tracer:
//
// let globalTracer = require('opentracing/global');
//      OR
// import globalTracer from 'opentracing/global';
//
// Acts a bridge to the global tracer that can be safely called before the
// global tracer is initialized. The purpose of the delegation is to avoid the
// sometimes nearly intractible initialization order problems that can arise in
// applications with a complex set of dependencies.

var GlobalTracerDelegate = function (_Tracer) {
    _inherits(GlobalTracerDelegate, _Tracer);

    function GlobalTracerDelegate() {
        _classCallCheck(this, GlobalTracerDelegate);

        return _possibleConstructorReturn(this, Object.getPrototypeOf(GlobalTracerDelegate).apply(this, arguments));
    }

    _createClass(GlobalTracerDelegate, [{
        key: '_startSpan',
        value: function _startSpan() {
            var tracer = (0, _global_tracer.getGlobalTracer)() || noopTracer;
            return tracer._startSpan.apply(tracer, arguments);
        }
    }, {
        key: '_reference',
        value: function _reference() {
            var tracer = (0, _global_tracer.getGlobalTracer)() || noopTracer;
            return tracer._reference.apply(tracer, arguments);
        }
    }, {
        key: '_inject',
        value: function _inject() {
            var tracer = (0, _global_tracer.getGlobalTracer)() || noopTracer;
            return tracer._inject.apply(tracer, arguments);
        }
    }, {
        key: '_extract',
        value: function _extract() {
            var tracer = (0, _global_tracer.getGlobalTracer)() || noopTracer;
            return tracer._extract.apply(tracer, arguments);
        }
    }, {
        key: '_flush',
        value: function _flush() {
            var tracer = (0, _global_tracer.getGlobalTracer)() || noopTracer;
            return tracer._flush.apply(tracer, arguments);
        }
    }]);

    return GlobalTracerDelegate;
}(_tracer2.default);

exports.default = GlobalTracerDelegate;

//# sourceMappingURL=global_tracer_delegate.js.map