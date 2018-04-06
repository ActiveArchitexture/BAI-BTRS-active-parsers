const assert = require('assert');
// var assert = require('unit.js').assert;


// Test date
//assert.equal(semanticsPartial.date(20, 12, 30), new Date('2020-12-30'))

var dateString = '2020-12-30';
var newDate = new Date(dateString);

var dict = {fileCreationDate: newDate};
console.log(dict);

var json = JSON.stringify(dict);
console.log(json);

assert.equal(dict, dict);
assert.deepStrictEqual(dict, {fileCreationDate: newDate});

//assert.equal(newDate, '"fileCreationDate": "2020/12/30"');
