require.config({
    paths: {
        jquery: "../lib/jquery",
        underscore: "./lib/underscore",
        nodeunit: "./lib/nodeunit",
        tmxjs: "../src"
    },
    shim: {
        underscore: { exports: "_" },
        nodeunit: { exports: "nodeunit" }
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