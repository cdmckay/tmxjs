define(["jquery", "util"], function ($, Util) {
    var Map = function (width, height) {
        this.bounds = {
            w: width,
            h: height
        };
        this.tileInfo = {};
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

    return Map;
});