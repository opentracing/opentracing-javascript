import * as GlobalTracer from './global_tracer';
import * as Constants from './constants';
import * as noop from './noop';
import BinaryCarrier from './binary_carrier';
import Reference from './reference';
import SpanContext from './span_context';
import Span from './span';
import Tracer from './tracer';

// Object.assign() is not available on Node v0.12, so implement a similar
// function here (subset of a proper polyfill).
function _extend(target) {
    for (let index = 1; index < arguments.length; index++) {
        const source = arguments[index];
        for (let key in source) { // eslint-disable-line no-restricted-syntax
            if (source.hasOwnProperty(key)) {
                target[key] = source[key];
            }
        }
    }
    return target;
}


// Use `module.exports` rather than `export` to avoid the need to use `.default`
// when requiring the package in ES5 code.
module.exports = _extend(
    {
        BinaryCarrier : BinaryCarrier,
        Reference     : Reference,
        SpanContext   : SpanContext,
        Span          : Span,
        Tracer        : Tracer,
    },
    Constants,
    GlobalTracer
);

// Initialize the noops last to avoid a dependecy cycle between the classes.
noop.initialize();
