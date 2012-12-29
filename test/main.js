require.config({
    paths: {
        jquery: "../lib/jquery",
        tmxjs: "../src"
    },
    shim: {
        nodeunit: { exports: "nodeunit" }
    }
});

require([
    "nodeunit",
    "map",
    "tile",
    "tile-layer",
    "tile-set",
    "util/rectangle"
], function (
    nodeunit,
    map,
    tile,
    tileLayer,
    tileSet,
    rectangle
) {
    nodeunit.run({
        map: map,
        tile: tile,
        tileLayer: tileLayer,
        tileSet: tileSet,
        rectangle: rectangle
    });
});