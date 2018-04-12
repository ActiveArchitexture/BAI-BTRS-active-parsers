var assert = require('assert');
var join = require('path').join;
var fs = require('fs');
var ohm = require('ohm-js');

var btr3ToJSON = require('../src/btr3ToJSON');
var btr3NodeExamples = require('./_btr3-node-examples.js');

import test from 'ava';

/*
    $ npm test -- --watch
*/

/*
    Test Helper functions
*/

function stripWhiteSpace(inString) {
    return inString.replace(/\s/g, '');
}

function parseFromNode(inputVal, startNodeVal) {
    return btr3ToJSON(inputVal, startNodeVal);
}

function expectedString(startNodeVal, expectedString) {
    return `"${startNodeVal}": "${expectedString}"`;
}

function expectedNumber(startNodeVal, expectedString) {
    return `"${startNodeVal}": ${expectedString}`;
}



// Test actions for FileTrailer start nodes
test('action for fileCreationDate', t => {
    var input = '201230';
    var startNode = 'fileCreationDate';
    var expected = '2020-12-30';
    t.deepEqual(parseFromNode(input, startNode), expectedString(startNode, expected));
});
test('action for fileControlTotal', t => {
    var input = '1215450000';
    var startNode = 'fileControlTotal';
    var expected = input;
    t.deepEqual(parseFromNode(input, startNode), expectedNumber(startNode, expected));
});
test('action for negative fileControlTotal', t => {
    var input = '-1215450000';
    var startNode = 'fileControlTotal';
    var expected = input;
    t.deepEqual(parseFromNode(input, startNode), expectedNumber(startNode, expected));
});
test('action for positive fileControlTotal', t => {
    var input = '+1215450000';
    var startNode = 'fileControlTotal';
    var expected = '1215450000';
    t.deepEqual(parseFromNode(input, startNode), expectedNumber(startNode, expected));
});
test('action for numberofBanks', t => {
    var input = '4';
    var startNode = 'numberofBanks';
    var expected = input;
    t.deepEqual(parseFromNode(input, startNode), expectedNumber(startNode, expected));
});
test('action for positive numberofBanks', t => {
    var input = '+4';
    var startNode = 'numberofBanks';
    var expected = '4';
    t.deepEqual(parseFromNode(input, startNode), expectedNumber(startNode, expected));
});
test('action for numberofRecords', t => {
    var input = '136';
    var startNode = 'numberofRecords';
    var expected = input;
    t.deepEqual(parseFromNode(input, startNode), expectedNumber(startNode, expected));
});
test('action for positive numberofRecords', t => {
    var input = '+136';
    var startNode = 'numberofRecords';
    var expected = '136';
    t.deepEqual(parseFromNode(input, startNode), expectedNumber(startNode, expected));
});






function parseFromNodeWithoutWhiteSpace(inputVal, startNodeVal) {
    return stripWhiteSpace(btr3ToJSON(inputVal, startNodeVal));
}

function arrayOfLinesToString(lines, eol) {
    var strung = "";
    for (var line of lines) {
        strung += line + eol;
    }
    return strung;
}

const CR = '\r';
const CRLF = '\r\n';

function macroPartial(t, testset, eol) {
    console.log("-----");
    console.log(testset.description);
    console.log(testset.startnode);
    console.log(testset.example);
    console.log(testset.expected);

    var exp = testset.expected[testset.startnode];
    console.log(exp);
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


// Test actions for FileTrailer
var expectedFileTrailer1 = `
    "FileTrailer": {
        "fileControlTotal": 1215450000,
        "numberofBanks": 4,
        "numberofRecords": 136
    }`;
test('action for FileTrailer', t => {
    var input = '99,1215450000,4,136/';
    var startNode = 'FileTrailer';
    t.deepEqual(parseFromNodeWithoutWhiteSpace(input, startNode), stripWhiteSpace(expectedFileTrailer1));
});
test('action for FileTrailer with +', t => {
    var input = '99,+1215450000,+4,+136/';
    var startNode = 'FileTrailer';
    t.deepEqual(parseFromNodeWithoutWhiteSpace(input, startNode), stripWhiteSpace(expectedFileTrailer1));
});
var expectedFileTrailer2 = `
    "FileTrailer": {
        "fileControlTotal": -1215450000,
        "numberofBanks": 4,
        "numberofRecords": 136
    }`;
test('action for FileTrailer with +', t => {
    var input = '99,-1215450000,+4,+136/';
    var startNode = 'FileTrailer';
    t.deepEqual(parseFromNodeWithoutWhiteSpace(input, startNode), stripWhiteSpace(expectedFileTrailer2));
});




test(macroPartial, btr3NodeExamples.FileHeader, CRLF);
test(macroPartial, btr3NodeExamples.FileTrailer, CRLF);