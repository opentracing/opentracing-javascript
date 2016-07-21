'use strict';

import Tracer from './tracer';
import * as Constants from './constants';
import BinaryCarrier from './binary_carrier';
import Reference from './reference';

/**
 * The Singleton object is the default export of the package and extends the
 * standard Tracer object so that the default
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
     * @param {TracerImp} tracerImp - the Tracer implementation object
     */
    initGlobalTracer(tracerImp) {
        this._imp = tracerImp;

        // Provide the implementation with a handle to the interface. This can
        // also be used a post-initialization signal.
        if (tracerImp) {
            tracerImp.setInterface(this);
        }
    }

    /**
     * Create a new Tracer object with the given underlying implementation.
     *
     * @return {Tracer} a new Tracer object
     */
    initNewTracer(tracerImp) {
        let tracer = new Tracer(tracerImp);
        if (tracerImp) {
            tracerImp.setInterface(this);
        }
        return tracer;
    }

    // ---------------------------------------------------------------------- //
    // Private and non-standard methods
    // ---------------------------------------------------------------------- //

    /* For internal use only:
     *
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
        for (let key in Constants) {        // eslint-disable-line no-restricted-syntax
            this[key] = Constants[key];
        }
        this.Reference = Reference;

        // Carrier objects to be exposed at the package level
        this.BinaryCarrier = BinaryCarrier;
    }
}
