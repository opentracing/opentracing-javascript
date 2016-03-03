'use strict';

/**
 * A SplitTextCarrier is intended to hold string-string pairs in its two
 * associative arrays.
 */
export default class SplitTextCarrier {
    constructor() {
        this.tracerState = {};
        this.baggage = {};
    }
}
