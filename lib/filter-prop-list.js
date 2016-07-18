module.exports = {
    exact: function (list) {
        return list.filter(function (m) {
            return m.match(/^[^\*\~\^\$\!]+/);
        });
    },
    contain: function (list) {
        return list.filter(function (m) {
            return m.indexOf('~') === 0;
        }).map(trimFirstCharacter);
    },
    start: function (list) {
        return list.filter(function (m) {
            return m.indexOf('^') === 0;
        }).map(trimFirstCharacter);
    },
    end: function (list) {
        return list.filter(function (m) {
            return m.indexOf('$') === 0;
        }).map(trimFirstCharacter);
    },
    not: function (list) {
        return list.filter(function (m) {
            return m.match(/^\![^\~\^\$]+/);
        }).map(trimFirstCharacter);
    },
    notContain: function (list) {
        return list.filter(function (m) {
            return m.indexOf('!~') === 0;
        }).map(trimFirstTwoCharacters);
    },
    notStart: function (list) {
        return list.filter(function (m) {
            return m.indexOf('!^') === 0;
        }).map(trimFirstTwoCharacters);
    },
    notEnd: function (list) {
        return list.filter(function (m) {
            return m.indexOf('!$') === 0;
        }).map(trimFirstTwoCharacters);
    }
};

function trimFirstCharacter(str) {
    return str.substring(1);
}

function trimFirstTwoCharacters(str) {
    return str.substring(2);
}
