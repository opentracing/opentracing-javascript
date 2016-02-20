'use strict';

/**
 */
export default class Injector {

    // ---------------------------------------------------------------------- //
    // OpenTracing API methods
    // ---------------------------------------------------------------------- //

    /**
     * TODO:
     */
    injectSpan(span, carrier) {
        if (this._imp) {
            this._imp.injectSpan(span, carrier);
        }
    }

    // ---------------------------------------------------------------------- //
    // Private and non-standard methods
    // ---------------------------------------------------------------------- //

    constructor(imp) {
        this._imp = imp;
    }
}


/**
 */
export default class Extractor {

    // ---------------------------------------------------------------------- //
    // OpenTracing API methods
    // ---------------------------------------------------------------------- //

    /**
     * TODO:
     */
    joinTrace(operationName, carrier) {
        if (this._imp) {
            this._imp.joinTrace(span, carrier);
        }
    }

    // ---------------------------------------------------------------------- //
    // Private and non-standard methods
    // ---------------------------------------------------------------------- //

    constructor(imp) {
        this._imp = imp;
    }
}
