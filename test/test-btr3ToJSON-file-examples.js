/**
 * Test the translation of complete examples of the BTR3 grammar to JSON.
 * The examples are stored in a JSON file.
 * The examples must represent complete BTR3 files. 
 * 
 * Two formats of AVA tests are supported:
 * 1.   tests for specific examples from the JSON file
 * 2.   tests for every example in the JSON file
 */

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
  run tests for specific examples from the JSON file. 
*/
test(macroFile, btr3FileExamples.emptyfile, CRLF);
test(macroFile, btr3FileExamples.emptyfile, CR);
test(macroFile, btr3FileExamples.btr3emptyfile, CRLF);

/*
 run tests for every example in the JSON file using CRLF as the end of line delimiter. 
 */
for (var fileExample in btr3FileExamples) {
    var entry = btr3FileExamples[fileExample];
    // console.log(entry);
    // console.log(entry.example);
    test(macroFile, entry, CRLF);
}

/*
 run tests for every example in the JSON file using CR as the end of line delimiter. 
 */
for (var fileExample in btr3FileExamples) {
    var entry = btr3FileExamples[fileExample];
    test(macroFile, entry, CR);
}