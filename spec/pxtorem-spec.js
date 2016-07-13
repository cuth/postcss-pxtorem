// Jasmine unit tests
// To run tests, run these commands from the project root:
// 1. `npm install -g jasmine-node`
// 2. `jasmine-node spec`

/* global describe, it, expect */

'use strict';
var postcss = require('postcss');
var pxtorem = require('..');
var basicCSS = '.rule { font-size: 15px }';

describe('pxtorem', function () {
    it('should work on the readme example', function () {
        var input = 'h1 { margin: 0 0 20px; font-size: 32px; line-height: 1.2; letter-spacing: 1px; }';
        var output = 'h1 { margin: 0 0 20px; font-size: 2rem; line-height: 1.2; letter-spacing: 0.0625rem; }';
        var processed = postcss(pxtorem()).process(input).css;

        expect(processed).toBe(output);
    });

    it('should replace the px unit with rem', function () {
        var processed = postcss(pxtorem()).process(basicCSS).css;
        var expected = '.rule { font-size: 0.9375rem }';

        expect(processed).toBe(expected);
    });

    it('should ignore non px properties', function () {
        var expected = '.rule { font-size: 2em }';
        var processed = postcss(pxtorem()).process(expected).css;

        expect(processed).toBe(expected);
    });

    it('should handle < 1 values and values without a leading 0', function () {
        var rules = '.rule { margin: 0.5rem .5px -0.2px -.2em }';
        var expected = '.rule { margin: 0.5rem 0.03125rem -0.0125rem -.2em }';
        var options = {
            propWhiteList: ['margin']
        };
        var processed = postcss(pxtorem(options)).process(rules).css;

        expect(processed).toBe(expected);
    });

    it('should not add properties that already exist', function () {
        var expected = '.rule { font-size: 16px; font-size: 1rem; }';
        var processed = postcss(pxtorem()).process(expected).css;

        expect(processed).toBe(expected);
    });
});

describe('value parsing', function () {
    it('should not replace values in double quotes or single quotes', function () {
        var options = {
            propWhiteList: []
        };
        var rules = '.rule { content: \'16px\'; font-family: "16px"; font-size: 16px; }';
        var expected = '.rule { content: \'16px\'; font-family: "16px"; font-size: 1rem; }';
        var processed = postcss(pxtorem(options)).process(rules).css;

        expect(processed).toBe(expected);
    });

    it('should not replace values in `url()`', function () {
        var options = {
            propWhiteList: []
        };
        var rules = '.rule { background: url(16px.jpg); font-size: 16px; }';
        var expected = '.rule { background: url(16px.jpg); font-size: 1rem; }';
        var processed = postcss(pxtorem(options)).process(rules).css;

        expect(processed).toBe(expected);
    });
});

describe('rootValue', function () {
    // Deprecate
    it('should replace using a root value of 10 - legacy', function () {
        var expected = '.rule { font-size: 1.5rem }';
        var options = {
            root_value: 10
        };
        var processed = postcss(pxtorem(options)).process(basicCSS).css;

        expect(processed).toBe(expected);
    });

    it('should replace using a root value of 10', function () {
        var expected = '.rule { font-size: 1.5rem }';
        var options = {
            rootValue: 10
        };
        var processed = postcss(pxtorem(options)).process(basicCSS).css;

        expect(processed).toBe(expected);
    });
});

describe('unitPrecision', function () {
    // Deprecate
    it('should replace using a decimal of 2 places - legacy', function () {
        var expected = '.rule { font-size: 0.94rem }';
        var options = {
            unit_precision: 2
        };
        var processed = postcss(pxtorem(options)).process(basicCSS).css;

        expect(processed).toBe(expected);
    });

    it('should replace using a decimal of 2 places', function () {
        var expected = '.rule { font-size: 0.94rem }';
        var options = {
            unitPrecision: 2
        };
        var processed = postcss(pxtorem(options)).process(basicCSS).css;

        expect(processed).toBe(expected);
    });
});

describe('propWhiteList', function () {
    // Deprecate
    it('should only replace properties in the white list - legacy', function () {
        var expected = '.rule { font-size: 15px }';
        var options = {
            prop_white_list: ['font']
        };
        var processed = postcss(pxtorem(options)).process(basicCSS).css;

        expect(processed).toBe(expected);
    });

    it('should only replace properties in the white list', function () {
        var expected = '.rule { font-size: 15px }';
        var options = {
            propWhiteList: ['font']
        };
        var processed = postcss(pxtorem(options)).process(basicCSS).css;

        expect(processed).toBe(expected);
    });

    it('should replace all properties when white list is empty', function () {
        var rules = '.rule { margin: 16px; font-size: 15px }';
        var expected = '.rule { margin: 1rem; font-size: 0.9375rem }';
        var options = {
            propWhiteList: []
        };
        var processed = postcss(pxtorem(options)).process(rules).css;

        expect(processed).toBe(expected);
    });
});

describe('selectorBlackList', function () {
    // Deprecate
    it('should ignore selectors in the selector black list - legacy', function () {
        var rules = '.rule { font-size: 15px } .rule2 { font-size: 15px }';
        var expected = '.rule { font-size: 0.9375rem } .rule2 { font-size: 15px }';
        var options = {
            selector_black_list: ['.rule2']
        };
        var processed = postcss(pxtorem(options)).process(rules).css;

        expect(processed).toBe(expected);
    });

    it('should ignore selectors in the selector black list', function () {
        var rules = '.rule { font-size: 15px } .rule2 { font-size: 15px }';
        var expected = '.rule { font-size: 0.9375rem } .rule2 { font-size: 15px }';
        var options = {
            selectorBlackList: ['.rule2']
        };
        var processed = postcss(pxtorem(options)).process(rules).css;

        expect(processed).toBe(expected);
    });

    it('should ignore every selector with `body$`', function () {
        var rules = 'body { font-size: 16px; } .class-body$ { font-size: 16px; } .simple-class { font-size: 16px; }';
        var expected = 'body { font-size: 1rem; } .class-body$ { font-size: 16px; } .simple-class { font-size: 1rem; }';
        var options = {
            selectorBlackList: ['body$']
        };
        var processed = postcss(pxtorem(options)).process(rules).css;

        expect(processed).toBe(expected);
    });

    it('should only ignore exactly `body`', function () {
        var rules = 'body { font-size: 16px; } .class-body { font-size: 16px; } .simple-class { font-size: 16px; }';
        var expected = 'body { font-size: 16px; } .class-body { font-size: 1rem; } .simple-class { font-size: 1rem; }';
        var options = {
            selectorBlackList: [/^body$/]
        };
        var processed = postcss(pxtorem(options)).process(rules).css;

        expect(processed).toBe(expected);
    });
});

describe('replace', function () {
    it('should leave fallback pixel unit with root em value', function () {
        var options = {
            replace: false
        };
        var processed = postcss(pxtorem(options)).process(basicCSS).css;
        var expected = '.rule { font-size: 15px; font-size: 0.9375rem }';

        expect(processed).toBe(expected);
    });
});

describe('mediaQuery', function () {
    // Deprecate
    it('should replace px in media queries', function () {
        var options = {
            media_query: true
        };
        var processed = postcss(pxtorem(options)).process('@media (min-width: 500px) { .rule { font-size: 16px } }').css;
        var expected = '@media (min-width: 31.25rem) { .rule { font-size: 1rem } }';

        expect(processed).toBe(expected);
    });

    it('should replace px in media queries', function () {
        var options = {
            mediaQuery: true
        };
        var processed = postcss(pxtorem(options)).process('@media (min-width: 500px) { .rule { font-size: 16px } }').css;
        var expected = '@media (min-width: 31.25rem) { .rule { font-size: 1rem } }';

        expect(processed).toBe(expected);
    });
});

describe('minPixelValue', function () {
    it('should not replace values below minPixelValue', function () {
        var options = {
            propWhiteList: [],
            minPixelValue: 2
        };
        var rules = '.rule { border: 1px solid #000; font-size: 16px; margin: 1px 10px; }';
        var expected = '.rule { border: 1px solid #000; font-size: 1rem; margin: 1px 0.625rem; }';
        var processed = postcss(pxtorem(options)).process(rules).css;

        expect(processed).toBe(expected);
    });
});
