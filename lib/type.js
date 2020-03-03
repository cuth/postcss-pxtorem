var type = function (s) {
    return Object.prototype.toString.call(s).slice(8, -1).toLowerCase();
};

var types = [
    'String',
    'Array',
    'Undefined',
    'Boolean',
    'Number',
    'Function',
    'Symbol',
    'Object'
];

types.forEach(function (str) {
    type['is' + str] = function (val) {
        return type(val) === str.toLowerCase();
    };
});

module.exports = type;

