/* eslint-disable import/no-extraneous-dependencies */
import * as _ from 'lodash';
import { DebugInfo, MockSpan } from './mock_span';

/**
 * Index a collection of reported MockSpans in a way that's easy to run unit
 * test assertions against.
 */
export class MockReport {

    spans: MockSpan[];
    private spansByUUID: { [uuid: string]: MockSpan };
    private spansByTag: { [key: string]: { [value: string]: MockSpan[] } };
    private debugSpans: DebugInfo[];
    private unfinishedSpans: MockSpan[];

    constructor(spans: MockSpan[]) {
        this.spans = spans;
        this.spansByUUID = {};
        this.spansByTag = {};
        this.debugSpans = [];

        this.unfinishedSpans = [];

        _.each(spans, span => {
            if (span._finishMs === 0) {
                this.unfinishedSpans.push(span);
            }

            this.spansByUUID[span.uuid()] = span;
            this.debugSpans.push(span.debug());

            _.each(span.tags(), (val, key: string) => {
                this.spansByTag[key] = this.spansByTag[key] || {};
                this.spansByTag[key][val] = this.spansByTag[key][val] || [];
                this.spansByTag[key][val].push(span);
            });
        });
    }

    firstSpanWithTagValue(key: string, val: any): MockSpan | null {
        const m = this.spansByTag[key];
        if (!m) {
            return null;
        }
        const n = m[val];
        if (!n) {
            return null;
        }
        return n[0];
    }
}

export default MockReport;
