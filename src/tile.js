define(["jquery"], function ($) {
    var Tile = function () {
        this.id = null;
        this.tileSet = null;
        this.position = { x: 0, y: 0 };
        this.bounds = { w: 0, h: 0 };
        this.imageInfo = { url: null, w: 0, h: 0 };
        this.propertes = {};
    };

    Tile.prototype.getGlobalId = function () {
        return this.tileSet.firstGlobalId + this.id;
    };

    return Tile;
});