'use strict';

const kKeyRegExp = new RegExp(/^[a-z0-9][-a-z0-9]*/);

/**
 *
 */
export default class TraceContext {

    constructor(imp) {
        this._imp = imp;
    }

    /**
     *
     */
    imp() {
        return this._imp;
    }

    /**
     * [setTraceAttribute description]
     * @param {[type]} key   [description]
     * @param {[type]} value [description]
     */
    setTraceAttribute(key, value) {
        if (API_CONFORMANCE_CHECKS) {
            if (arguments.length !== 2) {
                throw new Error('Expected 2 arguments');
            }
            if (typeof key !== 'string' || key.length === 0) {
                throw new Error('Key must be a string');
            }
            if (!kKeyRegExp.match(key)) {
                throw new Error('Invalid trace key');
            }

            let valueType = typeof value;
            if (value !== null &&
                valueType !== 'boolean' &&
                valueType !== 'number' &&
                valueType !== 'string') {
                throw new Error('Trace attribute values can only be basic types');
            }
        }

        if (this._imp) {
            this._imp.setTraceAttribute(key, value);
        }
        return;
    }

    /**
     * [traceAttribute description]
     * @param  {[type]} key [description]
     * @return {[type]}     [description]
     */
    traceAttribute(key) {
        if (API_CONFORMANCE_CHECKS) {
            if (arguments.length !== 1) {
                throw new Error('Expected 1 arguments');
            }
            if (typeof key !== 'string' || key.length === 0) {
                throw new Error('Key must be a string');
            }
            if (!kKeyRegExp.match(key)) {
                throw new Error('Invalid trace key');
            }
        }

        if (!this._imp) {
            return undefined;
        }
        return this._imp.traceAttribute(key);
    }
}
