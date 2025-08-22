# inquire_buffer_bun_issue

## Overview

This is an example project to detect and issue with:

- Bun.build (packager like webpack)
- @protobufjs/inquire of the Buffer class

This was found when attempting to use this stack:

- Bun 1.2.20 (built for production)
- @valkey/valkey-glide@2.0.1
- Pulled in: protobufjs@7.5.4, @protobufjs/inquire@1.1.0

The error when creating a Valkey Glide client was:

```
65 |
66 | /**
67 |  * @override
68 |  */
69 | BufferWriter.prototype.string = function write_string_buffer(value) {
70 |     var len = util.Buffer.byteLength(value);
                        ^
TypeError: null is not an object (evaluating 't9.Buffer.byteLength')
      at H (/usr/node_modules/protobufjs/src/writer_buffer.js:70:20)
      at L (/usr/node_modules/@valkey/valkey-glide/build-ts/ProtobufMessage.js:3214:58)
      at A (/usr/node_modules/@valkey/valkey-glide/build-ts/ProtobufMessage.js:4313:58)
      at A (/usr/node_modules/@valkey/valkey-glide/build-ts/ProtobufMessage.js:4359:25)
      at <anonymous> (/usr/node_modules/@valkey/valkey-glide/build-ts/BaseClient.js:6478:72)
      at writeOrBufferRequest (/usr/node_modules/@valkey/valkey-glide/build-ts/BaseClient.js:577:9)
      at <anonymous> (/usr/node_modules/@valkey/valkey-glide/build-ts/BaseClient.js:6477:18)
      at new Promise (1:11)
      at connectToServer (/usr/node_modules/@valkey/valkey-glide/build-ts/BaseClient.js:6470:16)
      at __createClientInternal (/usr/node_modules/@valkey/valkey-glide/build-ts/BaseClient.js:6504:26)
      at __createClientInternal (/usr/node_modules/@valkey/valkey-glide/build-ts/BaseClient.js:6506:16)
      at createClientInternal (/usr/node_modules/@valkey/valkey-glide/build-ts/BaseClient.js:6527:31)
Bun v1.2.20 (Linux x64 baseline)
```

This appears to be an issue with how inquire tries to avoid bundlers
& with how buffer is pulled in. A similar issue is
[in this bun issue](https://github.com/oven-sh/bun/issues/14891).

The ultimate problem appears to be that inquire does something like this:

```javascript
eval("quire".replace(/^/, "re"))
> ReferenceError: require is not defined
```

Building with `format: "cjs",` seems to work if you then run `index.js` directly.

## Using

To install dependencies:

```bash
bun install
```

To run the test case:

```bash
# Creates built library using bun
# (I checked in `build/` for this example, so not strictly necessary)
bun run build
# Imports the library in the same way protobuf.js does
bun run ./validate.ts
```

Here is an example of what you will see if there's an error:

```
23 |       return Buffer.prototype.utf8Write ? Buffer : null;
24 |     } catch (e) {
25 |       return null;
26 |     }
27 |   }();
28 |   var len = util.Buffer.byteLength("test value");
                      ^
TypeError: null is not an object (evaluating 'util.Buffer.byteLength')
      at <anonymous> (/Users/mark.watson/proj/open_source/inquire_buffer_bun_issue/build/index.js:28:18)
      at <anonymous> (/Users/mark.watson/proj/open_source/inquire_buffer_bun_issue/build/index.js:1:47)
      at /Users/mark.watson/proj/open_source/inquire_buffer_bun_issue/build/index.js:31:16
      at loadAndEvaluateModule (2:1)

Bun v1.2.20 (macOS arm64)
```

If you run the code directly (not the built file), you get:

```
bun run ./index.ts
Worked and found buffer package. Got byte length: 10
```

This project was created using `bun init` in bun v1.2.20. [Bun](https://bun.com) is a fast all-in-one JavaScript runtime.
