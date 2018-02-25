// Ensure the stack trace lines numbers are correct on errors
require('source-map-support').install();

import apiCompatibilityChecks from './api_compatibility';
// import mocktracerImplementationTests from './mocktracer_implemenation';
import noopImplementationTests from './noop_implementation';
import opentracingAPITests from './opentracing_api';

import {MockTracer} from '../index.js';

// basic tests for the mock tracer
// mocktracerImplementationTests ();
apiCompatibilityChecks( () =>  new MockTracer (), {checkInjectBehaviour: false} );

// Run the tests on the default OpenTracing no-op Tracer.
noopImplementationTests();

// Run the api conformance tests on the default Opentracing no-op Tracer.
apiCompatibilityChecks();

// Basic unittests for opentracing
opentracingAPITests();
