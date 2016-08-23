let _globalTracer = null;

/**
 * Set the global Tracer.
 *
 * The behavior is undefined if this function is called more than once.
 *
 * @param {Tracer} tracer - the Tracer implementation
 */
export function initGlobalTracer(tracer) {
    _globalTracer = tracer;
}

/**
 * Returns the global tracer
 */
export function getGlobalTracer() {
    return _globalTracer;
}
