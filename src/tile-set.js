define(["jquery", "./tile", "./util/string-util"], function ($, Tile, S) {
    var TileSet = function (firstGlobalId) {
        this.firstGlobalId = firstGlobalId || 1;
        this.dir = null;
        this.name = null;
        this.tileInfo = { w: 0, h: 0, spacing: 0, margin: 0 };
        this.imageInfo = { source: null, url: null, w: 0, h: 0 };
        this.tiles = [];
        this.properties = {};
    };

    TileSet.prototype.addTile = function (tile) {
        if (tile.id !== null) {
            throw Error("Tile cannot have an id");
        }
        tile.id = this.tiles.length;
        tile.tileSet = this;
        this.tiles.push(tile);
        return tile.id;
    };

    TileSet.prototype.getTileAt = function(id) {
        return this.tiles[id];
    };

    TileSet.prototype.removeTileAt = function(id) {
        this.tiles[id] = null;
    };

    TileSet.prototype.getMaxTileId = function() {
        return this.tiles.length - 1;
    };

    TileSet.prototype.generateTiles = function () {
        this.tiles.length = 0;

        var tileInfo = this.tileInfo;
        var imageInfo = this.imageInfo;
        for (var j = tileInfo.margin; j < imageInfo.h; j += tileInfo.h + tileInfo.spacing) {
            for (var i = tileInfo.margin; i < imageInfo.w; i += tileInfo.w + tileInfo.spacing) {
                var tile = new Tile();
                tile.imageInfo = imageInfo;
                tile.bounds.x = i;
                tile.bounds.y = j;
                tile.bounds.w = tileInfo.w;
                tile.bounds.h = tileInfo.h;
                this.addTile(tile);
            } // end for
        } // end for
    };

    TileSet.fromElement = function (element, options) {
        var tileSetElement = $(element);
        var firstGlobalId = parseInt(tileSetElement.attr("firstgid"));
        var tileSet = new TileSet(firstGlobalId);
        tileSet.dir = options.dir;

        var extract = function (e) {
            tileSet.name = e.attr("name");

            tileSet.tileInfo = {
                w: parseInt(e.attr("tilewidth")) || 1,
                h: parseInt(e.attr("tileheight")) || 1,
                spacing: parseInt(e.attr("spacing")),
                margin: parseInt(e.attr("margin"))
            };

            var image = e.children("image:first");
            var imageSource = image.attr("source");
            if (!imageSource) {
                throw new Error("'image' requires 'source' attribute");
            }
            tileSet.imageInfo = {
                source: imageSource,
                url: (S.startsWith(imageSource, "http") ? "" : options.dir + "/") + imageSource,
                w: parseInt(image.attr("width")) || 0,
                h: parseInt(image.attr("height")) || 0
            };

            tileSet.generateTiles();

            e.children("tiles").each(function () {
                var tile = Tile.fromElement(this, options);
                if (tile.id < 0) {
                    throw new Error("Invalid (negative) tile id: " + tile.id);
                } else if (tile.id === tileSet.tiles.length) {
                    tileSet.addTile(tile);
                } else {
                    throw new Error("Invalid (non-consecutive) tile id: " + tile.id);
                }
            });
        };

        tileSet.source = tileSetElement.attr("source");
        var promise = $.Deferred();
        if (tileSet.source) {
            $.get((S.startsWith(tileSet.source, "http") ? "" : options.dir + "/") + tileSet.source, {}, null, "xml")
                .done(function (data) {
                    var external = $(data).find("tileset");
                    extract(external);
                    promise.resolve(tileSet);
                });
        } else {
            // Load all attributes.
            extract(tileSetElement);
            promise.resolve(tileSet);
        }

        return promise;
    };

    return TileSet;
});