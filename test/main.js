require.config({
    paths: {
        jquery: "../lib/jquery",
        underscore: "../lib/underscore",
        tmxjs: "../src"
    },
    shim: {
        nodeunit: { exports: "nodeunit" },
        underscore: { exports: "_" }
    }
});

require([
    "nodeunit",
    "map",
    "tile",
    "tile-layer",
    "tile-set",
    "util/base64",
    "util/rectangle"
], function (
    nodeunit,
    map,
    tile,
    tileLayer,
    tileSet,
    base64,
    rectangle
) {
    nodeunit.run({
        map: map,
        tile: tile,
        tileLayer: tileLayer,
        tileSet: tileSet,
        base64: base64,
        rectangle: rectangle
    });
});