import BinaryCarrier from './binary_carrier';
import * as Tags from './ext/tags';
import * as Noop from './noop';
import Reference from './reference';
import Span from './span';
import SpanContext from './span_context';
import Tracer from './tracer';

export {
    BinaryCarrier,
    Reference,
    SpanContext,
    Span,
    Tracer,
    Tags
};

export * from './global_tracer';
export * from './constants';
export * from './functions';

// Initialize the noops last to avoid a dependecy cycle between the classes.
Noop.initialize();

// Provide the exports object as a default export for BC
// Some implementations rely on this, e.g. https://github.com/lightstep/lightstep-tracer-javascript/blob/f783dd4d45314ab4aa4fba0339b8588da9939ba0/src/imp/span_imp.js#L4
export default exports;
