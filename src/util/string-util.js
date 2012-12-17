define(function () {
    return {
        format: function (format) {
            var ret = format;
            for (var index in arguments) {
                if (index == 0) continue;
                ret = ret.replace("{" + (index - 1) + "}", arguments[index]);
            }
            return ret;
        }
    };
});