define(["jquery", "./layer", "./util/rectangle"], function ($, Layer, Rectangle) {
    var TileLayer = function(map, bounds) {
        Layer.call(this, map, bounds);
        this.tiles = new Array(this.bounds.w * this.bounds.h);
        this.tileProperties = {};
    };
    TileLayer.prototype = Layer;

    TileLayer.prototype.rotate = function (angle) {
        var newBounds;
        var transform = { x: 0, y: 0 };
        switch (angle) {
            case 90:
                newBounds = new Rectangle(this.bounds.x, this.bounds.y, this.bounds.h, this.bounds.w);
                transform.x = this.bounds.h - 1;
                break;
            case 180:
                newBounds = this.bounds;
                transform.x = this.bounds.w - 1;
                transform.y = this.bounds.h - 1;
                break;
            case 270:
                newBounds = new Rectangle(this.bounds.x, this.bounds.y, this.bounds.h, this.bounds.w);
                transform.y = this.bounds.w - 1;
                break;
            default:
                throw new Error("Unsupported rotation angle: " + angle);
        }

        var newTiles = new Array(this.bounds.w * this.bounds.h);
        var angleInRadians = angle * Math.PI / 180;
        var cos = Math.round(Math.cos(angleInRadians));
        var sin = Math.round(Math.sin(angleInRadians));
        for (var j = 0; j < this.bounds.h; j++) {
            for (var i = 0; i < this.bounds.w; i++) {
                var rotation = {
                    x: i * cos - j * sin,
                    y: i * sin + j * cos
                };
                var ni = rotation.x + transform.x;
                var nj = rotation.y + transform.y;
                newTiles[nj * newBounds.w + ni] = this.tiles[j * this.bounds.w + i];
            } // end for
        } // end for

        this.bounds = newBounds;
        this.tiles = newTiles;
    };

    TileLayer.prototype.mirror = function(direction) {
        switch (direction) {
            case "horizontal":
                break;
            case "vertical":
                break;
            default:
                throw new Error("Unsupported mirror direction: " + direction);
        }
        // TODO Fill in the rest.
    };

    TileLayer.prototype.setTileAt = function (tx, ty, tile) {
        if (this.bounds.contains(tx, ty)) {
            var i = tx - this.bounds.x;
            var j = ty - this.bounds.y;
            this.tiles[j * this.bounds.w + i] = tile;
        }
    };

    TileLayer.prototype.getTileAt = function (tx, ty) {
        var i = tx - this.bounds.x;
        var j = ty - this.bounds.y;
        return this.bounds.contains(tx, ty) ? this.tiles[j * this.bounds.w + i] : null;
    };

    TileLayer.prototype.removeTile = function (tile) {
        this.replaceTile(tile, null);
    };

    TileLayer.prototype.replaceTile = function (tile, replacement) {
        for (var n = 0; n < this.tiles.length; n++) {
            if (this.tiles[n] === tile) {
                this.tiles[n] = replacement;
            }
        } // end for
    };

    TileLayer.fromElement = function (element, map, options) {
        var layerElement = $(element);
        var tileLayer = new TileLayer(map);
        tileLayer.name = layerElement.attr("name");
        tileLayer.visible = !!layerElement.attr("visible");
        tileLayer.opacity = parseFloat(layerElement.attr("opacity")) || 0.0;

        layerElement.find("properties:first property").each(function () {
            tileLayer.properties[$(this).attr("name")] = $(this).attr("value");
        });

        layerElement.find("data:first").each(function () {
            var encoding = $(this).attr("encoding");
            if (encoding) {
                switch (encoding) {
                    case "base64":
                        if (!options.encoding.base64.decode) {
                            throw new Error("Could not find decoder for encoding: " + encoding);
                        }
                        break;
                    default:
                        throw new Error("Unsupported encoding: " + encoding);
                }
            }

            $(this).children("tile").each(function (n) {
                var i = n % tileLayer.bounds.w;
                var j = Math.floor(n / tileLayer.bounds.w);
                var globalId = parseInt($(this).attr("gid")) || null;
                var tileSet = map.findTileSet(globalId);
                tileLayer.setTileAt(i, j, tileSet ? tileSet.getTileAt(globalId - tileSet.firstGlobalId) : null);
            });
        });

        return tileLayer;
    };

    return TileLayer;
});