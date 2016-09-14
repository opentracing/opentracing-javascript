/* eslint-disable import/no-extraneous-dependencies */

import opentracing from '../..';
import MockContext from './mock_context';
import _ from 'underscore';

/**
 * OpenTracing Span implementation designed for use in unit tests.
 */
export default class MockSpan extends opentracing.Span {

    //------------------------------------------------------------------------//
    // OpenTracing implementation
    //------------------------------------------------------------------------//

    _context() {
        return new MockContext(this);
    }

    _setOperationName(name) {
        this._operationName = name;
    }

    _addTags(set) {
        let keys = Object.keys(set);
        for (let i = 0; i < keys.length; i++) {
            let key = keys[i];
            this._tags[key] = set[key];
        }
    }

    _log(fields, timestamp) {
        this._logs.push({
            fields    : fields,
            timestamp : timestamp,
        });
    }

    _finish(finishTime) {
        this._finishMs = finishTime || Date.now();
    }

    //------------------------------------------------------------------------//
    // MockSpan-specific
    //------------------------------------------------------------------------//

    constructor(tracer) {
        super();
        this._tracer = tracer;
        this._uuid = this._generateUUID();
        this._startMs = Date.now();
        this._finishMs = 0;
        this._operationName = '';
        this._tags = {};
        this._logs = [];
    }

    uuid() {
        return this._uuid;
    }

    operationName() {
        return this._operationName;
    }

    durationMs() {
        return this._finishMs - this._startMs;
    }

    tags() {
        return this._tags;
    }

    _generateUUID() {
        const p0 = `00000000${Math.abs((Math.random() * 0xFFFFFFFF) | 0).toString(16)}`.substr(-8);
        const p1 = `00000000${Math.abs((Math.random() * 0xFFFFFFFF) | 0).toString(16)}`.substr(-8);
        return `${p0}${p1}`;
    }

    addReference(ref) {
    }

    /**
     * Returns a simplified object better for console.log()'ing.
     */
    debug() {
        let obj = {
            uuid      : this._uuid,
            operation : this._operationName,
            millis    : [this._finishMs - this._startMs, this._startMs, this._finishMs],
        };
        if (_.size(this._tags)) {
            obj.tags = this._tags;
        }
        return obj;
    }
}
