// Ensure the stack trace lines numbers are correct on errors
require('source-map-support').install();

var apiCompatibilityChecks = require('./api_compatibility.js');
var noopImplementationTests = require('./noop_implementation.js');
var opentracingAPITests = require('./opentracing_api.js');

// Run the tests on the default OpenTracing no-op Tracer.
noopImplementationTests();

// Run the api conformance tests on the default Opentracing no-op Tracer.
apiCompatibilityChecks();

// Basic unittests for opentracing
opentracingAPITests();
