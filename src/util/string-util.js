define(["underscore"], function (_) {
    var StringUtil = {};

    StringUtil.format = function (format) {
        var ret = format;
        for (var index in arguments) {
            if (index == 0) continue;
            ret = ret.replace("{" + (index - 1) + "}", arguments[index]);
        }
        return ret;
    };

    StringUtil.startsWith = function (str, prefix) {
        return str.indexOf(prefix) === 0;
    };

    StringUtil.endsWith = function (str, suffix) {
        return str.indexOf(suffix, str.length - suffix.length) !== -1;
    };

    return StringUtil;
});