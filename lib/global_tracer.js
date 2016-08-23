"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.initGlobalTracer = initGlobalTracer;
exports.getGlobalTracer = getGlobalTracer;
var _globalTracer = null;

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
 * Returns the global tracer
 */
function getGlobalTracer() {
  return _globalTracer;
}

//# sourceMappingURL=global_tracer.js.map