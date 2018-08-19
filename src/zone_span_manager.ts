/// <reference types="zone.js"/>
import { Span } from './span';
import { SpanManager } from './span_manager';

const defaultPropertyKey = 'opentracing';

const defaultZoneName = 'opentracing';

interface PropertyData {
    owner: ZoneSpanManager;
    span: Span | null;
}

export interface ZoneSpanOptions {
    /**
     * Name to give a created zone. Defaults to 'opentracing'.
     */
    zoneName?: string;
    /**
     * Key of Zone property. Defaults to 'opentracing'.
     */
    propertyKey?: string;
}

/**
 * SpanManager using {@link Zone.js|https://github.com/angular/zone.js}.
 *
 * The activated span is tied to the Zone. I.e. Zone#run affects which span is
 * active.
 */
export class ZoneSpanManager implements SpanManager {
    private readonly _propertyKey: string;

    private readonly _zoneName: string;

    constructor(options: ZoneSpanOptions = {}) {
        this._propertyKey = options.propertyKey || defaultPropertyKey;
        this._zoneName = options.zoneName || defaultZoneName;

        if (typeof Zone === 'undefined') {
            console.warn('Zone implementation does not exist.');
        }
    }

    active(): Span | null {
        // tslint:disable-next-line:no-conditional-assignment
        for (let zone = Zone.current; zone = zone.getZoneWith(this._propertyKey), zone; zone = zone.parent) {
            const { owner, span } = zone.get(this._propertyKey) as PropertyData;
            if (owner === this) {
                return span;
            }
        }
        return null;
    }

    activate<A>(span: Span | null, f: () => A): A {
        const zone = Zone.current.fork({
            name: this._zoneName,
            properties: {
                [this._propertyKey]: {owner: this, span}
            }
        });
        return zone.run(f);
    }
}
