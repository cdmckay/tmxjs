define(["jquery"], function ($) {
    var TileSet = function (firstGlobalId) {
        this.firstGlobalId = firstGlobalId;
        this.name = null;
        this.tileInfo = {};
        this.tiles = [];
    };

    TileSet.prototype.addTile = function (tile) {
        tile.id = this.tiles.length;
        tile.tileSet = this;
        this.tiles.push(tile);
        return tile.id;
    };

    TileSet.fromXML = function (element, dir) {
        var firstGlobalId = parseInt(element.attr("firstgid"));
        var tileSet = new TileSet(firstGlobalId);

        var extract = function (e) {
            tileSet.name = e.attr("name");
            tileSet.tileInfo = {
                w: parseInt(e.attr("tilewidth")),
                h: parseInt(e.attr("tileheight")),
                spacing: parseInt(e.attr("spacing")),
                margin: parseInt(e.attr("margin"))
            };
        };

        tileSet.source = element.attr("source");
        var promise = $.Deferred();
        if (tileSet.source) {
            $.get(dir + "/" + this.source, {}, "xml")
                .done(function (data) {
                    var external = $(data).filter(":first");
                    extract(external);
                    promise.resolve(tileSet);
                });
        } else {
            // Load all attributes.
            extract(element);
            promise.resolve(tileSet);
        }

        return promise;
    };

    return TileSet;
});