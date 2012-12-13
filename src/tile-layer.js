define(["jquery", "layer"], function ($, Layer) {
    var TileLayer = function(map) {
        Layer.call(this, map);

        var grid = new Array(map.bounds.h);
        $.each(grid, function(i) {
            grid[i] = new Array(map.bounds.w);
        });
        this.grid = grid;

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
                if (this.grid[j][i] === tile) {
                    this.setTileAt(i + this.bounds.x, j + this.bounds.y, null);
                }
            } // end for
        } // end for
    };

    TileLayer.prototype.setTileAt = function (tx, ty, tile) {
        if (this.bounds.contains(tx, ty)) {
            this.grid[ty - this.bounds.y][tx - this.bounds.x] = tile;
        }
    };

    TileLayer.prototype.getTileAt = function (tx, ty) {
        return this.bounds.contains(tx, ty) ? this.grid[ty - this.bounds.y][tx - this.bounds.x] : null;
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

            $(this).children("tile").each(function (i) {
                var x = i % tileLayer.bounds.w;
                var y = Math.floor(i / tileLayer.bounds.w);
                var globalId = parseInt($(this).attr("gid")) || null;
                var tileSet = map.findTileSet(globalId);
                tileLayer.setTileAt(x, y, tileSet ? tileSet.getTileAt(globalId - tileSet.firstGlobalId) : null);
            });
        });

        return tileLayer;
    };

    return TileLayer;
});