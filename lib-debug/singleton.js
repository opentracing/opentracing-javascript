'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _tracer = require('./tracer');

var _tracer2 = _interopRequireDefault(_tracer);

var _constants = require('./constants');

var Constants = _interopRequireWildcard(_constants);

var _binary_carrier = require('./binary_carrier');

var _binary_carrier2 = _interopRequireDefault(_binary_carrier);

var _reference = require('./reference');

var _reference2 = _interopRequireDefault(_reference);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

/**
 * The Singleton object is the default export of the package and extends the
 * standard Tracer object so that the default
 * exported object of the package can be conveniently be used both as the
 * default tracer and an interface to the library.
 */
var Singleton = function (_Tracer) {
    _inherits(Singleton, _Tracer);

    _createClass(Singleton, [{
        key: 'initGlobalTracer',


        // ---------------------------------------------------------------------- //
        // OpenTracing API methods
        // ---------------------------------------------------------------------- //

        /**
         * Set the global Tracer's underlying implementation.
         *
         * The behavior is undefined if this function is called more than once.
         *
         * @param {TracerImp} tracerImp - the Tracer implementation object
         */
        value: function initGlobalTracer(tracerImp) {
            this._imp = tracerImp;

            // Provide the implementation with a handle to the interface. This can
            // also be used a post-initialization signal.
            if (tracerImp) {
                tracerImp.setInterface(this);
            }
        }

        /**
         * Create a new Tracer object with the given underlying implementation.
         *
         * @return {Tracer} a new Tracer object
         */

    }, {
        key: 'initNewTracer',
        value: function initNewTracer(tracerImp) {
            var tracer = new _tracer2.default(tracerImp);
            if (tracerImp) {
                tracerImp.setInterface(this);
            }
            return tracer;
        }

        // ---------------------------------------------------------------------- //
        // Private and non-standard methods
        // ---------------------------------------------------------------------- //

        /* For internal use only:
         *
         * Creates the Singleton with no underlying implementation (i.e. defaults
         * to no-op behavior for all functions).
         *
         * The OpenTracing package-level object acts both at the singleton and the
         * package interface itself, so this Singleton is both a the Tracer and
         * also includes all the global library symbols.
         *
         * Note: this should never be called directly by consumers of the library.
         */

    }]);

    function Singleton() {
        _classCallCheck(this, Singleton);

        // Merge the constants into the singleton object so they are accessible at the
        // package level.
        var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(Singleton).call(this));

        for (var key in Constants) {
            // eslint-disable-line no-restricted-syntax
            _this[key] = Constants[key];
        }
        _this.Reference = _reference2.default;

        // Carrier objects to be exposed at the package level
        _this.BinaryCarrier = _binary_carrier2.default;
        return _this;
    }

    return Singleton;
}(_tracer2.default);

exports.default = Singleton;

//# sourceMappingURL=singleton.js.map