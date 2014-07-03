'use strict';

var postcss = require('postcss');

var defaults = {
    root_value: 16,
    unit_precision: 5,
    prop_white_list: ['font', 'font-size', 'line-height', 'letter-spacing'],
    replace: true,
    media_query: false
};

var extend = function (obj) {
    if (typeof obj !== 'object') return obj;
    Array.prototype.slice.call(arguments, 1).forEach(function (source) {
        for (var prop in source) {
            obj[prop] = source[prop];
        }
    });
    return obj;
};

var toFixed = function (number, precision) {
    var multiplier = Math.pow(10, precision + 1),
    wholeNumber = Math.floor(number * multiplier);
    return Math.round(wholeNumber / 10) * 10 / multiplier;
};

var remExists = function (decls, prop, value) {
    return decls.some(function (decl) {
        return (decl.prop === prop && decl.value === value);
    });
};

module.exports = function (css, options) {

    var opts = extend({}, defaults, options);

    var pxRegex = /(\d*\.?\d+)px/ig;

    var pxReplace = function (m, $1) {
        return toFixed((parseFloat($1) / opts.root_value), opts.unit_precision) + 'rem';
    };

    var postprocessor = postcss(function (css) {

        css.eachDecl(function (decl, i) {
            if (opts.prop_white_list.indexOf(decl.prop) === -1) return;

            var rule = decl.parent;
            var value = decl.value;

            if (value.indexOf('px') !== -1) {
                value = value.replace(pxRegex, pxReplace);

                // if rem unit already exists, do not add or replace
                if (remExists(rule.decls, decl.prop, value)) return;

                if (opts.replace) {
                    decl.value = value;
                } else {
                    rule.insertAfter(i, decl.clone({ value: value }));
                }
            }
        });

        if (opts.media_query) {
            css.each(function (rule) {
                if (rule.type !== 'atrule' && rule.name !== 'media') return;

                if (rule._params.indexOf('px') !== -1) {
                    rule._params = rule._params.replace(pxRegex, pxReplace);
                }
            });
        }

    });

    return postprocessor.process(css).css;
};