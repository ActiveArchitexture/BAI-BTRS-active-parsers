/*
    https://github.com/harc/ohm/blob/master/doc/index.md
    https://github.com/harc/ohm/blob/master/examples/csv/index.js

    https://x9.org/wp-content/uploads/2017/05/X9.121-2016-BTRS-Version-3.0.pdf
    

*/
var assert = require('assert');
var join = require('path').join;
var fs = require('fs');
var ohm = require('ohm-js');

var contents = fs.readFileSync(join(__dirname, 'BTR3.ohm'));

var g = ohm.grammar(contents);


// Test grammar for fileCreationDate
assert(g.match('201230', 'fileCreationDate').succeeded());
assert(g.match('201240', 'fileCreationDate').failed(), 'dd 40 greater than 31');

// Test grammar for fileCreationTime
assert(g.match('2359', 'fileCreationTime').succeeded());
assert(g.match('2400', 'fileCreationTime').failed(), 'hh 24 not in range 00..23');
assert(g.match('2360', 'fileCreationTime').failed(), 'mm 60 not in range 00..59');

// Test grammar for FileHeader
assert(g.match('01,122099999,123456789,150623,0200,1,,,3/', 'FileHeader').succeeded(), 'ANSI X9.121–2016 (BTR3) Sample 01 Record Example Using Only Mandatory Fields');
assert(g.match('01, 122099999, 123456789, 150623, 0200, 1,,,3/', 'FileHeader').succeeded(), 'ANSI X9.121–2016 (BTR3) Sample 01 Record Example WITH space after commas');

// Log traces to console - similar to interactive editor outputs
// console.log(g.trace("2359", "fileCreationTime").toString());

// Test grammar for fileControlTotal
assert(g.match('1215450000', 'fileControlTotal').succeeded(), 'unsigned total');
assert(g.match('-1215450000', 'fileControlTotal').succeeded(), 'negative total');
assert(g.match('+1215450000', 'fileControlTotal').succeeded(), 'positive total');

// Test grammar for numberofBanks
assert(g.match('121', 'numberofBanks').succeeded(), 'unsigned numberofBanks');
assert(g.match('+121', 'numberofBanks').succeeded(), 'positive numberofBanks');
assert(g.match('-121', 'numberofBanks').failed(), 'negative numberofBanks');

// Test grammar for FileTrailer
assert(g.match('99,1215450000,4,136/', 'FileTrailer').succeeded(), 'ANSI X9.121–2016 (BTR3) Sample 99 Record');
assert(g.match('99,0,0,2/', 'FileTrailer').succeeded(), 'ANSI X9.121–2016 (BTR3) from 5.1.1 Empty File 99 Record');

// Test grammar for 5.1.1 Empty File - with CRLF
var emptyfile = '01,123456789,NAMENAME,150716,2100,11,,,3/' + '\r\n' + '99,0,0,2/'
assert(g.match(emptyfile, 'BTRSfile').succeeded(), 'ANSI X9.121–2016 (BTR3) 5.1.1 Empty File');

// Test grammar for 5.1.1 Empty File - with CR 
var emptyfile = '01,123456789,NAMENAME,150716,2100,11,,,3/' + '\r' + '99,0,0,2/'
assert(g.match(emptyfile, 'BTRSfile').succeeded(), 'ANSI X9.121–2016 (BTR3) 5.1.1 Empty File');

/*
CSV {
  csv = row (eol ~end row)* eol?
  row = col ("," col)*
  col = colChar*
  colChar = ~(eol | ",") any
  eol = "\r"? "\n"
}

var semantics = g.createSemantics().addOperation('value', {
    csv: function(r, _, rs, eol) {
      return [r.value()].concat(rs.value());
    },
    row: function(c, _, cs) {
      return [c.value()].concat(cs.value());
    },
    col: function(_) {
      return this.sourceString;
    }
});
*/

/*
    BTRSfile = FileHeader FileTrailer
    
    FileHeader = "01" sep senderID sep receiverID sep fileCreationDate sep fileCreationTime sep fileID sep physicalRecordLength sep blockSize sep versionNumber eor
    FileTrailer = "99" sep fileControlTotal sep numberofBanks sep numberofRecords eor
    
*/

var semantics = g.createSemantics().addOperation('astext', {
    BTRSfile: function(fh, ft) {
        return fh.astext() + '\n' + ft.astext();
    },

    FileHeader: function(_, _, sid, _, rid, _, fcd, _, fct, _, fid, _, _, _, _, _, vn, _) {
        return this.ctorName + ':' + sid.astext() + rid.astext() + fcd.astext() + fct.astext() + fid.astext() + vn.astext();
    },

    FileTrailer: function(_, _, fct, _, nob, _, nor, _) {
      return this.ctorName + ':' + fct.astext() + nob.astext() + nor.astext();
    },

    date: function(yy, mo, dd) {
        return this.ctorName + ':' + yy.sourceString + '/' + mo.sourceString + '/' + dd.sourceString + ', ';
    },

    _nonterminal: function(n) {
        return this.ctorName + ':' + this.sourceString + ', ';
    },

    /*
    _terminal: function() {
      return this.sourceString;
    }
    */

});

function parse(input) {
    var match = g.match(input);
    assert(match.succeeded());
    return semantics(match).astext();
}

console.log(parse(emptyfile));