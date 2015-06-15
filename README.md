# postcss-pxtorem [![NPM version](https://badge.fury.io/js/postcss-pxtorem.svg)](http://badge.fury.io/js/postcss-pxtorem)

A plugin for [PostCSS](https://github.com/ai/postcss) that generates rem units from pixel units.


## Usage

Pixels are the easiest unit to use (*opinion*). The only issue with them is that they don't let browsers change the default font size of 16. This script converts every px value to a rem from the properties you choose to allow the browser to set the font size.


### Example

```js
var fs = require('fs');
var postcss = require('postcss');
var pxtorem = require('postcss-pxtorem');
var css = fs.readFileSync('main.css', 'utf8');
var options = {
    replace: false
};
var processedCss = postcss(pxtorem(options)).process(css).css;

fs.writeFile('main-rem.css', processedCss, function (err) {
  if (err) {
    throw err;
  }
  console.log('Rem file written.');
});
```

### options

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
- `prop_white_list` (Array) The properties that can change from px to rem. `'*'` will change all properties.
- `replace` (Boolean) replaces rules containing rems instead of adding fallbacks.
- `media_query` (Boolean) Allow px to be converted in media queries.


### Use with gulp-postcss and autoprefixer-core
```js
var gulp = require('gulp');
var postcss = require('gulp-postcss');
var autoprefixer = require('autoprefixer-core');
var pxtorem = require('postcss-pxtorem');

gulp.task('css', function () {

    var processors = [
        autoprefixer({
            browsers: 'last 1 version'
        }),
        pxtorem({
            replace: false
        })
    ];

    return gulp.src(['build/css/**/*.css'])
        .pipe(postcss(processors))
        .pipe(gulp.dest('build/css'));
});
```
