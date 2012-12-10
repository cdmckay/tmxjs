define(["jquery"], function ($) {
    var Tile = function (tileSet) {
        this.id = null;
        this.tileSet = tileSet || null;
        this.offset = { x: 0, y: 0 };
    };

    Tile.prototype.getGlobalId = function () {
        return this.tileSet.firstGlobalId + this.id;
    };

    return Tile;
});