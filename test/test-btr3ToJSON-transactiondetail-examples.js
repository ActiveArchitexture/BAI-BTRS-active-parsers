/**
 * Test the translation from example nodes of the BTR3 grammar to JSON.
 * The example nodes are stored in a JSON file.
 * The examples can be any subnode of BTR3 but NOT an example of a complete BTR3 file. 
 * 
 * Two formats of AVA tests are supported:
 * 1.   tests for specific examples from the JSON file
 * 2.   tests for every example in the JSON file
 */
var btr3ToJSON = require('../src/btr3ToJSON');
var btr3DetailExamples = require('./_btr3-transactiondetail-examples.json');

// import test from 'ava';
var test = require('ava');

function stripWhiteSpace(inString) {
    return inString.replace(/\s/g, '');
}

function macroDetail(t, testset) {
    // console.log("-----");
    // console.log(testset.description);
    // console.log(testset.startnode);
    // console.log(testset.example);
    // console.log(testset.expected);

    var exp = testset.expected[testset.startnode];
    
    /*
     * NOTE the extra {} around these examples. 
     * TODO eliminate the need to split Transaction Detail examples from other node examples. 
     */
    var expected = `{"${testset.startnode}": ${JSON.stringify(exp)}}`;
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
 run tests for every example in the JSON file. 
 */
for (var nodeExample in btr3DetailExamples) {
    // console.log('-----');
    // console.log(nodeExample);
    var entry = btr3DetailExamples[nodeExample];
    // console.log(entry);
    // console.log(entry.example);
    test(macroDetail, entry);
}