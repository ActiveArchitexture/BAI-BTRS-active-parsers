/*
    https://github.com/harc/ohm/blob/master/doc/index.md
    https://github.com/harc/ohm/blob/master/examples/csv/index.js

    https://x9.org/wp-content/uploads/2017/05/X9.121-2016-BTRS-Version-3.0.pdf
    

*/
var join = require('path').join;
var fs = require('fs');
var ohm = require('ohm-js');

var btr3Contents = fs.readFileSync(join(__dirname, 'BTR3.ohm'));
var btr3Grammar = module.exports = ohm.grammar(btr3Contents);