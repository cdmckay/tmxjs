define(["jquery", "layer"], function ($, Layer) {
    var TileLayer = function(map) {
        Layer.call(this, map);

        this.grid = [];
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

    TileLayer.fromElement = function (element, map) {
        var layerElement = $(element);
        var tileLayer = new TileLayer(map);
        tileLayer.name = layerElement.attr("name");
        tileLayer.visible = !!layerElement.attr("visible");
        tileLayer.opacity = parseFloat(layerElement.attr("opacity")) || 0.0;

        layerElement.find("properties:first property").each(function () {
            tileLayer.properties[$(this).attr("name")] = $(this).attr("value");
        });

        layerElement.find("data:first").each(function() {
            // TODO Deal with layer data.
        });

        return tileLayer;
    };

    return TileLayer;
});