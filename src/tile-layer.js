define([
    "jquery",
    "./cell",
    "./layer",
    "./util/base64",
    "./util/rectangle"
], function (
    $,
    Cell,
    Layer,
    Base64,
    Rectangle
) {
    var TileLayer = function(map, bounds) {
        Layer.call(this, map, bounds);
        this.cells = new Array(this.bounds.w * this.bounds.h);
        this.tileProperties = {};
    };
    TileLayer.prototype = new Layer;
    TileLayer.prototype.constructor = TileLayer;

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

        var newCells = new Array(this.bounds.w * this.bounds.h);
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
                newCells[nj * newBounds.w + ni] = this.cells[j * this.bounds.w + i];
            } // end for
        } // end for

        this.bounds = newBounds;
        this.cells = newCells;
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

    TileLayer.prototype.setCellAt = function (tx, ty, tile) {
        if (this.bounds.contains(tx, ty)) {
            var i = tx - this.bounds.x;
            var j = ty - this.bounds.y;
            this.cells[j * this.bounds.w + i] = tile;
        }
    };

    TileLayer.prototype.getCellAt = function (tx, ty) {
        var i = tx - this.bounds.x;
        var j = ty - this.bounds.y;
        return this.bounds.contains(tx, ty) ? this.cells[j * this.bounds.w + i] : null;
    };

    TileLayer.prototype.removeTile = function (tile) {
        for (var n = 0; n < this.tiles.length; n++) {
            if (this.cells[n] && this.cells[n].tile === tile) {
                this.cells[n] = null;
            }
        }
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
            var handleBase64 = function (options) {
                var decompress = function (data) { return data };
                var compression = $(this).attr("compression");
                if (compression) {
                    if (!options.compression[compression] || !options.compression[compression].decompress) {
                        throw new Error("Could not find decompressor for compression: " + compression);
                    }
                    decompress = options.compression[compression].decompress;
                }
                var flippedGlobalIds = [];
                var bytes = decompress(Base64.decode($.trim($(this).text())));
                for (var n = 0; n < bytes.length; n += 4) {
                    var flippedGlobalId = 0;
                    flippedGlobalId += bytes[n + 0] << 0;
                    flippedGlobalId += bytes[n + 1] << 8;
                    flippedGlobalId += bytes[n + 2] << 16;
                    flippedGlobalId += bytes[n + 3] << 24;
                    flippedGlobalIds.push(flippedGlobalId);
                }
                return flippedGlobalIds;
            };
            var handleCSV = function (options) {
                var flippedGlobalIds = [];
                $.each($(this).text().split(","), function(n) {
                    flippedGlobalIds.push(parseInt(this));
                });
                return flippedGlobalIds;
            };

            var flippedGlobalIds = [];
            var encoding = $(this).attr("encoding");
            if (encoding) {
                switch (encoding) {
                    case "base64":
                        flippedGlobalIds = handleBase64.call(this, options);
                        break;
                    case "csv":
                        flippedGlobalIds = handleCSV.call(this, options);
                        break;
                    default:
                        throw new Error("Unsupported encoding: " + encoding);
                }
            } else {
                $(this).children("tile").each(function () {
                    flippedGlobalIds.push(parseInt($(this).attr("gid")) || null);
                });
            }

            $.each(flippedGlobalIds, function (n, flippedGlobalId) {
                var globalId = Cell.getGlobalIdFrom(flippedGlobalId);
                var i = n % tileLayer.bounds.w;
                var j = Math.floor(n / tileLayer.bounds.w);
                var tileSet = map.findTileSet(globalId);
                if (tileSet) {
                    var cell = new Cell(
                        tileSet.getTileAt(globalId - tileSet.firstGlobalId),
                        Cell.getFlippedFrom(flippedGlobalId));
                    tileLayer.setCellAt(i, j, cell);
                } else {
                    tileLayer.setCellAt(i, j, null);
                }
            });
        });

        return tileLayer;
    };

    return TileLayer;
});