'use strict';

import Tracer from './tracer';

/**
 * The Singleton object extends the standard Tracer object so that the default
 * exported object of the package can be conveniently be used both as the
 * default tracer and an interface to the library.
 */
export default class Singleton extends Tracer {

    // ---------------------------------------------------------------------- //
    // OpenTracing API methods
    // ---------------------------------------------------------------------- //

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
        return new Tracer(tracingImp);
    }

    // ---------------------------------------------------------------------- //
    // Private and non-standard methods
    // ---------------------------------------------------------------------- //

    /**
     * Creates the Singleton with no underlying implementation (i.e. defaults
     * to no-op behavior for all functions).
     *
     * Note: this should never be called directly by consumers of the library.
     */
    constructor() {
        super();
    }
}
