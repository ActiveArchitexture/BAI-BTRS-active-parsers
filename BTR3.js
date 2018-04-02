/*
    https://github.com/harc/ohm/blob/master/doc/index.md
    https://github.com/harc/ohm/blob/master/examples/csv/index.js

    https://x9.org/wp-content/uploads/2017/05/X9.121-2016-BTRS-Version-3.0.pdf
    

*/
var assert = require('assert');
var join = require('path').join;
var fs = require('fs');
var ohm = require('ohm-js');

var contents = fs.readFileSync(join(__dirname, 'BTR3.ohm'));

var g = ohm.grammar(contents);


// Test grammar for fileCreationDate
assert(g.match('201230', 'fileCreationDate').succeeded());
assert(g.match('201240', 'fileCreationDate').failed(), 'dd 40 greater than 31');

// Test grammar for fileCreationTime
assert(g.match('2359', 'fileCreationTime').succeeded());
assert(g.match('2400', 'fileCreationTime').failed(), 'hh 24 not in range 00..23');
assert(g.match('2360', 'fileCreationTime').failed(), 'mm 60 not in range 00..59');

// Test grammar for FileHeader
assert(g.match('01,122099999,123456789,150623,0200,1,,,3/', 'FileHeader').succeeded(), 'ANSI X9.121–2016 (BTR3) Sample 01 Record Example Using Only Mandatory Fields');
assert(g.match('01, 122099999, 123456789, 150623, 0200, 1,,,3/', 'FileHeader').succeeded(), 'ANSI X9.121–2016 (BTR3) Sample 01 Record Example WITH space after commas');


g.trace("2359", "fileCreationTime");
