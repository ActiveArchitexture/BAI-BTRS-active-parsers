/**
 * Test the translation of simples nodes of the BTR3 to JSON.
 */
var btr3ToJSON = require('../src/btr3ToJSON');

// import test from 'ava';
var test = require('ava');

/*
    $ npm test -- --watch
*/

function macroSimpleNodeValue(t, startnode, input, expectedOutput, testTitle) {
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


// grammar nodes that return strings
test(macroSimpleNodeValue, 'senderIdentification', '122099999', '"122099999"', 'senderID');
test(macroSimpleNodeValue, 'fileCreationDate', '201230', '"2020-12-30"', 'fileCreationDate');
test(macroSimpleNodeValue, 'fileCreationTime', '0200', '"0200"', 'fileCreationTime');

// grammar nodes that return numbers
test(macroSimpleNodeValue, 'numberofRecords', '136', '136', 'numberofRecords');
test(macroSimpleNodeValue, 'numberofRecords', '+136', '136', 'numberofRecords Positive');
