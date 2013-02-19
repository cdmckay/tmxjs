define([
    "jquery",
    "underscore",
    "./tile-layer",
    "./tile-set",
    "./util/rectangle"
], function (
    $,
    _,
    TileLayer,
    TileSet,
    Rectangle
) {
    var Map = function (orientation, width, height, tileWidth, tileHeight) {
        this.version = null;
        this.bounds = Rectangle.atOrigin(width, height);
        this.orientation = orientation || "orthogonal";
        this.tileInfo = {
            w: tileWidth || 0,
            h: tileHeight || 0
        };
        this.layers = [];
        this.tileSets = [];
        this.properties = {};
    };

    Map.prototype.fitBoundsToLayers = function() {
        var w = 0;
        var h = 0;

        // TODO Finish this.
    };

    Map.prototype.addLayer = function (layer) {
        layer.map = this;
        this.layers.push(layer);
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
        $.each(this.layers, function () {
            if (this instanceof TileLayer) {
                tileLayers.push(this);
            }
        });
        return tileLayers;
    };

    Map.prototype.getDoodadGroups = function () {
        var doodadGroups = [];
        $.each(this.layers, function () {
            if (this instanceof DoodadGroup) {
                doodadGroups.push(this);
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
        $.each(tileSet.tiles, function (tn, tile) {
            $.each(map.layers, function (ln, layer) {
                layer.removeTile(tile);
            });
        });
        this.tileSets.splice(index, 1);
    };

    Map.prototype.findTileSet = function (globalId) {
        var target = null;
        $.each(this.tileSets, function () {
            if (this.firstGlobalId <= globalId) {
                target = this;
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

    };

    Map.fromXML = function (xml, options) {
        options = $.extend(true, {
            dir: ".",
            compression: {}
        }, options);

        var root = $(xml).find("map");
        var map = new Map(
            root.attr("orientation"),
            parseInt(root.attr("width")),
            parseInt(root.attr("height")),
            parseInt(root.attr("tilewidth")),
            parseInt(root.attr("tileheight"))
        );

        // Load properties.
        root.find("properties:first property").each(function () {
            map.properties[$(this).attr("name")] = $(this).attr("value");
        });

        // Load tile sets.
        var tileSetPromises = [];
        root.find("tileset").each(function () {
            tileSetPromises.push(TileSet.fromElement(this, options).done(function (tileSet) {
                map.addTileSet(tileSet);
            }));
        });

        var deferred = $.Deferred();
        $.when.apply($, tileSetPromises)
            .done(function () {
                // Load tile layers.
                root.find("layer").each(function() {
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