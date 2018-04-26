# BAI-BTRS-active-parsers

BAI-BTRS-active-parsers can be used to convert [BTRS - Balance Transaction and Reporting Standard](https://x9.org/standards/btrs/) files.

BAI-BTRS-active-parsers:

- Input files are parsed using an [Ohm grammar](TODO local ref) to represent [BTRS Version 3 files](TODO local github ref) slightly relaxed to also permit parsing of [BAI2 files](TODO local github ref).
- Each output format is generated using a [Semantics](TODO) of the Ohm grammar.

The output formats supported are:

- [JSON](http://json.org/)
- PDF (TODO)

## Ohm

[Ohm](https://github.com/harc/ohm) is a parser generator consisting of a library and a domain-specific language.
You can use it to parse custom file formats or quickly build parsers, interpreters, and compilers for programming languages.
The Ohm language is based on [parsing expression grammars](http://en.wikipedia.org/wiki/Parsing_expression_grammar) (PEGs),
which are a formal way of describing syntax, similar to regular expressions and context-free grammars.
The Ohm library provides a JavaScript interface (known as Ohm/JS) for creating parsers, interpreters, and more from the grammars you write.

## BTRS Standard

[BTRS - Balance Transaction and Reporting Standard](https://x9.org/standards/btrs/)

[X9.121 BTRS Version 3 – Format Guide](https://x9.org/wp-content/uploads/2017/05/X9.121-2016-BTRS-Version-3.0.pdf)

Version History

Version 3
The Balance and Transaction Reporting Standard (BTRS) Version 3 is named “BTR3”. This was decided as a more effective branding as the industry moves from BAI2 to BTR3. The standard will still be named BTRS, but each release will incorporate the level. The next release will be BTR4, for example.

Version 2
The BTRS Version 2 was skipped to provide consistent versioning. The X9 Committee agreed that this naming convention provided better continuity when the industry moves from BAI2 to BTR3.

Version 1
The Balance and Transaction Reporting Standard (BTRS) is intended to increase standardization of and improve upon the Bank Administration Institute Reporting Specification version 2 (BAI2).
The standard builds upon the BAI2 format while retaining forward compatibility. Although a BTRS file with the above changes could not be interpreted with a BAI2 reader, a BAI2 file could be interpreted with a BTRS reader. (Note: With some exceptions, a BAI2 file cannot be processed by a BTRS reader if deleted or repurposed codes were included in the BAI2 file.)

[X9.121 BTRS Version 3.1 – Codes List](https://x9.org/wp-content/uploads/2013/10/X9-121-2017-BTRS-Version-3-1-Type-Codes.xlsx)

[Download ANSI X9.121-2012 Balance and Transaction Reporting Standard](https://x9.org/standards/btrs/download-btrs/)

### A brief history of the BAI file format

[X9 BTRS FAQs 6. How did the BAI file format get established?](https://x9.org/standards/btrs/faqs/)

### Online BTRS Validator for BAI2 and BTRS

[BTRS Validator | X9](https://x9.org/standards/btrs/btrs-validator/)

This validator provides a structured view of a file or message contents. IMHO the interface is not useful if the format is not valid.

## BAI2 Specification

[Cash Management Balance Reporting Specifications Version 2 - Technical Reference Manual](https://www.bai.org/docs/default-source/libraries/site-general-downloads/cash_management_2005.pdf)

## Other BAI2 Guides

[SEPA - BAI2 Format Specification](http://www.sepaforcorporates.com/swift-for-corporates/bai2-format-specification/)

## Individual Bank - File Specifications and Examples

### CBA

[CommBiz File Spec - Account Information BAI2](doc/CBA/CommBiz File Spec - Account Information BAI2.pdf)
[CommBiz Transaction Codes for BAI2](doc/CBA/CommBiz Transaction Codes for BAI2.pdf)

### TD Bank

[TD Bank](https://www.tdcommercialbanking.com/document/PDF/bai.pdf)

### RBS

[RBS - Bankline export file layout guide – BAI v2 format](https://www.business.rbs.co.uk/content/dam/rbs_co_uk/Business_and_Content/PDFs/Export-file-layout-guide-BAI-v2-format.pdf)

    Note 1: Continuation record - The “Record Code” field is followed by a continuation of the preceding record. The format is exactly the same as in the preceding record. If the preceding record ended within a text field, the text continues in the 88 record. If the preceding record did not end within the text field, the 88 record continues with whatever field follows the final field in the preceding physical record. Do not split nontext fields between records. If a nontext field is begun in one record, it must be completed in that record. The following 88 record may continue with the next field.
    Note 2: Date fields are held in the format yymmdd.
    Note 3: Conforms to BAIv2 standard whereby “/” delimiter only present when Continuation Record (88) required.

## Running Scripts

Tests are implemented using [AVA the futuristic JavaScript test runner](https://github.com/avajs/ava)

The following scripts are in package.json:

    "scripts": {
        "test": "ava test/**/*.js --verbose",
        "test:watch": "ava test/**/*.js --verbose --watch",
        "test:file-examples": "ava test/test-btr3ToJSON-file-examples.js --verbose",
        "ava": "ava --verbose",
        "BTRS-valid": "node src/btr3ToJSON.js 'test/files/BAI2 BTRS Validator samples/valid/BTRS_valid.txt'",
        "BAI2-valid": "node src/btr3ToJSON.js 'test/files/BAI2 BTRS Validator samples/valid/BAI2_valid.txt'",
        "BAI2-valid-mod": "node src/btr3ToJSON.js 'test/files/BAI2_valid_modified.txt'",
        "empty1": "node src/btr3ToJSON.js test/files/emptyfile.txt"
    }

### Tests

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

### Others

    npm run BTRS-valid
    npm run empty1
    npm run CBA01

## Acknowledgements

### Creators and maintainers of Ohm

### Creators and maintainers of AVA

[avajs/ava: Futuristic JavaScript test runner](https://github.com/avajs/ava)

### Peter Weber from the Aten Design Group

Thanks to [Peter Weber from the Aten Design Group](https://atendesigngroup.com/about/peter-weber) for [Javascript Testing with AVA](https://atendesigngroup.com/blog/javascript-testing-ava).
It is a great article and it helped me with:

- configuring the test scripts in [Running Tests](TODO local link)
- removing repetitive test boiler plate by iterating over every example in the JSON file.