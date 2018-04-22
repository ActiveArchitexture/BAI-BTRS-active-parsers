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
var btr3NodeExamples = require('./_btr3-node-examples.js');

import test from 'ava';

/*
    inline tests for success and failure
    Many of these are redundant - replaced by tests from examples store in JSON file.
*/
test('grammar for valid fileCreationDate', t => {
    t.true(btr3Grammar.match('201230', 'fileCreationDate').succeeded());
});
test('grammar for invalid fileCreationDate - dd 40 greater than 31', t => {
    t.true(btr3Grammar.match('201240', 'fileCreationDate').failed());
});

test('grammar for valid fileCreationTime', t => {
    t.true(btr3Grammar.match('2359', 'fileCreationTime').succeeded());
});
test('grammar for invalid fileCreationTime - hh 24 not in range 00..23', t => {
    t.true(btr3Grammar.match('2400', 'fileCreationTime').failed());
});
test('grammar for invalid fileCreationTime - mm 60 not in range 00..59', t => {
    t.true(btr3Grammar.match('2360', 'fileCreationTime').failed());
});

test('grammar for valid FileHeader - ANSI X9.121–2016 (BTR3) Sample 01 Record Example Using Only Mandatory Fields', t => {
    t.true(btr3Grammar.match('01,122099999,123456789,150623,0200,1,,,3/', 'FileHeader').succeeded());
});
test('grammar for valid FileHeader - ANSI X9.121–2016 (BTR3) Sample 01 Record Example Using Only Mandatory Fields WITH space after commas', t => {
    t.true(btr3Grammar.match('01, 122099999, 123456789, 150623, 0200, 1,,,3/', 'FileHeader').succeeded());
});

// Log traces to console - similar to interactive editor outputs
// console.log(g.trace("2359", "fileCreationTime").toString());

// Test grammar for fileControlTotal
test('grammar for valid fileControlTotal with unsigned total', t => {
    t.true(btr3Grammar.match('1215450000', 'fileControlTotal').succeeded());
});
test('grammar for valid fileControlTotal with negative total', t => {
    t.true(btr3Grammar.match('-1215450000', 'fileControlTotal').succeeded());
});
test('grammar for valid fileControlTotal with positive total', t => {
    t.true(btr3Grammar.match('+1215450000', 'fileControlTotal').succeeded());
});

// Test grammar for numberofBanks
test('grammar for valid fileControlTotal with unsigned numberofBanks', t => {
    t.true(btr3Grammar.match('121', 'numberofBanks').succeeded());
});
test('grammar for valid fileControlTotal with positive numberofBanks', t => {
    t.true(btr3Grammar.match('+121', 'numberofBanks').succeeded());
});
test('grammar for invalid fileControlTotal with negative numberofBanks', t => {
    t.true(btr3Grammar.match('-121', 'numberofBanks').failed());
});

// Test grammar for FileTrailer
test('grammar for valid FileTrailer succeeds for ANSI X9.121–2016 (BTR3) Sample 99 Record', t => {
    t.true(btr3Grammar.match('99,1215450000,4,136/', 'FileTrailer').succeeded());
});
test('grammar for valid FileTrailer succeeds for ANSI X9.121–2016 (BTR3) from 5.1.1 Empty File 99 Record', t => {
    t.true(btr3Grammar.match('99,0,0,2/', 'FileTrailer').succeeded());
});

// Test grammar for BankHeader
test('grammar for valid BankHeader - ANSI X9.121–2016 (BTR3) Sample 02 Record - Example Using Only Mandatory Fields', t => {
    t.true(btr3Grammar.match('02,,122099999,1,150622,,,2/', 'BankHeader').succeeded());
});

// Test grammar for 5.1.1 Empty Files
var emptyCRLFfile = '01,123456789,NAMENAME,150716,2100,11,,,3/' + '\r\n' + '99,0,0,2/';
test('grammar for valid BTRSfile succeeds for ANSI X9.121–2016 (BTR3) 5.1.1 Empty File with CRLF', t => {
    t.true(btr3Grammar.match(emptyCRLFfile, 'BTRSfile').succeeded());
});
var emptyCRfile = '01,123456789,NAMENAME,150716,2100,11,,,3/' + '\r' + '99,0,0,2/';
test('grammar for valid BTRSfile succeeds for ANSI X9.121–2016 (BTR3) 5.1.1 Empty File', t => {
    t.true(btr3Grammar.match(emptyCRfile, 'BTRSfile').succeeded());
});

test.todo("3.3 ACCOUNT HEADER – Record 03 customerAccountNumber Must not contain comma , or slash / delimiters.");
test.todo("3.3.1 Sample 03 Record Example Splitting a Summary Code (400) Across 2 Lines");
test.todo("Extract statusTypeCode and summaryTypeCode and descriptions to separate grammars");
test.todo("Decide if Amounts and Control Totals will be treated as strings (to avoid floating point errors) or numbers");
test.todo("3.4 TRANSACTION DETAIL – Record 16 - Record Code - Placement 1: Follows a ’03, ‘16’, or ‘88’ Record");
test.todo("3.4 TRANSACTION DETAIL – Record 16 - Record Code - Placement 2: If a “message only” file, the Record 16 with a code 890 (information text) can follow the Record 01.");
test.todo("3.4 TRANSACTION DETAIL – Record 16 - Detail Type Code");
test.todo("3.4 TRANSACTION DETAIL – Record 16 - Amount - Note: Only optional for Detail Type 890 , see “Type Code for Non-monetary Information");
test.todo('3.4 TRANSACTION DETAIL – Record 16 - Bank Reference Number - Rule: Must not contain a comma “,” or a slash “/”');
test.todo('3.4 TRANSACTION DETAIL – Record 16 - Customer Reference Number - Rule: Must not contain a comma “,” or a slash “/”');
test.todo('3.4 TRANSACTION DETAIL – Record 16 - Text - Rule: Must not begin with a comma “,” or a slash “/”, but may contain a comma “,” or a slash “/” after the first character.');
test.todo('3.4 TRANSACTION DETAIL – Record 16 - Text - Best Practice: Text begins on separate Record 88 rather than the Record 16');
test.todo("?");



function btr3Parse(source, startNode) {
    return btr3Grammar.match(source, startNode);
}

function macroNode(t, nodeExample, testset) {
    // console.log("-----");
    // console.log(testset.description);
    // console.log(testset.startnode);
    // console.log(testset.example);

    this.title = `from node-example "${nodeExample}": ${testset.description}`;

    var matchResult = btr3Parse(testset.example, testset.startnode);
    if (matchResult.succeeded()) {
        t.pass();
    }
    else {
        t.fail(matchResult.message);
    }
}


/*
 run tests for specific examples from the JSON file. 
 */
// // Test actions for FileHeader start nodes
// test(macroNode, btr3NodeExamples.fileCreationDate);

// // Test actions for FileHeader
// test(macroNode, btr3NodeExamples.FileHeader);

// // Test actions for FileTrailer start nodes
// test(macroNode, btr3NodeExamples.fileControlTotal);
// test(macroNode, btr3NodeExamples.fileControlTotalPositive);
// test(macroNode, btr3NodeExamples.fileControlTotalNegative);
// test(macroNode, btr3NodeExamples.numberofBanks);
// test(macroNode, btr3NodeExamples.numberofBanksPositive);
// test(macroNode, btr3NodeExamples.numberofRecords);
// test(macroNode, btr3NodeExamples.numberofRecordsPositive);

// // Test actions for FileTrailer
// test(macroNode, btr3NodeExamples.FileTrailer);
// test(macroNode, btr3NodeExamples.FileTrailerPositive);
// test(macroNode, btr3NodeExamples.FileTrailerNegative);

/*
 run tests for every example in the JSON file. 
 */
for (var nodeExample in btr3NodeExamples) {
    // console.log('-----');
    // console.log(nodeExample);
    var entry = btr3NodeExamples[nodeExample];
    // console.log(entry);
    // console.log(entry.example);
    test(macroNode, nodeExample, entry);
}