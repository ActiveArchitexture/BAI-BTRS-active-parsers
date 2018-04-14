# BAI-BTRS-active-parsers

Convert [BTRS - Balance Transaction and Reporting Standard](https://x9.org/standards/btrs/) files to other formats.

Input files in [X9.121 BTRS Version 3 Format](https://x9.org/wp-content/uploads/2017/05/X9.121-2016-BTRS-Version-3.0.pdf) are represented as an [Ohm grammar](TODO).

Each output format is implemented as a Semantics of the grammar.

The output formats supported are:

- [JSON](http://json.org/)
- PDF (TODO)

## Ohm

[Ohm](https://github.com/harc/ohm) is a parser generator consisting of a library and a domain-specific language. 
You can use it to parse custom file formats or quickly build parsers, interpreters, and compilers for programming languages.
The Ohm language is based on [parsing expression grammars](http://en.wikipedia.org/wiki/Parsing_expression_grammar) (PEGs),
which are a formal way of describing syntax, similar to regular expressions and context-free grammars.
The Ohm library provides a JavaScript interface (known as Ohm/JS) for creating parsers, interpreters, and more from the grammars you write.

## BTRS - Version of the standard implemented

[BTRS - Balance Transaction and Reporting Standard](https://x9.org/standards/btrs/)

[X9.121 BTRS Version 3 – Format Guide](https://x9.org/wp-content/uploads/2017/05/X9.121-2016-BTRS-Version-3.0.pdf)

[X9.121 BTRS Version 3.1 – Codes List](https://x9.org/wp-content/uploads/2013/10/X9-121-2017-BTRS-Version-3-1-Type-Codes.xlsx)

[Download ANSI X9.121-2012 Balance and Transaction Reporting Standard](https://x9.org/standards/btrs/download-btrs/)

### A brief history of the standard

TODO

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
