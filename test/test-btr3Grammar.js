var assert = require('assert');
var join = require('path').join;
var fs = require('fs');
var ohm = require('ohm-js');

var btr3Contents = fs.readFileSync(join('src', 'BTR3.ohm'));
var btr3Grammar = ohm.grammar(btr3Contents);

/*
    $ npm test -- --watch
*/

import test from 'ava';

test('grammar for valid fileCreationDate', t => {
    t.true(btr3Grammar.match('201230', 'fileCreationDate').succeeded());
});
test('grammar for invalid fileCreationDate - dd 40 greater than 31', t => {
    t.true(btr3Grammar.match('201240', 'fileCreationDate').failed());
});

test('grammar for valid fileCreationTime', t => {
    t.true(btr3Grammar.match('2359', 'fileCreationTime').succeeded());
});
test('grammar for invalid fileCreationTime - hh 24 not in range 00..23', t => {
    t.true(btr3Grammar.match('2400', 'fileCreationTime').failed());
});
test('grammar for invalid fileCreationTime - mm 60 not in range 00..59', t => {
    t.true(btr3Grammar.match('2360', 'fileCreationTime').failed());
});

test('grammar for valid FileHeader - ANSI X9.121–2016 (BTR3) Sample 01 Record Example Using Only Mandatory Fields', t => {
    t.true(btr3Grammar.match('01,122099999,123456789,150623,0200,1,,,3/', 'FileHeader').succeeded());
});
test('grammar for valid FileHeader - ANSI X9.121–2016 (BTR3) Sample 01 Record Example Using Only Mandatory Fields WITH space after commas', t => {
    t.true(btr3Grammar.match('01, 122099999, 123456789, 150623, 0200, 1,,,3/', 'FileHeader').succeeded());
});

// Log traces to console - similar to interactive editor outputs
// console.log(g.trace("2359", "fileCreationTime").toString());

// Test grammar for fileControlTotal
test('grammar for valid fileControlTotal with unsigned total', t => {
    t.true(btr3Grammar.match('1215450000', 'fileControlTotal').succeeded());
});
test('grammar for valid fileControlTotal with negative total', t => {
    t.true(btr3Grammar.match('-1215450000', 'fileControlTotal').succeeded());
});
test('grammar for valid fileControlTotal with positive total', t => {
    t.true(btr3Grammar.match('+1215450000', 'fileControlTotal').succeeded());
});

// Test grammar for numberofBanks
test('grammar for valid fileControlTotal with unsigned numberofBanks', t => {
    t.true(btr3Grammar.match('121', 'numberofBanks').succeeded());
});
test('grammar for valid fileControlTotal with positive numberofBanks', t => {
    t.true(btr3Grammar.match('+121', 'numberofBanks').succeeded());
});
test('grammar for invalid fileControlTotal with negative numberofBanks', t => {
    t.true(btr3Grammar.match('-121', 'numberofBanks').failed());
});

// Test grammar for FileTrailer
test('grammar for valid FileTrailer succeeds for ANSI X9.121–2016 (BTR3) Sample 99 Record', t => {
    t.true(btr3Grammar.match('99,1215450000,4,136/', 'FileTrailer').succeeded());
});
test('grammar for valid FileTrailer succeeds for ANSI X9.121–2016 (BTR3) from 5.1.1 Empty File 99 Record', t => {
    t.true(btr3Grammar.match('99,0,0,2/', 'FileTrailer').succeeded());
});

// Test grammar for 5.1.1 Empty Files
var emptyCRLFfile = '01,123456789,NAMENAME,150716,2100,11,,,3/' + '\r\n' + '99,0,0,2/';
test('grammar for valid BTRSfile succeeds for ANSI X9.121–2016 (BTR3) 5.1.1 Empty File with CRLF', t => {
    t.true(btr3Grammar.match(emptyCRLFfile, 'BTRSfile').succeeded());
});
var emptyCRfile = '01,123456789,NAMENAME,150716,2100,11,,,3/' + '\r' + '99,0,0,2/';
test('grammar for valid BTRSfile succeeds for ANSI X9.121–2016 (BTR3) 5.1.1 Empty File', t => {
    t.true(btr3Grammar.match(emptyCRfile, 'BTRSfile').succeeded());
});

