# postcss-pxtorem [![NPM version](https://badge.fury.io/js/postcss-pxtorem.svg)](http://badge.fury.io/js/postcss-pxtorem)

[English](README.md) | 中文

将px单位转换为rem单位的[PostCSS](https://github.com/ai/postcss)插件.

## 安装

```shell
npm install postcss-pxtorem --save-dev
```

## 用法

在我看来`px`是最容易是用的单位. 唯一的问题是，他们不允许浏览器更改默认字体大小。此库将每个`px`值从您选择的属性转换为rem，以允许浏览器设置字体大小。

### 输入/输出

*在默认设置下，只针对与字体相关的属性。*

```css
// input
h1 {
    margin: 0 0 20px;
    font-size: 32px;
    line-height: 1.2;
    letter-spacing: 1px;
}

// output
h1 {
    margin: 0 0 20px;
    font-size: 2rem;
    line-height: 1.2;
    letter-spacing: 0.0625rem;
}
```

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

### 配置参数

类型: `Object | Null`
默认参数:

```js
{
    rootValue: 16,
    unitPrecision: 5,
    propList: ['font', 'font-size', 'line-height', 'letter-spacing'],
    selectorBlackList: [],
    replace: true,
    mediaQuery: false,
    minPixelValue: 0,
    exclude: /node_modules/i
}
```

- `rootValue` (Number | Function) 表示根元素字体大小，或基于[`input`]返回根元素字体大小(https://api.postss.org/Input.html)参数
- `unitPrecision` (Number) 单位转换后保留的精度
- `propList` (Array) 能转化为vw的属性列表
  -值必须完全匹配
  - 使用通配符`*`将匹配所有属性。例如：`['*']`
  - 在属性的前或后添加"*",可以匹配特定的属性. 例如:（`['*position*']`将匹配`background-position-y`
  - 在特定属性前加 "!"，将不转换该属性的单位 . 例如: `['*', '!letter-spacing']`
  - 在特定属性前加 "!"，将不转换该属性的单位. Example: `['*', '!font*']`
- `selectorBlackList` (Array) 选择符忽略并保留为px
  - 如果value是字符串，则检查选择器是否包含该字符串
    - `['body']`将匹配 `.body-class`
  - 如果value是正则，则检查选择器是否与正则匹配
    - `[/^body$/]` 将匹配 `body` 但是不匹配 `.body`
- `replace` (Boolean) 是否直接更换属性值，而不添加备用属性
- `mediaQuery` (Boolean) 媒体查询里的单位是否需要转换单位
- `minPixelValue` (Number) 设置最小的转换数值
- `exclude` (String, Regexp, Function) 忽略某些文件夹下的文件或特定文件
  - 如果值为string，则检查文件路径是否包含该字符串。
    - `'exclude'` 将匹配 `\project\postcss-pxtorem\exclude\path`
  - 如果值是正则，则检查文件路径是否与正则匹配.
    - `/exclude/i` 将匹配 `\project\postcss-pxtorem\exclude\path`
  - 如果值为function，则如果函数返回true，文件将被忽略
    - 回调将文件路径作为参数传递，它应该返回一个布尔结果
    - `function (file) { return file.indexOf('exclude') !== -1; }`

### 与gulp postss和autoprefixer一起使用

```js
var gulp = require('gulp');
var postcss = require('gulp-postcss');
var autoprefixer = require('autoprefixer');
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

### 关于忽略属性的问题

目前，忽略单个属性的最简单方法是在像素单元声明中使用大写字母。

```css
// `px` is converted to `rem`
.convert {
    font-size: 16px; // converted to 1rem
}

// `Px` or `PX` is ignored by `postcss-pxtorem` but still accepted by browsers
.ignore {
    border: 1Px solid; // ignored
    border-width: 2PX; // ignored
}
```
