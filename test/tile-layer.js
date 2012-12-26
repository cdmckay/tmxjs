define([
    'tmxjs/map',
    'tmxjs/tile',
    'tmxjs/tile-layer',
    'tmxjs/util/rectangle'
], function (
    Map,
    Tile,
    TileLayer,
    Rectangle
) {
    var tests = {
        "test constructor with map argument": function (test) {
            var w = 1, h = 2;
            var map = new Map(w, h);
            var tileLayer = new TileLayer(map);
            test.equal(tileLayer.bounds.w, map.bounds.w, "Should match map width");
            test.equal(tileLayer.bounds.h, map.bounds.h, "Should match map height");
            test.done();
        },

        "test constructor with map and width and height arguments": function (test) {
            var w = 1, h = 2, bounds = Rectangle.atOrigin(4, 8);
            var map = new Map(w, h);
            var tileLayer = new TileLayer(map, bounds);
            test.equal(tileLayer.bounds.w, bounds.w, "Should match passed bounds width");
            test.equal(tileLayer.bounds.h, bounds.h, "Should match passed bounds height");
            test.done();
        },

        "test setTileAt": function (test) {
            var tile = new Tile();
            var tileLayer = new TileLayer(null, Rectangle.atOrigin(32, 32));
            tileLayer.setTileAt(1, 2, tile);
            test.equal(tileLayer.getTileAt(1, 2), tile, "The tile at 1,2 should be set");
            test.done();
        },

        "test setTileAt when out of bounds": function (test) {
            var tile = new Tile();
            var tileLayer = new TileLayer(null, Rectangle.atOrigin(32, 32));
            tileLayer.setTileAt(40, 40, tile);
            test.equal(tileLayer.getTileAt(40, 40), null, "The tile at 40,40 should not be set");
            test.done();
        },

        "test removeTile": function (test) {
            var tile1 = new Tile();
            var tile2 = new Tile();
            var tileLayer = new TileLayer(null, Rectangle.atOrigin(32, 32));
            tileLayer.setTileAt(1, 2, tile1);
            tileLayer.setTileAt(3, 4, tile1);
            tileLayer.setTileAt(4, 5, tile2);
            tileLayer.setTileAt(6, 7, tile2);
            tileLayer.removeTile(tile1);
            test.equal(tileLayer.getTileAt(1, 2), null, "The tile at 1,2 should be null");
            test.equal(tileLayer.getTileAt(3, 4), null, "The tile at 3,4 should be null");
            test.equal(tileLayer.getTileAt(4, 5), tile2, "The tile at 4,5 should be tile2");
            test.equal(tileLayer.getTileAt(6, 7), tile2, "The tile at 6,7 should be tile2");
            test.done();
        },

        "test replaceTile": function (test) {
            var tile1 = new Tile();
            var tile2 = new Tile();
            var tileLayer = new TileLayer(null, Rectangle.atOrigin(32, 32));
            tileLayer.setTileAt(1, 2, tile1);
            tileLayer.setTileAt(3, 4, tile1);
            tileLayer.setTileAt(4, 5, tile2);
            tileLayer.setTileAt(6, 7, tile2);
            tileLayer.replaceTile(tile1, tile2);
            test.equal(tileLayer.getTileAt(1, 2), tile2, "The tile at 1,2 should be tile2");
            test.equal(tileLayer.getTileAt(3, 4), tile2, "The tile at 3,4 should be tile2");
            test.equal(tileLayer.getTileAt(4, 5), tile2, "The tile at 4,5 should be tile2");
            test.equal(tileLayer.getTileAt(6, 7), tile2, "The tile at 6,7 should be tile2");
            test.done();
        },

        "test rotate by 90 degrees": function (test) {
            var tile1 = new Tile();
            var tile2 = new Tile();
            var tileLayer = new TileLayer(null, Rectangle.atOrigin(16, 32));
            tileLayer.setTileAt(1, 1, tile1);
            tileLayer.setTileAt(4, 4, tile2);
            var oldBounds = tileLayer.bounds;
            tileLayer.rotate(90);
            test.equal(tileLayer.bounds.w, oldBounds.h, "Should be the old height");
            test.equal(tileLayer.bounds.h, oldBounds.w, "Should be the old width");
            test.equal(tileLayer.getTileAt(tileLayer.bounds.w - 2, 1), tile1, "The tile at w-2,1 should be tile1");
            test.equal(tileLayer.getTileAt(tileLayer.bounds.w - 5, 4), tile2, "The tile at w-5,4 should be tile2");
            test.done();
        }
    };

    return { tileLayer: tests };
});