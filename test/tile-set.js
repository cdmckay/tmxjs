define(['tmxjs/tile-set', 'tmxjs/tile'], function (TileSet, Tile) {
    var tests = {
        "test constructor": function (test) {
            var tileSet = new TileSet(42);
            test.equal(tileSet.firstGlobalId, 42);
            test.done();
        },

        "test addTile with no id": function (test) {
            var tileSet = new TileSet(42);
            var tile = new Tile();
            var id = tileSet.addTile(tile);
            test.equal(id, 0, "Should set the id when adding tile");
            test.done();
        },

        "test addTile with id": function (test) {
            var tileSet = new TileSet(42);
            var tile = new Tile();
            tile.id = 1;
            test.throws(function () {
                tileSet.addTile(tile)
            }, Error, "Should throw error when adding tile with id");
            test.done();
        },

        "test removeTileAt": function (test) {
            var tileSet = new TileSet(42);
            var tile = new Tile();
            tileSet.addTile(tile);
            test.notEqual(tileSet.getTileAt(0), null, "Should not be null after tile addition");
            test.equal(tileSet.tiles.length, 1, "Should have length 1 after tile addition");
            tileSet.removeTileAt(0);
            test.equal(tileSet.getTileAt(0), null, "Should be null after tile removal");
            test.equal(tileSet.tiles.length, 1, "Should still be length 1 after tile removal");
            test.done();
        }
    };

    return { tileSet: tests };
});