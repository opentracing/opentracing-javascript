import * as opentracing from '../index';
import MockReport from './mock_report';
import MockSpan from './mock_span';
/**
 * OpenTracing Tracer implementation designed for use in unit tests.
 */
export declare class MockTracer extends opentracing.Tracer {
    private _spans;
    protected _startSpan(name: string, fields: {
        [key: string]: any;
    }): MockSpan;
    protected _inject(span: MockSpan, format: any, carrier: any): never;
    protected _extract(format: any, carrier: any): never;
    constructor();
    private _allocSpan();
    /**
     * Discard any buffered data.
     */
    clear(): void;
    /**
     * Return the buffered data in a format convenient for making unit test
     * assertions.
     */
    report(): MockReport;
}
export default MockTracer;
