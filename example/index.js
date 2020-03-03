"use strict";

const fs = require("fs");
const postcss = require("postcss");
const pxtorem = require("..");

const css = fs.readFileSync("main.css", "utf8");
const options = {
  replace: false
};
const processedCss = postcss(pxtorem(options)).process(css).css;

fs.writeFile("main-rem.css", processedCss, function(err) {
  if (err) {
    throw err;
  }
  console.log("Rem file written.");
});
