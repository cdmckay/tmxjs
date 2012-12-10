define(["jquery"], function ($) {
    var TileSet = function (firstGlobalId) {
        this.firstGlobalId = firstGlobalId;
        this.name = null;
        this.tileInfo = {};
        this.tiles = [];
        this.properties = {};
    };

    TileSet.prototype.addTile = function (tile) {
        tile.id = this.tiles.length;
        tile.tileSet = this;
        this.tiles.push(tile);
        return tile.id;
    };

    TileSet.fromElement = function (element, dir) {
        var wrapped = $(element);
        var firstGlobalId = parseInt(wrapped.attr("firstgid"));
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

        tileSet.source = wrapped.attr("source");
        var promise = $.Deferred();
        if (tileSet.source) {
            $.get(dir + "/" + tileSet.source, {}, "xml")
                .done(function (data) {
                    var external = $(data).find("tileset");
                    extract(external);
                    promise.resolve(tileSet);
                });
        } else {
            // Load all attributes.
            extract(wrapped);
            promise.resolve(tileSet);
        }

        return promise;
    };

    return TileSet;
});