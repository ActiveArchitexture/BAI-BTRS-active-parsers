var btr3NodeExamples = require('./_btr3-node-examples.js');

function runAllTests() {
    console.log('----------');
    // console.log(btr3NodeExamples);
    for (var nodeExample in btr3NodeExamples) {
        console.log('-----');
        console.log(nodeExample);
        var entry = btr3NodeExamples[nodeExample];
        console.log(entry);
        console.log(entry.example);
    }
}

if (require.main === module) {
    runAllTests();
}