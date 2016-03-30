'use strict';

const _      = require('underscore');
const expect = require('chai').expect;

let NoopTracerImp;
let Tracer;

describe('OpenTracing API', function() {
    before(function() {
        NoopTracerImp = require('./noop_imp.js');
        Tracer = require('../dist/opentracing-node.js');
    });
    it('should not report leaks after setting the global tracer', function() {
        Tracer.initGlobalTracer(new NoopTracerImp());
    });
});
