var __commonJS = (cb, mod2) => () => (mod2 || cb((mod2 = { exports: {} }).exports, mod2), mod2.exports);

// node_modules/@protobufjs/inquire/index.js
var require_inquire = __commonJS((exports, module) => {
  module.exports = inquire;
  function inquire(moduleName) {
    try {
      var mod = eval("quire".replace(/^/, "re"))(moduleName);
      if (mod && (mod.length || Object.keys(mod).length))
        return mod;
    } catch (e) {}
    return null;
  }
});

// index.ts
var require_inquire_buffer_bun_issue = __commonJS((exports) => {
  var util = exports;
  util.inquire = require_inquire();
  util.Buffer = function() {
    try {
      var Buffer = util.inquire("buffer").Buffer;
      return Buffer.prototype.utf8Write ? Buffer : null;
    } catch (e) {
      return null;
    }
  }();
  var len = util.Buffer.byteLength("test value");
  console.log("Worked found buffer package. Got byte length: " + len);
});
export default require_inquire_buffer_bun_issue();
