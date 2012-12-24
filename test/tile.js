define(['tmxjs/tile'], function (Tile) {
    var tests = {
        "test getGlobalId": function (test) {
            var tile = new Tile();
            tile.id = 2;
            tile.tileSet = { firstGlobalId: 40 };
            test.equal(tile.getGlobalId(), 42, "Should be the sum of the firstGlobalId and the tile id");
            test.done();
        }
    };

    return { tile: tests };
});