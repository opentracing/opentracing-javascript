'use strict';

import Singleton from './singleton';

// Due to the various ways packages can be included in JavaScript (e.g. <script>
// tags vs included via webpack), it's possible for a single application to
// have multiple copies of the OpenTracing code.  Try to ensure there's only one
// singleton even in such scenarios.
var singleton;
if (typeof window !== 'undefined' && window.__opentracing_singleton) {
    singleton = window.__opentracing_singleton;
} else if (typeof global !== 'undefined' && global.__opentracing_singleton) {
    singleton = global.__opentracing_singleton;
} else {
    singleton = new Singleton();
}
module.exports = singleton;
