// The main lib now contains all the type checks lib-debug had previously by default
process.emitWarning('The opentracing/debug entry point is deprecated', 'DeprecationWarning');
module.exports = require('./lib');
