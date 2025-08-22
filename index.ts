// Reproducing buffer not found in Bun bundler with:
// Bun 1.2.20
// @protobufjs/inquire@1.1.0
// protobufjs@7.5.4
// @valkey/valkey-glide@2.0.1
// SNIP from https://github.com/protobufjs/protobuf.js/blob/827ff8e48253e9041f19ac81168aa046dbdfb041/src/util/minimal.js
var util = exports;

util.inquire = require("@protobufjs/inquire");

/**
 * Node's Buffer class if available.
 * @type {Constructor<Buffer>}
 */
util.Buffer = (function() {
    try {
        var Buffer = util.inquire("buffer").Buffer;
        // refuse to use non-node buffers if not explicitly assigned (perf reasons):
        return Buffer.prototype.utf8Write ? Buffer : /* istanbul ignore next */ null;
    } catch (e) {
        /* istanbul ignore next */
        return null;
    }
})();

var len = util.Buffer.byteLength("test value");
console.log("Worked and found buffer package. Got byte length: " + len);
