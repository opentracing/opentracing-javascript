/* eslint-disable */

import opentracing from '../../..';
import { MockTracer } from '../../mock_tracer';

console.log('\nRunning demo...\n');

const tracer = new MockTracer();

console.log('Starting parent.');
const parent = tracer.startSpan('parent_span');
parent.setTag('custom', 'tag value');
parent.setTag('alpha', '1000');

console.log('Waiting to start child...');
setTimeout(() => {
    console.log('Starting child span.');
    const child = tracer.startSpan('child_span', { childOf: parent });
    child.setTag('alpha', '200');
    child.setTag('beta', '50');
    child.log({state: "waiting"})

    console.log('Waiting...');
    setTimeout(() => {
        console.log('Finishing child and parent.')
        child.log({state: "done"})
        child.finish();
        parent.finish();

        // Print some information about the two spans. Note the `report` method
        // is specific to the MockTracer implementation and is not part of the
        // OpenTracing API.
        console.log('\nSpans:');
        const report = tracer.report();
        for (let i = 0; i < report.spans.length; i++) {
            const span = report.spans[i];
            const tags = span.tags();
            const tagKeys = Object.keys(tags);

            console.log(`    ${span.operationName()} - ${span.durationMs()}ms`);
            for (let j = 0; j < tagKeys.length; j++) {
                let key = tagKeys[j];
                let value = tags[key];
                console.log(`        tag '${key}':'${value}'`);
            }
        }
    }, 500);
}, 1000);
