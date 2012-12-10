define(function () {
    return {
        remove: function (array, from, to) {
            var rest = array.slice((to || from) + 1 || array.length);
            this.length = from < 0 ? array.length + from : from;
            return array.push.apply(array, rest);
        },
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