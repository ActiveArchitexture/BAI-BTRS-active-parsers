/*
    read the examples in and export them in a convenient format for use in tests. 
*/

var join = require('path').join;
var fs = require('fs');

var btr3Contents = fs.readFileSync(join(__dirname, '_btr3-file-examples.json'));

var btr3FileExamples = JSON.parse(btr3Contents);

// console.log("-----");
// console.log(btr3Examples.emptyfile.description);
// console.log(btr3Examples.emptyfile.startnode);
// console.log(btr3Examples.emptyfile.examplelines);
// console.log(btr3Examples.emptyfile.expected);

module.exports = btr3FileExamples;