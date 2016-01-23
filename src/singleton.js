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
     * Set the global Tracer's underlying implementation.
     *
     * The behavior is undefined if this function is called more than once.
     */
    initGlobalTracer(tracingImp) {
        this._imp = tracingImp.newTracer();
    }

    /**
     * Create a new Tracer object with the given underlying implementation.
     *
     * @return {Tracer} a new Tracer object
     */
    initNewTracer(tracingImp) {
        if (!this._imp) {
            return null;
        }
        return new Tracer(tracingImp);
    }
}
