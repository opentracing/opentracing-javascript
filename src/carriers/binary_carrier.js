'use strict';

export default class BinaryCarrier {
    constructor() {
        this.tracerState = new Uint8Array(0);
        this.baggage = new Uint8Array(0);
    }
}
