define(function () {
    return {
        remove: function (array, from, to) {
            var rest = array.slice((to || from) + 1 || array.length);
            this.length = from < 0 ? array.length + from : from;
            return array.push.apply(array, rest);
        }
    };
});