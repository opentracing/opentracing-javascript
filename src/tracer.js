'use strict';

import Span from './span';

/**
 *
 */
export default class Tracer {

    /**
     * [constructor description]
     * @return {[type]} [description]
     */
    constructor(imp) {
        this._imp = imp || null;
    }

    /**
     * Handle to implementation object.
     */
    imp() {
        return this._imp;
    }

    /**
     * TODO: Unclear what the OpenTracing specification wants here.  This
     * implementation is a best-guess approximation that's likely not right.
     * The spec refers to text and binary representations, but what does
     * "binary" mean in JavaScript without making assumptions about protocols,
     * transports, and platforms?
     *
     * @param  {[type]} traceContext [description]
     * @return {[type]}              [description]
     */
    encodeTraceContext(traceContext) {
        if (API_CONFORMANCE_CHECKS) {
            if (arguments.length  !== 1) {
                throw new Error('Invalid arguments.');
            }
        }

        if (!this._imp) {
            return null;
        }

        // TODO: this does not get wrapped as it's unclear what the type of
        // return value is / should be.
        return this._imp.encodeTraceContext(traceContext);
    }

    /**
     * TODO: see concerns in encodeTraceContext.
     *
     * @param  {[type]} json [description]
     * @return {[type]}      [description]
     */
    decodeTraceContext(obj) {
        if (API_CONFORMANCE_CHECKS) {
            if (arguments.length  !== 1) {
                throw new Error('Invalid arguments.');
            }
        }

        let traceContextImp = null;
        if (this._imp) {
            traceContextImp = this._imp.decodeTraceContext();
        }
        return TraceContext(traceContextImp);
    }

    /**
     * [newRootTraceContext description]
     * @return {[type]} [description]
     */
    newRootTraceContext() {
        if (API_CONFORMANCE_CHECKS) {
            if (arguments.length  !== 0) {
                throw new Error('Invalid arguments.');
            }
        }

        let traceContextImp = null;
        if (this._imp) {
            traceContextImp = this._imp.newRootTraceContext();
        }
        return TraceContext(traceContextImp);
    }

    /**
     * [newChildTraceContext description]
     * @return {[type]} [description]
     */
    newChildTraceContext(parentContext) {
        if (API_CONFORMANCE_CHECKS) {
            if (arguments.length  !== 1) {
                throw new Error('Invalid arguments.');
            }
        }

        let traceContextImp = null;
        let tags = {};
        if (this._imp) {
            let pair = this._imp.newChildTraceContext(parentContext.imp());
            traceContextImp = pair[0];
            tags = pair[1];
        }
        return [ TraceContext(traceContextImp), tags ];
    }

    /**
     * [startTrace description]
     * @param  {[type]} operation [description]
     * @return {[type]}           [description]
     */
    startTrace(operationName) {
        if (API_CONFORMANCE_CHECKS) {
            if (arguments.length  !== 1) {
                throw new Error('Invalid arguments.');
            }
            if (typeof operationName !== 'string') {
                throw new Error('operationName expected to be a string');
            }
            if (operationName.length === 0) {
                throw new Error('operationName cannot be length zero');
            }
        }

        let spanImp = null;
        if (this._imp) {
            spanImp = this._imp.startTrace(operationName);
        }
        return new Span(spanImp);
    }

    /**
     * [joinTrace description]
     * @param  {[type]} operationName [description]
     * @param  {[type]} parent        [description]
     * @return {[type]}               [description]
     */
    joinTrace(operationName, parentContext) {
        if (API_CONFORMANCE_CHECKS) {
            if (arguments.length  !== 2) {
                throw new Error('Invalid arguments.');
            }
            if (typeof operationName !== 'string') {
                throw new Error('operationName expected to be a string');
            }
            if (typeof parentContext !== 'object') {
                throw new Error('parentContext expected to be an object');
            }
        }

        let spanImp = null;
        if (this._imp) {
            spanImp = this._imp.joinTrace(operationName, parentContext.imp());
        }
        return new Span(spanImp);
    }

    /**
     * [startSpanWithContext description]
     * @param  {[type]} operationName [description]
     * @param  {[type]} traceContext  [description]
     * @return {[type]}               [description]
     */
    startSpanWithContext(operationName, traceContext) {
        if (API_CONFORMANCE_CHECKS) {
            if (arguments.length  !== 2) {
                throw new Error('Invalid arguments.');
            }
        }

        let spanImp = null;
        if (this._imp) {
            spanImp = this._imp.startSpanWithContext(operationName, parent);
        }
        return new Span(spanImp);
    }
}
