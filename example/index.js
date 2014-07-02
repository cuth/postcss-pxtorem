'use strict';

var fs = require('fs');
var pixrem = require('../lib/pxtorem');
var css = fs.readFileSync('main.css', 'utf8');
var processedCss = pixrem(css, {
    replace: false
});

fs.writeFile('main-rem.css', processedCss, function (err) {
  if (err) {
    throw err;
  }
  console.log('Rem file written.');
});