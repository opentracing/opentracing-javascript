'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }(); /* eslint-disable import/no-extraneous-dependencies */


var _underscore = require('underscore');

var _underscore2 = _interopRequireDefault(_underscore);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * Index a collection of reported MockSpans in a way that's easy to run unit
 * test assertions against.
 */
var MockReport = function () {
    function MockReport(spans) {
        var _this = this;

        _classCallCheck(this, MockReport);

        this.spans = spans;
        this.spansByUUID = {};
        this.spansByTag = {};
        this.debugSpans = [];

        this.unfinishedSpans = [];

        _underscore2.default.each(spans, function (span) {
            if (span._finishMs === 0) {
                _this.unfinishedSpans.push(span);
            }

            _this.spansByUUID[span.uuid()] = span;
            _this.debugSpans.push(span.debug());

            _underscore2.default.each(span._tags, function (val, key) {
                _this.spansByTag[key] = _this.spansByTag[key] || {};
                _this.spansByTag[key][val] = _this.spansByTag[key][val] || [];
                _this.spansByTag[key][val].push(span);
            });
        });
    }

    _createClass(MockReport, [{
        key: 'firstSpanWithTagValue',
        value: function firstSpanWithTagValue(key, val) {
            var m = this.spansByTag[key];
            if (!m) {
                return null;
            }
            var n = m[val];
            if (!n) {
                return null;
            }
            return n[0];
        }
    }]);

    return MockReport;
}();

exports.default = MockReport;

//# sourceMappingURL=mock_report.js.map