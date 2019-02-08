declare module 'emitter-listener' {
    type EventName = string | symbol;

    type EventListener = (...args: any[]) => any;

    type EmitterMethod = (eventName: EventName, listener: EventListener) => any;

    interface EventEmitter {
        emit(eventName: EventName, ...args: any[]): any;
        on: EmitterMethod;
        addListener: EmitterMethod;
        removeListener: EmitterMethod;
    }

    export default function wrapEmitter(
      emitter: EventEmitter,
      mark: EventListener,
      prepare: EventListener
    ): void;
}
