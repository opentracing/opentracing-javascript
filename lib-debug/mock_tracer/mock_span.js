'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _2 = require('../..');

var _3 = _interopRequireDefault(_2);

var _mock_context = require('./mock_context');

var _mock_context2 = _interopRequireDefault(_mock_context);

var _underscore = require('underscore');

var _underscore2 = _interopRequireDefault(_underscore);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } /* eslint-disable import/no-extraneous-dependencies */

/**
 * OpenTracing Span implementation designed for use in unit tests.
 */
var MockSpan = function (_opentracing$Span) {
    _inherits(MockSpan, _opentracing$Span);

    _createClass(MockSpan, [{
        key: '_context',


        //------------------------------------------------------------------------//
        // OpenTracing implementation
        //------------------------------------------------------------------------//

        value: function _context() {
            return new _mock_context2.default(this);
        }
    }, {
        key: '_setOperationName',
        value: function _setOperationName(name) {
            this._operationName = name;
        }
    }, {
        key: '_addTags',
        value: function _addTags(set) {
            var keys = Object.keys(set);
            for (var i = 0; i < keys.length; i++) {
                var key = keys[i];
                this._tags[key] = set[key];
            }
        }
    }, {
        key: '_log',
        value: function _log(fields, timestamp) {
            this._logs.push({
                fields: fields,
                timestamp: timestamp
            });
        }
    }, {
        key: '_finish',
        value: function _finish(finishTime) {
            this._finishMs = finishTime || Date.now();
        }

        //------------------------------------------------------------------------//
        // MockSpan-specific
        //------------------------------------------------------------------------//

    }]);

    function MockSpan(tracer) {
        _classCallCheck(this, MockSpan);

        var _this = _possibleConstructorReturn(this, (MockSpan.__proto__ || Object.getPrototypeOf(MockSpan)).call(this));

        _this._tracer = tracer;
        _this._uuid = _this._generateUUID();
        _this._startMs = Date.now();
        _this._finishMs = 0;
        _this._operationName = '';
        _this._tags = {};
        _this._logs = [];
        return _this;
    }

    _createClass(MockSpan, [{
        key: 'uuid',
        value: function uuid() {
            return this._uuid;
        }
    }, {
        key: 'operationName',
        value: function operationName() {
            return this._operationName;
        }
    }, {
        key: 'durationMs',
        value: function durationMs() {
            return this._finishMs - this._startMs;
        }
    }, {
        key: 'tags',
        value: function tags() {
            return this._tags;
        }
    }, {
        key: '_generateUUID',
        value: function _generateUUID() {
            var p0 = ('00000000' + Math.abs(Math.random() * 0xFFFFFFFF | 0).toString(16)).substr(-8);
            var p1 = ('00000000' + Math.abs(Math.random() * 0xFFFFFFFF | 0).toString(16)).substr(-8);
            return '' + p0 + p1;
        }
    }, {
        key: 'addReference',
        value: function addReference(ref) {}

        /**
         * Returns a simplified object better for console.log()'ing.
         */

    }, {
        key: 'debug',
        value: function debug() {
            var obj = {
                uuid: this._uuid,
                operation: this._operationName,
                millis: [this._finishMs - this._startMs, this._startMs, this._finishMs]
            };
            if (_underscore2.default.size(this._tags)) {
                obj.tags = this._tags;
            }
            return obj;
        }
    }]);

    return MockSpan;
}(_3.default.Span);

exports.default = MockSpan;

//# sourceMappingURL=mock_span.js.map