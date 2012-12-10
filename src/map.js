define(["jquery", "tile-set", "util"], function ($, TileSet, Util) {
    var Map = function (width, height) {
        this.version = null;
        this.bounds = {
            w: width,
            h: height
        };
        this.orientation = "orthogonal";
        this.properties = {};
        this.tileInfo = { w: 0, h: 0 };
        this.layers = [];
        this.tileSets = [];
    };

    Map.prototype.addLayer = function (layer) {
        layer.tileMap = this;
        this.layers.push(layer);
    };

    Map.prototype.setLayerAt = function(index, layer) {
        layer.tileMap = this;
        this.layers[index] = layer;
    };

    Map.prototype.removeLayerAt = function(index) {
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
        $.each(this.tileSets, function(tileSet) {
            if (tileSet.firstGlobalId <= globalId) {
                target = tileSet;
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
        map.tileInfo.w = parseInt(root.attr("tilewidth"));
        map.tileInfo.h = parseInt(root.attr("tileheight"));

        var tileSetPromises = [];
        root.find("tileset").each(function() {
            tileSetPromises.push(TileSet.fromElement(this, dir).done(function(tileSet) {
                map.addTileSet(tileSet);
            }));
        });

        var promise = $.Deferred();
        $.when.apply($, tileSetPromises)
            .done(function() {
                promise.resolve(map);
            })
            .fail(function() {
                promise.reject();
            });
        return promise;
    };

    return Map;
});