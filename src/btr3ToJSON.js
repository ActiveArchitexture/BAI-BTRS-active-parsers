/*
    https://github.com/harc/ohm/blob/master/doc/index.md
    https://github.com/harc/ohm/blob/master/examples/csv/index.js

    https://x9.org/wp-content/uploads/2017/05/X9.121-2016-BTRS-Version-3.0.pdf
    

*/
var assert = require('assert');
var join = require('path').join;
var fs = require('fs');
var ohm = require('ohm-js');

var btr3Contents = fs.readFileSync(join(__dirname, 'BTR3.ohm'));

var btr3Grammar = ohm.grammar(btr3Contents);


// Exports
// -------

var btr3ToJSON = module.exports = function (source, startNode) {
    var matchResult = btr3Grammar.match(source, startNode);
    if (matchResult.failed()) {
        return matchResult;
    }
    return semantics(matchResult).json();
};


// Test grammar for fileCreationDate
assert(btr3Grammar.match('201230', 'fileCreationDate').succeeded());
assert(btr3Grammar.match('201240', 'fileCreationDate').failed(), 'dd 40 greater than 31');

// Test grammar for fileCreationTime
assert(btr3Grammar.match('2359', 'fileCreationTime').succeeded());
assert(btr3Grammar.match('2400', 'fileCreationTime').failed(), 'hh 24 not in range 00..23');
assert(btr3Grammar.match('2360', 'fileCreationTime').failed(), 'mm 60 not in range 00..59');

// Test grammar for FileHeader
assert(btr3Grammar.match('01,122099999,123456789,150623,0200,1,,,3/', 'FileHeader').succeeded(), 'ANSI X9.121–2016 (BTR3) Sample 01 Record Example Using Only Mandatory Fields');
assert(btr3Grammar.match('01, 122099999, 123456789, 150623, 0200, 1,,,3/', 'FileHeader').succeeded(), 'ANSI X9.121–2016 (BTR3) Sample 01 Record Example WITH space after commas');

// Log traces to console - similar to interactive editor outputs
// console.log(g.trace("2359", "fileCreationTime").toString());

// Test grammar for fileControlTotal
assert(btr3Grammar.match('1215450000', 'fileControlTotal').succeeded(), 'unsigned total');
assert(btr3Grammar.match('-1215450000', 'fileControlTotal').succeeded(), 'negative total');
assert(btr3Grammar.match('+1215450000', 'fileControlTotal').succeeded(), 'positive total');

// Test grammar for numberofBanks
assert(btr3Grammar.match('121', 'numberofBanks').succeeded(), 'unsigned numberofBanks');
assert(btr3Grammar.match('+121', 'numberofBanks').succeeded(), 'positive numberofBanks');
assert(btr3Grammar.match('-121', 'numberofBanks').failed(), 'negative numberofBanks');

// Test grammar for FileTrailer
assert(btr3Grammar.match('99,1215450000,4,136/', 'FileTrailer').succeeded(), 'ANSI X9.121–2016 (BTR3) Sample 99 Record');
assert(btr3Grammar.match('99,0,0,2/', 'FileTrailer').succeeded(), 'ANSI X9.121–2016 (BTR3) from 5.1.1 Empty File 99 Record');

// Test grammar for 5.1.1 Empty File - with CRLF
var emptyfile = '01,123456789,NAMENAME,150716,2100,11,,,3/' + '\r\n' + '99,0,0,2/'
assert(btr3Grammar.match(emptyfile, 'BTRSfile').succeeded(), 'ANSI X9.121–2016 (BTR3) 5.1.1 Empty File');

// Test grammar for 5.1.1 Empty File - with CR 
var emptyfile = '01,123456789,NAMENAME,150716,2100,11,,,3/' + '\r' + '99,0,0,2/'
assert(btr3Grammar.match(emptyfile, 'BTRSfile').succeeded(), 'ANSI X9.121–2016 (BTR3) 5.1.1 Empty File');


var semantics = btr3Grammar.createSemantics().addOperation('json', {

    BTRSfile: function (fh, ft) {
        // Only the top level rule returns {a complete JSON object}
        return `{"${this.ctorName}": {${fh.json()}, ${ft.json()}}}`;
    },

    FileHeader: function (_, _, sid, _, rid, _, fcd, _, fct, _, fid, _, _, _, _, _, vn, _) {
        return `"${this.ctorName}": {${sid.json()}, ${rid.json()}, ${fcd.json()}, ${fct.json()}, ${fid.json()}, ${vn.json()}}`;
    },

    FileTrailer: function (_, _, fct, _, nob, _, nor, _) {
        return `"${this.ctorName}": {${fct.json()}, ${nob.json()}, ${nor.json()}}`;
    },

    fileCreationDate: function (d) {
        let keyvalue = `"${this.ctorName}": "${d.json()}"`;
        return keyvalue;
    },

    fileControlTotal: function (d) {
        let keyvalue = `"${this.ctorName}": ${d.json()}`;
        return keyvalue;
    },

    numberofBanks: function (d) {
        let keyvalue = `"${this.ctorName}": ${d.json()}`;
        return keyvalue;
    },

    numberofRecords: function (d) {
        let keyvalue = `"${this.ctorName}": ${d.json()}`;
        return keyvalue;
    },

    date: function (yy, mo, dd) {
        // Default Century to 20. So much for learning from Y2K.
        let dateString = `20${yy.sourceString}-${mo.sourceString}-${dd.sourceString}`;
        return dateString;
    },

    optSignedN: function (s, n) {
        // ("-" | "+")? digit+
        // best practice is to omit the optional + sign
        // a - sign is NOT optional
        if (s.sourceString == '-') {
            return `-${n.sourceString}`;
        } else {
            return n.sourceString;
        }
    },

    optPosN: function (s, n) {
        // "+"? digit+
        // best practice is to omit the optional + sign
        return n.sourceString;
    },

    _nonterminal: function (n) {
        //console.log(this.ctorName);
        //console.log(n);
        // returns a string
        return `"${this.ctorName}": "${this.sourceString}"`;
    },

});


/*
    Test Helper functions
*/

function stripWhiteSpace(inString) {
    return inString.replace(/\s/g, '');
}

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

expectedEmptyFile = `
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

// Main
// ----
// if (require.main === module) {
//     var filename = process.argv[2];
//     var source = fs.readFileSync(filename).toString();
//     var result = btr3ToJSON(source, 'BTRSfile');
//     /* eslint-disable no-console, no-process-exit */
//     if (typeof result === 'string') {
//         console.log(result);
//     } else {
//         console.error('Not a BTR3 file: ' + filename);
//         console.error(result.message);
//         process.exit(1);
//     }
// }