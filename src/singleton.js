'use strict';

import Tracer from './tracer';

/**
 *
 */
export default class Singleton extends Tracer {

    /**
     * Creates the Singleton with no underlying implementation (i.e. defaults
     * to no-op behavior for all functions).
     */
    constructor() {
        super();
    }

    /**
     * [initialize description]
     * @return {[type]} [description]
     */
    initGlobalTracer(tracingImp) {
        this._imp = tracingImp.newTracer();
    }

    /**
     * Create a new Tracer object using the global implementation registered
     * with initGlobalTracer. To reduce complexity, it is currently intentionally
     * not possible to create a new Tracer with a different underlying
     * implementation than the globally registered implementation.
     *
     * @return {[type]} [description]
     */
    initNewTracer() {
        if (!this._imp) {
            return null;
        }
        return this._imp.newTracer();
    }
}
