/* eslint-disable import/no-extraneous-dependencies */
import _ from 'underscore';

/**
 * Index a collection of reported MockSpans in a way that's easy to run unit
 * test assertions against.
 */
export default class MockReport {

    constructor(spans) {
        this.spans = spans;
        this.spansByUUID = {};
        this.spansByTag = {};
        this.debugSpans = [];

        this.unfinishedSpans = [];

        _.each(spans, (span) => {
            if (span._finishMs === 0) {
                this.unfinishedSpans.push(span);
            }

            this.spansByUUID[span.uuid()] = span;
            this.debugSpans.push(span.debug());

            _.each(span._tags, (val, key) => {
                this.spansByTag[key] = this.spansByTag[key] || {};
                this.spansByTag[key][val] = this.spansByTag[key][val] || [];
                this.spansByTag[key][val].push(span);
            });
        });
    }

    firstSpanWithTagValue(key, val) {
        let m = this.spansByTag[key];
        if (!m) {
            return null;
        }
        let n = m[val];
        if (!n) {
            return null;
        }
        return n[0];
    }
}
