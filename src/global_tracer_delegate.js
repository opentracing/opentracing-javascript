import { getGlobalTracer } from './global_tracer';
import Tracer from './tracer';

const noopTracer = new Tracer();

// Allows direct importing/requiring of the global tracer:
//
// let globalTracer = require('opentracing/global');
//      OR
// import globalTracer from 'opentracing/global';
//
// Acts a bridge to the global tracer that can be safely called before the
// global tracer is initialized. The purpose of the delegation is to avoid the
// sometimes nearly intractible initialization order problems that can arise in
// applications with a complex set of dependencies.
export default class GlobalTracerDelegate extends Tracer {

    _startSpan(...args) {
        const tracer = getGlobalTracer() || noopTracer;
        return tracer._startSpan(...args);
    }

    _reference(...args) {
        const tracer = getGlobalTracer() || noopTracer;
        return tracer._reference(...args);
    }

    _inject(...args) {
        const tracer = getGlobalTracer() || noopTracer;
        return tracer._inject(...args);
    }

    _extract(...args) {
        const tracer = getGlobalTracer() || noopTracer;
        return tracer._extract(...args);
    }

    _flush(...args) {
        const tracer = getGlobalTracer() || noopTracer;
        return tracer._flush(...args);
    }
}
