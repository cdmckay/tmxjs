/*
 * Copyright 2013 Cameron McKay
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

define([
    "jquery",
    "zlib",
    "./cell",
    "./layer",
    "./util/base64",
    "./util/rectangle",
    "./util/util"
], function (
    $,
    Zlib,
    Cell,
    Layer,
    Base64,
    Rectangle,
    Util
) {
    var TileLayer = function(name, bounds) {
        Layer.call(this, name, bounds);
        this.format = TileLayer.Format.XML;
        this.cells = new Array(this.bounds.w * this.bounds.h);
        this.tileProperties = {};
    };
    TileLayer.prototype = new Layer();
    TileLayer.prototype.constructor = TileLayer;

    TileLayer.Format = {
        XML: "xml",
        BASE64: "base64",
        BASE64_GZIP: "base64gzip",
        BASE64_ZLIB: "base64zlib",
        CSV: "csv"
    };

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
        for (var n = 0; n < this.cells.length; n++) {
            if (this.cells[n] && this.cells[n].tile === tile) {
                this.cells[n] = null;
            }
        }
    };

    TileLayer.prototype.clone = function () {
        var layer = new TileLayer();

        // Layer
        layer.name = this.name;
        layer.visible = this.visible;
        layer.map = this.map;
        layer.opacity = this.opacity;
        layer.bounds = this.bounds.clone();
        layer.properties = $.extend({}, this.properties);

        // Tile Layer
        layer.cells = this.cells.slice();
        layer.tileProperties = $.extend({}, this.tileProperties);

        return layer;
    };

    TileLayer.prototype.toXML = function (xml, options) {
        var tileLayerEl = $("<layer>", xml).attr({
            name: this.name,
            width: this.bounds.w,
            height: this.bounds.h
        });

        // Properties
        if (Util.size(this.properties)) {
            var propertiesEl = $("<properties>", xml);
            $.each(this.properties, function (k, v) {
                var propertyEl = $("<property>", xml).attr({ name: k, value: v });
                propertiesEl.append(propertyEl);
            });
            tileLayerEl.append(propertiesEl);
        }

        var compression, encoding;
        switch (this.format) {
            case TileLayer.Format.XML:
                break;
            case TileLayer.Format.BASE64:
                encoding = "base64";
                break;
            case TileLayer.Format.BASE64_GZIP:
                encoding = "base64";
                compression = "gzip";
                break;
            case TileLayer.Format.BASE64_ZLIB:
                encoding = "base64";
                compression = "zlib";
                break;
            case TileLayer.Format.CSV:
                encoding = "csv";
                break;
            default:
                throw new Error("Unsupported format: " + this.format);
        }

        // TODO Deal with flipped bits.
        var dataEl = $("<data>", xml);
        if (compression) dataEl.attr("compression", compression);
        if (encoding) dataEl.attr("encoding", encoding);
        if (this.format === TileLayer.Format.XML) {
            $.each(this.cells, function (ci, cell) {
                var cellEl = $("<tile>", xml).attr("gid", cell ? cell.tile.getGlobalId() : 0);
                dataEl.append(cellEl);
            });
        } else if (this.format === TileLayer.Format.CSV) {
            var globalIds = $.map(this.cells, function (cell) {
                return cell ? cell.tile.getGlobalId() : 0;
            });
            dataEl.text(globalIds.join(","));
        } else {
            var bytes = [];
            $.each(this.cells, function (ci, cell) {
                var globalId = cell ? cell.tile.getGlobalId() : 0;
                bytes.push((globalId >> 0) & 255);
                bytes.push((globalId >> 8) & 255);
                bytes.push((globalId >> 16) & 255);
                bytes.push((globalId >> 24) & 255);
            });
            var content;
            switch (this.format) {
                case TileLayer.Format.BASE64:
                    content = Base64.encode(bytes);
                    break;
                case TileLayer.Format.BASE64_GZIP:
                    content = Base64.encode(new Zlib.Gzip(bytes).compress());
                    break;
                case TileLayer.Format.BASE64_ZLIB:
                    content = Base64.encode(new Zlib.Deflate(bytes).compress());
                    break;
            }
            dataEl.text(content);
        }
        tileLayerEl.append(dataEl);

        return tileLayerEl;
    };

    TileLayer.fromElement = function (element, map, options) {
        var layerElement = $(element);
        var tileLayer = new TileLayer();
        tileLayer.name = layerElement.attr("name");
        tileLayer.bounds = new Rectangle(
            0, 0,
            parseInt(layerElement.attr("width")),
            parseInt(layerElement.attr("height"))
        );
        tileLayer.visible = layerElement.attr("visible") !== "0";
        tileLayer.opacity = parseFloat(layerElement.attr("opacity"));
        tileLayer.opacity = isNaN(tileLayer.opacity) ? 1.0 : Math.min(Math.max(0.0, tileLayer.opacity), 1.0);

        layerElement.find("properties:first property").each(function () {
            tileLayer.properties[$(this).attr("name")] = $(this).attr("value");
        });

        var decodeBase64 = function (dataEl) {
            var base64String = $.trim(dataEl.text());
            var bytes = Base64.decode(base64String);
            var compression = dataEl.attr("compression");
            if (compression) {
                tileLayer.format += compression;
                switch (compression) {
                    case "gzip":
                        bytes = new Zlib.Gunzip(bytes).decompress();
                        break;
                    case "zlib":
                        bytes = new Zlib.Inflate(bytes).decompress();
                        break;
                    default:
                        throw new Error("Unsupported format: " + tileLayer.format);
                }
            }
            var flippedGlobalIds = [];
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

        var decodeCSV = function (dataEl) {
            var flippedGlobalIds = [];
            $.each(dataEl.text().split(","), function(n) {
                flippedGlobalIds.push(parseInt(this));
            });
            return flippedGlobalIds;
        };

        layerElement.find("data:first").each(function () {
            var dataEl = $(this);
            var flippedGlobalIds = [];
            var encoding = dataEl.attr("encoding");
            if (encoding) {
                tileLayer.format = encoding;
                switch (encoding) {
                    case "base64":
                        flippedGlobalIds = decodeBase64(dataEl);
                        break;
                    case "csv":
                        flippedGlobalIds = decodeCSV(dataEl);
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