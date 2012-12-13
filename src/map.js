define(["jquery", "tile-set", "tile-layer", "rectangle", "util"], function ($, TileSet, TileLayer, Rectangle, Util) {
    var Map = function (width, height) {
        this.version = null;
        this.bounds = Rectangle.atOrigin(width, height);
        this.orientation = "orthogonal";
        this.tileInfo = { w: 0, h: 0 };
        this.layers = [];
        this.tileSets = [];
        this.properties = {};
    };

    Map.prototype.addLayer = function (layer) {
        layer.map = this;
        this.layers.push(layer);
    };

    Map.prototype.setLayerAt = function (index, layer) {
        layer.map = this;
        this.layers[index] = layer;
    };

    Map.prototype.removeLayerAt = function (index) {
        Util.remove(this.tileSets, index);
    };

    Map.prototype.addTileSet = function (tileSet) {
        if (tileSet === null) throw new Error("tileSet cannot be null");
        if ($.inArray(tileSet, this.tileSets) > -1) {
            return;
        }

        this.tileSets.push(tileSet);
    };

    Map.prototype.removeTileSet = function (tileSet) {
        if (tileSet === null) throw new Error("tileSet cannot be null");
        if ($.inArray(tileSet, this.tileSets) > -1) {
            return;
        }

        $.each(tileSet.tiles, function (tile) {
            $.each(this.layers, function (layer) {
                layer.removeTile(tile);
            });
        });
        var index = $.inArray(tileSet, this.tileSets);
        Util.remove(this.tileSets, index);
    };

    Map.prototype.findTileSet = function (globalId) {
        var target = null;
        $.each(this.tileSets, function () {
            if (this.firstGlobalId <= globalId) {
                target = this;
                return false;
            }
            return true;
        });
        return target;
    };

    Map.fromXML = function (xml, dir) {
        var root = $(xml).find("map");
        var map = new Map(parseInt(root.attr("width")), parseInt(root.attr("height")));
        map.version = parseInt(root.attr("version"));
        map.tileInfo.w = parseInt(root.attr("tilewidth")) || 0;
        map.tileInfo.h = parseInt(root.attr("tileheight")) || 0;
        map.orientation = root.attr("orientation") || "orthogonal";

        // Load properties.
        root.find("properties:first property").each(function () {
            map.properties[$(this).attr("name")] = $(this).attr("value");
        });

        // Load tile sets.
        var tileSetPromises = [];
        root.find("tileset").each(function () {
            tileSetPromises.push(TileSet.fromElement(this, dir).done(function (tileSet) {
                map.addTileSet(tileSet);
            }));
        });

        var promise = $.Deferred();
        $.when.apply($, tileSetPromises)
            .done(function () {
                // Load layers.
                root.find("layer").each(function() {
                    map.addLayer(TileLayer.fromElement(this, map));
                });

                // Load object groups.
                // TODO Finish this.

                promise.resolve(map);
            })
            .fail(function () {
                promise.reject();
            });
        return promise;
    };

    return Map;
});