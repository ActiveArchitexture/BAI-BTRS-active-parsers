var assert = require('assert');
var join = require('path').join;
var fs = require('fs');
var ohm = require('ohm-js');

var btr3ToJSON = require('../src/btr3ToJSON');
var btr3Examples = require('./_btr3-file-examples.js');

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









function parseFromNodeWithoutWhiteSpace(inputVal, startNodeVal) {
    return stripWhiteSpace(btr3ToJSON(inputVal, startNodeVal));
}

function arrayOfLinesToString(lines, eol){
    var strung = "";
    for (var line of lines) {
        strung += line + eol;
    }
    return strung;
}

const CR = '\r';
const CRLF = '\r\n';



function macroFull(t, testset, eol) {
    // console.log("-----");
    // console.log(testset.description);
    // console.log(testset.startnode);
    // console.log(testset.example);
    // console.log(testset.expected);
    this.title = testset.description;
    
    var input = arrayOfLinesToString(testset.example, eol);
    // console.log(input);

    var actual = btr3ToJSON(input, testset.startnode);
    var expected = JSON.stringify(testset.expected);

    t.deepEqual(stripWhiteSpace(actual), stripWhiteSpace(expected));
}
// macroFull.title = (providedTitle) => `${providedTitle}`;

// strip the rubbish - use the macro Luke



test(macroFull, btr3Examples.emptyfile, CRLF);

// console.log(btr3Examples.btr3emptyfile.expected);
test(macroFull, btr3Examples.btr3emptyfile, CRLF);





