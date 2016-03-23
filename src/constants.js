'use strict';

module.exports = {
    /**
     * Used to inject/join a span using a Uint8Array as a carrier.
     */
    FORMAT_BINARY : 'binary',

    /**
     * Used to inject/join a span using a string->string map as a carrier.
     *
     * NOTE: Since HTTP headers are a particularly important use case for the
     * TEXT_MAP carrier, map keys identify their respective values in a
     * case-insensitive manner.
     * 
     * NOTE: The TEXT_MAP carrier map may contain unrelated data (e.g.,
     * arbitrary HTTP headers). As such, the Tracer implementation should use a
     * prefix or other convention to distinguish Tracer-specific key:value
     * pairs.
     */
    FORMAT_TEXT_MAP   : 'text_map',
};
