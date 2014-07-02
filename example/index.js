'use strict';

var fs = require('fs');
var pxtorem = require('../lib/pxtorem');
var css = fs.readFileSync('main.css', 'utf8');
var processedCss = pxtorem(css, {
    replace: false
});

fs.writeFile('main-rem.css', processedCss, function (err) {
  if (err) {
    throw err;
  }
  console.log('Rem file written.');
});