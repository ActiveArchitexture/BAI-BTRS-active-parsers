var assert = require('assert');
var join = require('path').join;
var fs = require('fs');
var ohm = require('ohm-js');

var btr3ToJSON = require('../src/btr3ToJSON');

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

// Test actions for FileTrailer start nodes
test('action for fileCreationDate', t => {
    var input = '201230';
    var startNode = 'fileCreationDate';
    var expected = '2020-12-30';
    t.deepEqual(parseFromNode(input, startNode), expectedString(startNode, expected));
});





function assertStartNodeExpectedString(inputVal, startNodeVal, expectedString) {
    var parsed = btr3ToJSON(inputVal, startNodeVal);
    console.log(parsed);
    assert.deepEqual(parsed, `"${startNodeVal}": "${expectedString}"`);
}

function assertStartNodeNumber(inputVal, startNodeVal) {
    var parsed = btr3ToJSON(inputVal, startNodeVal);
    console.log(parsed);
    assert.deepEqual(parsed, `"${startNodeVal}": ${inputVal}`);
}

function assertStartNodeExpectedNumber(inputVal, startNodeVal, expectedNumber) {
    var parsed = btr3ToJSON(inputVal, startNodeVal);
    console.log(parsed);
    assert.deepEqual(parsed, `"${startNodeVal}": ${expectedNumber}`);
}

function assertStartNodeExpected(inputVal, startNodeVal, expectedValue) {
    var parsed = btr3ToJSON(inputVal, startNodeVal);
    console.log(parsed);
    var expected = `${expectedValue}`;
    assert.deepEqual(stripWhiteSpace(parsed), stripWhiteSpace(expected));
}

/*
    Test actions
*/
// Test actions for FileTrailer start nodes
assertStartNodeExpectedString('201230', 'fileCreationDate', '2020-12-30');
assertStartNodeNumber('1215450000', 'fileControlTotal');
assertStartNodeNumber('-1215450000', 'fileControlTotal');
assertStartNodeExpectedNumber('+1215450000', 'fileControlTotal', '1215450000');
assertStartNodeNumber('4', 'numberofBanks');
assertStartNodeExpectedNumber('+4', 'numberofBanks', '4');
assertStartNodeNumber('136', 'numberofRecords');
assertStartNodeExpectedNumber('+136', 'numberofRecords', '136');

// Test actions for FileTrailer
var expectedFileTrailer = '{"FileTrailer": {"fileControlTotal": 1215450000, "numberofBanks": 4, "numberofRecords": 136}}';
var expectedFileTrailer = `
    "FileTrailer": {
        "fileControlTotal": 1215450000,
        "numberofBanks": 4,
        "numberofRecords": 136
    }
`;
assertStartNodeExpected('99,1215450000,4,136/', 'FileTrailer', expectedFileTrailer);
assertStartNodeExpected('99,+1215450000,+4,+136/', 'FileTrailer', expectedFileTrailer);
var expectedFileTrailer = `
    "FileTrailer": {
        "fileControlTotal": -1215450000,
        "numberofBanks": 4,
        "numberofRecords": 136
    }
`;
assertStartNodeExpected('99,-1215450000,+4,+136/', 'FileTrailer', expectedFileTrailer);

// Test actions for FileHeader
var expectedFileHeader = `
    "FileHeader": {
        "senderID": "122099999",
        "receiverID": "123456789",
        "fileCreationDate": "2015-06-23",
        "fileCreationTime": "0200",
        "fileID": "1",
        "versionNumber": "3"
    }
`;
assertStartNodeExpected('01,122099999,123456789,150623,0200,1,,,3/', 'FileHeader', expectedFileHeader);

var emptyfile = '01,123456789,NAMENAME,150716,2100,11,,,3/' + '\r\n' + '99,0,0,2/';

var expectedEmptyFile = `
{
    "BTRSfile": {
        "FileHeader": {
            "senderID": "123456789",
            "receiverID": "NAMENAME",
            "fileCreationDate": "2015-07-16",
            "fileCreationTime": "2100",
            "fileID": "11",
            "versionNumber": "3"
        },
        "FileTrailer": {
            "fileControlTotal": 0,
            "numberofBanks": 0,
            "numberofRecords": 2
        }
    }
}
`;
assertStartNodeExpected(emptyfile, 'BTRSfile', expectedEmptyFile);
