import * as GlobalTracer from './global_tracer';
import * as Constants from './constants';
import * as Functions from './functions';
import * as Noop from './noop';
import * as Tags from './ext/tags';
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
        Tags          : Tags,
    },
    Constants,
    Functions,
    GlobalTracer
);

// Initialize the noops last to avoid a dependecy cycle between the classes.
Noop.initialize();
