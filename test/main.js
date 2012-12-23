require.config({
    paths: {
        jquery: "../lib/jquery",
        tmxjs: "../src"
    },
    shim: {
        nodeunit: {
            exports: "nodeunit"
        }
    }
});

require([
    "nodeunit",
    "util/rectangle",
    "map"
], function (
    nodeunit,
    rectangle,
    map
) {
    nodeunit.run({
        rectangle: rectangle,
        map: map
    });
});