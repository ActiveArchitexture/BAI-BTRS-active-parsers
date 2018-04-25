/*
    https://github.com/harc/ohm/blob/master/doc/index.md
    https://github.com/harc/ohm/blob/master/examples/csv/index.js

    https://x9.org/wp-content/uploads/2017/05/X9.121-2016-BTRS-Version-3.0.pdf
    

*/
var fs = require('fs');
var btr3Grammar = require('../src/btr3Grammar');


var semantics = btr3Grammar.createSemantics().addOperation('json', {

    // BTRSfile = FileHeader Bank* FileTrailer
    BTRSfile: function (fh, bank, ft) {
        // Only the top level rule returns {a complete JSON object}
        return `{"${this.ctorName}": {${fh.json()} ${bank.json()}, ${ft.json()}}}`;
    },

    // FileHeader = "01" delim senderIdentification delim receiverIdentification delim fileCreationDate delim fileCreationTime delim fileIdentificationNumber delim physicalRecordLength delim blockSize delim versionNumber eor
    FileHeader: function (_, _, sid, _, rid, _, fcd, _, fct, _, fidn, _, prl, _, bs, _, vn, _) {
        return `"${this.ctorName}": {${sid.json()}, ${rid.json()}, ${fcd.json()}, ${fct.json()}, ${fidn.json()}, ${prl.json()}, ${bs.json()}, ${vn.json()}}`;
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

    // Bank = BankHeader Account* BankTrailer
    Bank: function (bh, account, bt) {
        return `,"${this.ctorName}": {${bh.json()}, "Accounts": [${account.json()}], ${bt.json()}}`;
    },

    // BankHeader = "02" delim ultimateReceiverID delim bankID delim groupStatus delim asofDate delim asofTime delim currencyCode delim asofDateModifier eor
    BankHeader: function (_, _, urid, _, bid, _, gs, _, asod, _, asot, _, cc, _, asodm, _) {
        return `"${this.ctorName}": {${urid.json()}, ${bid.json()}, ${gs.json()}, ${asod.json()}, ${asot.json()}, ${cc.json()}, ${asodm.json()}}`;
    },

    // BankTrailer = "98" delim groupControlTotal delim numberofAccounts delim numberofRecords eor
    /*
        BankTrailer (Number of Accounts is in BTR3 but not in BAI2)
                = "98" delim groupControlTotal delim (numberofAccounts delim)? numberofRecords eor
    */
    BankTrailer: function (_, _, gct, _, noa, _, nor, _) {
        if (noa.sourceString == "") {
            return `"${this.ctorName}": {${gct.json()}, ${nor.json()}}`;    
        } else {
            return `"${this.ctorName}": {${gct.json()}, ${noa.json()}, ${nor.json()}}`;
        }
    },

    groupControlTotal: function (d) {
        let keyvalue = `"${this.ctorName}": ${d.json()}`;
        return keyvalue;
    },

    numberofAccounts: function (d) {
        let keyvalue = `"${this.ctorName}": ${d.json()}`;
        return keyvalue;
    },

    // Account = AccountHeader TransactionDetail* AccountTrailer
    Account: function (ah, td, at) {
        return `{"${this.ctorName}": {${ah.json()}, "Transaction Details": [${td.json()}], ${at.json()}}}`;
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
        return `"Amount": "${amountSigned(s.sourceString, n.sourceString)}"`;
    },

    // amountOpt = optSign digit*
    amountOpt: function (s, n) {
        // "+"? digit+
        return `"Amount": "${amountSigned(s.sourceString, n.sourceString)}"`;
    },

    // AccountTrailer = "49" delim accountControlTotal delim numberofRecords eor
    AccountTrailer: function (_, _, act, _, nor, _) {
        return `"${this.ctorName}": {${act.json()}, ${nor.json()}}`;
    },

    // TransactionDetail = "16" delim detailTypeCode delim detailAmount delim detailFundsType delim bankReferenceNumber delim customerReferenceNumber delim detailText eor
    TransactionDetail: function (_, _, dtc, _, da, _, dft, _, brn, _, crn, _, dt, _) {
        return `{"${this.ctorName}": {${dtc.json()}, ${da.json()}, ${dft.json()}, ${brn.json()}, ${crn.json()}, ${dt.json()}}}`;
    },

    // detailFundsType = detailFundsTypeZ012 | detailFundsTypeS | detailFundsTypeV
    detailFundsType: function (dft) {
        return `"${this.ctorName}": ${dft.json()}`;
    },

    detailFundsTypeZ012: function (ft) {
        return `"${ft.sourceString}"`;
    },

    // detailFundsTypeS = "S" delim availableImmediate delim available1Day delim available2PlusDays
    detailFundsTypeS: function (ft, _, ai, _, a1d, _, a2d) {
        return `"${ft.sourceString}", ${ai.json()}, ${a1d.json()}, ${a2d.json()}`;
    },

    // detailFundsTypeV = "V" delim valueDate delim valueTime
    detailFundsTypeV: function (ft, _, vd, _, vt) {
        return `"${ft.sourceString}", ${vd.json()}, ${vt.json()}`;
    },

    // valueDate = date
    valueDate: function (vd) {
        return `"${this.ctorName}": "${vd.json()}"`;
    },

    // detailAvailableAmount = optSign digit*
    detailAvailableAmount: function (s, n) {
        return `"${amountSigned(s.sourceString, n.sourceString)}"`;
    },

    // // detailText = ~(delim | eor) any
    // detailText: function (_, dt) {
    //     return `"${this.ctorName}": "${dt.json()}"`;
    // },

    // amountOpt = optSign digit*
    amountOpt: function (s, n) {
        // "+"? digit+
        return `"Amount": "${amountSigned(s.sourceString, n.sourceString)}"`;
    },

    // 
    date: function (yy, mo, dd) {
        // Default Century to 20. So much for learning from Y2K.
        let dateString = `20${yy.sourceString}-${mo.sourceString}-${dd.sourceString}`;
        return dateString;
    },

    // optSignedN = ("-" | "+")? digit+
    optSignedN: function (s, n) {
        return `${amountSigned(s.sourceString, n.sourceString)}`;
    },

    // optPosN = "+"? digit+
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

function amountSigned(sString, nString) {
    // best practice is to omit the optional + sign
    // TODO format amounts with number of decimal places for currency
    let value = '';
    if (sString == '-') {
        value = `-${nString}`;
    } else {
        value = nString;
    }
    return value;
}

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