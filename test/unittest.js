// Ensure the stack trace lines numbers are correct on errors
require('source-map-support').install();

var apiCompatibilityChecks = require('./api_compatibility.js');

// Run the tests on the default OpenTracing no-op Tracer.
apiCompatibilityChecks(function() {
    return new opentracing.Tracer();
});
