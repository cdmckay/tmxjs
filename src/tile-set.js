define(["jquery", "./tile", "./util/util"], function ($, Tile, Util) {
    var TileSet = function (firstGlobalId) {
        this.firstGlobalId = firstGlobalId || 1;
        this.name = null;
        this.tileInfo = { w: 0, h: 0, spacing: 0, margin: 0 };
        this.imageInfo = { source: null, w: 0, h: 0 };
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

    /**
     * Generate tiles based on tile width, tile height, image width and image height.
     * If a tile already exists, its bounds and image information will be overwritten.
     */
    TileSet.prototype.generateTiles = function () {
        var tileInfo = this.tileInfo;
        var imageInfo = this.imageInfo;
        for (var j = tileInfo.margin; j < imageInfo.h; j += tileInfo.h + tileInfo.spacing) {
            for (var i = tileInfo.margin; i < imageInfo.w; i += tileInfo.w + tileInfo.spacing) {
                var id = j * tileInfo.w + i;
                var tile = this.getTileAt(id) || new Tile();
                tile.imageInfo = imageInfo;
                tile.bounds.x = i;
                tile.bounds.y = j;
                tile.bounds.w = tileInfo.w;
                tile.bounds.h = tileInfo.h;
                if (!tile.id) this.addTile(tile);
            } // end for
        } // end for
    };

    TileSet.prototype.toXML = function (xml, options) {
        var tileSetEl = $("<tileset>", xml).attr({
            firstgid: this.firstGlobalId,
            name: this.name
        });
        if (tileSetEl.source) {
            tileSetEl.attr("source", tileSetEl.source);
        } else {
            // Attributes
            tileSetEl.attr({
                tilewidth: this.tileInfo.w,
                tileheight: this.tileInfo.h,
                spacing: this.tileInfo.spacing,
                margin: this.tileInfo.margin
            });

            // Image
            var imageEl = $("<image>", xml).attr({
                source: this.imageInfo.source,
                width: this.imageInfo.w,
                height: this.imageInfo.h
            });
            tileSetEl.append(imageEl);

            // Properties
            if (Util.size(this.properties)) {
                var propertiesEl = $("<properties>", xml);
                $.each(this.properties, function (k, v) {
                    var propertyEl = $("<property>", xml).attr({ name: k, value: v });
                    propertiesEl.append(propertyEl);
                });
                tileSetEl.append(propertiesEl);
            }

            // Tiles
            $.each(this.tiles, function (ti, tile) {
                var tileEl = tile.toXML(xml, options);
                tileSetEl.append(tileEl);
            });
        }
        return tileSetEl;
    };

    TileSet.fromElement = function (element, options) {
        options = $.extend(true, { dir: "." }, options);

        var tileSetElement = $(element);
        var firstGlobalId = parseInt(tileSetElement.attr("firstgid"));
        var tileSet = new TileSet(firstGlobalId);

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
                w: parseInt(image.attr("width")) || 0,
                h: parseInt(image.attr("height")) || 0
            };

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

            tileSet.generateTiles();
        };

        tileSet.source = tileSetElement.attr("source");
        var promise = $.Deferred();
        if (tileSet.source) {
            $.get(Util.urlFor(tileSet.source, options.dir), {}, null, "xml")
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