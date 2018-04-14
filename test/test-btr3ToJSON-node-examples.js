var assert = require('assert');
var join = require('path').join;
var fs = require('fs');
var ohm = require('ohm-js');

var btr3ToJSON = require('../src/btr3ToJSON');
var btr3NodeExamples = require('./_btr3-node-examples.js');

// import test from 'ava';
var test = require('ava');

/*
    $ npm test -- --watch
*/

function stripWhiteSpace(inString) {
    return inString.replace(/\s/g, '');
}

function macroNode(t, testset) {
    // console.log("-----");
    // console.log(testset.description);
    // console.log(testset.startnode);
    // console.log(testset.example);
    // console.log(testset.expected);

    var exp = testset.expected[testset.startnode];
    // console.log(exp);
    this.title = testset.description;

    var actual = btr3ToJSON(testset.example, testset.startnode);
    // check that example parses
    if (typeof actual === 'string') {
        var expected = `"${testset.startnode}": ${JSON.stringify(exp)}`;
        t.deepEqual(stripWhiteSpace(actual), stripWhiteSpace(expected));
    } else {
        t.fail(actual.message)
    }
}
// macroPartial.title = (providedTitle) => `${providedTitle}`;


/*
 run tests for specific examples from the JSON file. 
 */
// Test actions for FileHeader start nodes
test(macroNode, btr3NodeExamples.fileCreationDate);

// Test actions for FileHeader
test(macroNode, btr3NodeExamples.FileHeader);

// Test actions for FileTrailer start nodes
test(macroNode, btr3NodeExamples.fileControlTotal);
test(macroNode, btr3NodeExamples.fileControlTotalPositive);
test(macroNode, btr3NodeExamples.fileControlTotalNegative);
test(macroNode, btr3NodeExamples.numberofBanks);
test(macroNode, btr3NodeExamples.numberofBanksPositive);
test(macroNode, btr3NodeExamples.numberofRecords);
test(macroNode, btr3NodeExamples.numberofRecordsPositive);

// Test actions for FileTrailer
test(macroNode, btr3NodeExamples.FileTrailer);
test(macroNode, btr3NodeExamples.FileTrailerPositive);
test(macroNode, btr3NodeExamples.FileTrailerNegative);

/*
 run a test for each example in the JSON file. 
 */
for (var nodeExample in btr3NodeExamples) {
    // console.log('-----');
    // console.log(nodeExample);
    var entry = btr3NodeExamples[nodeExample];
    // console.log(entry);
    // console.log(entry.example);
    test(macroNode, entry);
}