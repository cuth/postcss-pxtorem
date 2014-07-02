# Pxtorem

A CSS post-processor that generates rem units from pixel units.  
Written with [PostCSS](https://github.com/ai/postcss).  
This is essentially [node-pixrem](https://github.com/robwierzbowski/node-pixrem) only reversed.

## Usage

Pixels are the easiest unit to use. The only issue with them is that they don't let browsers change the default font size of 16. This script converts every px value to a rem to allow the browser to choose the font size.

### Example

```js
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
  console.log('REM file written.');
});
```

### Parameters

#### css

Type: `String`  
Some CSS to process.

#### options

Type: `Object | Null`  
Default:
```js
{
    root_value: 16,
    unit_precision: 5,
    prop_white_list: ['font', 'font-size', 'line-height', 'letter-spacing'],
    replace: true,
    media_query: false
}
```

- `root_value` (Number) The root element font size.
- `unit_precision` (Number) The decimal numbers to allow the REM units to grow to.
- `prop_white_list` (Array) The properties that can change from px to rem.
- `replace` (Boolean) replaces rules containing rems instead of adding fallbacks.
- `media_query` (Boolean) Allow px to be converted in media queries.
