define(function () {
    var Util = {};

    Util.format = function (format) {
        var ret = format;
        for (var index in arguments) {
            if (index == 0) continue;
            ret = ret.replace("{" + (index - 1) + "}", arguments[index]);
        }
        return ret;
    };

    Util.startsWith = function (str, prefix) {
        return str.indexOf(prefix) === 0;
    };

    Util.endsWith = function (str, suffix) {
        return str.indexOf(suffix, str.length - suffix.length) !== -1;
    };

    Util.size = function (iterable) {
        if (iterable == null) return 0;
        if (iterable.length === parseInt(iterable.length)) return iterable.length;
        if (Object.keys) return Object.keys(iterable).length;

        var size = 0;
        for (var key in iterable) {
            if (iterable.hasOwnProperty(key)) size++;
        }
        return size;
    };

    return Util;
});