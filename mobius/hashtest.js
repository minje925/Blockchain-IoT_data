require('date-utils');
var crypto = require('crypto');

var hash = crypto.createHash('sha256');
hash.update('1572853838307;29;38');
var output = hash.digest('hex');

console.log(output);
