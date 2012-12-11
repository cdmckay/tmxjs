define(["jquery", "tile"], function ($, Tile) {
    var TileSet = function (firstGlobalId) {
        this.firstGlobalId = firstGlobalId || 1;
        this.dir = null;
        this.name = null;
        this.tileInfo = { w: 0, h: 0, spacing: 0, margin: 0 };
        this.imageInfo = { url: null, w: 0, h: 0 };
        this.tiles = [];
        this.properties = {};
    };

    TileSet.prototype.addTile = function (tile) {
        if (tile.id == null) {
            tile.id = this.tiles.length;
        }
        tile.tileSet = this;
        this.tiles.push(tile);
        return tile.id;
    };

    TileSet.prototype.removeTileAt = function(id) {
        this.tiles[id] = null;
    };

    TileSet.prototype.getTileAt = function(id) {
        return this.tiles[id];
    };

    TileSet.prototype.getMaxTileId = function() {
        return this.tiles.length - 1;
    };

    TileSet.fromElement = function (element, dir, map) {
        var tileSetElement = $(element);
        var firstGlobalId = parseInt(tileSetElement.attr("firstgid"));
        var tileSet = new TileSet(firstGlobalId);
        tileSet.dir = dir;

        var extract = function (e) {
            tileSet.name = e.attr("name");

            var tileInfo = {
                w: parseInt(e.attr("tilewidth")) || (map && map.tileInfo.w),
                h: parseInt(e.attr("tileheight")) || (map && map.tileInfo.h),
                spacing: parseInt(e.attr("spacing")),
                margin: parseInt(e.attr("margin"))
            };
            tileSet.tileInfo = tileInfo;

            var image = e.children("image:first");
            if (image.attr("source")) {
                var imageInfo = {
                    url: dir + "/" + image.attr("source"),
                    w: parseInt(image.attr("width")) || 0,
                    h: parseInt(image.attr("height")) || 0
                };
                tileSet.imageInfo = imageInfo;

                for (var j = tileInfo.margin; j < imageInfo.h; j += tileInfo.h + tileInfo.spacing) {
                    for (var i = tileInfo.margin; i < imageInfo.w; i += tileInfo.w + tileInfo.spacing) {
                        var tile = new Tile();
                        tile.imageInfo = imageInfo;
                        tile.position.x = i;
                        tile.position.y = j;
                        tile.bounds.w = tileInfo.w;
                        tile.bounds.h = tileInfo.h;
                        tileSet.addTile(tile);
                    }
                }
            }

            e.children("tiles").each(function () {
                var tileElement = $(this);
                var tile = new Tile();
                tile.id = tileElement.attr("id") || null;
                tileElement.find("properties:first property").each(function () {
                    tile.properties[$(this).attr("name")] = $(this).attr("value");
                });

                if (tile.id > tileSet.getMaxTileId()) {
                    tileSet.addTile(tile);
                } else {
                    var existingTile = tileSet.getTileAt(tile.id);
                    existingTile.properties = tile.properties;
                }
            });
        };

        tileSet.source = tileSetElement.attr("source");
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
            extract(tileSetElement);
            promise.resolve(tileSet);
        }

        return promise;
    };

    return TileSet;
});