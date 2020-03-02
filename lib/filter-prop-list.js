module.exports = {
  exact: list => list.filter(m => m.match(/^[^*!]+$/)),
  contain: list =>
    list.filter(m => m.match(/^\*.+\*$/)).map(m => m.substr(1, m.length - 2)),
  endWith: list => list.filter(m => m.match(/^\*[^*]+$/)).map(m => m.substr(1)),
  startWith: list =>
    list.filter(m => m.match(/^[^*!]+\*$/)).map(m => m.substr(0, m.length - 1)),
  notExact: list =>
    list.filter(m => m.match(/^![^*].*$/)).map(m => m.substr(1)),
  notContain: list =>
    list.filter(m => m.match(/^!\*.+\*$/)).map(m => m.substr(2, m.length - 3)),
  notEndWith: list =>
    list.filter(m => m.match(/^!\*[^*]+$/)).map(m => m.substr(2)),
  notStartWith: list =>
    list.filter(m => m.match(/^![^*]+\*$/)).map(m => m.substr(1, m.length - 2))
};
