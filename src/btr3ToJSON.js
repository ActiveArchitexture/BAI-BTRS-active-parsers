/*
    https://github.com/harc/ohm/blob/master/doc/index.md
    https://github.com/harc/ohm/blob/master/examples/csv/index.js

    https://x9.org/wp-content/uploads/2017/05/X9.121-2016-BTRS-Version-3.0.pdf
    

*/
var btr3Grammar = require('../src/btr3Grammar');


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

    // BankHeader = "02" delim ultimateReceiverID delim bankID delim groupStatus delim asofDate delim asofTime delim currencyCode delim asofDateModifier eor
    BankHeader: function (_, _, urid, _, bid, _, gs, _, asod, _, asot, _, cc, _, asodm, _) {
        return `"${this.ctorName}": {${urid.json()}, ${bid.json()}, ${gs.json()}, ${asod.json()}, ${asot.json()}, ${cc.json()}, ${asodm.json()}}`;
    },

    // BankTrailer = "98" delim groupControlTotal delim numberofAccounts delim numberofRecords eor
    BankTrailer: function (_, _, gct, _, noa, _, nor, _) {
        return `"${this.ctorName}": {${gct.json()}, ${noa.json()}, ${nor.json()}}`;
    },

    groupControlTotal: function (d) {
        let keyvalue = `"${this.ctorName}": ${d.json()}`;
        return keyvalue;
    },

    numberofAccounts: function (d) {
        let keyvalue = `"${this.ctorName}": ${d.json()}`;
        return keyvalue;
    },

    // AccountHeader = "03" delim customerAccountNumber delim currencyCode delim statusOrSummaryCodeFormatOptRepeat eor
    AccountHeader: function (_, _, can, _, cc, _, sos, _) {
        return `"${this.ctorName}": {${can.json()}, ${cc.json()}, ${sos.json()}}`;
    },

    // statusOrSummaryCodeFormatOptRepeat = statusOrSummaryCodeFormat (delim statusOrSummaryCodeFormat)*
    statusOrSummaryCodeFormatOptRepeat: function (sos, _, soso) {
        // there is a comma between only if the soso can be iterated.
        // console.log(soso.isIteration());
        // console.log(soso.numChildren);
        if (soso.numChildren > 0) {
            return `"AccountStatusesSummaries": [${sos.json()}, ${soso.json()}]`;
        }
        else {
            return `"AccountStatusesSummaries": [${sos.json()}]`;
        }
    },

    // statusOrSummaryCodeFormat = statusCodeFormat | summaryCodeFormat
    statusOrSummaryCodeFormat: function (scf) {
        return `{${scf.json()}}`;
    },

    // statusCodeFormat = statusTypeCode delim amount delim itemCountNull delim fundsTypeNull
    statusCodeFormat: function (stc, _, amount, _, ic, _, ft) {
        return `"AccountStatus": {${stc.json()}, ${amount.json()}, ${ic.json()}, ${ft.json()}}`;
    },

    // summaryCodeFormat = summaryTypeCode delim amount? delim itemCount delim fundsType
    summaryCodeFormat: function (stc, _, amount, _, ic, _, ft) {
        return `"AccountSummary": {${stc.json()}, ${amount.json()}, ${ic.json()}, ${ft.json()}}`;
    },

    statusTypeCode: function (tc) {
        return `"TypeCode": "${tc.sourceString}"`;
    },

    summaryTypeCode: function (tc) {
        return `"TypeCode": "${tc.sourceString}"`;
    },

    itemCountNull: function (_) {
        return `"itemCount": ""`;
    },

    fundsTypeNull: function (_) {
        return `"fundsType": ""`;
    },

    // amount = optSign digit+
    amount: function (s, n) {
        // "+"? digit+
        // best practice is to omit the optional + sign
        let value = '';
        if (s.sourceString == '-') {
            value = `-${n.sourceString}`;
        } else {
            value = n.sourceString;
        }
        // TODO format amounts with number of decimal places for currency
        return `"Amount": "${value}"`;
    },

    // TODO refactor common code
    amountOpt: function (s, n) {
        // "+"? digit+
        // best practice is to omit the optional + sign
        let value = '';
        if (s.sourceString == '-') {
            value = `-${n.sourceString}`;
        } else {
            value = n.sourceString;
        }
        // TODO format amounts with number of decimal places for currency
        return `"Amount": "${value}"`;
    },



    // 
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
        // console.log('-----');
        // console.log(this.ctorName);
        // console.log(n);
        // returns a string
        return `"${this.ctorName}": "${this.sourceString}"`;
    },

    _terminal: function () {
        //console.log(this.ctorName);
        //console.log(n);
        // returns a string
        return `"${this.ctorName}": "${this.sourceString}"`;
    },

});


function btr3Parser(source, startNode) {
    return btr3Grammar.match(source, startNode);
}


var btr3ToJSON = module.exports = function (source, startNode) {
    var matchResult = btr3Parser(source, startNode);
    if (matchResult.failed()) {
        return matchResult;
    }
    return semantics(matchResult).json();
};


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