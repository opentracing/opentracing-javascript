'use strict';

import Tracer from './tracer';
import * as Constants from './constants';
import BinaryCarrier from './binary_carrier';

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
     *
     * @param {TracerImp} The Tracer implementation object
     */
    initGlobalTracer(tracerImp) {
        this._imp = tracerImp;
    }

    /**
     * Create a new Tracer object with the given underlying implementation.
     *
     * @return {Tracer} a new Tracer object
     */
    initNewTracer(tracerImp) {
        return new Tracer(tracerImp);
    }

    // ---------------------------------------------------------------------- //
    // Private and non-standard methods
    // ---------------------------------------------------------------------- //

    /**
     * Creates the Singleton with no underlying implementation (i.e. defaults
     * to no-op behavior for all functions).
     *
     * The OpenTracing package-level object acts both at the singleton and the
     * package interface itself, so this Singleton is both a the Tracer and
     * also includes all the global library symbols.
     *
     * Note: this should never be called directly by consumers of the library.
     */
    constructor() {
        super();

        // Merge the constants into the singleton object so they are accessible at the
        // package level.
        for (let key in Constants) {
            this[key] = Constants[key];
        }

        // Carrier objects to be exposed at the package level
        this.BinaryCarrier = BinaryCarrier;
    }
}
