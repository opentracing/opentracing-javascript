import * as GlobalTracer from './global_tracer';
import * as Constants from './constants';
import BinaryCarrier from './binary_carrier';
import Reference from './reference';
import SpanContext from './span_context';
import Span from './span';
import Tracer from './tracer';

// Use `module.exports` rather than `export` to avoid the need to use `.default`
// when requiring the package in ES5 code.
module.exports = Object.assign(
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
