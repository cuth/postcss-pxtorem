# Pxtorem

A CSS post-processor that generates rem units from pixel units.  
Written with [PostCSS](https://github.com/ai/postcss).  
This is essentially [node-pixrem](https://github.com/robwierzbowski/node-pixrem) only reversed.

## Usage

Pixels are the easiest unit to use. The only issue with them is that they don't let browsers change the default font size of 16. This script converts every px value to a rem to allow the browser to choose the font size.

### Example

```js
'use strict';
var fs = require('fs');
var pixrem = require('pxtorem');
var css = fs.readFileSync('main.css', 'utf8');
var processedCss = pixrem(css, '16');

fs.writeFile('main.with-fallbacks.css', processedCss, function (err) {
  if (err) {
    throw err;
  }
  console.log('Hello font resizing.');
});
```

### Parameters

#### css

Type: `String`  

Some CSS to process.

#### rootvalue

Type: `Number`  
Default: `16`  

The root element font size. Can be px, rem, em, percent, or unitless pixel value.

#### options

Type: `Object | Null`  
Default: `{ replace: false }`  

- `replace` replaces rules containing rems instead of adding fallbacks.

## Contribute

Report bugs and feature proposals in the [Github issue tracker](https://github.com/robwierzbowski/node-pixrem/issues). Run tests with jasmine-node. In lieu of a formal styleguide, take care to maintain the existing coding style. 

## Release History

0.1.4, March 6, 2014: Code optimization from AI.  
0.1.3, Dec 14, 2013: Fix regex for < 0 values.  
0.1.1, 0.1.2, Dec 14, 2013: Documentation improvements.  
0.1.0, Dec 14, 2013: Initial release.  

## License

[MIT](http://en.wikipedia.org/wiki/MIT_License)


[![Bitdeli Badge](https://d2weczhvl823v0.cloudfront.net/robwierzbowski/node-pixrem/trend.png)](https://bitdeli.com/free "Bitdeli Badge")

