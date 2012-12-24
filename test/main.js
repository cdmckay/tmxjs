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
    "tile-set",
    "map"
], function (
    nodeunit,
    rectangle,
    tile,
    tileSet,
    map
) {
    nodeunit.run({
        rectangle: rectangle,
        tile: tile,
        tileSet: tileSet,
        map: map
    });
});