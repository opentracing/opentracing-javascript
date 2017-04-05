"use strict";
function __export(m) {
    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}
Object.defineProperty(exports, "__esModule", { value: true });
var binary_carrier_1 = require("./binary_carrier");
exports.BinaryCarrier = binary_carrier_1.default;
var Tags = require("./ext/tags");
exports.Tags = Tags;
var Noop = require("./noop");
var reference_1 = require("./reference");
exports.Reference = reference_1.default;
var span_1 = require("./span");
exports.Span = span_1.default;
var span_context_1 = require("./span_context");
exports.SpanContext = span_context_1.default;
var tracer_1 = require("./tracer");
exports.Tracer = tracer_1.default;
__export(require("./global_tracer"));
__export(require("./constants"));
__export(require("./functions"));
// Initialize the noops last to avoid a dependecy cycle between the classes.
Noop.initialize();
// Provide the exports object as a default export for BC
// Some implementations rely on this, e.g. https://github.com/lightstep/lightstep-tracer-javascript/blob/f783dd4d45314ab4aa4fba0339b8588da9939ba0/src/imp/span_imp.js#L4
exports.default = exports;
//# sourceMappingURL=index.js.map