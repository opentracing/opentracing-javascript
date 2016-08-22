'use strict';

/**
 * SpanContext represents Span state that must propagate to descendant Spans
 * and across process boundaries.
 *
 * SpanContext is logically divided into two pieces: the user-level "Baggage"
 * (see setBaggageItem and getBaggageItem) that propagates across Span
 * boundaries and any Tracer-implementation-specific fields that are needed to
 * identify or otherwise contextualize the associated Span instance (e.g., a
 * <trace_id, span_id, sampled> tuple).
 */

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var SpanContext = function () {
  /**
   * Constructs a new SpanContext object.
   *
   * This method should not be called directly; Span.context() should be used
   * instead.
   */
  function SpanContext(imp) {
    _classCallCheck(this, SpanContext);

    this._imp = imp;
  }

  /**
   * Returns the SpanContext implementation object. The returned object is by
   * its nature entirely implementation-dependent.
   */


  _createClass(SpanContext, [{
    key: 'imp',
    value: function imp() {
      return this._imp;
    }
  }]);

  return SpanContext;
}();

exports.default = SpanContext;

//# sourceMappingURL=span_context.js.map