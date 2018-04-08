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

// Exports
// -------
var btr3ToJSON = module.exports = function (source, startNode) {
    var matchResult = btr3Grammar.match(source, startNode);
    if (matchResult.failed()) {
        return matchResult;
    }
    return semantics(matchResult).json();
};

// Main
// ----
if (require.main === module) {
    var filename = process.argv[2];
    var source = fs.readFileSync(filename).toString();
    var result = btr3ToJSON(source, 'BTRSfile');
    /* eslint-disable no-console, no-process-exit */
    if (typeof result === 'string') {
        console.log(result);
    } else {
        console.error('Not a BTR3 file: ' + filename);
        console.error(result.message);
        process.exit(1);
    }
}