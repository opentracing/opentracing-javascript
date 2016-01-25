'use strict';

import TraceContext from './trace_context';

/**
 *
 */
export default class Span {

    /**
     * [constructor description]
     * @return {[type]} [description]
     */
    constructor(imp) {
        this._imp = imp;
    }

    /**
     *
     */
    imp() {
        return this._imp;
    }

    // ---------------------------------------------------------------------- //
    //
    // ---------------------------------------------------------------------- //

    traceContext() {
        if (API_CONFORMANCE_CHECKS) {
            if (arguments.length !== 0) {
                throw new Error('Invalid arguments');
            }
        }

        let contextImp = null;
        if (this._imp) {
            contextImp = this._imp.traceContext();
        }
        return new TraceContext(contextImp);
    }

    /**
     * [tags description]
     * @return {[type]} [description]
     */
    setTag(key, value) {
        if (API_CONFORMANCE_CHECKS) {
            if (arguments.length !== 2) {
                throw new Error('Invalid number of arguments');
            }
            if (typeof key !== 'string') {
                throw new Error('Tag key must be a string');
            }
        }

        if (!this._imp) {
            return;
        }
        this._imp.setTag(key, value);
    }



    /**
     * Creates an informational log record with the given message and optional
     * payload.
     *
     * @param  {string} message Text of the log record
     * @param  {object} payload [description]
     * @return {[type]}         [description]
     */
    info(message, payload) {
        if (API_CONFORMANCE_CHECKS) {
            if (arguments.length < 1 || arguments.length > 2) {
                throw new Error('Invalid arguments.');
            }
            if (typeof message !== 'string') {
                throw new Error('Expected message to be a string');
            }
        }

        if (!this._imp) {
            return;
        }
        this._imp.info(message, payload);
    }

    /**
     * [error description]
     * @param  {[type]} message [description]
     * @param  {[type]} payload [description]
     * @return {[type]}         [description]
     */
    error(message, payload) {
        if (API_CONFORMANCE_CHECKS) {
            if (arguments.length < 1 || arguments.length > 2) {
                throw new Error('Invalid arguments.');
            }
            if (typeof message !== 'string') {
                throw new Error('Expected message to be a string');
            }
        }

        if (!this._imp) {
            return;
        }
        this._imp.error(message, payload);
    }

    startChild(operationName) {
        if (API_CONFORMANCE_CHECKS) {
            if (arguments.length !== 1) {
                throw new Error('Invalid arguments');
            }
            if (typeof operationName !== 'string') {
                throw new Error('Invalid arguments');
            }
        }

        let spanImp = null;
        if (this._imp) {
            spanImp = this._imp.startChild(operationName);
        }
        return new Span(spanImp);
    }

    /**
     * [finish description]
     */
    finish() {
        if (API_CONFORMANCE_CHECKS) {
            if (arguments.length !== 0) {
                throw new Error('Invalid arguments');
            }
        }

        if (!this._imp) {
            return;
        }
        this._imp.finish();
    }
}
