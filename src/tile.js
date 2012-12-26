define(["jquery", "./util/rectangle"], function ($, Rectangle) {
    var Tile = function () {
        this.id = null;
        this.tileSet = null;
        this.bounds = new Rectangle();
        this.imageInfo = { url: null, w: 0, h: 0 };
        this.propertes = {};
    };

    Tile.prototype.getGlobalId = function () {
        return this.tileSet.firstGlobalId + this.id;
    };

    Tile.fromElement = function (element, options) {
        var tileElement = $(element);
        var tile = new Tile();
        tile.id = tileElement.attr("id") || null;
        tileElement.find("properties:first property").each(function () {
            tile.properties[$(this).attr("name")] = $(this).attr("value");
        });
        return tile;
    };

    return Tile;
});