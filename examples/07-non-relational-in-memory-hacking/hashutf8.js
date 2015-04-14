// Wraps murmurhash-js and exports a simple function for
// converting UTF8 strings into base64-encoded, 32-bit Murmur3
// hashes (fast hash w/excellent distribution).
//

var murmurhash = require('murmurhash-js');

var hash = module.exports = function(utf8string_) {
    var uint32 = murmurhash((new Buffer(utf8string_, 'utf-8')).toString('ascii'));
    var buffer = new Buffer(4);
    buffer[0] = uint32 & 0xFF;
    buffer[1] = (uint32 & 0xFF00) >> 8;
    buffer[2] = (uint32 & 0xFF0000) >> 16;
    buffer[3] = (uint32 & 0xFF000000) >> 24;
    var utf8 = buffer.toString('base64');
    var tail = utf8.length
    while (utf8.charAt(tail - 1) == '=') {
        tail--;
    }
    return utf8.slice(0,tail);
};
