/**
 * Test the translation from example nodes of the BTR3 to JSON.
 * Three formats of AVA tests are supported:
 * 1.   tests for specific examples NOT from the JSON file
 * 2.   tests for specific examples from the JSON file
 * 3.   tests for every example in the JSON file
 */
var btr3ToJSON = require('../src/btr3ToJSON');
var btr3NodeExamples = require('./_btr3-node-examples.js');

// import test from 'ava';
var test = require('ava');

/*
    $ npm test -- --watch
*/

function macroNodeX(t, startnode, input, expectedOutput, testTitle) {
     this.title = testTitle;
    var expected = `"${startnode}": ${expectedOutput}`;

    var actual = btr3ToJSON(input, startnode);
    // check that example parses
    if (typeof actual === 'string') {
        t.deepEqual(actual, expected);
    } else {
        t.fail(actual.message)
    }
}

/*
 run tests for specific examples NOT from the JSON file. 
 */
// grammar nodes that return strings
test(macroNodeX, 'senderID', '122099999', '"122099999"', 'senderID');
test(macroNodeX, 'fileCreationDate', '201230', '"2020-12-30"', 'fileCreationDate');
test(macroNodeX, 'fileCreationTime', '0200', '"0200"', 'fileCreationTime');

// grammar nodes that return numbers
test(macroNodeX, 'numberofRecords', '136', '136', 'numberofRecords');
test(macroNodeX, 'numberofRecords', '+136', '136', 'numberofRecords Positive');


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
    var expected = `"${testset.startnode}": ${JSON.stringify(exp)}`;
    this.title = testset.description;

    var actual = btr3ToJSON(testset.example, testset.startnode);
    // check that example parses
    if (typeof actual === 'string') {
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
 run tests for every example in the JSON file. 
 */
for (var nodeExample in btr3NodeExamples) {
    // console.log('-----');
    // console.log(nodeExample);
    var entry = btr3NodeExamples[nodeExample];
    // console.log(entry);
    // console.log(entry.example);
    test(macroNode, entry);
}