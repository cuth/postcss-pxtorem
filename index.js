'use strict';

var postcss = require('postcss');

module.exports = postcss.plugin('postcss-pxtorem', function (options) {

    return function (css) {

        options = options || {};
        var rootValue = options.root_value || 16;
        var unitPrecision = options.unit_precision || 5;
        var selectorBlackList = options.selector_black_list || [];
        var propWhiteList = options.prop_white_list || ['font', 'font-size', 'line-height', 'letter-spacing'];
        var replace = (options.replace === false) ? false : true;
        var mediaQuery = options.media_query || false;

        var pxRegex = /(\d*\.?\d+)px/ig;

        var pxReplace = function (m, $1) {
            return toFixed((parseFloat($1) / rootValue), unitPrecision) + 'rem';
        };

        css.eachDecl(function (decl, i) {
            if (propWhiteList.indexOf(decl.prop) === -1) return;

            if (blacklistedSelector(selectorBlackList, decl.parent.selector)) return;

            var rule = decl.parent;
            var value = decl.value;

            if (value.indexOf('px') !== -1) {
                value = value.replace(pxRegex, pxReplace);

                // if rem unit already exists, do not add or replace
                if (remExists(rule, decl.prop, value)) return;

                if (replace) {
                    decl.value = value;
                } else {
                    rule.insertAfter(i, decl.clone({ value: value }));
                }
            }
        });

        if (mediaQuery) {
            css.each(function (rule) {
                if (rule.type !== 'atrule' && rule.name !== 'media') return;

                if (rule.params.indexOf('px') !== -1) {
                    rule.params = rule.params.replace(pxRegex, pxReplace);
                }
            });
        }

    };
});

function toFixed(number, precision) {
    var multiplier = Math.pow(10, precision + 1),
    wholeNumber = Math.floor(number * multiplier);
    return Math.round(wholeNumber / 10) * 10 / multiplier;
}

function remExists(decls, prop, value) {
    return decls.some(function (decl) {
        return (decl.prop === prop && decl.value === value);
    });
}

function blacklistedSelector(blacklist, selector) {
    return blacklist.some(function (regex) {
        return selector.match(regex);
    });
}
