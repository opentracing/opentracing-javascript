'use strict';

import Singleton from './singleton';

// Due to the various ways packages can be included in JavaScript (e.g. <script>
// tags vs included via webpack), it's possible for a single application to
// have multiple copies of the OpenTracing code.  Try to ensure there's only one
// singleton even in such scenarios.
let handleWindow = (typeof window !== 'undefined') ? window : {};
let handleGlobal = (typeof global !== 'undefined') ? global : {};

let singleton = handleWindow.__opentracing_singleton ||
    handleGlobal.__opentracing_singleton;
if (!singleton) {
    singleton = new Singleton();
    handleWindow.__opentracing_singleton = singleton;
    handleGlobal.__opentracing_singleton = singleton;
}

module.exports = singleton;
