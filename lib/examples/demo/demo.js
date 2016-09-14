'use strict';

var _ = require('../../..');

var _2 = _interopRequireDefault(_);

var _mock_tracer = require('../../mock_tracer');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/* eslint-disable */

console.log('\nRunning demo...\n');

var tracer = new _mock_tracer.MockTracer();

console.log('Starting parent.');
var parent = tracer.startSpan('parent_span');
parent.setTag('custom', 'tag value');
parent.setTag('alpha', '1000');

console.log('Waiting to start child...');
setTimeout(function () {
    console.log('Starting child span.');
    var child = tracer.startSpan('child_span', { childOf: parent });
    child.setTag('alpha', '200');
    child.setTag('beta', '50');
    child.log({ state: "waiting" });

    console.log('Waiting...');
    setTimeout(function () {
        console.log('Finishing child and parent.');
        child.log({ state: "done" });
        child.finish();
        parent.finish();

        // Print some information about the two spans. Note the `report` method
        // is specific to the MockTracer implementation and is not part of the
        // OpenTracing API.
        console.log('\nSpans:');
        var report = tracer.report();
        for (var i = 0; i < report.spans.length; i++) {
            var span = report.spans[i];
            var tags = span.tags();
            var tagKeys = Object.keys(tags);

            console.log('    ' + span.operationName() + ' - ' + span.durationMs() + 'ms');
            for (var j = 0; j < tagKeys.length; j++) {
                var key = tagKeys[j];
                var value = tags[key];
                console.log('        tag \'' + key + '\':\'' + value + '\'');
            }
        }
    }, 500);
}, 1000);

//# sourceMappingURL=demo.js.map