'use strict';

// Add pixel fallbacks for rem units to a string of CSS
// - css `String`: the contents of a CSS file.
// - rootvalue `String | Null`: The root element font size. Default = 16px.
// - options `Object`
//     - replace `Boolean`: Replace rems with pixels instead of providing
//       fallbacks. Default = false.
// }
module.exports = function pixrem(css, rootvalue, options) {
  var postcss = require('postcss');
  var remgex = /(\d*\.?\d+)px/ig;
  var rootvalue = rootvalue || 16;
  var options = typeof options !== 'undefined' ? options : {
    replace: true
  };

  var toFixed = function (number, precision) {
    var multiplier = Math.pow(10, precision + 1),
        wholeNumber = Math.floor(number * multiplier);
    return Math.round( wholeNumber / 10 ) * 10 / multiplier;
  };

  var postprocessor = postcss(function (css) {

    css.eachDecl(function (decl, i) {
      var rule = decl.parent;
      var value = decl.value;

      if (value.indexOf('px') != -1) {

        value = value.replace(remgex, function (m, $1) {
          return toFixed((parseFloat($1) / rootvalue), 5) + 'rem';
        });

        if (options.replace) {
          decl.value = value;
        } else {
          rule.insertAfter(i, decl.clone({ value: value }));
        }
      }
    });

    css.each(function (rule, i) {
      if (rule.type !== 'atrule' && rule.name !== 'media') {
        return true;
      }
      if (rule._params.indexOf('px') != 1) {
        rule._params = rule._params.replace(remgex, function (m, $1) {
          return toFixed((parseFloat($1) / rootvalue), 5) + 'rem';
        });
      }
    });

  });

  return postprocessor.process(css).css;
};
