/*
    read the examples in and export them in a convenient format for use in tests. 
*/

var join = require('path').join;
var fs = require('fs');

var btr3Contents = fs.readFileSync(join(__dirname, '_btr3-node-examples.json'));

var btr3NodeExamples = JSON.parse(btr3Contents);

module.exports = btr3NodeExamples;