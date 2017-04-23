"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Convenience class to use as a binary carrier.
 *
 * Any valid Object with a field named `buffer` may be used as a binary carrier;
 * this class is only one such type of object that can be used.
 */
var BinaryCarrier = (function () {
    function BinaryCarrier(binaryData) {
        this.binaryData = binaryData;
        this.buffer = binaryData;
    }
    return BinaryCarrier;
}());
exports.default = BinaryCarrier;
//# sourceMappingURL=binary_carrier.js.map