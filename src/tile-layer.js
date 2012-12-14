define(["jquery", "layer"], function ($, Layer) {
    var TileLayer = function(map) {
        Layer.call(this, map);
        this.tiles = new Array(this.bounds.w * this.bounds.h);
        this.tileProperties = {};
    };
    TileLayer.prototype = Layer;

    TileLayer.prototype.rotate = function (angle) {
        var transformedGrid = [];
        var transform = { x: 0, y: 0 };
        switch (angle) {
            case 90:
                transform.x = this.bounds.h - 1;
                break;
            case 180:
                transform.x = this.bounds.w - 1;
                transform.y = this.bounds.h - 1;
                break;
            case 270:
                transform.y = this.bounds.w - 1;
                break;
            default:
                throw new Error("Unsupported rotation angle: " + angle);
        }
        // TODO Fill in the rest.
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

    TileLayer.prototype.removeTile = function (tile) {
        for (var j = 0; j < this.bounds.h; j++) {
            for (var i = 0; i < this.bounds.w; i++) {
                if (this.tiles[j * this.bounds.w + i] === tile) {
                    this.setTileAt(i + this.bounds.x, j + this.bounds.y, null);
                }
            } // end for
        } // end for
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

    TileLayer.fromElement = function (element, map) {
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
                throw new Error("Encoded maps not supported");
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