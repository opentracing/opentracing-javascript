var _      = require('underscore');
var expect = require('chai').expect;
var opentracing = require('../lib');

module.exports = function opentracingAPITests() {
    describe('Opentracing API', function() {
        describe('Constants', function() {
            var constStrings = [
                'FORMAT_TEXT_MAP',
                'FORMAT_BINARY',
                'FORMAT_HTTP_HEADERS',
                'REFERENCE_CHILD_OF',
                'REFERENCE_FOLLOWS_FROM',
            ];
            _.each(constStrings, function(name) {
                it(name + ' should be a constant string', function() {
                    expect(opentracing[name]).to.be.a('string');
                });
            });
        });

        describe('Standalone functions', function() {
            var funcs = [
                'childOf',
                'followsFrom',
                'initGlobalTracer',
                'globalTracer',

            ];
            _.each(funcs, function(name) {
                it(name + ' should be a function', function() {
                    expect(opentracing[name]).to.be.a('function');
                });
            });
        });
    });
}
