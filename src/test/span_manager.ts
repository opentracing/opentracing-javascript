import { expect } from 'chai';
import * as fs from 'fs';

import * as opentracing from '..';
import * as asyncHookSpanManager from '../async_hook_span_manager';
import * as asyncWrapSpanManager from '../async_wrap_span_manager';
import * as zoneSpanManager from '../zone_span_manager';

export function spanManagerTests(spanManagerFactory: () => opentracing.SpanManager): void {
    describe('activate()', () => {
        it('should persist through setTimeout', async () => {
            const spanManager = spanManagerFactory();
            expect(spanManager.active()).to.be.null;

            const span = new opentracing.Span();
            const spanPromise = spanManager.activate(span, () => {
                expect(spanManager.active()).to.equal(span);
                return new Promise<opentracing.Span | null>(resolve => {
                    setTimeout(() => resolve(spanManager.active()), 0);
                });
            });

            expect(spanManager.active()).to.be.null;
            expect(await spanPromise).to.equal(span);
            expect(spanManager.active()).to.be.null;
        });

        it('should persist through async/await', async () => {
            const spanManager = spanManagerFactory();
            expect(spanManager.active()).to.be.null;

            const span = new opentracing.Span();
            const spanPromise = spanManager.activate(span, () => {
                expect(spanManager.active()).to.equal(span);
                return (async () => {
                    await Promise.resolve();
                    return spanManager.active();
                })();
            });

            expect(spanManager.active()).to.be.null;
            expect(await spanPromise).to.equal(span);
            expect(spanManager.active()).to.be.null;
        });

        it('should persist through fs.stat', async () => {
            const spanManager = spanManagerFactory();
            expect(spanManager.active()).to.be.null;

            const span = new opentracing.Span();
            const spanPromise = spanManager.activate(span, () => {
                expect(spanManager.active()).to.equal(span);
                return new Promise<opentracing.Span | null>(resolve => {
                    fs.stat('test', () => resolve(spanManager.active()));
                });
            });

            expect(spanManager.active()).to.be.null;
            expect(await spanPromise).to.equal(span);
            expect(spanManager.active()).to.be.null;
        });
    });

    describe('multiple instances', () => {
        it('should not interfere', async () => {
            const spanManager1 = spanManagerFactory();
            const spanManager2 = spanManagerFactory();
            expect(spanManager1.active()).to.be.null;
            expect(spanManager2.active()).to.be.null;

            const span1 = new opentracing.Span();
            const span2 = new opentracing.Span();
            const [spanPromise1, spanPromise2] = spanManager1.activate(span1, () => {
                expect(spanManager1.active()).to.equal(span1);
                expect(spanManager2.active()).to.be.null;

                return spanManager2.activate(span2, () => {
                    expect(spanManager1.active()).to.equal(span1);
                    expect(spanManager2.active()).to.equal(span2);

                    return [
                        new Promise<opentracing.Span | null>(resolve => {
                            setTimeout(() => resolve(spanManager1.active()), 0);
                        }),
                        new Promise<opentracing.Span | null>(resolve => {
                            setTimeout(() => resolve(spanManager2.active()), 0);
                        })
                    ];
                });
            });

            expect(spanManager1.active()).to.be.null;
            expect(spanManager2.active()).to.be.null;
            expect(await spanPromise1).to.equal(span1);
            expect(await spanPromise2).to.equal(span2);
            expect(spanManager1.active()).to.be.null;
            expect(spanManager2.active()).to.be.null;
        });
    });
}

export function asyncHookManagerTests(): void {
    const { AsyncHookSpanManager } = require('../async_hook_span_manager') as typeof asyncHookSpanManager;
    describe('AsyncHookManager', () => {
        spanManagerTests(() => new AsyncHookSpanManager());
    });
}

export function asyncWrapSpanManagerTest(): void {
    const { AsyncWrapSpanManager } = require('../async_wrap_span_manager') as typeof asyncWrapSpanManager;
    describe('AsyncWrapManager', () => {
        spanManagerTests(() => new AsyncWrapSpanManager());
    });
}

export function zoneSpanManagerTests(): void {
    const { ZoneSpanManager } = require('../zone_span_manager') as typeof zoneSpanManager;
    describe('ZoneSpanManager', () => {
        spanManagerTests(() => new ZoneSpanManager());
    });
}
