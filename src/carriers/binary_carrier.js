'use strict';

export default class BinaryCarrier {
    constructor() {
        this.tracerState = new Uint8Array();
        this.baggage = new Uint8Array();
    }
}
