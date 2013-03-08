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
    "./doodad-group",
    "./tile-layer",
    "./tile-set",
    "./util/rectangle",
    "./util/util"
], function (
    $,
    DoodadGroup,
    TileLayer,
    TileSet,
    Rectangle,
    Util
) {
    var Map = function (orientation, width, height, tileWidth, tileHeight) {
        this.version = null;
        this.bounds = Rectangle.atOrigin(width, height);
        this.orientation = orientation || Map.Orientation.ORTHOGONAL;
        this.tileInfo = {
            w: tileWidth || 0,
            h: tileHeight || 0
        };
        this.layers = [];
        this.tileSets = [];
        this.properties = {};
    };

    Map.Orientation = {
        ORTHOGONAL: "orthogonal",
        ISOMETRIC: "isometric",
        STAGGERED: "staggered"
    };

    Map.prototype.fitBoundsToLayers = function() {
        var w = 0;
        var h = 0;

        // TODO Finish this.
    };

    Map.prototype.addLayer = function (layer) {
        layer.map = this;
        return this.layers.push(layer);
    };

    Map.prototype.setLayerAt = function (index, layer) {
        layer.map = this;
        this.layers[index] = layer;
    };

    Map.prototype.insertLayerAt = function (index, layer) {
        layer.map = this;
        this.layers.splice(index, 0, layer);
    };

    Map.prototype.removeLayerAt = function (index) {
        var layer = this.layers[index];
        this.layers.splice(index, 1);
        return layer;
    };

    Map.prototype.removeAllLayers = function () {
        this.layers.length = 0;
    };

    Map.prototype.getTileLayers = function () {
        var tileLayers = [];
        $.each(this.layers, function (li, layer) {
            if (layer instanceof TileLayer) {
                tileLayers.push(layer);
            }
        });
        return tileLayers;
    };

    Map.prototype.getDoodadGroups = function () {
        var doodadGroups = [];
        $.each(this.layers, function (li, layer) {
            if (layer instanceof DoodadGroup) {
                doodadGroups.push(layer);
            }
        });
        return doodadGroups;
    };

    Map.prototype.addTileSet = function (tileSet) {
        if (tileSet === null) throw new Error("TileSet cannot be null");
        if ($.inArray(tileSet, this.tileSets) > -1) {
            return;
        }

        this.tileSets.push(tileSet);
    };

    Map.prototype.removeTileSetAt = function (index) {
        if (index >= this.tileSets.length) {
            return;
        }

        var map = this;
        var tileSet = this.tileSets[index];
        $.each(tileSet.tiles, function (ti, tile) {
            $.each(map.layers, function (li, layer) {
                if (layer instanceof TileLayer) layer.removeTile(tile);
            });
        });
        this.tileSets.splice(index, 1);
    };

    Map.prototype.findTileSet = function (globalId) {
        var target = null;
        $.each(this.tileSets, function (ti, tileSet) {
            if (this.firstGlobalId <= globalId) {
                target = tileSet;
            }
        });
        return target;
    };

    Map.prototype.findTile = function (globalId) {
        var tileSet = this.findTileSet(globalId);
        return tileSet.tiles[globalId - tileSet.firstGlobalId];
    };

    Map.prototype.getMaxGlobalId = function () {
        if (!this.tileSets.length) {
            return 0;
        }
        var tileSet = this.tileSets[this.tileSets.length - 1];
        return tileSet.firstGlobalId + tileSet.tiles.length - 1;
    };

    Map.prototype.swapTileSets = function(index1, index2) {

    };

    Map.prototype.toXML = function (options) {
        var xml = $.parseXML('<?xml version="1.0" encoding="UTF-8"?><map/>')
        var mapEl = $(xml).find("map").attr({
            version: this.version,
            orientation: this.orientation,
            width: this.bounds.w,
            height: this.bounds.h,
            tilewidth: this.tileInfo.w,
            tileheight: this.tileInfo.h
        });
        if (Util.size(this.properties)) {
            var propertiesEl = $("<properties>", xml);
            $.each(this.properties, function (k, v) {
                var propertyEl = $("<property>", xml).attr({ name: k, value: v });
                propertiesEl.append(propertyEl);
            });
            mapEl.append(propertiesEl);
        }

        // Export tile sets.
        $.each(this.tileSets, function (ti, tileSet) {
            mapEl.append(tileSet.toXML(xml, options));
        });

        // Export tile layers.
        $.each(this.layers, function (li, layer) {
            mapEl.append(layer.toXML(xml, options));
        });

        // TODO Export DoodadGroups.

        return mapEl;
    };

    Map.fromXML = function (xml, options) {
        var mapEl = $(xml).find("map");
        var map = new Map(
            mapEl.attr("orientation"),
            parseInt(mapEl.attr("width")),
            parseInt(mapEl.attr("height")),
            parseInt(mapEl.attr("tilewidth")),
            parseInt(mapEl.attr("tileheight"))
        );
        //
        map.version = mapEl.attr("version") || null;

        // Load properties.
        mapEl.find("properties:first property").each(function () {
            map.properties[$(this).attr("name")] = $(this).attr("value");
        });

        // Load tile sets.
        var tileSetPromises = [];
        mapEl.find("tileset").each(function () {
            tileSetPromises.push(TileSet.fromElement(this, options).done(function (tileSet) {
                map.addTileSet(tileSet);
            }));
        });

        var deferred = $.Deferred();
        $.when.apply($, tileSetPromises)
            .done(function () {
                // Load tile layers.
                mapEl.find("layer").each(function() {
                    map.addLayer(TileLayer.fromElement(this, map, options));
                });

                // Load doodad groups.
                // TODO Finish this.

                deferred.resolve(map);
            })
            .fail(function () {
                deferred.reject();
            });
        return deferred.promise();
    };

    return Map;
});