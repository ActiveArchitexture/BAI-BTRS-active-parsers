var assert = require('assert');
var join = require('path').join;
var fs = require('fs');
var ohm = require('ohm-js');

var btr3ToJSON = require('../src/btr3ToJSON');
var btr3FileExamples = require('./_btr3-file-examples.js');

import test from 'ava';


const CR = '\r';
const CRLF = '\r\n';

/*
    $ npm test -- --watch
*/

/*
    Test Helper functions
*/

/**
 * 
 * @param {*} inString 
 */
function stripWhiteSpace(inString) {
    return inString.replace(/\s/g, '');
}

/**
 * 
 * @param {*} lines 
 * @param {*} eol 
 */
function arrayOfLinesToString(lines, eol) {
    var strung = "";
    for (var line of lines) {
        strung += line + eol;
    }
    return strung;
}

/**
 * 
 * @param {*} t 
 * @param {*} testset 
 * @param {*} eol 
 */
function macroFile(t, testset, eol) {
    // console.log("-----");
    // console.log(testset.description);
    // console.log(testset.startnode);
    // console.log(testset.example);
    // console.log(testset.expected);
    this.title = testset.description;

    var input = arrayOfLinesToString(testset.examplelines, eol);
    // console.log(input);

    var actual = btr3ToJSON(input, testset.startnode);
    // check that example parses
    if (typeof actual === 'string') {
        var expected = JSON.stringify(testset.expected);
        t.deepEqual(stripWhiteSpace(actual), stripWhiteSpace(expected));
    } else {
        t.fail(actual.message)
    }
}

// Is this needed? Is setting this.title in the macro equivalent?
// macroFull.title = (providedTitle) => `${providedTitle}`;


/*
    run specific test examples
*/
test(macroFile, btr3FileExamples.emptyfile, CRLF);

test(macroFile, btr3FileExamples.btr3emptyfile, CRLF);


/* TODO test array of examples
*/
