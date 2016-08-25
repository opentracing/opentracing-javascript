"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * Convenience class to use as a binary carrier.
 *
 * Any valid Object with a field named `buffer` may be used as a binary carrier;
 * this class is only one such type of object that can be used.
 */
var BinaryCarrier = function BinaryCarrier(binaryData) {
    _classCallCheck(this, BinaryCarrier);

    this._buffer = binaryData;
};

exports.default = BinaryCarrier;

//# sourceMappingURL=binary_carrier.js.map