// Ensure the stack trace lines numbers are correct on errors
require('source-map-support').install();

import * as semver from 'semver';

import {MockTracer, Tracer} from '../index.js';
import apiCompatibilityChecks from './api_compatibility';
import mocktracerImplementationTests from './mocktracer_implemenation';
import noopImplementationTests from './noop_implementation';
import opentracingAPITests from './opentracing_api';
import { asyncHookManagerTests, asyncWrapSpanManagerTest, zoneSpanManagerTests } from './span_manager';

mocktracerImplementationTests ();

apiCompatibilityChecks( () =>  new MockTracer (), {skipInjectExtractChecks: true, skipBaggageChecks: true} );

// Run the tests on the default OpenTracing no-op Tracer.
noopImplementationTests();

// Run the api conformance tests on the default Opentracing no-op Tracer.
apiCompatibilityChecks( () => new Tracer (), {skipBaggageChecks: true});

// Basic unittests for opentracing
opentracingAPITests();
opentracingAPITests();

// Scope manager tests
const loadZoneJs = process.env.TEST_ZONE_JS === 'true'; // zone.js interferes with Node.js async APIs

if (loadZoneJs) {
    require('zone.js');
    zoneSpanManagerTests();
}

if (!loadZoneJs && semver.satisfies(process.version, '>=8.1.0')) {
    asyncHookManagerTests();
}

if (!loadZoneJs && semver.satisfies(process.version, '>=4.0.0 <8.0.0')) {
    asyncWrapSpanManagerTest();
}
