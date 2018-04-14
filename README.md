# BAI-BTRS-active-parsers

## Running Tests

[Javascript Testing with AVA | Aten Design Group](https://atendesigngroup.com/blog/javascript-testing-ava)

The following scripts are in package.json:

    "scripts": {
        "test": "ava test/**/*.js --verbose",
        "test:watch": "ava test/**/*.js --verbose --watch",
        "test:file-examples": "ava test/test-btr3ToJSON-file-examples.js --verbose",
        "ava": "ava --verbose",
        "empty2": "node src/btr3ToJSON.js test/files/BAI2 BTRS Validator samples/valid/BTRS_valid.txt",
        "empty1": "node src/btr3ToJSON.js test/files/emptyfile.txt"
    }

The --verbose flag can be removed
, and --watch is handy if you want AVA to continually check your work. Sometimes it’s useful to just have the ava command so you can test a single file.

These commands can be run as:

    npm test

Watch commands

    npm test -- --watch

or

    npm run test:watch

Control-c to cancel

To run the AVA test for file-examples:

    npm run test:file-examples

Which is equivalent to (without the verbosity flag):

    npm run ava test/test-btr3ToJSON-file-examples.js
