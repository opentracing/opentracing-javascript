# Developer Notes

This is a work-in-progress implementation. Feedback and contributions are welcome.

This particular document is intended to summarize some development decisions made in the library to make moving the library forward easier and avoid revisiting past issues. The code history and Github issue history are helpful sources for more of this kind of information.

### Strictness

The library has a debug mode that enforces as many aspects of the public API as it reasonably can before passing data onto the implementation object. Often this is simply means validating the number and type of arguments. This is intended to discourage accidental (as well as intentional!) deviations in individual implementations from the OpenTracing specification. Particularly in debug mode, the library should err on the side of being overly restrictive (at least during initial development) as public APIs are almost always easier to make more flexible than more restrictive over time.

### Errors and Exceptions

The API layer throws Error exceptions *only* in debug builds.

In spirit of keeping the instrumentation from ever interfering with production application logic, the API layer does not handle error conditions in production builds. OpenTracing implementations may choose to handle them, but the implementations are encouraged to adhere to the principle that instrumentation code should not adversely affect the primary application code.

### No-op implementation

A design choice has been made that, for the purposes of integration simplicity and thus ease-of adoption, the `opentracing` JavaScript package is both the common API as well as a no-op implementation. This means that including the package should not require explicit configuration of a no-op implementation backend in order to run without instrumentation.

### API use of the Bridge Pattern ("pImpl idiom")

The API layer uses a bridge pattern to pass work to the specific tracing implementation. This is done instead of providing direct access to implementation-specific objects.

This is done primarily to encourage and, when possible enforce, standardization of the instrumentation code and conformance to the OpenTracing API. In JavaScript, which lacks a formal language-level concept of an "interface", the bridge pattern can emulate some of the advantages of more formal separation between interface and implementation.

For example, it is almost inevitable that there will be use cases for particular implementations that cannot be handled directly by the OpenTracing API (both valid uses and misguided ones, no doubt!). Encapsulating the implementation object as separate from the standard API, at the very least, encourages the deviations from the standard to be made more explicit.

For example, in the construed scenario below the `imp()` call below makes it self-documenting and obvious that `flushToStream()` is a non-standard, implementation-dependent method:

```
Tracer.startTrace("big_operation");
Tracer.imp().flushToStream(stream);
```

As a practical matter, such explicitness can be helpful for those new to tracing code (it self-documents what is standard and what is implementation-specific) as well as to reviewers of such code in highlighting deviations from the standard that may creep into a codebase.

## Open Questions / Issues / TODOS

*Note: the unresolved issues should be migrated to Github once the `opentracing-javascript` repository is created.*

**Don't the argument checks created overhead?**

Yes. Since webpack is being used, the code should be modified so these are compiled out of the production version.  A Github issue should be opened on to properly exclude these from production builds of the package.

**How do I create span and log data retroactively?**

Example: creating a span retroactively after page load from `window.performance.timing` data.

This is [logged as an issue](https://github.com/opentracing/opentracing.github.io/issues/20) on the generalized OpenTracing API.

**How do I create a new Tracer instance (i.e. not the global singleton)?**

The current solution is to call `opentracing.initNewTracer(...)`.  This is a *non-standard API* -- thus this is an open issue.

**What's the OpenTracing equivalent of `console.warn`?**

Current the API supports only info and error log statements.

**Should there be object pooling / reuse for all the ActiveSpan and ActiveSpan implementation objects?**

This optimization may make sense for a future version once the outward facing API is stabilized.

**Can I log spans before initializing the libray?**

Currently, no, as the underlying implementation object that would record these spans is not created until initialization.

This could be potentially useful as the startup information can be important and initialization order can sometimes be hard to control completely in a complex system of nested packages. However, this introduces difficulty as it would likely push implementation code to the OpenTracing API layer (i.e. some form of buffering until initialization was complete).

**What is an example use case for calling a newRootTraceContext()?**

...that could not be accomplished with a call to `startTrace()`?
