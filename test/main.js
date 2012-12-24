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
    "tile",
    "map"
], function (
    nodeunit,
    rectangle,
    tile,
    map
) {
    nodeunit.run({
        rectangle: rectangle,
        tile: tile,
        map: map
    });
});