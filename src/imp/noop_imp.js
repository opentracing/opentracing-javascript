function NoopSpanImp() {
}
NoopSpanImp.prototype.tracer = function () {
    return null;
}
NoopSpanImp.prototype.setOperationName = function (name) {
}
NoopSpanImp.prototype.setTag = function (key, value) {
}
NoopSpanImp.prototype.addTags = function (keyValuePairs) {
}
NoopSpanImp.prototype.setBaggageItem = function (key, value) {
}
NoopSpanImp.prototype.getBaggageItem = function (key) {
}
NoopSpanImp.prototype.log = function (fields) {
}
NoopSpanImp.prototype.finish = function (finishTime) {
}

let noopSpanSingleton = new NoopSpanImp();

function NoopTracerImp() {
}
NoopTracerImp.prototype.setInterface = function (inf) {
}
NoopTracerImp.prototype.startSpan = function (nameOrFields, fields) {
    return noopSpanSingleton;
}
NoopTracerImp.prototype.inject = function (span, format, carrier) {
}
NoopTracerImp.prototype.join = function (operationName, format, carrier) {
    return noopSpanSingleton;
}

module.exports = NoopTracerImp;
