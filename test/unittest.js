// Ensure the stack trace lines numbers are correct on errors
require('source-map-support').install();

var apiCompatibilityChecks = require('./api_compatibility.js');
var mockCompatibilityChecks = require('./mock_compatibility.js');
var opentracing = require('../debug.js');

// Run the tests on the default OpenTracing no-op Tracer.
mockCompatibilityChecks();

// Run the api conformance tests on the default Opentracing no-op Tracer.
apiCompatibilityChecks(function() {
    return new opentracing.Tracer();
});
