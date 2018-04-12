/*
    ANSI X9.121–2016 (BTR3)
    5 File and Record Construction with Delimiters
*/

/*
    5.1 Specialty File Types
*/

/*
    5.1.1 Empty File
    An ‘empty’ file is one that acts as an acknowledgment from the originator to recipient that there is no incremental activity. Some recipients that schedule several daily current day files, for example, require a BTRS file even when there is nothing new to report. To accomplish this, the minimum content is a BTRS file containing only a File Header record and a File Trailer record. These 2 records inform the recipient where the file originated and the absence of 03 and 16 records communicate that no account has any activity. Note that the intent to report no incremental activity can also be accomplished with a BTRS file that includes Records 03/49, either with current balances or not, but such may be harder to determine what incrementally changed, so the’ empty’ file may be a preferred format.
*/

var btr3ExampleEmptyFile = module.exports = {
    a: "aa",
    b: "bb"
}


// '01,123456789,NAMENAME,150716,2100,11,,,3/' + '\r\n' + '99,0,0,2/';

var btr3ExpectedEmptyFile1 = module.exports = `
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

