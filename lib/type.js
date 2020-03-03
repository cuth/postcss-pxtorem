const type = s =>
  Object.prototype.toString
    .call(s)
    .slice(8, -1)
    .toLowerCase();

const types = [
  "String",
  "Array",
  "Undefined",
  "Boolean",
  "Number",
  "Function",
  "Symbol",
  "Object"
];

module.exports = types.reduce((acc, str) => {
  acc["is" + str] = val => type(val) === str.toLowerCase();
  return acc;
}, {});
