// The main lib now contains all the type checks lib-debug had previously by default
process.emitWarning('The main opentracing entry point is now equivalent to opentracing/debug', 'DeprecationWarning');
module.exports = require('./lib');
