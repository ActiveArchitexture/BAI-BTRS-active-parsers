/**
 * Tests the BTR3 grammar on example nodes both
 *   inline and
 *   stored in a JSON file.
 * 
 * Three formats of AVA tests are supported:
 * 1.   inline tests
 * 2.   tests for specific examples from the JSON file
 * 3.   tests for every example in the JSON file
 */

var btr3Grammar = require('../src/btr3Grammar');
var btr3FileExamples = require('./_btr3-file-examples.js');

import test from 'ava';



// test.todo("3.3 ACCOUNT HEADER – Record 03 customerAccountNumber Must not contain comma , or slash / delimiters.");

/**
 * TODO refactor into helpers
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

function btr3Parse(source, startNode) {
    return btr3Grammar.match(source, startNode);
}

function macroFile(t, fileExample, testset) {
    // console.log("-----");
    // console.log(testset.description);
    // console.log(testset.startnode);

    this.title = `from file-example "${fileExample}": ${testset.description}`;

    // CRLF gives better output in case of parse failure
    var input = arrayOfLinesToString(testset.examplelines, '\r\n');

    var matchResult = btr3Parse(input, testset.startnode);
    if (matchResult.succeeded()) {
        t.pass();
    }
    else {
        t.fail(matchResult.message);
    }
}



/*
 run tests for every example in the JSON file. 
 */
for (var nodeExample in btr3FileExamples) {
    // console.log('-----');
    // console.log(nodeExample);
    var entry = btr3FileExamples[nodeExample];
    // console.log(entry);
    // console.log(entry.example);
    test(macroFile, nodeExample, entry);
}