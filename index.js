'use strict';

var postcss = require('postcss');
var pxRegex = require('./lib/pixel-unit-regex');
var objectAssign = require('object-assign');

var defaults = {
    rootValue: 16,
    unitPrecision: 5,
    selectorBlackList: [],
    propWhiteList: ['font', 'font-size', 'line-height', 'letter-spacing'],
    replace: true,
    mediaQuery: false,
    minPixelValue: 0
};

var legacyOptions = {
    'root_value': 'rootValue',
    'unit_precision': 'unitPrecision',
    'selector_black_list': 'selectorBlackList',
    'prop_white_list': 'propWhiteList',
    'media_query': 'mediaQuery'
};

module.exports = postcss.plugin('postcss-pxtorem', function (options) {

    convertLegacyOptions(options);

    var opts = objectAssign({}, defaults, options);
    var pxReplace = createPxReplace(opts.rootValue, opts.unitPrecision, opts.minPixelValue);

    return function (css) {

        css.walkDecls(function (decl, i) {
            // This should be the fastest test and will remove most declarations
            if (decl.value.indexOf('px') === -1) return;

            if (opts.propWhiteList.length && opts.propWhiteList.indexOf(decl.prop) === -1) return;

            if (blacklistedSelector(opts.selectorBlackList, decl.parent.selector)) return;

            var value = decl.value.replace(pxRegex, pxReplace);

            // if rem unit already exists, do not add or replace
            if (declarationExists(decl.parent, decl.prop, value)) return;

            if (opts.replace) {
                decl.value = value;
            } else {
                decl.parent.insertAfter(i, decl.clone({ value: value }));
            }
        });

        if (opts.mediaQuery) {
            css.walkAtRules('media', function (rule) {
                if (rule.params.indexOf('px') === -1) return;
                rule.params = rule.params.replace(pxRegex, pxReplace);
            });
        }

    };
});

function convertLegacyOptions(options) {
    if (typeof options !== 'object') return;
    Object.keys(legacyOptions).forEach(function (key) {
        if (options.hasOwnProperty(key)) {
            options[legacyOptions[key]] = options[key];
            delete options[key];
        }
    });
}

function createPxReplace (rootValue, unitPrecision, minPixelValue) {
    return function (m, $1) {
        if (!$1) return m;
        var pixels = parseFloat($1);
        if (pixels < minPixelValue) return m;
        return toFixed((pixels / rootValue), unitPrecision) + 'rem';
    };
}

function toFixed(number, precision) {
    var multiplier = Math.pow(10, precision + 1),
    wholeNumber = Math.floor(number * multiplier);
    return Math.round(wholeNumber / 10) * 10 / multiplier;
}

function declarationExists(decls, prop, value) {
    return decls.some(function (decl) {
        return (decl.prop === prop && decl.value === value);
    });
}

function blacklistedSelector(blacklist, selector) {
    if (typeof selector !== 'string') return;
    return blacklist.some(function (regex) {
        if (typeof regex === 'string') return selector.indexOf(regex) !== -1;
        return selector.match(regex);
    });
}
